import { ports, type Port } from "./data";

export type GeoPoint = { lon: number; lat: number };
export type NavigationState = {
  position: GeoPoint;
  heading: number;
  manual: boolean;
  throttle: number;
  route: GeoPoint[];
  leg: number;
  trail: GeoPoint[];
  discovered: string[];
  targetId: string | null;
  distanceSailed: number;
};
export type NavHazard = {
  id: string;
  kind: "storm" | "pirate" | "fog" | "current";
  lon: number;
  lat: number;
  radius: number;
  strength: number;
  label: string;
};
type Edge = [number, number, number, number];
const edgeBands = new Map<number, Edge[]>();
const seaGrid = new Int8Array(360 * 151);
const accessCache = new Map<string, GeoPoint[]>();
const routeCache = new Map<string, GeoPoint[]>();
let geographyReady = false;
const wrap = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180;
const deltaLon = (a: number, b: number) => wrap(b - a);
const point = (lon: number, lat: number): GeoPoint => ({ lon: wrap(lon), lat });
export const portPoint = (port: Port): GeoPoint =>
  point(port.x * 180, port.y * 90);
export function isLandPoint(point: GeoPoint): boolean { return geographyReady && isLand(point); }
export function distanceDegrees(a: GeoPoint, b: GeoPoint): number {
  return Math.hypot(
    deltaLon(a.lon, b.lon) *
      Math.max(0.18, Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180)),
    b.lat - a.lat,
  );
}

