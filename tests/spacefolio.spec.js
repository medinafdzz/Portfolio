import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PerspectiveCamera, Vector3 } from 'three';

const ids = ['experience', 'projects', 'about', 'education', 'skills', 'contact'];
const titles = ['Experiencia', 'Proyectos', 'Sobre mí', 'Formación', 'Tecnologías', 'Contacto'];
const english = ['Experience', 'Projects', 'About me', 'Education', 'Tech stack', 'Contact'];
const contents = ['Indra Sistemas', 'CodeGuardian', 'Actualmente curso', 'Universidad Alfonso X el Sabio', 'AI/LLM learning roadmap', 'amedinaf.it@gmail.com'];
async function sceneSnapshot(page) {
  return page.evaluate(async () => {
    const { _roots } = await import('/node_modules/.vite/deps/@react-three_fiber.js');
    const root = [..._roots.values()].find(value => value.store.getState().gl.domElement.isConnected);
    if (!root) return null;
    const { scene, gl } = root.store.getState();
    const robot = scene.getObjectByName('host-robot');
    return { position: robot.position.toArray(), rotation: robot.rotation.y, geometries: gl.info.memory.geometries, calls: gl.info.render.calls, triangles: gl.info.render.triangles };
  });
}
const openSection = async (page, index) => {
  await page.locator(`[data-section="${ids[index]}"]`).click();
  await expect(page.locator('#section-heading')).toHaveText(titles[index]);
  await expect(page.locator('.section-panel')).toContainText(contents[index]);
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','SECTION_OPEN');
};
const closeSection = async page => {
  await page.keyboard.press('Escape');
  await expect(page.locator('.section-panel')).toHaveCount(0);
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
};

test('real WebGL introduction, guarded Enter, six sections, projects, languages and focus', async ({ page }) => {
  test.setTimeout(180000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if(message.type()==='error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.screenshot({ path:'artifacts/desktop-intro.png' });
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE',{timeout:20000});
  await page.screenshot({ path:'artifacts/desktop-explore.png' });
  for(let i=0;i<6;i++) {
    await openSection(page,i);
    if(i===0) await page.screenshot({path:'artifacts/desktop-section.png'});
    if(i===1) {
      await page.getByRole('button',{name:'Commons DbUtils',exact:true}).click();
      await expect(page.locator('#active-project')).toContainText('Estudio académico');
      await page.getByRole('button',{name:'RemoteWordle',exact:true}).click();
      await expect(page.locator('#active-project')).toContainText('cliente-servidor');
      await expect(page.locator('.project-secondary__list a')).toHaveCount(3);
    }
    const accessibility = await new AxeBuilder({page}).include('.section-panel').analyze();
    expect(accessibility.violations).toEqual([]);
    await closeSection(page);
    await expect(page.locator(`[data-section="${ids[i]}"]`)).toBeFocused();
  }
  await page.getByRole('button',{name:'EN — English',exact:true}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  for(let i=0;i<6;i++) {
    await page.locator(`[data-section="${ids[i]}"]`).click();
    await expect(page.locator('#section-heading')).toHaveText(english[i]);
    await closeSection(page);
  }
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','en');
  expect(errors).toEqual([]);
});

test('all six 3D objects respond to actual raycast clicks', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  const canvas = await page.locator('canvas').boundingBox();
  const camera = new PerspectiveCamera(40,canvas.width/canvas.height,.1,100);
  camera.position.set(0,4.25,10.6); camera.lookAt(0,2.45,-1.3); camera.updateMatrixWorld();
  const points = [[-5,3.42,-1.49],[-3.4,2.88,-1.24],[-1.95,2.22,-.95],[0,4.72,-2.1],[3.03,2.82,-1.15],[5.3,3.35,-1.3]];
  for(let i=0;i<6;i++){
    const point=new Vector3(...points[i]).project(camera);
    await page.mouse.click(canvas.x+(point.x+1)/2*canvas.width,canvas.y+(1-point.y)/2*canvas.height);
    await expect(page.locator('#section-heading')).toHaveText(titles[i]);
    await closeSection(page);
  }
});

for(const [name,width,height] of [['desktop-large',1920,1080],['tablet-portrait',768,1024],['tablet-landscape',1024,768],['mobile',390,844],['mobile-large',430,932]]) {
  test(`${name}: responsive canvas, touch navigation, content and no overflow`,async ({page})=>{
    await page.setViewportSize({width,height});
    await page.goto('/');
    await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
    await page.screenshot({path:`artifacts/${name}-intro.png`});
    await page.locator('.start-button').click();
    await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE',{timeout:20000});
    await page.screenshot({path:`artifacts/${name}-explore.png`});
    const measurements=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,height:innerHeight,body:document.body.scrollHeight}));
    expect(measurements.scroll).toBeLessThanOrEqual(width);
    expect(measurements.body).toBeLessThanOrEqual(height);
    for(let i=0;i<6;i++){await openSection(page,i);await closeSection(page);}
    await openSection(page,1);
    await page.screenshot({path:`artifacts/${name}-section.png`});
    expect(await page.locator('.section-panel').evaluate(node=>node.scrollWidth<=node.clientWidth)).toBe(true);
  });
}

