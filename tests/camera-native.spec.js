import { test, expect } from './fixtures';
import { clickSceneObject } from './scene-helpers';

test.use({launchOptions:{args:['--use-angle=d3d11','--enable-gpu']}});

test('native-speed camera completes focus and restores the user pose across panel phases', async({page})=>{
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  const state=()=>page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {camera,controls}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    return {position:camera.position.toArray(),target:controls.target.toArray(),enabled:controls.enabled};
  });
  await expect.poll(async()=>(await state()).enabled).toBe(true);
  await page.mouse.move(770,650); await page.mouse.down();
  await page.mouse.move(850,650,{steps:8}); await page.mouse.up();
  const manual=await state();
  await clickSceneObject(page,'experience');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','SECTION_OPEN');
  await page.waitForTimeout(850);
  const focused=await state();
  expect(focused.position[0]).toBeCloseTo(-.45,4);
  expect(focused.target[0]).toBeCloseTo(-.75,4);
  await page.keyboard.press('Escape');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await expect.poll(async()=>(await state()).enabled).toBe(true);
  const restored=await state();
  for(let i=0;i<3;i++) expect(restored.position[i]).toBeCloseTo(manual.position[i],4);
  for(let i=0;i<3;i++) expect(restored.target[i]).toBeCloseTo(manual.target[i],4);
  await clickSceneObject(page,'contact');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','SECTION_OPEN');
  await page.setViewportSize({width:768,height:1024});
  await page.waitForTimeout(850);
  expect((await state()).target[0]).toBeCloseTo(5.3*.45,4);
  await page.keyboard.press('Escape');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await expect.poll(async()=>(await state()).enabled).toBe(true);
  const portrait=await state();
  expect(portrait.position[0]).toBeCloseTo(0,4);
  expect(portrait.position[2]).toBeCloseTo(12,4);
});
