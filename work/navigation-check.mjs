import { build } from "esbuild";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
await build({
  stdin: {
    contents:
      'export * from "./src/navigation.ts"; export { ports } from "./src/data.ts";',
    resolveDir: process.cwd(),
  },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "work/navigation-bundle.mjs",
});
const {
  ports,
  createNavigation,
  initializeNavigationGeography,
  planSeaRoute,
  advanceNavigation,
  distanceDegrees,
  portPoint,
  navigationHazards,
  readNavigation,
} = await import("./navigation-bundle.mjs");
initializeNavigationGeography(
  JSON.parse(await readFile("public/data/land.geojson", "utf8")),
);
const port = (id) => {
  const p = ports.find((p) => p.id === id);
  assert.ok(p, id);
  return p;
};
let checks = 0;
function check(label, action) {
  action();
  checks++;
  console.log(`PASS ${label}`);
}
check("Coordinate convention uses degrees and respects date line", () => {
  assert.ok(Math.abs(portPoint(port("memphis")).lon - 31.25) < 1);
  assert.ok(
    distanceDegrees({ lon: 179, lat: 0 }, { lon: -179, lat: 0 }) < 2.01,
  );
});
const routes = [
  ["memphis", "byblos"],
  ["memphis", "ur"],
  ["lisbon", "havana"],
  ["lisbon", "malacca"],
  ["venice", "constantinople"],
  ["london", "amsterdam"],
  ["manila", "yuegang"],
  ["ur", "lothal"],
  ["cartagena", "panama"],
];
for (const [a, b] of routes) {
  if (!ports.some((p) => p.id === a) || !ports.some((p) => p.id === b))
    continue;
  const start = performance.now(),
    route = planSeaRoute(portPoint(port(a)), port(b));
  check(
    `${a} → ${b} geographic route exists (${Math.round(performance.now() - start)} ms; ${route.length} points)`,
    () => {
      assert.ok(route.length > 1);
      assert.ok(distanceDegrees(route.at(-1), portPoint(port(b))) < 0.01);
    },
  );
  if (a === "memphis" && b === "ur")
    check("Mediterranean → Persian Gulf rounds Africa; no Suez canal", () =>
      assert.ok(route.some((p) => p.lat < -33)),
    );
  if (a === "lisbon" && b === "malacca")
    check("Europe → Asia rounds Africa", () =>
      assert.ok(route.some((p) => p.lat < -33)),
    );
  if (a === "cartagena" && b === "panama")
    check("Caribbean → Pacific rounds South America; no Panama canal", () =>
      assert.ok(route.some((p) => p.lat < -52)),
    );
  const n = createNavigation(port(a), 0);
  n.route = route;
  n.targetId = b;
  let result;
  for (let i = 0; i < 1000; i++) {
    result = advanceNavigation(n, 1.5, 4);
    assert.equal(
      result.blocked,
      false,
      `${a} to ${b} blocked at ${JSON.stringify(n.position)}`,
    );
    if (result.reached) break;
  }
  check(`${a} → ${b} traverses to port without crossing land`, () =>
    assert.equal(result.reached, true),
  );
}
check(
  "Manual helm moves east with clockwise heading and stops at zero throttle",
  () => {
    const n = createNavigation(port("lisbon"), 0);
    n.position = { lon: -30, lat: 30 };
    n.manual = true;
    n.heading = Math.PI / 2;
    advanceNavigation(n, 1, 0);
    assert.ok(n.position.lon > -29);
    assert.ok(Math.abs(n.position.lat - 30) < 0.01);
    n.throttle = 0;
    const before = { ...n.position };
    advanceNavigation(n, 4, 0);
    assert.deepEqual(n.position, before);
  },
);
check("Manual coast collision blocks crossing Africa", () => {
  const n = createNavigation(port("lisbon"), 0);
  n.position = { lon: -18, lat: 15 };
  n.manual = true;
  n.heading = Math.PI / 2;
  const result = advanceNavigation(n, 30, 0);
  assert.equal(result.blocked, true);
  assert.ok(n.position.lon < -15);
});
check(
  "Weather and pirate sites persist deterministically during their six-day cycle",
  () => {
    assert.deepEqual(navigationHazards(7), navigationHazards(11));
    assert.notDeepEqual(navigationHazards(6), navigationHazards(12));
    assert.ok(navigationHazards(1).length <= 32);
    assert.deepEqual(
      new Set(navigationHazards(1).map((h) => h.kind)),
      new Set(["storm", "pirate", "fog", "current"]),
    );
  },
);
check("Storm zones slow down an otherwise identical manual crossing", () => {
  const storm = navigationHazards(0).find(
    (h) => h.kind === "storm" && h.lon < -5,
  );
  const n = createNavigation(port("lisbon"), 0);
  n.position = { lon: storm.lon, lat: storm.lat };
  n.manual = true;
  n.heading = Math.PI;
  advanceNavigation(n, 0.5, 0);
  assert.ok(n.distanceSailed < 0.45);
});
check(
  "Navigation save read clones, roundtrips, and validates corrupted fields",
  () => {
    const n = createNavigation(port("memphis"), 0);
    n.route = planSeaRoute(n.position, port("byblos"));
    n.targetId = "byblos";
    advanceNavigation(n, 1, 2);
    const copy = readNavigation(
      JSON.parse(JSON.stringify(n)),
      port("memphis"),
      ports,
    );
    assert.deepEqual(copy, n);
    copy.position.lon += 1;
    assert.notDeepEqual(copy.position, n.position);
    for (const bad of [
      { ...n, position: { lon: NaN, lat: 0 } },
      { ...n, leg: 999999 },
      { ...n, throttle: -1 },
      { ...n, targetId: "nonexistent" },
      { ...n, discovered: ["bogus"] },
    ])
      assert.equal(readNavigation(bad, port("memphis"), ports), null);
    assert.equal(
      readNavigation(undefined, port("memphis"), ports).position.lon,
      portPoint(port("memphis")).lon,
    );
  },
);
check("Trail memory stays bounded during long free sailing", () => {
  const n = createNavigation(port("lisbon"), 0);
  n.position = { lon: -150, lat: -45 };
  n.manual = true;
  n.heading = Math.PI / 2;
  for (let i = 0; i < 800; i++) advanceNavigation(n, 0.3, 0);
  assert.ok(n.trail.length <= 500);
});
console.log(`Navigation: ${checks} checks passed.`);

