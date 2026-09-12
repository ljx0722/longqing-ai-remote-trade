const {
  chromium,
} = require("C:/Users/刘锦烋/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--enable-unsafe-swiftshader",
      "--use-angle=swiftshader",
      "--disable-webgpu",
    ],
  });
  try {
    const page = await browser.newPage({
        viewport: { width: 1100, height: 780 },
        serviceWorkers: "block",
      }),
      errors = [];
    page.setDefaultTimeout(60000);
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "gpu", { value: undefined });
      localStorage.setItem("remote-trade-quality", "low");
      // Observe the camera actually rendered, without adding a game debug API.
      window.__THREE_DEVTOOLS__ = new EventTarget();
      window.__THREE_DEVTOOLS__.addEventListener("observe", (event) => {
        const renderer = event.detail;
        if (!renderer.isWebGLRenderer) return;
        const render = renderer.render.bind(renderer);
        renderer.render = (scene, camera) => {
          window.__mapGroundAt = (x, y) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const ray = camera.position
              .clone()
              .set(
                ((x - rect.left) / rect.width) * 2 - 1,
                1 - ((y - rect.top) / rect.height) * 2,
                -1,
              )
              .unproject(camera);
            const direction = camera.getWorldDirection(camera.position.clone());
            ray.addScaledVector(direction, -ray.y / direction.y);
            return { x: ray.x, z: ray.z };
          };
          window.__renderedMapCamera = {
            x: camera.position.x,
            z: camera.position.z,
            zoom: camera.zoom,
          };
          return render(scene, camera);
        };
      });
    });
    const frames = async () =>
      page.evaluate(
        () =>
          new Promise((resolve) => {
            let n = 0;
            function frame() {
              if (++n === 5) resolve();
              else requestAnimationFrame(frame);
            }
            requestAnimationFrame(frame);
          }),
      );
    await page.goto("http://127.0.0.1:4173/");
    await page.locator("#startGame").click();
    await page.locator(".ocean-active").waitFor();
    await page.locator("#pause").click();
    if (await page.locator("#dismissNews").isVisible())
      await page.locator("#dismissNews").click();
    if (await page.locator("#skipGuide").isVisible())
      await page.locator("#skipGuide").click();
    await frames();
    const marker = page.locator("[data-ocean-port=memphis]");
    await marker.waitFor();
    const before = await marker.boundingBox();
    console.log(
      "hit",
      await page.evaluate(() =>
        document.elementFromPoint(830, 440)?.outerHTML.slice(0, 200),
      ),
    );
    await page.mouse.move(830, 440);
    await page.mouse.down();
    await page.mouse.move(660, 420, { steps: 24 });
    await page.mouse.up();
    await frames();
    const after = await marker.boundingBox();
    console.log({ before, after, errors });
    assert(
      after && Math.abs(after.x - before.x) > 50,
      "Map must pan with a mouse drag",
    );
    assert.equal(await page.locator("#toggleMap").innerText(), "回到船队");
    assert(
      (await page.locator("#placeRegion").innerText()).includes(
        "地图浏览 · 船队停泊",
      ),
    );
    await frames();
    const retained = await marker.boundingBox();
    assert(
      Math.abs(retained.x - after.x) < 15,
      "Camera must not snap back after dragging",
    );
    await page.locator("#recenter").click();
    await frames();
    const centered = await marker.boundingBox();
    console.log({ centered });
    assert(
      Math.abs(centered.x - before.x) < 20,
      "Return to fleet restores the camera",
    );
    const cityStart = await marker.boundingBox();
    await page.mouse.move(
      cityStart.x + cityStart.width / 2,
      cityStart.y + cityStart.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      cityStart.x + cityStart.width / 2 + 140,
      cityStart.y + cityStart.height / 2 + 30,
      { steps: 20 },
    );
    await page.mouse.up();
    await frames();
    const cityEnd = await marker.boundingBox();
    console.log({ cityStart, cityEnd });
    assert(
      cityEnd && Math.abs(cityEnd.x - cityStart.x) > 50,
      "Dragging from a city label must also move the map",
    );
    assert(
      await page.locator("#drawer").isHidden(),
      "Dragging a label must not open a city drawer",
    );
    const beforeWheel = await marker.boundingBox();
    await marker.hover();
    const wheelPoint = {
      x: beforeWheel.x + beforeWheel.width / 2,
      y: beforeWheel.y + beforeWheel.height / 2,
    };
    const groundBefore = await page.evaluate(
      ({ x, y }) => window.__mapGroundAt(x, y),
      wheelPoint,
    );
    const zoomBefore = await page.evaluate(
      () => window.__renderedMapCamera.zoom,
    );
    await page.mouse.wheel(0, 260);
    await frames();
    const groundAfter = await page.evaluate(
      ({ x, y }) => window.__mapGroundAt(x, y),
      wheelPoint,
    );
    assert(
      (await page.evaluate(() => window.__renderedMapCamera.zoom)) < zoomBefore,
      "Wheel over a city label must zoom the map",
    );
    assert(
      Math.hypot(
        groundAfter.x - groundBefore.x,
        groundAfter.z - groundBefore.z,
      ) < 0.01,
      "Browsing zoom must keep the ground beneath the cursor fixed",
    );
    await marker.click();
    await page.locator("#drawer").waitFor({ state: "visible" });
    assert(
      (await page.locator("#drawerTitle").innerText()).includes("市场"),
      "A click still opens the city market",
    );
    await page.locator("#closeDrawer").click();
    for (let i = 0; i < 8; i++) await page.locator("#zoomIn").click();
    await frames();
    assert.equal(
      await page.evaluate(() => window.__renderedMapCamera.zoom),
      32,
    );
    await marker.waitFor({ state: "visible" });
    await page.locator("#recenter").click();
    await frames();
    assert.equal(
      await page.evaluate(() => window.__renderedMapCamera.zoom),
      32,
      "Recenter preserves the player's chosen zoom",
    );
    const closeCity = await marker.boundingBox();
    await page.mouse.click(
      closeCity.x + closeCity.width / 2,
      closeCity.y + closeCity.height + 24,
    );
    assert(
      (await page.locator("#drawerTitle").innerText()).includes("市场"),
      "At maximum zoom, the city label remains visible and clicking the building below it opens the city",
    );
    await page.locator("#closeDrawer").click();
    await page.locator(".bottom-dock [data-panel=route]").click();
    await page.locator("#routeSearch").fill("比布鲁斯");
    await page.locator("[data-destination=byblos]").click();
    await page.locator("#sail").click();
    await page.locator("#helm").waitFor({ state: "visible" });
    if (
      (await page.locator("#pause").getAttribute("aria-label")) === "暂停时间"
    )
      await page.locator("#pause").click();
    await frames();
    await page.locator("#followShip").click();
    for (let i = 0; i < 11; i++) await page.locator("#zoomIn").click();
    await frames();
    const cameraState = () => page.evaluate(() => window.__renderedMapCamera);
    const slowBefore = await cameraState();
    assert.equal(slowBefore.zoom, 32);
    await page.mouse.move(780, 400);
    await page.mouse.down();
    for (let i = 1; i <= 18; i++) {
      await page.mouse.move(780 + i, 400);
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(resolve)),
      );
    }
    await page.mouse.up();
    await frames();
    const slowAfter = await cameraState();
    console.log({ slowBefore, slowAfter });
    assert(
      slowBefore.x - slowAfter.x > 0.12,
      "A slow 1px-per-frame drag must release fleet follow even at maximum zoom",
    );
    await frames();
    const slowRetained = await cameraState();
    assert(
      Math.abs(slowRetained.x - slowAfter.x) < 0.001,
      "Fleet follow stays off after the slow drag",
    );
    await page.locator("#followShip").click();
    await frames();
    const followed = await cameraState();
    assert(
      Math.abs(followed.x - slowBefore.x) < 0.001 &&
        followed.zoom === slowBefore.zoom,
      "Follow fleet can be restored without changing zoom",
    );
    await page.keyboard.down("Shift");
    await page.mouse.move(780, 400);
    await page.mouse.down({ button: "right" });
    await page.mouse.move(720, 410, { steps: 8 });
    await page.mouse.up({ button: "right" });
    await page.keyboard.up("Shift");
    await frames();
    assert(
      (await cameraState()).x > followed.x + 0.4,
      "Right drag with a modifier still pans the map",
    );
    console.log(
      "Map drag checks passed: terrain, city labels, click, wheel, recenter, slow drag at max zoom, fleet follow, right drag.",
    );
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
