// Crawls the built site in ./out: checks every internal link, console errors, and takes screenshots.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
const { chromium } = createRequire(import.meta.url)('playwright');

const out = resolve('out');
const shots = process.argv[2];
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = await new Promise((ok) => {
  const s = createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = join(out, p);
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch {}
    try { const b = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(b); }
    catch { res.writeHead(404, { 'content-type': 'text/html' }); res.end(await readFile(join(out, '404.html'))); }
  }).listen(0, () => ok(s));
});
const base = `http://localhost:${server.address().port}`;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(`${page.url()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`${page.url()}: ${e.message}`));

const queue = ['/en/'], seen = new Set(), broken = [];
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  if (!path.endsWith('/')) {
    const r = await ctx.request.get(base + path);
    if (r.status() !== 200) broken.push(`${path} -> ${r.status()}`);
    continue;
  }
  const res = await page.goto(base + path, { waitUntil: 'networkidle' });
  if (!res || res.status() !== 200) { broken.push(`${path} -> ${res && res.status()}`); continue; }
  const links = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const l of links) {
    if (!l || !l.startsWith('/')) continue;
    const clean = l.split('#')[0].split('?')[0];
    if (!seen.has(clean)) queue.push(clean);
  }
}
console.log('Pages/files checked:', seen.size);
console.log('Broken:', broken.length ? broken : 'none');
console.log('Console errors:', errors.length ? errors.slice(0, 20) : 'none');

if (shots) {
  await mkdir(shots, { recursive: true });
  const list = process.argv.slice(3);
  for (const item of list) {
    const [path, w] = item.split('@');
    const p2 = await browser.newPage({ viewport: { width: Number(w || 1366), height: 900 } });
    await p2.goto(base + path, { waitUntil: 'networkidle' });
    await p2.screenshot({ path: join(shots, `${path.replace(/\//g, '_')}${w || ''}.png`), fullPage: true });
    await p2.close();
  }
}
await browser.close();
server.close();
