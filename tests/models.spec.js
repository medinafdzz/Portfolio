import { test, expect } from '@playwright/test';

test('baked GLB loads embedded textures under real CSP and survives lightweight remount', async ({page}) => {
  const errors=[];
  const requests=[];
  page.on('request',r=>requests.push(r.url()));
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:90000});
  async function bakedStats(){
    return page.evaluate(async()=>{
      const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
      const root=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected);
      if(!root)return null;
      const {scene}=root.store.getState();
      const cabin=scene.getObjectByName('cabin-baked');
      const meshes=[];
      cabin?.traverse(o=>{if(o.isMesh)meshes.push({type:o.material.type,width:o.material.map?.image?.width||0,vertices:o.geometry.attributes.position.count});});
      return meshes;
    });
  }
  await expect.poll(bakedStats).toEqual([{type:'MeshBasicMaterial',width:2048,vertices:expect.any(Number)}]);
  const original=await bakedStats();
  const hitboxes=await page.evaluate(async()=>{
    const {_roots}=await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const {scene}=[..._roots.values()].find(r=>r.store.getState().gl.domElement.isConnected).store.getState();
    const names=[];
    scene.traverse(o=>{if(o.name.endsWith('-hitbox') && o.geometry?.type==='BoxGeometry' && !o.material.visible)names.push(o.name);});
    return names;
  });
  expect(hitboxes).toHaveLength(7);
  await page.screenshot({path:'artifacts/baked-integrated-intro.png'});
  await page.getByRole('button',{name:'Vista ligera',exact:true}).click();
  await page.getByRole('button',{name:'Vista 3D',exact:true}).click();
  await expect.poll(bakedStats).toEqual(original);
  expect(errors).toEqual([]);
  expect(requests.some(url=>url.endsWith('/draco/draco_decoder.wasm'))).toBe(true);
  expect(requests.filter(url=>!url.startsWith('blob:') && new URL(url).origin!=='http://127.0.0.1:5173')).toEqual([]);
});
