/** Local-only persistence. Storage schema is independent of the simulation schema. */
const DATABASE = "longqing-remote-trade";
const STORE = "saves";
const RECORD_KEY = "captain";
const FALLBACK_KEY = "remote-trade-save-v1";
const LEGACY_KEY = "remote-trade-save";
const MAX_BYTES = 5 * 1024 * 1024;
const KEEP_SNAPSHOTS = 4; // Current save and three distinct previous saves.

interface Snapshot {
  serialized: string;
  savedAt: number;
}
interface SaveRecord {
  storageVersion: 1;
  updatedAt: number;
  snapshots: Snapshot[];
}
class StoredDataError extends Error {}

function validSerialized(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !value.length ||
    value.length > MAX_BYTES ||
    new TextEncoder().encode(value).byteLength > MAX_BYTES
  )
    return false;
  try {
    const parsed: unknown = JSON.parse(value);
    return (
      parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
    );
  } catch {
    return false;
  }
}

function decodeRecord(value: unknown): SaveRecord | null {
  if (value == null) return null;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      throw new StoredDataError("本地存档已损坏，请从备份恢复。");
    }
  }
  const record = value as Partial<SaveRecord>;
  if (
    !record ||
    record.storageVersion !== 1 ||
    !Array.isArray(record.snapshots)
  ) {
    throw new StoredDataError("存档格式无法识别，请使用导出的 JSON 存档恢复。");
  }
  const snapshots = record.snapshots
    .filter(
      (s) => s && validSerialized(s.serialized) && Number.isFinite(s.savedAt),
    )
    .slice(0, KEEP_SNAPSHOTS);
  if (!snapshots.length)
    throw new StoredDataError("本地存档已损坏，请从备份恢复。");
  return {
    storageVersion: 1,
    updatedAt: Number.isFinite(record.updatedAt)
      ? record.updatedAt!
      : snapshots[0].savedAt,
    snapshots,
  };
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(new Error("IndexedDB 不可用"));
      return;
    }
    let finished = false;
    const request = indexedDB.open(DATABASE, 1);
    const timer = window.setTimeout(() => {
      finished = true;
      reject(new Error("数据库打开超时"));
    }, 4000);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE))
        request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => {
      clearTimeout(timer);
      if (finished) {
        request.result.close();
        return;
      }
      finished = true;
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => {
      clearTimeout(timer);
      if (!finished) {
        finished = true;
        reject(request.error ?? new Error("无法打开数据库"));
      }
    };
  });
}

async function readDatabase(): Promise<SaveRecord | null> {
  const db = await openDatabase();
  try {
    const raw = await new Promise<unknown>((resolve, reject) => {
      const transaction = db.transaction(STORE, "readonly");
      const request = transaction.objectStore(STORE).get(RECORD_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onabort = () => reject(transaction.error);
    });
    return decodeRecord(raw);
  } finally {
    db.close();
  }
}

async function writeDatabase(record: SaveRecord): Promise<void> {
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, "readwrite");
      transaction.objectStore(STORE).put(record, RECORD_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onabort = () =>
        reject(transaction.error ?? new Error("数据库写入中断"));
      transaction.onerror = () =>
        reject(transaction.error ?? new Error("数据库写入失败"));
    });
  } finally {
    db.close();
  }
}