if (process.argv.includes("--visual")) {
  const { chromium } = await import("file:///C:/Users/刘锦烋/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs");
  const browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--disable-webgpu"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => { Object.defineProperty(navigator, "gpu", { value: undefined }); localStorage.setItem("remote-trade-quality", "low"); });
  await page.route("**/navigation-preview", (route) => route.fulfill({ contentType: "text/html", body: '<!DOCTYPE html><html><body style="margin:0"><div id="map" style="width:100vw;height:100vh"></div></body></html>' }));
  await page.goto("http://127.0.0.1:5173/navigation-preview");
  await page.evaluate(async () => {
    const { WorldRenderer } = await import("/src/renderer.ts");
    const { ports } = await import("/src/data.ts");
    const { createNavigation, navigationHazards, planSeaRoute } = await import("/src/navigation.ts");
    const renderer = new WorldRenderer(document.getElementById("map"));
    await renderer.init();
    const nav = createNavigation(ports.find((p) => p.id === "lisbon"), 0);
    nav.discovered = ports.filter((p) => p.basin === "med" || p.basin === "atlantic").map((p) => p.id);
    nav.route = planSeaRoute(nav.position, ports.find((p) => p.id === "malacca"));
    renderer.updateNavigation(nav, ports, navigationHazards(3)); renderer.setOceanView(true); renderer.resetCamera();
    window.previewRenderer = renderer; window.previewNav = nav;
  });
  await page.screenshot({ path: "outputs/navigation-world.png", timeout: 60000 });
  await page.evaluate(() => { window.previewRenderer.followShip(); window.previewRenderer.zoom(3.8); });
  await page.screenshot({ path: "outputs/navigation-coast.png", timeout: 60000 });
  assert.deepEqual(errors, []);
  console.log("Ocean renderer WebGL2 visual check passed; saved world and coast screenshots.");
  await browser.close();
}
