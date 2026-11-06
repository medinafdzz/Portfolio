import {test,expect} from '@playwright/test';

test('software rendering opens lightweight content without downloading the 3D engine',async({page})=>{
  const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto('/');
  await expect(page.locator('.flat-view')).toBeVisible();
  await expect(page.locator('.nav-station')).toHaveCount(6);
  expect(requests.some(url=>/Scene\.jsx|spacefolio\.glb|moon-512/.test(url))).toBe(false);
  await page.locator('[data-section="skills"]').click();
  await expect(page.getByRole('dialog')).toContainText('AI/LLM learning roadmap');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Vista 3D',exact:true}).click();
  await expect(page.locator('canvas')).toBeVisible();
  await page.getByRole('button',{name:'Vista ligera',exact:true}).click();
  await page.reload();
  await expect(page.locator('.flat-view')).toBeVisible();
});
