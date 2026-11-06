import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';

const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
try {
  const page=await browser.newPage({viewport:{width:1366,height:768}});
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:6});
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200*1024,uploadThroughput:100*1024});
  await page.addInitScript(()=>{
    Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>2});
    Object.defineProperty(navigator,'deviceMemory',{get:()=>2});
  });
  const requests=[];page.on('request',r=>requests.push(r.url()));
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const start=performance.now();
  await page.goto(process.argv[2]||'http://127.0.0.1:4173/');
  await page.locator('.nav-station').first().waitFor({timeout:45000});
  const interactiveMs=performance.now()-start;
  assert.equal(await page.locator('canvas').count(),0);
  assert.equal(await page.locator('.nav-station').count(),6);
  assert.ok(!requests.some(url=>/\/assets\/Scene-|spacefolio\.glb|moon-512|draco_decoder/.test(url)));
  for(const language of ['es','en']) {
    await page.getByRole('button',{name:language==='es'?'ES — Español':'EN — English'}).click();
    for(const id of ['experience','projects','about','education','skills','contact']) {
      await page.locator(`[data-section="${id}"]`).click();
      await page.getByRole('dialog').waitFor();
      await page.keyboard.press('Escape');
      await page.waitForFunction(()=>document.querySelector('.spacefolio').dataset.phase==='EXPLORE');
    }
  }
  await page.screenshot({path:'artifacts/enclosed-low-end.png'});
  const metrics=(await cdp.send('Performance.getMetrics')).metrics;
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({url:r.name.split('/').at(-1),bytes:r.encodedBodySize})));
  assert.deepEqual(errors,[]);
  const result={status:'PASSED',profile:'6x CPU throttle, 200KiB/s down, 150ms latency; reported 2 cores/2GiB; SwiftShader',physicalMemoryLimit:false,interactiveMs,jsHeapBytes:metrics.find(m=>m.name==='JSHeapUsedSize').value,checks:'six sections ES/EN; no 3D engine/model/decoder requests; no Canvas',resources,errors};
  await writeFile('artifacts/enclosed-low-end-performance.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
} finally {await browser.close();}
