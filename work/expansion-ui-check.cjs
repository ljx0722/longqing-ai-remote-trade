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
        viewport: { width: 1440, height: 960 },
        serviceWorkers: "block",
      }),
      errors = [];
    page.setDefaultTimeout(30000);
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "gpu", { value: undefined });
      localStorage.setItem("remote-trade-quality", "low");
      const raf = window.requestAnimationFrame.bind(window),
        pending = [];
      let pause = false;
      window.requestAnimationFrame = (cb) =>
        raf((t) => {
          if (pause) pending.push(cb);
          else cb(t);
        });
      window.__pauseCapture = (value) => {
        pause = value;
        if (!value) pending.splice(0).forEach((cb) => raf(cb));
      };
    });
    const capture = async (name) => {
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            window.__pauseCapture(true);
            setTimeout(resolve, 150);
          }),
      );
      try {
        await page.screenshot({ path: `outputs/${name}.png`, timeout: 45000 });
      } finally {
        await page.evaluate(() => window.__pauseCapture(false));
      }
    };
    await page.goto("http://127.0.0.1:4173/");
    await page.locator("canvas").waitFor();
    await page.locator("#startGame").click();
    await page.locator("#welcome").waitFor({ state: "hidden" });
    await page.locator(".ocean-active").waitFor();
    await page.waitForTimeout(900);
    await capture("continuous-start");
    await page.locator(".bottom-dock [data-panel=market]").click();
    assert.equal(await page.locator(".market-product").count(), 12);
    assert(
      (await page.locator("[data-unit-buy=grain]").innerText()).includes(
        "金币／袋",
      ),
    );
    await page.locator("#marketSearch").fill("亚麻");
    assert((await page.locator(".market-product").count()) < 12);
    await page.locator("#marketSearch").fill("");
    await page.locator('[data-page-kind=market][data-page="1"]').click();
    assert((await page.locator(".market-product").count()) <= 12);
    await page.locator("#drawer [data-panel=catalog]").click();
    await page.locator("#catalogSearch").fill("瓷");
    assert((await page.locator(".life-card").count()) <= 12);
    assert((await page.locator("#drawerBody").innerText()).includes("瓷"));
    await page.locator("#closeDrawer").click();
    await page.locator("[data-panel=settings]").click();
    await page
      .locator("#importFile")
      .setInputFiles("work/expansion-fixture.json");
    await page.locator("#drawer").waitFor({ state: "hidden" });
    await page.locator(".bottom-dock [data-panel=guild]").click();
    await page.locator("[data-city=thebes]").waitFor();
    assert(
      (await page.locator("[data-city=memphis]").innerText()).includes(
        "商业 1/3",
      ),
    );
    await capture("civilization-cities");
    await page.locator("[data-dominion-tab=caravans]").click();
    assert(
      (await page.locator("#drawerBody").innerText()).includes("商队在途"),
    );
    await capture("civilization-caravans");
    await page.locator("[data-dominion-tab=army]").click();
    assert(
      (await page.locator("#drawerBody").innerText()).includes("40 / 100"),
    );
    await page.locator("#drawer [data-panel=life]").click();
    await page.locator("[data-life-tab=research]").click();
    assert.equal(await page.locator("[data-life-action=research]").count(), 9);
    await page.locator("[data-life-tab=commissions]").click();
    await page.locator("[data-life-action=accept]").first().click();
    assert((await page.locator("#drawerBody").innerText()).includes("已接下"));
    await capture("civilization-port-life");
    await page.locator("#closeDrawer").click();
    await page.locator("#toggleMap").click();
    await page.locator("#toggleMap", { hasText: "回到船队" }).waitFor();
    await page.waitForTimeout(900);
    await page.locator(".ocean-active").waitFor();
    await capture("civilization-world");
    await page.locator("#toggleMap").click();
    await page.locator("#toggleMap", { hasText: "查看区域" }).waitFor();
    await page.waitForTimeout(900);
    await page.locator("[data-ocean-port=thebes]").waitFor();
    await page.locator("[data-ocean-port=thebes]").click();
    assert((await page.locator("#drawerBody").innerText()).includes("底比斯"));
    await page.locator(".bottom-dock [data-panel=route]").click();
    await page.locator("#routeSearch").fill("比布鲁斯");
    await page.locator("[data-destination=byblos]").click();
    await page.locator("#sail").click();
    await page.locator("#helm").waitFor({ state: "visible" });
    await page.locator("#toggleHelm").click();
    await page.locator("#manualControls").waitFor({ state: "visible" });
    const heading = await page.locator("#headingLabel").innerText();
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(550);
    await page.keyboard.up("ArrowRight");
    assert.notEqual(await page.locator("#headingLabel").innerText(), heading);
    await page.locator("#toggleHelm").click();
    await page.locator("#manualControls").waitFor({ state: "hidden" });
    await page.locator("#pause").click();
    await capture("civilization-sailing");
    await page.setViewportSize({ width: 390, height: 844 });
    await capture("civilization-mobile-sailing");
    assert(
      await page.locator("#helm").evaluate((e) => {
        const r = e.getBoundingClientRect();
        return r.x >= 0 && r.right <= innerWidth;
      }),
    );
    await page.locator(".bottom-dock [data-panel=guild]").click();
    await page.waitForFunction(() => {
      const r = document.querySelector("#drawer").getBoundingClientRect();
      return r.x >= 0 && r.right <= innerWidth + 1;
    });
    await capture("civilization-mobile-cities");
    await page.locator("#closeDrawer").click();
    await page.setViewportSize({ width: 1440, height: 960 });
    const atlasState = JSON.parse(
      require("node:fs").readFileSync("work/expansion-fixture.json", "utf8"),
    );
    atlasState.eraIndex = 10;
    atlasState.sandbox = true;
    atlasState.sandboxUnlocked = true;
    await page.locator("[data-panel=settings]").click();
    await page
      .locator("#importFile")
      .setInputFiles({
        name: "world-atlas.json",
        mimeType: "application/json",
        buffer: Buffer.from(JSON.stringify(atlasState)),
      });
    await page.locator("#drawer").waitFor({ state: "hidden" });
    await page.locator(".ocean-active").waitFor();
    await page.locator(".bottom-dock [data-panel=guild]").click();
    await page.locator("[data-dominion-tab=cities]").click();
    await page.locator("[data-city-scope=all]").click();
    await page.locator("#citySearch").fill("北京");
    assert.equal(await page.locator(".city-card").count(), 1);
    assert(
      (await page.locator("[data-city=beijing]").innerText()).includes(
        "尚未发现",
      ),
    );
    assert.equal(
      await page
        .locator("[data-city=beijing] [data-city-action=purchase]")
        .count(),
      0,
    );
    await page.locator("[data-city-focus=beijing]").click();
    await page.locator("[data-ocean-port=beijing]").waitFor();
    await page.waitForTimeout(900);
    await capture("continuous-inland-beijing");
    await page.locator("[data-ocean-port=beijing]").click();
    assert(
      (await page.locator("[data-city=beijing]").innerText()).includes(
        "尚未发现",
      ),
    );
    await page.locator("#citySearch").fill("纽约");
    assert.equal(await page.locator("[data-city=new-amsterdam]").count(), 1);
    await page.locator(".bottom-dock [data-panel=route]").click();
    await page.locator("#routeSearch").fill("雅加达");
    assert.equal(await page.locator("[data-destination=batavia]").count(), 1);
    await page.locator("#closeDrawer").click();
    await page.locator("#toggleMap").click();
    await page.locator("#toggleMap", { hasText: "回到船队" }).waitFor();
    await page.waitForTimeout(900);
    await capture("continuous-world-full");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(900);
    await capture("continuous-mobile-world");
    assert.deepEqual(errors, []);
    console.log(
      "Desktop/mobile UI: market pagination and prices, atlas, city ownership, caravans, residents/research, inland map labels, automatic/manual sailing, keyboard helm, and drawer layout passed.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
