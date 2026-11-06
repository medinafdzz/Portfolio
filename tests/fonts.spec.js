import { test, expect } from './fixtures';

test('Satoshi is the only rendered font in HTML and procedural screens', async ({ page }) => {
  test.setTimeout(120000);
  await page.addInitScript(() => {
    window.canvasTextFonts = [];
    const fillText = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
      window.canvasTextFonts.push({ font: this.font, text: String(text) });
      return fillText.call(this, text, ...args);
    };
  });
  await page.goto('/');
  await expect(page.locator('.start-button')).toBeEnabled({ timeout: 60000 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('DOM.enable'); await cdp.send('CSS.enable');

  async function inspectFonts() {
    const elements = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el =>
      el.getClientRects().length && [...el.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()),
    ).map((el, i) => {
      el.setAttribute('data-font-audit', String(i));
      return { index:i, tag:el.tagName, text:el.textContent.slice(0,70), css:getComputedStyle(el).fontFamily };
    }));
    const { root } = await cdp.send('DOM.getDocument');
    const violations = [];
    for (const el of elements) {
      expect(el.css.replaceAll('"','')).toBe('Satoshi');
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId:root.nodeId, selector:`[data-font-audit="${el.index}"]` });
      const { fonts } = await cdp.send('CSS.getPlatformFontsForNode', { nodeId });
      for (const font of fonts) if (font.glyphCount && (!font.isCustomFont || !/Satoshi/i.test(font.familyName))) violations.push({ ...el, font });
    }
    expect(violations).toEqual([]);
  }

  await inspectFonts();
  const canvasFonts = await page.evaluate(() => window.canvasTextFonts);
  expect(canvasFonts.length).toBeGreaterThan(0);
  for (const entry of canvasFonts) expect(entry.font).toMatch(/px Satoshi$/);
  await page.screenshot({ path:'artifacts/satoshi-intro.png' });
  await page.getByRole('button',{name:'Vista ligera',exact:true}).click();
  await inspectFonts();
  for (const language of ['ES — Español','EN — English']) {
    await page.getByRole('button',{name:language,exact:true}).click();
    for (const id of ['experience','projects','about','education','skills','contact']) {
      await page.locator(`[data-section="${id}"]`).click();
      await expect(page.locator('.spacefolio')).toHaveAttribute('data-phase','SECTION_OPEN');
      await inspectFonts();
      if (id==='projects' && language.startsWith('ES')) await page.screenshot({path:'artifacts/satoshi-projects.png'});
      await page.keyboard.press('Escape');
      await expect(page.locator('.section-panel')).toHaveCount(0);
    }
  }
});
