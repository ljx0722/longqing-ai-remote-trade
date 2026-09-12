/** Reproduce the 110m base + nine selected 50m islands, without changing mainland coasts.
 * Run from the project root: node work/augment-world-islands.mjs
 * Add --check-routes to compare actual navigation against the original coastline.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const basePath = "work/land-110m-original.geojson";
const detailedPath = "work/ne50-land.geojson";
const outputPath = "public/data/land.geojson";
const baseHash = "9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9";
const detailedHash = "e874b27a51d146452be360cafb3cc50c86001074a67d534113e6534682f9826b";
const digest = (buffer) => createHash("sha256").update(buffer).digest("hex");
let original;
try {
  original = await readFile(basePath);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  original = await readFile(outputPath);
  assert.equal(digest(original), baseHash, "Backup requires the unmodified 110m source");
  await writeFile(basePath, original, { flag: "wx" });
}
const detailed = await readFile(detailedPath);
assert.equal(digest(original), baseHash, "Original 110m source checksum");
assert.equal(digest(detailed), detailedHash, "Downloaded 50m source checksum");
const base = JSON.parse(original), source = JSON.parse(detailed);
const polygons = (collection) => collection.features.flatMap((feature) =>
  feature.geometry.type === "Polygon" ? [feature.geometry.coordinates]
    : feature.geometry.type === "MultiPolygon" ? feature.geometry.coordinates : [],
);
function inRing([x, y], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
const inPolygon = (point, rings) => inRing(point, rings[0]) && !rings.slice(1).some((ring) => inRing(point, ring));
const onLand = (point, shapes) => shapes.some((rings) => inPolygon(point, rings));
const signedSide = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
const intersects = (a, b, c, d) => signedSide(a, b, c) * signedSide(a, b, d) < 0 && signedSide(c, d, a) * signedSide(c, d, b) < 0;
const originalPolygons = polygons(base), detailedPolygons = polygons(source);
const selections = [
  ["malta", "马耳他", [14.45, 35.89]],
  ["rhodes", "罗得岛", [28.1, 36.2]],
  ["madeira", "马德拉岛", [-16.95, 32.75]],
  ["sao-miguel", "亚速尔圣米格尔岛", [-25.5, 37.78]],
  ["okinawa", "冲绳岛", [127.8, 26.35]],
  ["zanzibar", "桑给巴尔岛", [39.3, -6.1]],
  ["mauritius", "毛里求斯岛", [57.56, -20.26]],
  ["reunion", "留尼汪岛", [55.54, -21.13]],
  ["jeju", "济州岛", [126.53, 33.38]],
];
const used = new Set(), additions = [];
for (const [id, name, point] of selections) {
  assert.equal(onLand(point, originalPolygons), false, `${name} is absent from original data`);
  const found = detailedPolygons.filter((rings) => inPolygon(point, rings));
  assert.equal(found.length, 1, `${name} identifies exactly one source polygon`);
  const rings = found[0];
  assert.ok(!used.has(rings), `${name} is a unique island polygon`);
  used.add(rings);
  // Whole-island checks prevent importing a fragment of an existing mainland.
  for (const vertex of rings[0]) assert.equal(onLand(vertex, originalPolygons), false, `${name} overlaps an existing land vertex`);
  for (const old of originalPolygons) {
    for (const vertex of old[0]) assert.equal(inPolygon(vertex, rings), false, `${name} contains existing land`);
    for (let i = 1; i < rings[0].length; i++) {
      for (let j = 1; j < old[0].length; j++) {
        assert.equal(intersects(rings[0][i - 1], rings[0][i], old[0][j - 1], old[0][j]), false, `${name} crosses existing coastline`);
      }
    }
  }
  additions.push({
    type: "Feature",
    properties: { featurecla: "Land", scalerank: 1, min_zoom: 1, island_id: id, name_zh: name, source: "Natural Earth 1:50m land" },
    geometry: { type: "Polygon", coordinates: rings },
  });
  console.log(`PASS ${name}: original=sea, augmented=land; ${rings.flat().length} source vertices; no overlap with original land`);
}
const output = { ...base, name: "ne_110m_land_with_selected_50m_islands", features: [...base.features, ...additions] };
assert.deepEqual(output.features.slice(0, base.features.length), base.features, "Original mainland and island geometry stays unchanged");
for (const [id, , point] of selections) assert.equal(onLand(point, polygons(output)), true, `${id} retained in output`);
const serialized = JSON.stringify(output) + "\n";
await writeFile(outputPath, serialized);
const vertices = (collection) => polygons(collection).reduce((sum, rings) => sum + rings.reduce((n, ring) => n + ring.length, 0), 0);
console.log(JSON.stringify({ oldFeatures: base.features.length, newFeatures: output.features.length, oldVertices: vertices(base), newVertices: vertices(output), addedVertices: vertices(output) - vertices(base), bytes: Buffer.byteLength(serialized) }));

if (process.argv.includes("--check-routes")) {
  const { build } = await import("esbuild");
  const bundle = await build({ stdin: { contents: 'export * from "./src/navigation.ts"; export { ports } from "./src/data.ts";', resolveDir: process.cwd() }, bundle: true, platform: "node", format: "esm", write: false });
  const nav = await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`);
  const routes = [["lisbon", "funchal"], ["venice", "rhodes"], ["mombasa", "zanzibar"], ["nagasaki", "naha"], ["tunis", "rhodes"], ["lisbon", "malacca"]];
  const results = new Map();
  for (const [label, geography] of [["original", base], ["augmented", output]]) {
    nav.initializeNavigationGeography(geography);
    for (const [fromId, toId] of routes) {
      const from = nav.ports.find((p) => p.id === fromId), to = nav.ports.find((p) => p.id === toId);
      assert.ok(from && to, `${fromId} and ${toId} are existing ports`);
      const route = nav.planSeaRoute(nav.portPoint(from), to);
      assert.ok(route.length > 1, `${label} ${fromId} → ${toId} has a route`);
      const state = nav.createNavigation(from, 0);
      state.route = route;
      state.targetId = to.id;
      let result;
      for (let i = 0; i < 2000; i++) {
        result = nav.advanceNavigation(state, 1.5, 4);
        assert.equal(result.blocked, false, `${label} ${fromId} → ${toId} blocked at ${JSON.stringify(state.position)}`);
        if (result.reached) break;
      }
      assert.equal(result.reached, true, `${label} ${fromId} → ${toId} reached port`);
      const length = route.slice(1).reduce((sum, p, i) => sum + nav.distanceDegrees(route[i], p), 0);
      const key = `${fromId} → ${toId}`;
      const entry = results.get(key) ?? {};
      entry[label] = { routePoints: route.length, distance: Number(length.toFixed(3)), reached: result.reached };
      results.set(key, entry);
    }
  }
  for (const [route, result] of results) console.log(JSON.stringify({ route, ...result }));
}