/** Natural straits need a game-scale channel because the bundled coast is 1:110m. */
const straits: [GeoPoint, GeoPoint, number][] = [
  [point(-6.3, 35.9), point(-4.5, 35.9), 0.58],
  [point(26, 39.8), point(29.2, 41.4), 0.58],
  [point(11, 56.8), point(13.4, 54.5), 0.58],
  [point(43, 12), point(43.9, 13.6), 0.52],
  [point(56, 25.6), point(57.1, 26.6), 0.48],
  [point(99, 5), point(104.6, 1.2), 0.54],
  [point(-75, -52), point(-68, -54), 0.52],
];
function segmentDistance(p: GeoPoint, a: GeoPoint, b: GeoPoint): number {
  const x = deltaLon(a.lon, p.lon),
    y = p.lat - a.lat;
  const dx = deltaLon(a.lon, b.lon),
    dy = b.lat - a.lat;
  const t = Math.max(
    0,
    Math.min(1, (x * dx + y * dy) / Math.max(0.00001, dx * dx + dy * dy)),
  );
  return Math.hypot(x - dx * t, y - dy * t);
}
function naturalChannel(p: GeoPoint): boolean {
  return straits.some(([a, b, width]) => segmentDistance(p, a, b) < width);
}
export function initializeNavigationGeography(geojson: unknown): void {
  const data = geojson as {
    features?: { geometry?: { type?: string; coordinates?: unknown } }[];
  };
  if (!Array.isArray(data?.features)) throw new Error("海岸数据格式无效");
  edgeBands.clear();
  let edges = 0;
  for (const f of data.features) {
    const g = f.geometry;
    const polygons =
      g?.type === "Polygon"
        ? [g.coordinates]
        : g?.type === "MultiPolygon"
          ? g.coordinates
          : [];
    if (!Array.isArray(polygons)) continue;
    for (const polygon of polygons as number[][][][]) {
      for (const ring of polygon) {
        for (let i = 1; i < ring.length; i++) {
          const [x1, y1] = ring[i - 1],
            [x2, y2] = ring[i];
          if (
            ![x1, y1, x2, y2].every(Number.isFinite) ||
            Math.abs(x2 - x1) > 180
          )
            continue;
          const edge: Edge = [x1, y1, x2, y2];
          for (
            let band = Math.floor(Math.min(y1, y2));
            band <= Math.floor(Math.max(y1, y2));
            band++
          ) {
            const list = edgeBands.get(band) ?? [];
            list.push(edge);
            edgeBands.set(band, list);
          }
          edges++;
        }
      }
    }
  }
  if (!edges) throw new Error("海岸数据为空");
  seaGrid.fill(0);
  accessCache.clear();
  routeCache.clear();
  geographyReady = true;
}
function isLand(p: GeoPoint): boolean {
  if (!geographyReady || naturalChannel(p)) return false;
  let inside = false;
  for (const [x1, y1, x2, y2] of edgeBands.get(Math.floor(p.lat)) ?? []) {
    if (
      y1 > p.lat !== y2 > p.lat &&
      p.lon < ((x2 - x1) * (p.lat - y1)) / (y2 - y1) + x1
    )
      inside = !inside;
  }
  return inside;
}
function interpolate(a: GeoPoint, b: GeoPoint, fraction: number): GeoPoint {
  return point(
    a.lon + deltaLon(a.lon, b.lon) * fraction,
    a.lat + (b.lat - a.lat) * fraction,
  );
}
function clearSea(a: GeoPoint, b: GeoPoint): boolean {
  if (Math.abs(b.lon - a.lon) > 180) {
    const boundary = a.lon > 0 ? 179.999999 : -179.999999;
    const fraction = (boundary - a.lon) / deltaLon(a.lon, b.lon);
    const latitude = a.lat + (b.lat - a.lat) * fraction;
    return (
      clearSea(a, { lon: boundary, lat: latitude }) &&
      clearSea({ lon: -boundary, lat: latitude }, b)
    );
  }
  const steps = Math.max(
    1,
    Math.ceil(Math.hypot(deltaLon(a.lon, b.lon), b.lat - a.lat) / 0.24),
  );
  for (let i = 0; i <= steps; i++)
    if (isLand(interpolate(a, b, i / steps))) return false;
  // Exact coastline crossings catch small capes/islands that a sampling grid misses.
  const dx = b.lon - a.lon,
    dy = b.lat - a.lat,
    visited = new Set<Edge>();
  for (
    let band = Math.floor(Math.min(a.lat, b.lat));
    band <= Math.floor(Math.max(a.lat, b.lat));
    band++
  ) {
    for (const edge of edgeBands.get(band) ?? []) {
      if (visited.has(edge)) continue;
      visited.add(edge);
      const [x1, y1, x2, y2] = edge,
        ex = x2 - x1,
        ey = y2 - y1;
      const denominator = dx * ey - dy * ex;
      if (Math.abs(denominator) < 0.00000001) continue;
      const t = ((x1 - a.lon) * ey - (y1 - a.lat) * ex) / denominator;
      const u = ((x1 - a.lon) * dy - (y1 - a.lat) * dx) / denominator;
      if (
        t > 0 &&
        t < 1 &&
        u >= 0 &&
        u <= 1 &&
        !naturalChannel(interpolate(a, b, t))
      )
        return false;
    }
  }
  return true;
}

