import { test, expect } from '@playwright/test';
import { clickSceneObject } from './scene-helpers';

async function state(page) {
  return page.evaluate(async () => {
    const { _roots } = await import('/node_modules/.vite/deps/@react-three_fiber.js');
    return [..._roots.values()].some(value => value.store.getState().gl.domElement.isConnected);
  });
}

test('ear-anchored speech, framed medal and desk clearance', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({ timeout: 60000 });
  await expect.poll(() => state(page)).toBe(true);
  await expect(page.locator('.intro-card')).toHaveAttribute('data-anchored', 'true');
  await page.waitForTimeout(1800);
  const layout = await page.evaluate(async () => {
    const { _roots } = await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const { scene, camera, size } = [..._roots.values()].find(value => value.store.getState().gl.domElement.isConnected).store.getState();
    const { Box3, Vector3 } = await import('/node_modules/.vite/deps/three.js');
    scene.updateMatrixWorld(true);
    const ear = scene.getObjectByName('robot-ear').getWorldPosition(new Vector3()).project(camera);
    const rect = document.querySelector('.intro-card').getBoundingClientRect();
    const canvas = document.querySelector('canvas').getBoundingClientRect();
    return {
      gap: rect.left - canvas.left - (ear.x + 1)*size.width/2,
      tailGap: Math.abs(rect.top - canvas.top + parseFloat(document.querySelector('.intro-card').style.getPropertyValue('--tail-y')) + 8 - (1-ear.y)*size.height/2),
      bookBottom: new Box3().setFromObject(scene.getObjectByName('captains-log')).min.y,
      lecternBottom: new Box3().setFromObject(scene.getObjectByName('logbook-lectern')).min.y,
      consoleBottom: new Box3().setFromObject(scene.getObjectByName('command-console')).min.y,
      medal: scene.getObjectByName('object-education').position.toArray(),
      medalAngle: scene.getObjectByName('framed-medal').rotation.y,
      consoleBody: scene.getObjectByName('console-integrated-body').getObjectByProperty('isMesh',true).geometry.type,
      radarWidth: scene.getObjectByName('orbital-radar').material.map.image.width,
    };
  });
  expect(layout.gap).toBeGreaterThanOrEqual(0);
  expect(layout.gap).toBeLessThanOrEqual(20);
  expect(layout.tailGap).toBeLessThan(3);
  expect(layout.bookBottom).toBeGreaterThan(2.3);
  expect(layout.lecternBottom).toBeGreaterThan(2.08);
  expect(layout.consoleBottom).toBeGreaterThan(1.96);
  expect(layout.medal[0]).toBeLessThan(-5.8);
  expect(layout.medalAngle).toBeGreaterThan(.9);
  expect(layout.consoleBody).toBe('BufferGeometry');
  expect(layout.radarWidth).toBe(1536);
  await page.screenshot({path:'artifacts/corrected-intro.png'});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await page.waitForTimeout(1000);
  await page.screenshot({path:'artifacts/corrected-explore.png'});
});

test('motion enabled stops rendering when idle, including an open panel', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.evaluate(async()=>{
    const { _roots }=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const { gl }=[..._roots.values()].find(value=>value.store.getState().gl.domElement.isConnected).store.getState();
    const render=gl.render.bind(gl);window.testRenderCount=0;
    gl.render=(...args)=>{window.testRenderCount++;return render(...args);};
  });
  async function expectSleeping() {
    await page.waitForTimeout(2000);
    const before=await page.evaluate(()=>window.testRenderCount);
    await page.waitForTimeout(1200);
    expect(await page.evaluate(()=>window.testRenderCount)).toBe(before);
  }
  await expectSleeping();
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await expectSleeping();
  await clickSceneObject(page,'skills');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','SECTION_OPEN');
  await expectSleeping();
  await page.keyboard.press('Escape');
  await expect(page.locator('.section-panel')).toHaveCount(0);
  await expectSleeping();
});
