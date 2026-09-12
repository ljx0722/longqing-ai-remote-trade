const { chromium } = require('C:/Users/刘锦烋/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--disable-webgpu'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, serviceWorkers: 'block' });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'gpu', { value: undefined });
      localStorage.setItem('remote-trade-quality', 'low');
      const raf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = callback => raf(time => { if (!window.__stopCapture) callback(time); });
    });
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForFunction(() => document.querySelector('#eraLabel')?.textContent.includes('01 /'));
    await page.locator('#startGame').click();
    await page.locator('.bottom-dock [data-panel="market"]').click();
    await page.locator('#drawerBody').evaluate(element => { element.scrollTop = 400; });
    await page.locator('.bottom-dock [data-panel="history"]').click();
    if (!(await page.locator('.unlock-preview').innerText()).includes('船型')) throw Error('Unlock preview missing');
    await page.locator('.bottom-dock [data-panel="market"]').click();
    if (await page.locator('#drawerBody').evaluate(element => element.scrollTop) !== 0) throw Error('New market drawer did not reset its scroll position');
    await page.locator('[data-unit-buy="grain"]').waitFor({ state: 'visible' });
    await page.evaluate(() => new Promise(resolve => { window.__stopCapture = true; setTimeout(resolve, 150); }));
    await page.screenshot({ path: 'outputs/harbor-market.png', timeout: 45000 });
    console.log('Market drawer scroll, visible unit prices, and era unlock preview passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