async function readLatest(): Promise<SaveRecord | null> {
  const results = await Promise.allSettled([
    readDatabase(),
    Promise.resolve().then(() =>
      decodeRecord(localStorage.getItem(FALLBACK_KEY)),
    ),
  ]);
  const records: SaveRecord[] = [];
  let readableStorage = false;
  for (const result of results) {
    if (result.status === "fulfilled") {
      readableStorage = true;
      if (result.value) records.push(result.value);
    }
  }
  if (records.length) {
    records.sort((a, b) => b.updatedAt - a.updatedAt);
    const newest = records[0];
    const seen = new Set<string>();
    const snapshots = records
      .flatMap((r) => r.snapshots)
      .sort((a, b) => b.savedAt - a.savedAt)
      .filter((s) => {
        if (seen.has(s.serialized)) return false;
        seen.add(s.serialized);
        return true;
      })
      .slice(0, KEEP_SNAPSHOTS);
    return { ...newest, snapshots };
  }
  let legacy: string | null = null;
  try {
    legacy = localStorage.getItem(LEGACY_KEY);
  } catch {
    /* Database may still be readable. */
  }
  if (legacy !== null) {
    if (!validSerialized(legacy))
      throw new StoredDataError("旧版存档已损坏，请导入有效的 JSON 存档。");
    const record: SaveRecord = {
      storageVersion: 1,
      updatedAt: Date.now(),
      snapshots: [{ serialized: legacy, savedAt: Date.now() }],
    };
    await persistRecord(record);
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* Migration already persisted. */
    }
    return record;
  }
  const corrupt = results.find(
    (result) =>
      result.status === "rejected" && result.reason instanceof StoredDataError,
  );
  if (corrupt?.status === "rejected") throw corrupt.reason;
  if (!readableStorage)
    throw new Error("浏览器存储不可用或存档已损坏，请导入备份。");
  return null;
}

async function persistRecord(record: SaveRecord): Promise<void> {
  const results = await Promise.allSettled([
    writeDatabase(record),
    Promise.resolve().then(() =>
      localStorage.setItem(FALLBACK_KEY, JSON.stringify(record)),
    ),
  ]);
  if (!results.some((result) => result.status === "fulfilled")) {
    throw new Error(
      "存档未能保存：浏览器存储空间不足或已被禁用。请立即导出 JSON 备份。",
    );
  }
}

let pending: Promise<unknown> = Promise.resolve();
function serializedOperation<T>(work: () => Promise<T>): Promise<T> {
  const operation = pending.then(async (): Promise<T> => {
    // Web Locks serialize cross-tab saves where supported.
    if (navigator.locks)
      return await navigator.locks.request("longqing-save", work);
    return await work();
  });
  pending = operation.catch(() => undefined);
  return operation;
}

/** Saves a JSON object; full game-state validation belongs to TradeSim.import(). */
export function saveGame(serialized: string): Promise<void> {
  return serializedOperation(async () => {
    if (!validSerialized(serialized))
      throw new Error("存档必须是有效的 JSON 对象，且大小不能超过 5 MB。");
    let previous: SaveRecord | null;
    try {
      previous = await readLatest();
    } catch (error) {
      // A validated import can replace an unreadable old save; readable backups are retained above.
      if (!(error instanceof StoredDataError)) throw error;
      previous = null;
    }
    const now = Math.max(Date.now(), (previous?.updatedAt ?? 0) + 1);
    const snapshots = [
      { serialized, savedAt: now },
      ...(previous?.snapshots ?? []).filter((s) => s.serialized !== serialized),
    ].slice(0, KEEP_SNAPSHOTS);
    await persistRecord({ storageVersion: 1, updatedAt: now, snapshots });
  });
}

export function loadGame(): Promise<string | null> {
  return serializedOperation(
    async () => (await readLatest())?.snapshots[0]?.serialized ?? null,
  );
}

/** Returns the most recent distinct previous save. Does not overwrite the current save. */
export function loadBackup(): Promise<string | null> {
  return serializedOperation(
    async () => (await readLatest())?.snapshots[1]?.serialized ?? null,
  );
}

export function downloadSave(serialized: string): void {
  if (!validSerialized(serialized)) throw new Error("无法导出无效存档。");
  const url = URL.createObjectURL(
    new Blob([serialized], { type: "application/json;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `远海商途-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/** Development hot reload never uses a service worker. */
export async function registerOffline(): Promise<ServiceWorkerRegistration | null> {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
    scope: import.meta.env.BASE_URL,
  });
}
