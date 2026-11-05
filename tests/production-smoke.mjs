import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
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
  await page.waitForFunction(() => {
    const button = document.querySelector('.start-button');
    return button && !button.disabled;
  }, null, { timeout: 60000 });
  const fullResolution = () => {
    const canvas = document.querySelector('canvas');
    return canvas && canvas.width >= canvas.clientWidth * .79;
  };
  await page.waitForTimeout(1000);
  await page.waitForFunction(fullResolution);
  await page.screenshot({ path: 'artifacts/production-intro.png' });
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('.spacefolio').dataset.phase === 'EXPLORE');
  await page.waitForTimeout(1000);
  await page.waitForFunction(fullResolution);
  await page.screenshot({ path: 'artifacts/production-explore.png' });
  assert.equal(await page.locator('[data-section]').count(), 6);
  await page.locator('[data-section="projects"]').click();
  await page.waitForFunction(() => document.querySelector('.spacefolio').dataset.phase === 'SECTION_OPEN');
  assert.equal(await page.locator('#section-heading').textContent(), 'Proyectos');
  await page.screenshot({ path: 'artifacts/production-section.png' });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('dialog'));
  assert.deepEqual(errors, []);
  const result = { status: 'PASSED', url: response.url(), csp: response.headers()['content-security-policy'], errors, warnings };
  await writeFile('artifacts/production-smoke.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
