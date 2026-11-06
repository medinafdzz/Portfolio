import {test as base} from '@playwright/test';
export {expect} from '@playwright/test';

// Functional 3D coverage explicitly opts into WebGL on the software test GPU.
export const test=base.extend({page:async({page},runPage)=>{
  await page.addInitScript(()=>localStorage.setItem('spacefolio-view','3d'));
  await runPage(page);
}});