// Actual river courses / ancient shoreline access. These are terminal approaches,
// never through-connections between different seas (no Suez or Panama shortcut).
const riverAccess: Record<string, number[][]> = {
  nanjing: [[119.5,32.2],[120.3,31.9],[121.1,31.9],[121.9,31.5],[122.3,31.4]],
  yangzhou: [[119.5,32.2],[120.3,31.9],[121.1,31.9],[121.9,31.5],[122.3,31.4]],
  novgorod: [[32.3,59.6],[32.3,60.1],[31.5,60.0],[30.5,59.95],[29.5,60.0],[28.8,59.9]],
  ayutthaya: [[100.5,13.8],[100.6,13.5],[100.65,13.1]],
  satgaon: [[88.2,22.3],[88.1,21.95],[88.0,21.55],[88.0,21.1]],
  bordeaux: [[-.7,45],[-.85,45.5],[-1.1,45.7],[-1.5,45.9]],
  shanghai: [[121.65,31.35],[121.9,31.45],[122.25,31.4]],
  rotterdam: [[4.1,51.97],[3.9,52.02]],
  "st-petersburg": [[29.6,60.0],[28.8,59.9]],
  calcutta: [[88.2,22.3],[88.1,21.95],[88.0,21.55],[88.0,21.1]],
  dhaka: [[90.55,23.4],[90.65,22.9],[90.65,22.2],[90.6,21.4]],
  bangkok: [[100.6,13.5],[100.65,13.2],[100.65,12.8]],
  dagon: [[96.25,16.5],[96.3,16.1],[96.25,15.7]],
  memphis: [
    [31.15, 30.2],
    [30.85, 30.8],
    [30.5, 31.5],
    [30.3, 32],
  ],
  ur: [
    [47.2, 30.8],
    [48.3, 30.1],
    [49, 29.7],
  ],
  basra: [
    [48.2, 30.1],
    [49, 29.7],
  ],
  lothal: [
    [72.35, 22.1],
    [72.35, 21.3],
    [71.9, 20.5],
  ],
  london: [
    [0.5, 51.5],
    [1.5, 51.5],
    [2, 52],
  ],
  quebec: [
    [-69.7, 47.4],
    [-68, 48.4],
    [-65.5, 49.6],
    [-62.5, 49.4],
  ],
  antwerp: [
    [4.1, 51.4],
    [3.3, 51.5],
    [2.5, 52],
  ],
  hamburg: [
    [9.1, 53.8],
    [8.2, 54.1],
    [7.5, 54.5],
  ],
  guangzhou: [
    [113.5, 22.5],
    [113.8, 21.8],
  ],
  hangzhou: [
    [121.1, 30.3],
    [122, 30.3],
  ],
  nantes: [
    [-1.95, 47.2],
    [-2.6, 47],
  ],
  sevilla: [
    [-6, 36.9],
    [-6.5, 36.6],
  ],
  seville: [
    [-6, 36.9],
    [-6.5, 36.6],
  ],
};
function nearestSea(p: GeoPoint): GeoPoint {
  if (!isLand(p)) return { ...p };
  for (let radius = 0.25; radius <= 9; radius += 0.25) {
    for (let angle = 0; angle < 32; angle++) {
      const q = point(
        p.lon + Math.sin((angle * Math.PI) / 16) * radius,
        p.lat + Math.cos((angle * Math.PI) / 16) * radius,
      );
      if (q.lat >= -70 && q.lat <= 80 && !isLand(q)) return q;
    }
  }
  return p;
}
function portAccess(port: Port): GeoPoint[] {
  const cached = accessCache.get(port.id);
  if (cached) return cached;
  const path = [
    portPoint(port),
    ...(riverAccess[port.id] ?? []).map(([lon, lat]) => point(lon, lat)),
  ];
  const sea = nearestSea(path[path.length - 1]);
  if (distanceDegrees(path[path.length - 1], sea) > 0.001) path.push(sea);
  accessCache.set(port.id, path);
  return path;
}
function onPortApproach(p: GeoPoint): boolean {
  for (const port of ports) {
    if (distanceDegrees(p, portPoint(port)) > (port.id === "quebec" ? 12 : 7))
      continue;
    const approach = portAccess(port);
    for (let i = 1; i < approach.length; i++)
      if (segmentDistance(p, approach[i - 1], approach[i]) < 0.3) return true;
  }
  return false;
}
function passable(p: GeoPoint): boolean {
  return p.lat >= -70 && p.lat <= 80 && (!isLand(p) || onPortApproach(p));
}
const gridPoint = (id: number) =>
  point((id % 360) - 180, Math.floor(id / 360) - 70);
const gridId = (lon: number, lat: number) =>
  (Math.round(lat) + 70) * 360 +
  ((((Math.round(lon) + 180) % 360) + 360) % 360);
