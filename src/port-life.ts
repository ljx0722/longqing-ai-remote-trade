import { goodById, portById, ports, type Good } from "./data";

export type LifeAction = { ok: boolean; message: string };
export type LifeHost = {
  readonly day: number;
  readonly eraIndex: number;
  readonly currentPortId: string;
  readonly cash: number;
  readonly atSea: boolean;
  readonly supplies: number;
  readonly shipCapacity: number;
  cargo(goodId: string): number;
  marketGoods(portId: string): Good[];
  spendCash(amount: number): boolean;
  addCash(amount: number): void;
  consumeCargo(goodId: string, quantity: number): boolean;
  addReputation(amount: number): void;
};
type ResidentMemory = { friendship: number; lastTalkDay: number };
type FacilityId = "warehouse" | "workshop" | "garden";
type FacilityLevels = Record<FacilityId, number>;
type AcceptedCommission = {
  id: string;
  portId: string;
  cycle: number;
  slot: number;
  goodId: string;
  quantity: number;
  reward: number;
  acceptedDay: number;
  expiresDay: number;
  festival: boolean;
  era: number;
};
export type LifeState = {
  version: 1;
  residents: Record<string, ResidentMemory>;
  accepted: AcceptedCommission[];
  claimed: Record<string, number>;
  researched: string[];
  facilities: Record<string, FacilityLevels>;
  completedBundles: string[];
};
export type LifeBonuses = {
  speed: number;
  riskReduction: number;
  taxReduction: number;
  supplyReduction: number;
  capacity: number;
  production: number;
};
export type Resident = {
  id: string;
  name: string;
  role: string;
  portrait: string;
  friendship: number;
  dialogue: string;
};
export type Commission = {
  id: string;
  title: string;
  description: string;
  goodId: string;
  quantity: number;
  reward: number;
  expiresDay: number;
  status: "available" | "accepted" | "completed" | "expired";
};
type Technology = {
  id: string;
  name: string;
  description: string;
  cost: number;
  era: number;
  requires: string[];
  unlocked: boolean;
};
type BundleDefinition = {
  id: string;
  name: string;
  description: string;
  requirements: { goodId: string; quantity: number }[];
  reward: number;
};

