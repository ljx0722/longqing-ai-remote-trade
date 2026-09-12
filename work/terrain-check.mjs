import { build } from "esbuild";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import * as THREE from "three";
await build({
  stdin: {
    contents:
      'export * from "./src/scene/hex-topology";export * from "./src/scene/terrain-elevation";export * from "./src/scene/terrain-biomes";export * from "./src/scene/terrain-surface";',
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  outfile: "work/terrain-bundle.mjs",
});
const {
  hexCenter,
  hexCorner,
  hexAt,
  HEX_RADIUS,
  groundHeight,
  setElevationRaster,
  terrainKind,
  buildReliefGeometry,
} = await import("./terrain-bundle.mjs");
let checks = 0;
for (let q = -20; q <= 20; q++)
  for (let r = -20; r <= 20; r++) {
    const center = hexCenter(q, r),
      rounded = hexAt(center.lon, center.lat);
    assert.equal(rounded.q, q);
    assert.equal(rounded.r, r);
    checks += 2;
    const corners = Array.from({ length: 6 }, (_, i) =>
      hexCorner(center.lon, center.lat, i),
    );
    for (const [dq, dr] of [
      [1, 0],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [0, -1],
      [1, -1],
    ]) {
      const neighbor = hexCenter(q + dq, r + dr),
        other = Array.from({ length: 6 }, (_, i) =>
          hexCorner(neighbor.lon, neighbor.lat, i),
        );
      assert.equal(
        corners.filter((a) =>
          other.some((b) => Math.hypot(a.lon - b.lon, a.lat - b.lat) < 1e-7),
        ).length,
        2,
      );
      checks++;
    }
    const dx = hexCenter(q + 1, r),
      dy = hexCenter(q, r + 1);
    assert(
      Math.abs(
        (dx.lon - center.lon) * (dy.lat - center.lat) -
          (dx.lat - center.lat) * (dy.lon - center.lon) -
          ((3 * Math.sqrt(3)) / 2) * HEX_RADIUS ** 2,
      ) < 1e-7,
    );
    checks++;
  }
setElevationRaster(new Uint8Array(readFileSync("public/data/elevation.bin")));
assert(groundHeight(86, 28) > groundHeight(31, 30) + 0.7);
assert.equal(terrainKind(12, 23), "desert");
assert.equal(terrainKind(-61, -4), "forest");
assert.equal(terrainKind(10, 46), "mountain");
assert.equal(terrainKind(31.2, 30), "river");
checks += 5;
for (let lon = -179; lon < 180; lon += 3)
  for (let lat = -80; lat <= 80; lat += 3) {
    assert(Number.isFinite(groundHeight(lon, lat)));
    checks++;
  }
const shape = new THREE.Shape([
  new THREE.Vector2(4, 44),
  new THREE.Vector2(16, 44),
  new THREE.Vector2(16, 51),
  new THREE.Vector2(4, 51),
]);
shape.holes.push(
  new THREE.Path([
    new THREE.Vector2(7, 47),
    new THREE.Vector2(7, 48),
    new THREE.Vector2(8, 48),
    new THREE.Vector2(8, 47),
  ]),
);
const geometry = buildReliefGeometry(shape),
  p = geometry.getAttribute("position");
for (const name of ["position", "normal", "uv"])
  assert([...geometry.getAttribute(name).array].every(Number.isFinite));
checks += 3;
for (let i = 0; i < p.count; i += 3) {
  const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3,
    lat = -(p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
  assert(!(x > 7 && x < 8 && lat > 47 && lat < 48));
  for (let j = 0; j < 3; j++) {
    const a = i + j,
      b = i + ((j + 1) % 3);
    assert(
      Math.hypot(p.getX(a) - p.getX(b), p.getZ(a) - p.getZ(b)) <= 1.100001,
    );
  }
  checks += 4;
}
geometry.dispose();
console.log(
  `Terrain: ${checks} checks passed (shared hex edges, geographic relief, river/biome positions, finite mesh, polygon holes).`,
);
