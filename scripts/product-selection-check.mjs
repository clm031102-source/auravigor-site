/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { preview } from 'vite';

const output = process.env.AURAVIGOR_CHECK_DIR ?? '.shots/selection';
await mkdir(output, { recursive: true });
const server = await preview({ preview: { host: '127.0.0.1', port: 4183, strictPort: true } });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('http://127.0.0.1:4183');
  await page.locator('.loader').waitFor({ state: 'hidden' });
  const clickProduct = async (button) => {
    await button.waitFor({ state: 'visible', timeout: 5000 });
    const box = await button.boundingBox();
    assert.ok(box && box.width > 0 && box.height > 0);
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    assert.equal(
      await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('button')?.id, {
        x,
        y,
      }),
      await button.getAttribute('id'),
    );
    // Idle float intentionally moves these targets; exercise a real mouse click at their centre.
    await page.mouse.click(x, y);
  };
  const hero = page.locator('.overlay--hero');
  const arginine = hero.getByRole('button', { name: '4X Arginine', exact: true });
  await clickProduct(arginine);
  await page.waitForFunction(() =>
    document.querySelector('.hero__name')?.textContent.includes('Arginine'),
  );
  assert.equal(await arginine.getAttribute('aria-pressed'), 'true');
  await page.screenshot({ path: path.join(output, 'hero-selected.png') });
  await page.evaluate(() =>
    window.scrollTo({
      top: document.querySelector('.stage').offsetHeight - 2 * window.innerHeight,
      behavior: 'instant',
    }),
  );
  await page.waitForFunction(() => document.querySelector('.stage')?.dataset.act === 'lineup');
  await page.screenshot({ path: path.join(output, 'lineup-clickable.png') });
  const gluta = page
    .locator('.overlay--lineup')
    .getByRole('button', { name: '4X Gluta', exact: true });
  await clickProduct(gluta);
  await page.waitForFunction(() => document.querySelector('.stage')?.dataset.act === 'reveal');
  await page.waitForFunction(() => Math.abs(window.scrollY - window.innerHeight * 0.4) < 1);
  assert.match(await page.locator('.overlay--reveal').innerText(), /Gluta/);
  assert.equal(await page.locator('#hero-product-gluta-4x').getAttribute('aria-pressed'), 'true');
  assert.equal(
    await page.locator('.layer--canvas').evaluate((node) => getComputedStyle(node).pointerEvents),
    'none',
  );
  await page.screenshot({ path: path.join(output, 'lineup-return.png') });
  // Returning to the hero must reactivate its controls after a lineup selection.
  await page.locator('.header__logo').click();
  await page.waitForFunction(() => document.querySelector('.stage')?.dataset.act === 'hero');
  await page.waitForFunction(() => window.scrollY < 1);
  const enzymes = hero.getByRole('button', { name: 'Enzymes', exact: true });
  await enzymes.focus();
  await page.keyboard.press('Enter');
  assert.equal(await enzymes.getAttribute('aria-pressed'), 'true');
  await page.keyboard.press('ArrowRight');
  assert.match(await page.locator('.hero__name').innerText(), /EAA/);
  // Drag by one slot starting on the product, then release; a drag must not become a click.
  await page.waitForFunction(
    () =>
      Math.abs(
        document.querySelector('#hero-product-eaa').getBoundingClientRect().x +
          document.querySelector('#hero-product-eaa').getBoundingClientRect().width / 2 -
          window.innerWidth / 2,
      ) < 5,
  );
  const centre = await hero.getByRole('button', { name: 'EAA', exact: true }).boundingBox();
  assert.ok(centre);
  await page.mouse.move(centre.x + centre.width / 2, centre.y + centre.height / 2);
  await page.mouse.down();
  await page.mouse.move(centre.x + centre.width / 2 - 1440 * 0.22, centre.y + centre.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
  assert.equal(await arginine.getAttribute('aria-pressed'), 'true');
  await page.mouse.click(720, 405, { button: 'right' });
  assert.equal(await arginine.getAttribute('aria-pressed'), 'true');
  // Check the final product row at the requested desktop widths, and keyboard activation.
  for (const width of [1280, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() =>
      window.scrollTo({
        top: document.querySelector('.stage').offsetHeight - 2 * window.innerHeight,
        behavior: 'instant',
      }),
    );
    await page.waitForFunction(() => document.querySelector('.stage')?.dataset.act === 'lineup');
    const bottle = page.locator('#lineup-product-vine-flam');
    await bottle.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('.stage')?.dataset.act === 'reveal');
    await page.waitForFunction(() => Math.abs(window.scrollY - window.innerHeight * 0.4) < 1);
    assert.match(await page.locator('.overlay--reveal').innerText(), /VINE·FLAM/);
  }
  const phone = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  phone.on('pageerror', (error) => errors.push(error.message));
  phone.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await phone.goto('http://127.0.0.1:4183');
  await phone.locator('.loader').waitFor({ state: 'hidden' });
  await phone.getByRole('button', { name: 'Next product', exact: true }).tap();
  const phoneTarget = phone.locator('#hero-product-arginine-4x');
  await phoneTarget.waitFor({ state: 'visible' });
  const phoneBox = await phoneTarget.boundingBox();
  assert.ok(phoneBox);
  await phone.touchscreen.tap(phoneBox.x + phoneBox.width / 2, phoneBox.y + phoneBox.height / 2);
  assert.equal(await phoneTarget.getAttribute('aria-pressed'), 'true');
  await phone.close();
  assert.deepEqual(errors, []);
  await writeFile(
    path.join(output, 'browser-checks.json'),
    JSON.stringify(
      {
        browser: await browser.version(),
        heroClick: true,
        lineupClick: true,
        returnToHero: true,
        keyboard: true,
        dragDoesNotClick: true,
        rightClickDoesNotSelect: true,
        phoneTap: true,
        desktopWidths: [1280, 1440, 2560],
        errors,
      },
      null,
      2,
    ),
  );
  console.log('Product selection passed: hero click, lineup click, reveal target, passive canvas.');
} finally {
  await browser.close();
  await server.close();
}