const MAX_DAY = 10000000;
const MAX_PORTS = ports.length;
const roles = [
  {
    id: "steward",
    role: "商栈管事",
    portrait: "商",
    names: ["阿弥", "塔拉", "米拉", "苏安", "阿丹", "伊娜"],
  },
  {
    id: "shipwright",
    role: "船坞匠人",
    portrait: "匠",
    names: ["纳木", "伊萨", "诺兰", "洛克", "阿文", "萨米"],
  },
  {
    id: "gardener",
    role: "港园园丁",
    portrait: "园",
    names: ["莱雅", "阿禾", "娜依", "苏里", "叶娜", "梅拉"],
  },
] as const;
const facilityRows: {
  id: FacilityId;
  name: string;
  description: string;
  base: number;
  era: number;
}[] = [
  {
    id: "warehouse",
    name: "家族货栈",
    description:
      "改进装卸与收纳。每级为整个船队增加 4 格有效货舱，上限 32 格。",
    base: 280,
    era: 0,
  },
  {
    id: "workshop",
    name: "码头工坊",
    description: "扶持本地加工。每级使此港本地物产采购价降低 3%，最多 3 级。",
    base: 450,
    era: 0,
  },
  {
    id: "garden",
    name: "补给菜园",
    description:
      "建立补给协作。每级让全船队补给消耗减少 1.5%，设施部分上限 12%。",
    base: 240,
    era: 0,
  },
];
const techRows: Omit<Technology, "unlocked">[] = [
  {
    id: "ledger",
    name: "商号账册",
    description: "统一度量和账目，各港交易税降低 0.3 个百分点。",
    cost: 180,
    era: 0,
    requires: [],
  },
  {
    id: "stowage",
    name: "分舱堆装",
    description: "船队有效货舱增加 6 格。",
    cost: 300,
    era: 0,
    requires: ["ledger"],
  },
  {
    id: "stars",
    name: "星象航记",
    description: "记录恒星与岸标，航行事件风险降低 1.5 个百分点。",
    cost: 480,
    era: 1,
    requires: ["ledger"],
  },
  {
    id: "sailcloth",
    name: "织帆工艺",
    description: "改良帆布与索具，航行速度提高 6%。",
    cost: 580,
    era: 1,
    requires: ["stowage"],
  },
  {
    id: "preservation",
    name: "干粮封储",
    description: "改善食物封储，航程补给消耗减少 8%。",
    cost: 850,
    era: 2,
    requires: ["stowage"],
  },
  {
    id: "survey",
    name: "沿岸测绘",
    description: "航行速度提高 6%，事件风险降低 1.5 个百分点。",
    cost: 1400,
    era: 3,
    requires: ["stars"],
  },
  {
    id: "craft-guilds",
    name: "工匠协作",
    description: "各港本地物产采购价降低 3%。",
    cost: 2200,
    era: 4,
    requires: ["ledger"],
  },
  {
    id: "compass",
    name: "罗盘航路",
    description: "航行速度提高 8%。",
    cost: 3800,
    era: 6,
    requires: ["survey", "sailcloth"],
  },
  {
    id: "marine-insurance",
    name: "商会互保",
    description: "由熟悉航路的商会协作护航，事件风险降低 3 个百分点。",
    cost: 6800,
    era: 8,
    requires: ["craft-guilds", "survey"],
  },
];
const bundleRows: BundleDefinition[] = [
  {
    id: "harbor-pantry",
    name: "港口开张礼",
    description:
      "为商栈收集粮食、织物与容器。交齐后奖励 220 金币、声望 3，并永久增加 2 格货舱。",
    requirements: [
      { goodId: "grain", quantity: 6 },
      { goodId: "linen", quantity: 3 },
      { goodId: "pottery", quantity: 2 },
    ],
    reward: 220,
  },
  {
    id: "shipwright-kit",
    name: "船匠的工具架",
    description:
      "木材、金属和盐，支持码头修造。交齐后奖励 360 金币、声望 3，并永久降低 0.5 个百分点航行风险。",
    requirements: [
      { goodId: "cedar", quantity: 4 },
      { goodId: "copper", quantity: 2 },
      { goodId: "salt", quantity: 4 },
    ],
    reward: 360,
  },
  {
    id: "world-teatable",
    name: "远洋会客厅",
    description:
      "把茶叶、胡椒与瓷器带回商栈。交齐后奖励 1200 金币、声望 5，并永久降低 0.3 个百分点交易税。",
    requirements: [
      { goodId: "tea", quantity: 3 },
      { goodId: "pepper", quantity: 3 },
      { goodId: "porcelain", quantity: 2 },
    ],
    reward: 1200,
  },
];
const hash = (text: string): number => {
  let n = 2166136261;
  for (const c of text) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
};
const cycleAt = (day: number) => Math.floor((day - 1) / 7);
const commissionId = (portId: string, cycle: number, slot: number) =>
  `${portId}~${cycle}~${slot}`;
const isFestival = (day: number) => ((day - 1) % 28) + 1 === 14;
const integer = (value: unknown, min: number, max: number): value is number =>
  typeof value === "number" &&
  Number.isSafeInteger(value) &&
  value >= min &&
  value <= max;
const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const exactKeys = (value: Record<string, unknown>, keys: string[]): boolean =>
  Object.keys(value).length === keys.length &&
  keys.every((key) => Object.hasOwn(value, key));
const knownResident = (id: string): boolean => {
  const [portId, role, ...rest] = id.split("~");
  return (
    !rest.length && portById.has(portId) && roles.some((r) => r.id === role)
  );
};
const parseCommissionId = (
  id: string,
): { portId: string; cycle: number; slot: number } | null => {
  const parts = id.split("~");
  if (
    parts.length !== 3 ||
    !portById.has(parts[0]) ||
    !/^\d+$/.test(parts[1]) ||
    !/^[0-2]$/.test(parts[2])
  )
    return null;
  const cycle = Number(parts[1]),
    slot = Number(parts[2]);
  if (!integer(cycle, 0, MAX_DAY) || commissionId(parts[0], cycle, slot) !== id)
    return null;
  return { portId: parts[0], cycle, slot };
};
const requestQuantity = (era: number, slot: number) =>
  2 + slot + Math.min(3, Math.floor(era / 3));
