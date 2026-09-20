/**
 * Visual smoke test: builds nothing, serves ./dist, scrolls through every act on desktop and
 * phone viewports and writes PNGs to ./.shots. Fails (exit 1) on any console / page error.
 *
 *   npm run shots
 *
 * Needs a Playwright Chromium (`npx playwright install chromium`). To reuse a system browser
 * set PW_CHROMIUM=/path/to/chrome.
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import { preview } from 'vite';

const OUT = new URL('../.shots/', import.meta.url).pathname;
const PORT = 4179;

// Scroll stops in vh. Keep in sync with ACTS in src/director/acts.ts (hero 40 · reveal 160 ·
// features 400 · slogan 200 · lineup 200).
const STOPS = [
  ['01-hero', 0],
  ['02-reveal', 150],
  ['03-feature-1', 260],
  ['04-feature-3', 470],
  ['05-slogan', 720],
  ['06-lineup', 990],
  ['07-faq', 1100],
  ['08-outro', 99999],
];

const VIEWPORTS = [
  ['desktop', 1440, 810],
  ['phone', 390, 844],
];

const SETTLE_MS = Number(process.env.SHOTS_SETTLE_MS ?? 2200);

await mkdir(OUT, { recursive: true });
const server = await preview({ preview: { port: PORT, strictPort: true } });
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || undefined,
  // software GL so this also runs on CI machines without a GPU
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const problems = [];
try {
  for (const [label, width, height] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height } });
    page.on('console', (msg) => {
      if (msg.type() === 'error') problems.push(`[${label}] console: ${msg.text()}`);
    });
    page.on('pageerror', (error) => problems.push(`[${label}] pageerror: ${error.message}`));

    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.loader[data-ready="true"]', { timeout: 30_000 });
    await page.waitForTimeout(SETTLE_MS);

    for (const [name, vh] of STOPS) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round((vh / 100) * height));
      await page.waitForTimeout(SETTLE_MS);
      await page.screenshot({ path: `${OUT}${label}-${name}.png` });
    }
    await page.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Screenshots written to ${OUT}`);
