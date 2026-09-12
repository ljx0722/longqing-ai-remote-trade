const {
  chromium,
} = require("C:/Users/刘锦烋/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");
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
        viewport: { width: 1280, height: 900 },
        serviceWorkers: "block",
      }),
      errors = [];
    page.setDefaultTimeout(60000);
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "gpu", { value: undefined });
      localStorage.setItem("remote-trade-quality", "low");
      const raf = window.requestAnimationFrame.bind(window),
        pending = [];
      let paused = false;
      window.requestAnimationFrame = (cb) =>
        raf((t) => {
          if (paused) pending.push(cb);
          else cb(t);
        });
      window.__pauseCapture = (value) => {
        paused = value;
        if (!value) pending.splice(0).forEach((cb) => raf(cb));
      };
    });
    const capture = async (name) => {
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            let frames = 0;
            const next = () => {
              if (++frames === 6) resolve();
              else requestAnimationFrame(next);
            };
            requestAnimationFrame(next);
          }),
      );
      await page.evaluate(() => window.__pauseCapture(true));
      await page.waitForTimeout(180);
      await page.screenshot({ path: `outputs/${name}.png`, timeout: 60000 });
      await page.evaluate(() => window.__pauseCapture(false));
      execFileSync("python", [
        "-c",
        `from PIL import Image
from collections import Counter
import sys
im=Image.open(sys.argv[1]).convert('RGB')
w,h=im.size
pixels=list(im.crop((int(w*.06),int(h*.25),int(w*.94),int(h*.66))).getdata())
bins=Counter(tuple(c//16 for c in pixel) for pixel in pixels)
dominant=bins.most_common(1)[0][1]/len(pixels)
assert dominant<.82, f'Blank or unrendered terrain: dominant color covers {dominant:.1%}'
`,
        `outputs/${name}.png`,
      ]);
      console.log("captured", name);
    };
    await page.goto("http://127.0.0.1:4173/");
    await page.locator("canvas").waitFor();
    await page.locator("#startGame").click();
    await page.locator("#welcome").waitFor({ state: "hidden" });
    await page.locator(".ocean-active").waitFor();
    await page.locator("#pause").click();
    await page.waitForTimeout(1500);
    if (await page.locator("#dismissNews").isVisible())
      await page.locator("#dismissNews").click();
    if (await page.locator("#skipGuide").isVisible())
      await page.locator("#skipGuide").click();
    if (await page.locator("#hideGrowth").isVisible())
      await page.locator("#hideGrowth").click();
    await page.waitForTimeout(3200);
    await capture("terrain-nile-current");
    await page.locator(".bottom-dock [data-panel=market]").click();
    assert(
      (await page.locator("[data-unit-buy=grain]").innerText()).includes(
        "金币／袋",
      ),
    );
    await page.locator("#closeDrawer").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(700);
    await capture("terrain-mobile-current");
    await page.locator("[data-ocean-port=memphis]").click();
    assert((await page.locator("#drawerTitle").innerText()).includes("市场"));
    await page.locator("#closeDrawer").click();
    assert(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await page.setViewportSize({ width: 1280, height: 900 });
    const fixture = JSON.parse(
      fs.readFileSync("work/expansion-fixture.json", "utf8"),
    );
    fixture.sandbox = true;
    fixture.eraIndex = 10;
    fs.writeFileSync("work/terrain-fixture.json", JSON.stringify(fixture));
    await page.locator("[data-panel=settings]").click();
    await page
      .locator("#importFile")
      .setInputFiles("work/terrain-fixture.json");
    await page.locator("#drawer").waitFor({ state: "hidden" });
    await page.locator(".bottom-dock [data-panel=guild]").click();
    await page.locator("[data-city-scope=all]").click();
    await page.locator("#citySearch").fill("米兰");
    await page.locator("[data-city-focus=milan]").click();
    await page.locator("[data-ocean-port=milan]").waitFor({ state: "visible" });
    await page
      .locator("[data-ocean-port=memphis]")
      .waitFor({ state: "detached" });
    await page.waitForTimeout(1000);
    assert((await page.locator("#placeName").innerText()).includes("米兰"));
    assert(
      (await page.locator("#placeRegion").innerText()).includes("船队停泊"),
    );
    assert.equal(await page.locator("#toggleMap").innerText(), "回到船队");
    await capture("terrain-alps-current");
    for (let i = 0; i < 6; i++) await page.locator("#zoomIn").click();
    await page.locator("[data-ocean-port=milan]").waitFor({ state: "visible" });
    await page.locator("[data-ocean-port=milan]").click();
    assert((await page.locator("#drawerTitle").innerText()).includes("城邦"));
    await page.locator("#closeDrawer").click();
    for (let i = 0; i < 5; i++) await page.locator("#zoomOut").click();
    for (let i = 0; i < 4; i++) await page.locator("#zoomOut").click();
    await page.waitForTimeout(900);
    await capture("terrain-regional-current");
    console.log(JSON.stringify({ errors }));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
