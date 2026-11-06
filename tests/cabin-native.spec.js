import {test,expect} from './fixtures';
test.use({launchOptions:{args:['--use-angle=d3d11','--enable-gpu']}});

test('enclosed ship, one-call unlit parts and a physical laptop hinge',async({page})=>{
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.screenshot({path:'artifacts/enclosed-desktop-intro.png'});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await page.waitForTimeout(1000);
  const inspect=()=>page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {Vector2,Raycaster,Mesh}=await import('/node_modules/.vite/deps/three.js');
    const {scene,camera,gl}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    scene.updateMatrixWorld(true);
    const hull=scene.getObjectByName('spaceship-hull').getObjectByProperty('isMesh',true);
    const cast=new Raycaster();hull.raycast=Mesh.prototype.raycast;
    const edges=[[-.99,-.99],[.99,-.99],[-.99,.99],[.99,.99],[0,.99],[0,-.99]].map(([x,y])=>{cast.setFromCamera(new Vector2(x,y),camera);return cast.intersectObject(hull).length>0;});
    cast.setFromCamera(new Vector2(0,0),camera);const windowClear=cast.intersectObject(hull).length===0;
    hull.raycast=()=>{};
    const materials=new Set();scene.traverse(o=>{if(o.isMesh)materials.add(o.material.type);});
    return{edges,windowClear,materials:[...materials],shadows:gl.shadowMap.enabled,lights:scene.children.filter(o=>o.isLight).length,lid:scene.getObjectByName('laptop-lid').rotation.x,calls:gl.info.render.calls};
  });
  const closed=await inspect();
  expect(closed.edges).toEqual([true,true,true,true,true,true]);expect(closed.windowClear).toBe(true);
  expect(closed.materials).toEqual(['MeshBasicMaterial']);expect(closed.shadows).toBe(false);expect(closed.lights).toBe(0);
  expect(closed.calls).toBeLessThan(45);expect(closed.lid).toBeCloseTo(Math.PI/2,3);
  await page.screenshot({path:'artifacts/enclosed-desktop-explore.png'});
  const point=await page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');const {Vector3}=await import('/node_modules/.vite/deps/three.js');
    const {scene,camera,gl}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    const p=scene.getObjectByName('object-skills').localToWorld(new Vector3(0,.3,0)).project(camera),rect=gl.domElement.getBoundingClientRect();
    return{x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(1-p.y)*rect.height/2};
  });
  await page.mouse.move(point.x,point.y);
  await expect.poll(async()=>(await inspect()).lid).toBeCloseTo(-.18,3);
  await page.screenshot({path:'artifacts/enclosed-laptop-open.png'});
  await page.mouse.click(point.x,point.y);
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');await page.mouse.move(700,730);
  await expect.poll(async()=>(await inspect()).lid).toBeCloseTo(Math.PI/2,3);
  await page.mouse.move(750,650);await page.mouse.down();await page.mouse.move(980,580,{steps:18});await page.mouse.up();
  await page.screenshot({path:'artifacts/enclosed-diagonal.png'});
  for(const [name,width,height] of [['tablet',768,1024],['mobile',390,844]]) {
    await page.setViewportSize({width,height});await page.waitForTimeout(1000);
    expect((await inspect()).edges).toEqual([true,true,true,true,true,true]);
    await page.screenshot({path:`artifacts/enclosed-${name}.png`});
  }
});

test('slow rendering lowers resolution during interaction without starting an idle loop',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {controls}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    controls.dispatchEvent({type:'start'});
  });
  const invalidate=async()=>page.evaluate(async()=>{const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState().invalidate();});
  for(let i=0;i<8;i++) {await invalidate();await page.waitForTimeout(80);}
  const ratio=()=>page.evaluate(async()=>{const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');return [..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState().viewport.dpr;});
  expect(await ratio()).toBe(1);
  await page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {scene}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    window.originalBefore=scene.onBeforeRender;
    scene.onBeforeRender=function(...args){window.originalBefore.apply(this,args);const end=performance.now()+60;while(performance.now()<end){/* Simulate drawing work. */}};
  });
  for(let i=0;i<12;i++) {
    await invalidate();
    await page.waitForTimeout(80);
  }
  const reduced=await page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {scene,controls,viewport}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    controls.dispatchEvent({type:'end'});scene.onBeforeRender=window.originalBefore;return viewport.dpr;
  });
  expect(reduced).toBeLessThan(1);expect(reduced).toBeGreaterThanOrEqual(.5);
  await page.getByRole('button',{name:'Repetir bienvenida'}).click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','HOST_GREETING');
  await page.getByRole('button',{name:'EN — English'}).click();
  expect(await ratio()).toBe(reduced);
});
