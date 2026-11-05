import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const label = process.argv[2] || 'after';
assert.match(label, /^[a-z0-9-]+$/i);
const baseUrl = process.argv[3] || 'http://127.0.0.1:5173/';
const mode = process.argv[4] || 'software';
assert.ok(['software','default','hardware'].includes(mode));
const args = mode === 'software' ? ['--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist'] : mode === 'hardware' ? ['--use-angle=d3d11','--enable-gpu'] : [];
const browser = await chromium.launch({ headless: true, args });
try {
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  const browserCdp = await browser.newBrowserCDPSession();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  const cpu = async () => (await browserCdp.send('SystemInfo.getProcessInfo')).processInfo.reduce((sum,p)=>sum+p.cpuTime,0);
  const tasks = async () => (await cdp.send('Performance.getMetrics')).metrics.find(m=>m.name==='TaskDuration').value;
  await page.goto(baseUrl);
  await page.waitForFunction(()=>{const b=document.querySelector('.start-button');return b&&!b.disabled;},null,{timeout:90000});
  const renderer = await page.evaluate(async()=>{
    const { _roots }=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const { gl }=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    const context=gl.getContext(), debug=context.getExtension('WEBGL_debug_renderer_info');
    window.frameSamples=0; window.passSamples=[];
    const render=gl.render.bind(gl), shadows=gl.shadowMap.render.bind(gl.shadowMap);
    let shadowCalls=0, shadowTriangles=0;
    gl.shadowMap.render=(...args)=>{
      const calls=gl.info.render.calls, triangles=gl.info.render.triangles;
      const result=shadows(...args);
      shadowCalls=gl.info.render.calls-calls; shadowTriangles=gl.info.render.triangles-triangles;
      return result;
    };
    gl.render=(...args)=>{
      shadowCalls=0; shadowTriangles=0;
      const result=render(...args); window.frameSamples++;
      window.passSamples.push({mainCalls:gl.info.render.calls-shadowCalls,shadowCalls,mainTriangles:gl.info.render.triangles-shadowTriangles,shadowTriangles,geometries:gl.info.memory.geometries,textures:gl.info.memory.textures});
      return result;
    };
    return debug?context.getParameter(debug.UNMASKED_RENDERER_WEBGL):context.getParameter(context.RENDERER);
  });
  async function sample(state, action, duration=3000){
    const start=performance.now(), cpuStart=await cpu(), taskStart=await tasks();
    const frameStart=await page.evaluate(()=>window.frameSamples);
    if(action) await action();
    await page.waitForTimeout(duration);
    const seconds=(performance.now()-start)/1000;
    return {state,seconds,browserCpuPercent:(await cpu()-cpuStart)/seconds*100,mainThreadPercent:(await tasks()-taskStart)/seconds*100,frames:await page.evaluate(start=>window.frameSamples-start,frameStart)};
  }
  await page.waitForTimeout(8000);
  await page.screenshot({path:`artifacts/${label}-intro.png`});
  const intro=await sample('INTRO idle, motion enabled');
  const boarding=await sample('Boarding, motion enabled (4s window)',()=>page.locator('.start-button').click(),4000);
  await page.waitForFunction(()=>document.querySelector('.spacefolio').dataset.phase==='EXPLORE');
  await page.waitForTimeout(8000);
  await page.screenshot({path:`artifacts/${label}-explore.png`});
  const explore=await sample('EXPLORE idle, motion enabled');
  const passes=await page.evaluate(()=>window.passSamples);
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').at(-1),bytes:r.encodedBodySize})).filter(r=>/glb|jpg|woff2/.test(r.name)));
  const result={label,mode,renderer,viewport:'1440x900',cpuUnits:'100 percent equals one CPU core',warmupSeconds:8,samples:[intro,boarding,explore],passes,resources};
  assert.equal(intro.frames,0,'Intro keeps drawing while idle');
  assert.equal(explore.frames,0,'Exploration keeps drawing while idle');
  assert.ok(boarding.frames>0 && passes.length>=boarding.frames,'Missing render samples');
  await writeFile(`artifacts/performance-${label}.json`,JSON.stringify(result,null,2));
  console.log(JSON.stringify({...result,passes:passes.at(-1)},null,2));
} finally { await browser.close(); }
