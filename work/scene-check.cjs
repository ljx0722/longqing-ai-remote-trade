const { chromium } = require('C:/Users/刘锦烋/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader','--disable-webgpu']});
 try {
  const page=await browser.newPage({viewport:{width:1100,height:760},deviceScaleFactor:1});
  page.setDefaultTimeout(15000); await page.addInitScript(()=>Object.defineProperty(navigator,'gpu',{value:undefined}));
  page.on('pageerror',e=>console.log(String(e)));
  await page.goto('http://127.0.0.1:5173/work/scene-preview.html');
  await page.waitForSelector('canvas');
  await page.screenshot({path:'work/scene.png',timeout:20000});
  console.log('Scene screenshot saved');
 } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
