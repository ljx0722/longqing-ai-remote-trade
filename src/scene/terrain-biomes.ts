import { rivers } from "./river-courses";

// Soft geographic zones, not rectangular biome blocks or surveyed elevations.
export const deserts = [
  [12, 23, 33, 12],
  [46, 24, 17, 10],
  [65, 37, 12, 8],
  [96, 42, 17, 8],
  [134, -26, 20, 10],
  [19, -25, 7, 11],
  [-112, 31, 10, 9],
  [-70, -23, 4, 10],
];
export const forests = [
  [-61, -4, 19, 11],
  [22, 0, 14, 9],
  [105, 9, 17, 16],
  [-119, 51, 10, 14],
  [-78, 44, 13, 13],
  [17, 52, 15, 11],
  [80, 58, 49, 10],
  [138, 38, 5, 11],
  [145, -6, 10, 4],
];
const ranges = [
  [
    [-6, 31],
    [3, 35],
    [9, 36],
  ],
  [
    [-6, 43],
    [3, 43],
  ],
  [
    [6, 45],
    [10, 47],
    [16, 47],
  ],
  [
    [40, 42],
    [48, 43],
  ],
  [
    [68, 36],
    [75, 34],
    [83, 29],
    [92, 29],
    [98, 27],
  ],
  [
    [-128, 57],
    [-119, 48],
    [-111, 39],
    [-104, 25],
  ],
  [
    [-74, 7],
    [-77, -6],
    [-69, -24],
    [-72, -43],
  ],
  [
    [36, 13],
    [40, 7],
  ],
  [
    [28, -29],
    [31, -25],
  ],
  [
    [101, 26],
    [106, 30],
    [111, 33],
  ],
  [
    [138, 34],
    [141, 41],
  ],
];
function segmentDistance(x: number, y: number, a: number[], b: number[]) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1];
  const t = Math.max(
    0,
    Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)),
  );
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}
export function riverDistance(lon: number, lat: number) {
  let distance = 1000;
  for (const river of rivers)
    for (let i = 1; i < river.length; i++) {
      const a = river[i - 1],
        b = river[i];
      if (
        lon < Math.min(a[0], b[0]) - 3 ||
        lon > Math.max(a[0], b[0]) + 3 ||
        lat < Math.min(a[1], b[1]) - 3 ||
        lat > Math.max(a[1], b[1]) + 3
      )
        continue;
      distance = Math.min(distance, segmentDistance(lon, lat, a, b));
    }
  return distance;
}
export function zoneStrength(lon: number, lat: number, zones: number[][]) {
  let value = 0;
  for (const [x, y, w, h] of zones)
    value = Math.max(value, 1 - Math.hypot((lon - x) / w, (lat - y) / h));
  return Math.max(0, value);
}
export function mountainStrength(lon: number, lat: number) {
  let d = 1000;
  for (const range of ranges)
    for (let i = 1; i < range.length; i++)
      d = Math.min(d, segmentDistance(lon, lat, range[i - 1], range[i]));
  return Math.max(0, 1 - d / 1.7);
}
export function terrainKind(
  lon: number,
  lat: number,
): "grass" | "forest" | "desert" | "mountain" | "tundra" | "river" {
  if (Math.abs(lat) > 67) return "tundra";
  if (mountainStrength(lon, lat) > 0.23) return "mountain";
  if (riverDistance(lon, lat) < 0.65) return "river";
  if (zoneStrength(lon, lat, deserts) > 0.13) return "desert";
  if (zoneStrength(lon, lat, forests) > 0.17) return "forest";
  return "grass";
}