const requestReward = (
  good: Good,
  quantity: number,
  era: number,
  festival: boolean,
) =>
  Math.ceil(good.base * quantity * (1.42 + Math.min(era, 10) * 0.008)) +
  24 +
  (festival ? 25 : 0);

export function createLifeState(): LifeState {
  return {
    version: 1,
    residents: {},
    accepted: [],
    claimed: {},
    researched: [],
    facilities: {},
    completedBundles: [],
  };
}

/** Returns a fresh validated copy. Undefined is the only legacy no-state form. */
export function readLifeState(raw: unknown, day: number): LifeState | null {
  if (!integer(day, 1, MAX_DAY)) return null;
  if (raw === undefined) return createLifeState();
  if (
    !object(raw) ||
    !exactKeys(raw, [
      "version",
      "residents",
      "accepted",
      "claimed",
      "researched",
      "facilities",
      "completedBundles",
    ]) ||
    raw.version !== 1
  )
    return null;
  if (
    !object(raw.residents) ||
    !object(raw.claimed) ||
    !object(raw.facilities) ||
    !Array.isArray(raw.accepted) ||
    !Array.isArray(raw.researched) ||
    !Array.isArray(raw.completedBundles)
  )
    return null;
  if (
    Object.keys(raw.residents).length > MAX_PORTS * 3 ||
    Object.keys(raw.facilities).length > MAX_PORTS ||
    Object.keys(raw.claimed).length > MAX_PORTS * 6 ||
    raw.accepted.length > 3 ||
    raw.researched.length > techRows.length ||
    raw.completedBundles.length > bundleRows.length
  )
    return null;
  const result = createLifeState();
  for (const [id, memory] of Object.entries(raw.residents)) {
    if (
      !knownResident(id) ||
      !object(memory) ||
      !exactKeys(memory, ["friendship", "lastTalkDay"]) ||
      !integer(memory.friendship, 0, 100) ||
      !integer(memory.lastTalkDay, 0, day)
    )
      return null;
    result.residents[id] = {
      friendship: memory.friendship,
      lastTalkDay: memory.lastTalkDay,
    };
  }
  for (const [id, claimedDay] of Object.entries(raw.claimed)) {
    const key = parseCommissionId(id);
    if (
      !key ||
      !integer(claimedDay, 1, day) ||
      claimedDay < key.cycle * 7 + 1 ||
      claimedDay > key.cycle * 7 + 14
    )
      return null;
    if (key.cycle >= cycleAt(day) - 1) result.claimed[id] = claimedDay;
  }
  const acceptedIds = new Set<string>();
  for (const entry of raw.accepted) {
    if (
      !object(entry) ||
      !exactKeys(entry, [
        "id",
        "portId",
        "cycle",
        "slot",
        "goodId",
        "quantity",
        "reward",
        "acceptedDay",
        "expiresDay",
        "festival",
        "era",
      ])
    )
      return null;
    if (
      typeof entry.id !== "string" ||
      typeof entry.portId !== "string" ||
      typeof entry.goodId !== "string"
    )
      return null;
    const key = parseCommissionId(entry.id),
      good = goodById.get(entry.goodId);
    if (
      !key ||
      !good ||
      acceptedIds.has(entry.id) ||
      Object.hasOwn(raw.claimed, entry.id) ||
      key.portId !== entry.portId ||
      key.cycle !== entry.cycle ||
      key.slot !== entry.slot
    )
      return null;
    if (
      !integer(entry.era, 0, 10) ||
      good.era > entry.era ||
      portById.get(entry.portId)!.era > entry.era ||
      !integer(entry.acceptedDay, 1, day) ||
      cycleAt(entry.acceptedDay) !== key.cycle ||
      entry.expiresDay !== key.cycle * 7 + 14 ||
      typeof entry.festival !== "boolean" ||
      entry.festival !== isFestival(entry.acceptedDay)
    )
      return null;
    if (
      entry.quantity !== requestQuantity(entry.era, key.slot) ||
      entry.reward !==
        requestReward(good, entry.quantity as number, entry.era, entry.festival)
    )
      return null;
    acceptedIds.add(entry.id);
    result.accepted.push({
      id: entry.id,
      portId: entry.portId,
      cycle: key.cycle,
      slot: key.slot,
      goodId: entry.goodId,
      quantity: entry.quantity as number,
      reward: entry.reward as number,
      acceptedDay: entry.acceptedDay,
      expiresDay: entry.expiresDay as number,
      festival: entry.festival,
      era: entry.era,
    });
  }
  for (const id of raw.researched) {
    if (
      typeof id !== "string" ||
      !techRows.some((t) => t.id === id) ||
      result.researched.includes(id)
    )
      return null;
    result.researched.push(id);
  }
  if (
    techRows.some(
      (t) =>
        result.researched.includes(t.id) &&
        t.requires.some((id) => !result.researched.includes(id)),
    )
  )
    return null;
  for (const [portId, levels] of Object.entries(raw.facilities)) {
    if (
      !portById.has(portId) ||
      !object(levels) ||
      !exactKeys(levels, ["warehouse", "workshop", "garden"]) ||
      !facilityRows.every((f) => integer(levels[f.id], 0, 3))
    )
      return null;
    result.facilities[portId] = {
      warehouse: levels.warehouse as number,
      workshop: levels.workshop as number,
      garden: levels.garden as number,
    };
  }
  for (const id of raw.completedBundles) {
    if (
      typeof id !== "string" ||
      !bundleRows.some((b) => b.id === id) ||
      result.completedBundles.includes(id)
    )
      return null;
    result.completedBundles.push(id);
  }
  return result;
}

