import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { PerspectiveCamera, Vector3 } from 'three';

const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const vercel=JSON.parse(await readFile('vercel.json','utf8'));
const deployedCsp=vercel.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
// Exercise the stricter deployed policy, including the local WASM decoder.
await page.route('http://127.0.0.1:4173/',async route=>{
  const response=await route.fetch();
  await route.fulfill({response,headers:{...response.headers(),'content-security-policy':deployedCsp}});
});
const errors = [];
const warnings = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => {
  if (message.type() === 'error') errors.push(message.text());
  if (message.type() === 'warning') warnings.push(message.text());
});
try {
  const response = await page.goto('http://127.0.0.1:4173/');
  assert.equal(response.status(), 200);
  if(await page.getByRole('button',{name:'Vista 3D',exact:true}).isVisible()) await page.getByRole('button',{name:'Vista 3D',exact:true}).click();
  await page.waitForFunction(() => {
    const button = document.querySelector('.start-button');
    return button && !button.disabled;
  }, null, { timeout: 60000 });
  const fullResolution = () => {
    const canvas = document.querySelector('canvas');
    return canvas && canvas.width >= canvas.clientWidth * .24;
  };
  await page.waitForTimeout(1000);
  await page.waitForFunction(fullResolution);
  await page.screenshot({ path: 'artifacts/production-intro.png' });
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('.spacefolio').dataset.phase === 'EXPLORE');
  await page.waitForTimeout(1000);
  await page.waitForFunction(fullResolution);
  await page.screenshot({ path: 'artifacts/production-explore.png' });
  assert.equal(await page.locator('.navigation-deck').count(), 0);
  const rect = await page.locator('canvas').boundingBox();
  const camera = new PerspectiveCamera(40,rect.width/rect.height,.1,100);
  camera.position.set(0,4.25,10.6); camera.lookAt(0,2.45,-1.3); camera.updateMatrixWorld();
  const rocket = new Vector3(-3.4,2.88,-1.24).project(camera);
  await page.mouse.click(rect.x+(rocket.x+1)*rect.width/2,rect.y+(1-rocket.y)*rect.height/2);
  await page.waitForFunction(() => document.querySelector('.spacefolio').dataset.phase === 'SECTION_OPEN');
  assert.equal(await page.locator('#section-heading').textContent(), 'Proyectos');
  await page.screenshot({ path: 'artifacts/production-section.png' });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.querySelector('.spacefolio').dataset.phase === 'EXPLORE');
  await page.waitForTimeout(400);
  await page.mouse.move(760,650); await page.mouse.down();
  await page.mouse.move(900,690,{steps:12}); await page.mouse.up();
  assert.equal(await page.locator('.spacefolio').getAttribute('data-phase'),'EXPLORE');
  await page.screenshot({path:'artifacts/production-orbit.png'});
  await page.getByRole('button',{name:'Restablecer vista'}).click();
  await page.waitForTimeout(400);
  await page.getByRole('button',{name:'Repetir bienvenida'}).click();
  await page.waitForFunction(()=>document.querySelector('.spacefolio').dataset.phase==='HOST_GREETING');
  assert.match(await page.locator('.intro-card').textContent(),/¡Bienvenido a la nave espacial de medinafdzz!/);
  await page.screenshot({path:'artifacts/production-greeting.png'});
  await page.getByRole('button',{name:'EN — English'}).click();
  assert.match(await page.locator('.intro-card').textContent(),/Welcome aboard medinafdzz's spaceship!/);
  await page.locator('.start-button').click();
  await page.waitForFunction(()=>document.querySelector('.spacefolio').dataset.phase==='EXPLORE');
  const icon=await page.request.get('http://127.0.0.1:4173/icon.svg');
  assert.equal(icon.status(),200); assert.match(await icon.text(),/rotate\(-10/);
  assert.deepEqual(errors, []);
  const result = { status: 'PASSED', url: response.url(), csp: response.headers()['content-security-policy'], errors, warnings };
  await writeFile('artifacts/production-smoke.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
