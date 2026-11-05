import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const label = process.argv[2] === 'before' ? 'before' : 'after';
const baseUrl = process.argv[3] || 'http://127.0.0.1:5173/';
const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] });
const page = await browser.newPage({viewport:{width:1440,height:900}});
const browserCdp = await browser.newBrowserCDPSession();
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
const cpu = async () => (await browserCdp.send('SystemInfo.getProcessInfo')).processInfo.reduce((sum,p)=>sum+p.cpuTime,0);
const tasks = async () => (await cdp.send('Performance.getMetrics')).metrics.find(m=>m.name==='TaskDuration').value;
await page.goto(baseUrl);
await page.waitForFunction(()=>{const b=document.querySelector('.start-button');return b&&!b.disabled;});
await page.evaluate(async()=>{
  const { _roots }=await import('/node_modules/.vite/deps/@react-three_fiber.js');
  const { gl }=[..._roots.values()][0].store.getState();
  const render=gl.render.bind(gl);window.frameSamples=0;
  gl.render=(...args)=>{window.frameSamples++;return render(...args);};
});
async function sample(state, action, duration=3000){
  const start=performance.now();const cpuStart=await cpu();const taskStart=await tasks();
  const frameStart=await page.evaluate(()=>window.frameSamples);
  if (action) await action();
  await page.waitForTimeout(duration);
  const seconds=(performance.now()-start)/1000;
  return {state,seconds,browserCpuPercent:(await cpu()-cpuStart)/seconds*100,mainThreadPercent:(await tasks()-taskStart)/seconds*100,frames:await page.evaluate(start=>window.frameSamples-start,frameStart)};
}
// Let shader compilation and GPU queues settle before measuring sustained CPU.
await page.waitForTimeout(8000);
const intro=await sample('INTRO idle, motion enabled');
const boarding=await sample('Boarding, motion enabled (4s window)',()=>page.locator('.start-button').click(),4000);
await page.waitForFunction(()=>document.querySelector('.spacefolio').dataset.phase==='EXPLORE');
await page.waitForTimeout(8000);
const explore=await sample('EXPLORE idle, motion enabled');
const result={label,renderer:'Chromium/SwiftShader',viewport:'1440x900',cpuUnits:'100 percent equals one CPU core',warmupSeconds:8,samples:[intro,boarding,explore]};
await writeFile(`artifacts/performance-${label}.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await browser.close();