export class PortLife {
  constructor(
    public readonly state: LifeState,
    private readonly host: LifeHost,
  ) {}
  private action(ok: boolean, message: string): LifeAction {
    return { ok, message };
  }
  private portReady(): boolean {
    return (
      !this.host.atSea &&
      portById.has(this.host.currentPortId) &&
      portById.get(this.host.currentPortId)!.era <= this.host.eraIndex
    );
  }
  private relation(id: string): ResidentMemory {
    return this.state.residents[id] ?? { friendship: 0, lastTalkDay: 0 };
  }
  private gainFriendship(id: string, amount: number): void {
    const memory = this.relation(id);
    this.state.residents[id] = {
      ...memory,
      friendship: Math.min(100, memory.friendship + amount),
    };
  }
  private prune(): void {
    const minCycle = cycleAt(this.host.day) - 1;
    for (const id of Object.keys(this.state.claimed))
      if ((parseCommissionId(id)?.cycle ?? -1) < minCycle)
        delete this.state.claimed[id];
  }
  season(): { name: string; day: number; festival: string } {
    const seasonIndex = Math.floor((this.host.day - 1) / 28) % 4;
    const day = ((this.host.day - 1) % 28) + 1;
    return {
      name: ["春", "夏", "秋", "冬"][seasonIndex],
      day,
      festival:
        day === 14
          ? ["开帆集会", "海风夜市", "收获集会", "归港灯会"][seasonIndex]
          : "",
    };
  }
  residents(): Resident[] {
    const port = portById.get(this.host.currentPortId);
    if (!port) return [];
    return roles.map((role, i) => {
      const id = `${port.id}~${role.id}`,
        memory = this.relation(id);
      const name = role.names[hash(`${port.id}:${i}`) % role.names.length];
      const festival = this.season().festival;
      let dialogue = [
        `我是${port.name}的商栈管事。带来公告上的货物，我会按约支付报酬。`,
        `在${port.name}建起货栈，船员装船时就不必四处找材料了。`,
        `${this.season().name}季到了。每逢第十四天，码头都会举行集会。`,
      ][i];
      if (festival)
        dialogue = `今天是${festival}。聊聊近况吧，今天新接委托还会多给 25 金币。`;
      else if (memory.friendship >= 50)
        dialogue = `${name}认出了你的船旗：老朋友，欢迎回到${port.name}。熟悉的商人会给你更好的税费条件。`;
      else if (memory.lastTalkDay === this.host.day)
        dialogue = "今天已经聊过啦。明天再来，我会继续留意港口的消息。";
      return {
        id,
        name,
        role: role.role,
        portrait: role.portrait,
        friendship: memory.friendship,
        dialogue,
      };
    });
  }
  talk(id: string): LifeAction {
    if (!this.portReady()) return this.action(false, "靠港后才能拜访居民。");
    const resident = this.residents().find((r) => r.id === id);
    if (!resident) return this.action(false, "这位居民不在当前港口。");
    const memory = this.relation(id);
    if (memory.lastTalkDay === this.host.day)
      return this.action(false, "今天已经聊过了，明天再来看看。");
    const gain = this.season().festival ? 4 : 2;
    this.gainFriendship(id, gain);
    this.state.residents[id].lastTalkDay = this.host.day;
    return this.action(
      true,
      `${resident.name}与你聊起码头近况，好感 +${gain}。`,
    );
  }
  private board(): AcceptedCommission[] {
    const portId = this.host.currentPortId,
      cycle = cycleAt(this.host.day);
    const port = portById.get(portId);
    if (!port || port.era > this.host.eraIndex) return [];
    // Affordable, locally stocked requests make the first town interaction playable.
    const choices = this.host
      .marketGoods(portId)
      .filter((g) => g.era <= this.host.eraIndex)
      .slice()
      .sort((a, b) => a.base - b.base || a.id.localeCompare(b.id))
      .slice(0, 15);
    if (!choices.length) return [];
    return [0, 1, 2].map((slot) => {
      const id = commissionId(portId, cycle, slot);
      const existing = this.state.accepted.find((c) => c.id === id);
      if (existing) return { ...existing };
      const good =
        choices[(hash(`${portId}:${cycle}`) + slot * 5) % choices.length];
      const quantity = requestQuantity(this.host.eraIndex, slot),
        festival = isFestival(this.host.day);
      return {
        id,
        portId,
        cycle,
        slot,
        goodId: good.id,
        quantity,
        reward: requestReward(good, quantity, this.host.eraIndex, festival),
        acceptedDay: this.host.day,
        expiresDay: cycle * 7 + 14,
        festival,
        era: this.host.eraIndex,
      };
    });
  }
  commissions(): Commission[] {
    this.prune();
    const board = this.board();
    for (const entry of this.state.accepted)
      if (
        entry.portId === this.host.currentPortId &&
        !board.some((c) => c.id === entry.id)
      )
        board.push({ ...entry });
    return board.map((entry) => {
      const good = goodById.get(entry.goodId)!;
      const accepted = this.state.accepted.some((c) => c.id === entry.id);
      const status: Commission["status"] = Object.hasOwn(
        this.state.claimed,
        entry.id,
      )
        ? "completed"
        : this.host.day > entry.expiresDay
          ? "expired"
          : accepted
            ? "accepted"
            : "available";
      return {
        id: entry.id,
        title: ["商栈补货", "匠人的日用采购", "码头聚餐筹备"][entry.slot],
        description: `${portById.get(entry.portId)!.name}的${roles[entry.slot].role}需要 ${entry.quantity} ${good.unit}${good.name}。${entry.festival ? "集会奖励已包含在报酬中。" : ""}第 ${entry.expiresDay} 日结束前送达。`,
        goodId: entry.goodId,
        quantity: entry.quantity,
        reward: entry.reward,
        expiresDay: entry.expiresDay,
        status,
      };
    });
  }
  acceptCommission(id: string): LifeAction {
    if (!this.portReady()) return this.action(false, "靠港后才能接取委托。");
    this.prune();
    if (
      Object.hasOwn(this.state.claimed, id) ||
      this.state.accepted.some((c) => c.id === id)
    )
      return this.action(false, "这份委托已经接取或完成。");
    const active = this.state.accepted.filter(
      (c) => this.host.day <= c.expiresDay,
    );
    if (active.length >= 3)
      return this.action(false, "最多同时接取 3 份委托，请先完成已有委托。");
    const entry = this.board().find((c) => c.id === id);
    if (!entry) return this.action(false, "这份委托已离开当前公告板。");
    this.state.accepted = active;
    this.state.accepted.push(entry);
    return this.action(
      true,
      `已接下委托，在第 ${entry.expiresDay} 日结束前将货物交给本港居民。`,
    );
  }
  deliverCommission(id: string): LifeAction {
    if (!this.portReady()) return this.action(false, "靠港后才能交付委托。");
    const entry = this.state.accepted.find((c) => c.id === id);
    if (!entry || Object.hasOwn(this.state.claimed, id))
      return this.action(false, "请先接取这份委托，已领取的奖励不能重复领取。");
    if (entry.portId !== this.host.currentPortId)
      return this.action(
        false,
        `请回到${portById.get(entry.portId)!.name}交付委托。`,
      );
    if (this.host.day > entry.expiresDay)
      return this.action(false, "委托已经过期，货物仍保留在你的船上。");
    if (this.host.cargo(entry.goodId) < entry.quantity)
      return this.action(
        false,
        `还需要准备 ${entry.quantity} ${goodById.get(entry.goodId)!.unit}${goodById.get(entry.goodId)!.name}。`,
      );
    if (!this.host.consumeCargo(entry.goodId, entry.quantity))
      return this.action(false, "货物数量发生变化，未完成交付。");
    this.state.claimed[id] = this.host.day;
    this.state.accepted = this.state.accepted.filter((c) => c.id !== id);
    this.host.addCash(entry.reward);
    this.host.addReputation(1);
    this.gainFriendship(
      `${entry.portId}~${roles[entry.slot].id}`,
      entry.festival ? 10 : 6,
    );
    return this.action(
      true,
      `交付完成，收到 ${entry.reward} 金币，声望 +1，委托人的好感上升。`,
    );
  }
  technologies(): Technology[] {
    return techRows.map((t) => ({
      ...t,
      requires: [...t.requires],
      unlocked: this.state.researched.includes(t.id),
    }));
  }
  research(id: string): LifeAction {
    if (!this.portReady()) return this.action(false, "请靠港后组织研究。");
    const tech = techRows.find((t) => t.id === id);
    if (!tech) return this.action(false, "没有这项研究。");
    if (this.state.researched.includes(id))
      return this.action(false, "这项工艺已经掌握。");
    if (tech.era > this.host.eraIndex)
      return this.action(false, "当前时代尚不支持这项研究。");
    const missing = tech.requires.filter(
      (required) => !this.state.researched.includes(required),
    );
    if (missing.length)
      return this.action(
        false,
        `请先研究${missing.map((id) => techRows.find((t) => t.id === id)!.name).join("、")}。`,
      );
    if (!this.host.spendCash(tech.cost))
      return this.action(false, `研究需要 ${tech.cost} 金币。`);
    this.state.researched.push(id);
    return this.action(true, `已掌握${tech.name}，${tech.description}`);
  }
  facilities(): {
    id: string;
    name: string;
    description: string;
    cost: number;
    level: number;
  }[] {
    const levels = this.state.facilities[this.host.currentPortId] ?? {
      warehouse: 0,
      workshop: 0,
      garden: 0,
    };
    return facilityRows.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      cost: Math.ceil(f.base * 1.9 ** levels[f.id]),
      level: levels[f.id],
    }));
  }
  build(id: string): LifeAction {
    if (!this.portReady())
      return this.action(false, "靠港后才能建设港口设施。");
    const row = facilityRows.find((f) => f.id === id);
    if (!row || row.era > this.host.eraIndex)
      return this.action(false, "当前无法建设这项设施。");
    const info = this.facilities().find((f) => f.id === id)!;
    if (info.level >= 3) return this.action(false, "该设施已达到 3 级上限。");
    if (!this.host.spendCash(info.cost))
      return this.action(false, `建设需要 ${info.cost} 金币。`);
    const portId = this.host.currentPortId;
    const levels = this.state.facilities[portId] ?? {
      warehouse: 0,
      workshop: 0,
      garden: 0,
    };
    this.state.facilities[portId] = { ...levels, [row.id]: info.level + 1 };
    return this.action(
      true,
      `${portById.get(portId)!.name}的${row.name}建成 ${info.level + 1} 级。`,
    );
  }
  bundles(): (BundleDefinition & { completed: boolean })[] {
    return bundleRows.map((b) => ({
      ...b,
      requirements: b.requirements.map((r) => ({ ...r })),
      completed: this.state.completedBundles.includes(b.id),
    }));
  }
  contributeBundle(id: string): LifeAction {
    if (!this.portReady())
      return this.action(false, "请靠港后把收集品交给商栈。");
    const bundle = bundleRows.find((b) => b.id === id);
    if (!bundle) return this.action(false, "没有这个收集项目。");
    if (this.state.completedBundles.includes(id))
      return this.action(false, "这份收集已经完成，不能重复领取奖励。");
    if (
      bundle.requirements.some(
        (r) => goodById.get(r.goodId)!.era > this.host.eraIndex,
      )
    )
      return this.action(
        false,
        "后续时代开放全部所需商品后，才能完成这份收集。",
      );
    if (bundle.requirements.some((r) => this.host.cargo(r.goodId) < r.quantity))
      return this.action(false, "请先把清单中的全部货物装进船舱。");
    // All quantities are checked before any deduction. Host consumption is
    // synchronous and must return true for a quantity it just reported holding.
    for (const requirement of bundle.requirements) {
      if (!this.host.consumeCargo(requirement.goodId, requirement.quantity))
        throw new Error("LifeHost violated its synchronous cargo contract");
    }
    this.state.completedBundles.push(id);
    this.host.addCash(bundle.reward);
    this.host.addReputation(id === "world-teatable" ? 5 : 3);
    return this.action(
      true,
      `${bundle.name}收集完成，收到 ${bundle.reward} 金币，家族永久奖励已生效。`,
    );
  }
  bonuses(): LifeBonuses {
    const has = (id: string) => this.state.researched.includes(id);
    const all = Object.values(this.state.facilities),
      local = this.state.facilities[this.host.currentPortId];
    const warehouses = all.reduce((n, f) => n + f.warehouse, 0),
      gardens = all.reduce((n, f) => n + f.garden, 0);
    const relation = roles.reduce(
      (n, r) =>
        n + this.relation(`${this.host.currentPortId}~${r.id}`).friendship,
      0,
    );
    return {
      speed:
        1 +
        (has("sailcloth") ? 0.06 : 0) +
        (has("survey") ? 0.06 : 0) +
        (has("compass") ? 0.08 : 0),
      riskReduction:
        (has("stars") ? 0.015 : 0) +
        (has("survey") ? 0.015 : 0) +
        (has("marine-insurance") ? 0.03 : 0) +
        (this.state.completedBundles.includes("shipwright-kit") ? 0.005 : 0),
      taxReduction:
        (has("ledger") ? 0.003 : 0) +
        Math.min(0.009, relation * 0.00003) +
        (this.state.completedBundles.includes("world-teatable") ? 0.003 : 0),
      supplyReduction:
        Math.min(0.12, gardens * 0.015) + (has("preservation") ? 0.08 : 0),
      capacity:
        Math.min(32, warehouses * 4) +
        (has("stowage") ? 6 : 0) +
        (this.state.completedBundles.includes("harbor-pantry") ? 2 : 0),
      production:
        (local?.workshop ?? 0) * 0.03 + (has("craft-guilds") ? 0.03 : 0),
    };
  }
}
