// Offline renderer: bundles lab-entry.ts, opens it in headless Chromium (WebGL via SwiftShader) and writes images.
// Usage: node scripts/render/run.mjs products|cotton|story|test [filter]
import { build } from 'esbuild';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../..');
const job = process.argv[2] || 'test';
const filter = process.argv[3] || '';

const bundle = await build({ entryPoints: [join(here, 'lab-entry.ts')], bundle: true, write: false, format: 'iife', target: 'es2020', minify: true, logLevel: 'error' });
const js = bundle.outputFiles[0].text;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
page.on('console', (m) => m.type() === 'error' && console.error('[page]', m.text()));
page.on('pageerror', (e) => console.error('[pageerror]', e.message));
await page.setContent('<!doctype html><html><body style="margin:0;background:#000"></body></html>');
await page.addScriptTag({ content: js });
await page.waitForFunction(() => window.ready);

async function save(url, file) {
  const b64 = url.split(',')[1];
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(b64, 'base64'));
}

const plan = (await import(join(here, 'plan.mjs'))).default;
const t0 = Date.now();
if (job === 'story') {
  for (const set of plan.story) {
    if (filter && set.name !== filter) continue;
    await page.evaluate(() => window.resetStory());
    for (let i = 0; i < set.frames; i++) {
      const t = i / (set.frames - 1);
      const url = await page.evaluate((o) => window.renderStory(o), { t, w: set.w, h: set.h, ss: set.ss, q: set.q, quality: set.quality });
      await save(url, join(root, set.out, `${String(i).padStart(3, '0')}.webp`));
      if (i % 10 === 0) console.log(set.name, i, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
  }
} else if (job === 'hero') {
  for (const it of plan.hero) {
    const url = await page.evaluate((o) => window.renderHero(o), it);
    await save(url, join(root, it.out));
    // smaller copy for cards and galleries (macro.webp -> macro-800.webp)
    const sharp = (await import('sharp')).default;
    await sharp(join(root, it.out)).resize(800).webp({ quality: 80 }).toFile(join(root, it.out.replace(/\.webp$/, '-800.webp')));
    console.log(it.out);
  }
} else if (job === 'yardtest') {
  const sizes = ['40ft', '20ft', '40ft HC', '40ft', '20ft', '40ft', '40ft HC'];
  for (const p of (filter || '0.08,0.25,0.5,0.75,1').split(',').map(Number)) {
    const url = await page.evaluate((o) => window.renderYard(o), { w: 960, h: 540, sizes, p });
    await save(url, join(process.env.OUT || '/tmp', `yard-${p}.webp`));
  }
} else if (job === 'storytest') {
  for (const t of (filter || '0,0.2,0.33,0.45,0.58,0.68,0.78,0.9,0.99').split(',').map(Number)) {
    const url = await page.evaluate((o) => window.renderStory(o), { t, w: 960, h: 540, ss: 1, q: 0.85 });
    await save(url, join(process.env.OUT || '/tmp', `story-${t}.webp`));
  }
} else {
  const items = plan[job] || [];
  for (const it of items) {
    if (filter && !it.out.includes(filter)) continue;
    const url = await page.evaluate((o) => window.renderShot(o), it);
    await save(url, join(root, it.out));
    // smaller copy for cards and galleries (macro.webp -> macro-800.webp)
    const sharp = (await import('sharp')).default;
    await sharp(join(root, it.out)).resize(800).webp({ quality: 80 }).toFile(join(root, it.out.replace(/\.webp$/, '-800.webp')));
    console.log(it.out, `${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
}
await browser.close();
