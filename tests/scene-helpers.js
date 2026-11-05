export async function clickSceneObject(page, id) {
  const offsets = { experience:[0,0,.16], projects:[0,.8,.26], about:[0,.85,.15], education:[.17,0,.09], skills:[0,.6,-.05], contact:[0,0,.3] };
  const point = await page.evaluate(async ({ id, offset }) => {
    const { _roots } = await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const { Vector3 } = await import('/node_modules/.vite/deps/three.js');
    const { scene, camera, gl } = [..._roots.values()].find(root => root.store.getState().gl.domElement.isConnected).store.getState();
    scene.updateMatrixWorld(true); camera.updateMatrixWorld();
    const position = scene.getObjectByName(`object-${id}`).localToWorld(new Vector3(...offset)).project(camera);
    const rect = gl.domElement.getBoundingClientRect();
    return { x:rect.left+(position.x+1)*rect.width/2, y:rect.top+(1-position.y)*rect.height/2 };
  }, { id, offset:offsets[id] });
  await page.mouse.click(point.x, point.y);
}
