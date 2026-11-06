import { test, expect } from './fixtures';
import { clickSceneObject } from './scene-helpers';

async function robotPoint(page) {
  return page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {Vector3}=await import('/node_modules/.vite/deps/three.js');
    const {scene,camera,gl}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    scene.updateMatrixWorld(true);
    const v=scene.getObjectByName('host-robot').localToWorld(new Vector3(0,2,0)).project(camera);
    const rect=gl.domElement.getBoundingClientRect();
    return {x:rect.left+(v.x+1)*rect.width/2,y:rect.top+(1-v.y)*rect.height/2};
  });
}

async function cameraState(page) {
  return page.evaluate(async () => {
    const { _roots } = await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const { camera, controls } = [..._roots.values()].find(r => r.store.getState().gl.domElement.isConnected).store.getState();
    return { position: camera.position.toArray(), target: controls?.target.toArray(), enabled: controls?.enabled };
  });
}

test('orbit, right-button pan, wheel, reset and section restore preserve demand rendering', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  const original = await cameraState(page);
  expect(original.enabled).toBe(true);
  await page.mouse.move(760,610);
  await page.mouse.down(); await page.mouse.move(920,650,{steps:10}); await page.mouse.up();
  expect((await cameraState(page)).position).not.toEqual(original.position);
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await page.mouse.down({button:'right'}); await page.mouse.move(840,610,{steps:8}); await page.mouse.up({button:'right'});
  expect((await cameraState(page)).target).not.toEqual(original.target);
  const beforeZoom=await cameraState(page);
  await page.mouse.wheel(0,-200); await page.waitForTimeout(300);
  expect((await cameraState(page)).position).not.toEqual(beforeZoom.position);
  const userPose=await cameraState(page);
  await page.screenshot({path:'artifacts/refined-camera-diagonal.png'});
  await clickSceneObject(page,'experience');
  await expect(page.getByRole('dialog')).toBeVisible();
  expect((await cameraState(page)).enabled).toBe(false);
  await page.keyboard.press('Escape');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  const restored=await cameraState(page);
  for(let i=0;i<3;i++) expect(restored.position[i]).toBeCloseTo(userPose.position[i],3);
  await page.getByRole('button',{name:'Restablecer vista'}).click();
  const reset=await cameraState(page);
  for(let i=0;i<3;i++) expect(reset.position[i]).toBeCloseTo(original.position[i],3);
  await page.screenshot({path:'artifacts/refined-camera-reset.png'});
  for(const id of ['experience','projects','about','education','skills','contact']) {
    await clickSceneObject(page,id); await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  }
});

test('repeat greeting has a real reversible pose, Enter, translations and safe remount', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  const pose=()=>page.evaluate(async()=>{
    const { _roots }=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const root=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected);
    return root?.store.getState().scene.getObjectByName('host-robot')?.position.toArray() ?? null;
  });
  expect(await pose()).toEqual([0,-.22,.25]);
  await page.getByRole('button',{name:'Repetir bienvenida'}).click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','HOST_GREETING');
  await expect(page.locator('.intro-card')).toContainText('¡Bienvenido a la nave espacial de medinafdzz!');
  expect(await pose()).toEqual([-1.4,0,2.15]);
  await page.getByRole('button',{name:'EN — English'}).click();
  await expect(page.locator('.intro-card')).toContainText("Welcome aboard medinafdzz's spaceship!");
  await page.locator('main').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  expect(await pose()).toEqual([0,-.22,.25]);
  await page.getByRole('button',{name:'Replay welcome'}).click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','HOST_GREETING');
  await page.getByRole('button',{name:'Lightweight view',exact:true}).click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await page.getByRole('button',{name:'3D view',exact:true}).click();
  await expect.poll(pose).toEqual([0,-.22,.25]);
});

test('three physical robot cycles, drag guard, animation cancellation and zero idle frames', async ({page})=>{
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  let point=await robotPoint(page);
  await page.mouse.move(point.x,point.y); await page.mouse.down();
  await page.mouse.move(point.x+60,point.y+20,{steps:6}); await page.mouse.up();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await page.getByRole('button',{name:'Restablecer vista'}).click();
  await page.waitForTimeout(600);
  for(let i=0;i<3;i++) {
    point=await robotPoint(page); await page.mouse.click(point.x,point.y);
    await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','HOST_RISING');
    await page.mouse.click(point.x,point.y);
    await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','HOST_GREETING');
    await expect(page.locator('.intro-card')).toHaveAttribute('data-anchored','true');
    const legs=await page.evaluate(async()=>{
      const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
      const {scene}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
      return ['robot-thigh-L','robot-thigh-R','robot-knee-L','robot-knee-R'].map(name=>scene.getObjectByName(name).rotation.x);
    });
    for(const angle of legs) expect(angle).toBeCloseTo(0,10);
    if(i===0) await page.screenshot({path:'artifacts/refined-host-greeting.png'});
    if(i===1) await page.locator('.start-button').click();
    else { point=await robotPoint(page); await page.mouse.click(point.x,point.y); }
    await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  }
  await page.mouse.move(710,730);
  await page.waitForTimeout(2500);
  await page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {gl}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    const render=gl.render.bind(gl); window.idleFrames=0;
    gl.render=(...args)=>{window.idleFrames++;return render(...args);};
  });
  await page.waitForTimeout(1500);
  expect(await page.evaluate(()=>window.idleFrames)).toBe(0);
  await page.getByRole('button',{name:'Repetir bienvenida'}).click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','HOST_RISING');
  await page.getByRole('button',{name:'Vista ligera',exact:true}).click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await page.getByRole('button',{name:'Vista 3D',exact:true}).click();
  await expect(page.locator('canvas')).toBeVisible();
  await page.getByRole('button',{name:'Repetir bienvenida'}).click();
  await page.getByRole('button',{name:'Reducir movimiento',exact:true}).click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','HOST_GREETING');
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
});

test('360px touch orbit and pinch-pan, reset, no overflow and local robot favicon', async ({page,request})=>{
  await page.setViewportSize({width:360,height:800});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});
  const before=await cameraState(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:560,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:230,y:590,id:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  expect((await cameraState(page)).position).not.toEqual(before.position);
  const orbit=await cameraState(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:130,y:560,id:1},{x:220,y:560,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:105,y:585,id:1},{x:255,y:585,id:2}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  expect((await cameraState(page)).target).not.toEqual(orbit.target);
  await page.getByRole('button',{name:'Restablecer vista'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(360);
  await page.screenshot({path:'artifacts/refined-mobile-360.png'});
  const icon=await request.get('/icon.svg');
  expect(icon.status()).toBe(200); expect(await icon.text()).toContain('rotate(-10');
  await page.setContent('<div style="display:flex;gap:32px;padding:32px;background:#fff"><img src="http://127.0.0.1:5173/icon.svg" width="16" height="16"><img src="http://127.0.0.1:5173/icon.svg" width="32" height="32"></div><div style="display:flex;gap:32px;padding:32px;background:#101720"><img src="http://127.0.0.1:5173/icon.svg" width="16" height="16"><img src="http://127.0.0.1:5173/icon.svg" width="32" height="32"></div>');
  await page.locator('img').last().evaluate(img=>img.decode());
  await page.screenshot({path:'artifacts/refined-favicon-sizes.png'});
});