test('WebGL unavailable: all content and languages work without a Canvas',async ({page})=>{
  await page.addInitScript(()=>{
    const getContext=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'||type==='webgl'?null:getContext.call(this,type,...args);};
  });
  await page.goto('/');
  await expect(page.locator('.flat-view')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.screenshot({path:'artifacts/webgl-fallback.png'});
  for(let i=0;i<6;i++){await openSection(page,i);await closeSection(page);}
  await page.getByRole('button',{name:'EN — English',exact:true}).click();
  await expect(page.locator('.flat-view')).toContainText('The exploration continues here.');
  const accessibility=await new AxeBuilder({page}).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('reduced motion, keyboard focus containment and lightweight toggle',async ({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  await openSection(page,0);
  const close=page.locator('.close-panel');
  await close.focus(); await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.panel-bottom button')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(close).toBeFocused();
  await closeSection(page);
  const before = await sceneSnapshot(page);
  expect(before.position).toEqual([0,.22,.25]);
  expect(before.rotation).toBeCloseTo(Math.PI);
  await page.getByRole('button',{name:'Vista ligera',exact:true}).click();
  await expect(page.locator('.flat-view')).toBeVisible();
  await page.getByRole('button',{name:'Vista 3D',exact:true}).click();
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(async () => (await sceneSnapshot(page))?.position).toEqual([0,.22,.25]);
  const accessibility=await new AxeBuilder({page}).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('motion preference does not replay boarding and repeated navigation releases geometry',async ({page})=>{
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').click();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE',{timeout:20000});
  await page.getByRole('button',{name:'Reducir movimiento',exact:true}).click();
  await page.getByRole('button',{name:'Activar movimiento',exact:true}).click();
  const before=await sceneSnapshot(page);
  expect(before.position).toEqual([0,.22,.25]);
  expect(before.rotation).toBeCloseTo(Math.PI);
  for(let i=0;i<12;i++){await openSection(page,i%6);await closeSection(page);}
  const after=await sceneSnapshot(page);
  expect(after.geometries).toBeLessThanOrEqual(before.geometries+20);
  console.log('WebGL budget',JSON.stringify(after));
});

test('WebGL context loss keeps all six sections usable',async ({page})=>{
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await expect(page.locator('.flat-view')).toBeVisible();
  await openSection(page,1);
  await closeSection(page);
});

test('touch input, CV, licensed texture assets and profile links',async ({browser,request})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:5173');
  await expect(page.locator('.start-button')).toBeEnabled({timeout:60000});
  await page.locator('.start-button').tap();
  await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','EXPLORE');
  for(let i=0;i<6;i++){
    await page.locator(`[data-section="${ids[i]}"]`).tap();
    await expect(page.locator('#section-heading')).toHaveText(titles[i]);
    await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','SECTION_OPEN');
    await page.locator('.close-panel').tap();
    await expect(page.locator('.section-panel')).toHaveCount(0);
  }
  const cv=await request.get('/CV.pdf');
  expect(cv.status()).toBe(200);
  expect((await cv.body()).subarray(0,4).toString()).toBe('%PDF');
  for(const asset of ['earth-day.jpg','earth-night.jpg','moon.jpg'])expect((await request.get(`/textures/${asset}`)).status()).toBe(200);
  await expect(page.locator('a[href="https://github.com/medinafdzz"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://linkedin.com/in/medinafdzz"]')).toHaveCount(1);
  await context.close();
});