function gridWater(id: number): boolean {
  if (!seaGrid[id]) seaGrid[id] = isLand(gridPoint(id)) ? -1 : 1;
  return seaGrid[id] === 1;
}
function nearestGrid(p: GeoPoint): number {
  let best = -1,
    distance = Infinity;
  for (let r = 1; r <= 5; r++) {
    for (let dx = -r; dx <= r; dx++)
      for (let dy = -r; dy <= r; dy++) {
        if (p.lat + dy < -70 || p.lat + dy > 80) continue;
        const id = gridId(p.lon + dx, p.lat + dy),
          q = gridPoint(id),
          d = distanceDegrees(p, q);
        if (d < distance && gridWater(id) && clearSea(p, q)) {
          best = id;
          distance = d;
        }
      }
    if (best !== -1) return best;
  }
  return -1;
}
class MinHeap {
  private entries: { id: number; score: number }[] = [];
  get length() {
    return this.entries.length;
  }
  push(id: number, score: number) {
    const item = { id, score };
    this.entries.push(item);
    let n = this.entries.length - 1;
    while (n > 0) {
      const parent = (n - 1) >> 1;
      if (this.entries[parent].score <= score) break;
      this.entries[n] = this.entries[parent];
      n = parent;
    }
    this.entries[n] = item;
  }
  pop(): number {
    const first = this.entries[0],
      last = this.entries.pop()!;
    if (this.entries.length) {
      let n = 0;
      while (n * 2 + 1 < this.entries.length) {
        let child = n * 2 + 1;
        if (
          child + 1 < this.entries.length &&
          this.entries[child + 1].score < this.entries[child].score
        )
          child++;
        if (this.entries[child].score >= last.score) break;
        this.entries[n] = this.entries[child];
        n = child;
      }
      this.entries[n] = last;
    }
    return first.id;
  }
}
function seaPath(from: GeoPoint, to: GeoPoint, useGulfApproach = true): GeoPoint[] {
  if (clearSea(from, to)) return [from, to];
  // The Gulf of Finland is navigable, but its mainland and skerries disconnect
  // the whole-degree search grid near 23–24°E. Join its actual open-water
  // entrance without relaxing the coastline checks or carving through land.
  if (useGulfApproach) {
    const entrance = point(22, 59.4);
    const inGulf = (p: GeoPoint) => p.lon > 23 && p.lon < 31 && p.lat > 59 && p.lat < 61;
    if (inGulf(to) && clearSea(entrance, to)) {
      const approach = seaPath(from, entrance, false);
      if (approach.length) return [...approach, to];
    }
    if (inGulf(from) && clearSea(from, entrance)) {
      const departure = seaPath(entrance, to, false);
      if (departure.length) return [from, ...departure];
    }
  }
  const start = nearestGrid(from),
    goal = nearestGrid(to);
  if (start < 0 || goal < 0) return [];
  const previous = new Int32Array(seaGrid.length).fill(-1);
  const cost = new Float64Array(seaGrid.length).fill(Infinity);
  const closed = new Uint8Array(seaGrid.length);
  const heap = new MinHeap();
  cost[start] = 0;
  heap.push(start, distanceDegrees(from, to));
  while (heap.length) {
    const id = heap.pop();
    if (closed[id]) continue;
    if (id === goal) {
      const path = [to];
      let cursor = goal;
      while (cursor !== -1) {
        path.push(gridPoint(cursor));
        cursor = previous[cursor];
      }
      path.push(from);
      path.reverse();
      const smooth = [path[0]];
      let i = 0;
      while (i < path.length - 1) {
        let next = Math.min(path.length - 1, i + 24);
        while (next > i + 1 && !clearSea(path[i], path[next])) next--;
        smooth.push(path[next]);
        i = next;
      }
      return smooth;
    }
    closed[id] = 1;
    const here = gridPoint(id);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++) {
        if ((!dx && !dy) || here.lat + dy < -70 || here.lat + dy > 80) continue;
        const next = gridId(here.lon + dx, here.lat + dy);
        if (closed[next] || !gridWater(next)) continue;
        const q = gridPoint(next),
          nextCost = cost[id] + distanceDegrees(here, q);
        if (nextCost >= cost[next] || !clearSea(here, q)) continue;
        cost[next] = nextCost;
        previous[next] = id;
        heap.push(next, nextCost + distanceDegrees(q, to) * 0.85);
      }
  }
  return [];
}
export function planSeaRoute(from: GeoPoint, to: Port): GeoPoint[] {
  if (!geographyReady) return [];
  const cacheKey = `${from.lon.toFixed(5)},${from.lat.toFixed(5)}:${to.id}:${to.x.toFixed(5)},${to.y.toFixed(5)}`;
  const cached = routeCache.get(cacheKey);
  if (cached) return cached.map((p) => ({ ...p }));
  const origin = ports.find((p) => distanceDegrees(from, portPoint(p)) < 0.05);
  let depart = origin ? [from, ...portAccess(origin).slice(1)] : [from];
  // A player can hand control back while still in a river approach. Continue
  // along that same channel instead of asking the sea grid to route from land.
  if (!origin && isLand(from)) {
    let best = Infinity;
    for (const port of ports) {
      if (distanceDegrees(from, portPoint(port)) > 12) continue;
      const access = portAccess(port);
      for (let i = 1; i < access.length; i++) {
        const distance = segmentDistance(from, access[i - 1], access[i]);
        if (distance < 0.32 && distance < best) {
          best = distance;
          depart = [from, ...access.slice(i)];
        }
      }
    }
  }
  const arrival = portAccess(to);
  const middle = seaPath(
    depart[depart.length - 1],
    arrival[arrival.length - 1],
  );
  if (!middle.length) return [];
  const path = [
    from,
    ...depart.slice(1),
    ...middle.slice(1),
    ...arrival.slice(0, -1).reverse(),
  ];
  const result = path
    .filter((p, i) => !i || distanceDegrees(p, path[i - 1]) > 0.001)
    .map((p) => ({ ...p }));
  if (routeCache.size > 240) routeCache.delete(routeCache.keys().next().value!);
  routeCache.set(cacheKey, result);
  return result.map((p) => ({ ...p }));
}
export function createNavigation(port: Port, _day: number): NavigationState {
  return {
    position: portPoint(port),
    heading: 0,
    manual: false,
    throttle: 1,
    route: [],
    leg: 0,
    trail: [portPoint(port)],
    discovered: [port.id],
    targetId: null,
    distanceSailed: 0,
  };
}
function bearing(a: GeoPoint, b: GeoPoint): number {
  return Math.atan2(
    deltaLon(a.lon, b.lon) * Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180),
    b.lat - a.lat,
  );
}
export function navigationHazards(day: number): NavHazard[] {
  const epoch = Math.floor(Math.max(0, day) / 6);
  const sites: [number, number, NavHazard["kind"], string][] = [
    [24, 34, "storm", "爱琴海阵风"],
    [16, 36, "pirate", "西西里可疑帆影"],
    [-14, 41, "storm", "北大西洋风暴"],
    [-35, 28, "current", "大西洋洋流"],
    [-65, 20, "pirate", "加勒比海盗活动"],
    [-75, 37, "fog", "西大西洋海雾"],
    [43, 13, "pirate", "曼德海峡劫掠船"],
    [58, 23, "storm", "阿拉伯海涌浪"],
    [69, 13, "current", "印度洋季风流"],
    [95, 8, "storm", "孟加拉湾风暴"],
    [103, 2, "pirate", "海峡陌生船队"],
    [118, 21, "storm", "南海热带风暴"],
    [130, 34, "fog", "东海浓雾"],
    [18, -38, "storm", "好望角大浪"],
    [-69, -57, "current", "合恩角强流"],
    [151, -18, "fog", "珊瑚海海雾"],
  ];
  return sites.map(([lon, lat, kind, label], i) => ({
    id: `${kind}-${i}-${epoch}`,
    kind,
    lon: wrap(lon + Math.sin(epoch * 1.7 + i) * 2),
    lat: lat + Math.cos(epoch * 0.9 + i * 2) * 1.4,
    radius: kind === "pirate" ? 3.4 : kind === "storm" ? 5 : 4,
    strength: 0.5 + (Math.sin(epoch + i * 1.2) + 1) * 0.23,
    label,
  }));
}
export function advanceNavigation(
  nav: NavigationState,
  distance: number,
  day: number,
): { reached: boolean; blocked: boolean } {
  if (!Number.isFinite(distance) || distance <= 0 || !geographyReady)
    return { reached: false, blocked: false };
  let budget =
    Math.min(distance, 180) *
    (nav.manual ? Math.max(0, Math.min(1, nav.throttle)) : 1);
  const hazards = navigationHazards(day);
  for (const hazard of hazards)
    if (distanceDegrees(nav.position, hazard) < hazard.radius)
      budget *=
        hazard.kind === "current"
          ? 1.16
          : hazard.kind === "storm"
            ? 0.7
            : hazard.kind === "fog"
              ? 0.82
              : 1;
  let moved = 0,
    blocked = false;
  while (budget > 0.000001) {
    if (!nav.manual && nav.leg >= nav.route.length) break;
    const goal = nav.manual
      ? point(
          nav.position.lon +
            (Math.sin(nav.heading) * 0.2) /
              Math.max(0.18, Math.cos((nav.position.lat * Math.PI) / 180)),
          nav.position.lat + Math.cos(nav.heading) * 0.2,
        )
      : nav.route[nav.leg];
    const remaining = distanceDegrees(nav.position, goal);
    if (remaining < 0.00001) {
      if (!nav.manual) nav.leg++;
      else break;
      continue;
    }
    const step = Math.min(remaining, budget, 0.12);
    const next = interpolate(nav.position, goal, step / remaining);
    if (!passable(next)) {
      blocked = true;
      break;
    }
    nav.heading = bearing(nav.position, next);
    nav.position = next;
    budget -= step;
    moved += step;
    if (!nav.manual && step >= remaining - 0.00001) nav.leg++;
  }
  nav.distanceSailed += moved;
  if (
    moved > 0 &&
    (!nav.trail.length ||
      distanceDegrees(nav.trail[nav.trail.length - 1], nav.position) > 0.18)
  )
    nav.trail.push({ ...nav.position });
  if (nav.trail.length > 500) nav.trail.splice(0, nav.trail.length - 500);
  return {
    reached: !nav.manual && nav.route.length > 0 && nav.leg >= nav.route.length,
    blocked,
  };
}
export function readNavigation(
  raw: unknown,
  fallbackPort: Port,
  unlockedPorts: Port[],
): NavigationState | null {
  if (raw === undefined || raw === null)
    return createNavigation(fallbackPort, 0);
  if (typeof raw !== "object") return null;
  const n = raw as NavigationState;
  const validPoint = (p: unknown): p is GeoPoint =>
    !!p &&
    typeof p === "object" &&
    Number.isFinite((p as GeoPoint).lon) &&
    Math.abs((p as GeoPoint).lon) <= 180 &&
    Number.isFinite((p as GeoPoint).lat) &&
    (p as GeoPoint).lat >= -70 &&
    (p as GeoPoint).lat <= 80;
  const validList = (items: unknown, max: number): items is GeoPoint[] =>
    Array.isArray(items) && items.length <= max && items.every(validPoint);
  const ids = new Set(unlockedPorts.map((p) => p.id));
  if (
    !validPoint(n.position) ||
    !Number.isFinite(n.heading) ||
    Math.abs(n.heading) > 1000 ||
    typeof n.manual !== "boolean" ||
    !Number.isFinite(n.throttle) ||
    n.throttle < 0 ||
    n.throttle > 1 ||
    !validList(n.route, 1000) ||
    !Number.isInteger(n.leg) ||
    n.leg < 0 ||
    n.leg > n.route.length ||
    !validList(n.trail, 500) ||
    !Array.isArray(n.discovered) ||
    n.discovered.length > ports.length ||
    n.discovered.some((id) => typeof id !== "string" || !ids.has(id)) ||
    (n.targetId !== null && !ids.has(n.targetId)) ||
    !Number.isFinite(n.distanceSailed) ||
    n.distanceSailed < 0
  )
    return null;
  return {
    ...n,
    position: { ...n.position },
    route: n.route.map((p) => ({ ...p })),
    trail: n.trail.map((p) => ({ ...p })),
    discovered: [...new Set(n.discovered)],
  };
}
