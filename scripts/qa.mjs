// QA run on the built site in ./out: screenshots (desktop + mobile), scroll story forward/back, form validation.
// Usage: node scripts/qa.mjs <screenshot-dir>
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
const { chromium, devices } = createRequire(import.meta.url)('playwright');

const out = resolve('out');
const dir = process.argv[2] || 'tmp-render/qa';
await mkdir(dir, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf', '.json': 'application/json' };
const server = await new Promise((ok) => {
  const s = createServer(async (req, res) => {
    let file = join(out, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch {}
    try { const b = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(b); }
    catch { res.writeHead(404); res.end('404'); }
  }).listen(0, () => ok(s));
});
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const results = [];
const ok = (name, pass, info = '') => { results.push({ name, pass, info }); console.log(`${pass ? '✓' : '✗'} ${name} ${info}`); };

async function shoot(page, name, full = false) {
  await page.screenshot({ path: join(dir, `${name}.png`), fullPage: full });
}

// Desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto(base + '/en/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);
  await shoot(page, 'd-01-hero');

  // story: scroll into the sticky section and compare canvas content at two positions, then back
  const story = await page.$('[data-story]');
  if (story) {
    const top = await story.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const h = await story.evaluate((el) => el.offsetHeight);
    const grab = async (f) => {
      await page.evaluate((y) => window.scrollTo(0, y), top + (h - 900) * f);
      await page.waitForTimeout(1500);
      return page.evaluate(() => document.querySelector('[data-story] canvas')?.toDataURL('image/webp', 0.3).length ?? 0);
    };
    const a = await grab(0.1);
    await shoot(page, 'd-02-story-10');
    const b = await grab(0.55);
    await shoot(page, 'd-03-story-55');
    const c = await grab(0.9);
    await shoot(page, 'd-04-story-90');
    const back = await grab(0.1);
    ok('Story frames change while scrolling', a !== b && b !== c, `${a}/${b}/${c}`);
    ok('Story scrolls back to the same frame', Math.abs(back - a) < a * 0.02, `${a} vs ${back}`);
  } else ok('Story section present', false);

  const yard = await page.$('[data-yard]');
  if (yard) {
    const top = await yard.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    const h = await yard.evaluate((el) => el.offsetHeight);
    for (const f of [0.15, 0.95]) {
      await page.evaluate((y) => window.scrollTo(0, y), top + (h - 900) * f);
      await page.waitForTimeout(2500);
      await shoot(page, `d-05-yard-${Math.round(f * 100)}`);
    }
    ok('Container yard shows demo label with no records', (await yard.innerText()).toLowerCase().includes('demo'));
  } else ok('Container yard present', false);

  for (const [p, n] of [['/en/products/', 'd-06-products'], ['/en/products/cotton/', 'd-07-product-cotton'], ['/tr/cotton/', 'd-08-cotton-tr'], ['/en/knowledge/', 'd-09-knowledge'], ['/en/partners/', 'd-10-partners'], ['/tr/about/', 'd-11-about-tr'], ['/ar/', 'd-12-home-ar']]) {
    await page.goto(base + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await shoot(page, n);
  }

  // filters + compare
  await page.goto(base + '/en/products/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Synthetic' }).click();
  const synth = await page.locator('main ul li').count();
  ok('Synthetic filter', synth > 0 && synth < 14, `${synth} items`);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await page.fill('input[type=search]', 'linen');
  ok('Search', (await page.locator('main ul li').count()) >= 1);
  await page.fill('input[type=search]', '');
  const adds = page.getByRole('button', { name: '+ Compare' });
  await adds.nth(0).click();
  await adds.nth(0).click();
  await page.getByRole('button', { name: /^Compare \(2\)/ }).click();
  await page.waitForTimeout(500);
  ok('Compare table opens with 2 yarns', (await page.locator('table thead th').count()) === 3);
  await shoot(page, 'd-13-compare');

  // quote form: preselect, validation, no fake success
  await page.goto(base + '/en/request-a-quote/?yarn=viscose', { waitUntil: 'networkidle' });
  ok('Quote form preselects yarn', (await page.inputValue('#quote-yarn')) === 'viscose');
  await page.click('button[type=submit]');
  ok('Empty form shows errors', (await page.locator('[role=alert]').count()) > 0);
  await page.fill('#quote-email', 'not-an-email');
  await page.fill('#quote-phone', 'abc');
  await page.click('button[type=submit]');
  const txt = await page.locator('form').innerText();
  ok('Email and phone validation', txt.includes('valid email') && txt.includes('valid phone'));
  await shoot(page, 'd-14-quote-errors', true);
  await page.goto(base + '/tr/contact/', { waitUntil: 'networkidle' });
  ok('Contact form has Subject field', (await page.locator('#contact-subject').count()) === 1);
  ok('No success message shown before sending', (await page.locator('text=has been sent').count()) === 0);
  ok('No console errors (desktop)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}

// Mobile
{
  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + '/tr/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await shoot(page, 'm-01-hero');
  await page.getByRole('button', { name: /Menü|Menu/ }).click();
  await page.waitForTimeout(600);
  await shoot(page, 'm-02-menu');
  await page.keyboard.press('Escape');
  await page.goto(base + '/tr/', { waitUntil: 'networkidle' });
  const story = await page.$('[data-story]');
  if (story) {
    const top = await story.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y), top + 2000);
    await page.waitForTimeout(2000);
    await shoot(page, 'm-03-story');
  }
  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok('No horizontal scroll on mobile', scrollW <= 0, `${scrollW}px`);
  await page.goto(base + '/tr/products/wool/', { waitUntil: 'networkidle' });
  await shoot(page, 'm-04-product');
  await page.goto(base + '/tr/request-a-quote/', { waitUntil: 'networkidle' });
  await shoot(page, 'm-05-quote');
  ok('No page errors (mobile)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await ctx.close();
}

await browser.close();
server.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
