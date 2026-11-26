// Generates brand images (favicon, logo PNGs, Open Graph image) and the company profile PDFs.
// Usage: npm run build && node scripts/generate-assets.mjs && npm run build
import { createRequire } from 'node:module';
// Playwright is used only by this script; install it with "npm i -D playwright" if it is not available globally.
const { chromium } = createRequire(import.meta.url)('playwright');
import { createServer } from 'node:http';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';

const root = resolve(process.cwd());
const out = join(root, 'out');
const pub = join(root, 'public');

const mark = (bg = '#14243b', fg = '#ffffff') => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="10" fill="${bg}"/>
  <path d="M32.5 15.2c-2-2.3-5-3.6-8.4-3.6-4.8 0-8.3 2.6-8.3 6.4 0 4 3.7 5.4 8.4 6.5 4.8 1.1 8.5 2.6 8.5 6.7 0 4-3.7 6.9-8.8 6.9-3.6 0-6.8-1.4-8.8-3.9" fill="none" stroke="${fg}" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M15.1 34.2c-1.6-1.9-3.8-2.5-6.1-1.9" fill="none" stroke="#c08560" stroke-width="1.6" stroke-linecap="round"/>
  <circle cx="32.5" cy="15.2" r="2.1" fill="#c08560"/>
</svg>`.trim();

const wordmark = (inverted = false) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 64">
  <g transform="translate(0,8)">${mark(inverted ? '#ffffff' : '#14243b', inverted ? '#14243b' : '#ffffff').replace(/<\/?svg[^>]*>/g, '')}</g>
  <text x="64" y="40" font-family="Inter, Helvetica, Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="6.5" fill="${inverted ? '#ffffff' : '#14243b'}">SNTURCO</text>
</svg>`.trim();

function ico(png) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  return Buffer.concat([header, png]);
}

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.txt': 'text/plain' };
function serve() {
  return new Promise((ok) => {
    const server = createServer(async (req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = join(out, p);
      try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch {}
      try { const body = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(body); }
      catch { res.writeHead(404); res.end('not found'); }
    }).listen(0, () => ok(server));
  });
}

const browser = await chromium.launch();
const page = await browser.newPage();

async function svgToPng(svg, size, file, pad = 0) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent"><div style="padding:${pad}px;box-sizing:border-box;width:${size}px;height:${size}px">${svg.replace('<svg ', `<svg width="${size - 2 * pad}" height="${size - 2 * pad}" `)}</div></body></html>`);
  const buf = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  if (file) await writeFile(file, buf);
  return buf;
}

await writeFile(join(pub, 'favicon.svg'), mark());
await writeFile(join(pub, 'brand', 'snturco-mark.svg'), mark());
await writeFile(join(pub, 'brand', 'snturco-logo.svg'), wordmark());
await writeFile(join(pub, 'brand', 'snturco-logo-white.svg'), wordmark(true));
await writeFile(join(pub, 'favicon.ico'), ico(await svgToPng(mark(), 32)));
await svgToPng(mark(), 180, join(pub, 'apple-touch-icon.png'));
await svgToPng(mark(), 512, join(pub, 'logo.png'));
await svgToPng(mark(), 512, join(pub, 'brand', 'snturco-mark-512.png'));

// Open Graph image (1200x630)
const strands = Array.from({ length: 26 }, (_, i) => { const y = 10 + i * 26; return `<path d="M0 ${y + 70} C 260 ${y - 60}, 520 ${y + 110}, 1000 ${y - 20}" fill="none" stroke="#fff" stroke-opacity="${i % 5 === 0 ? 0.2 : 0.1}" stroke-width="${i % 5 === 0 ? 1.6 : 1}"/>`; }).join('');
await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<html><head><style>body{margin:0}</style></head><body>
<div style="width:1200px;height:630px;background:#14243b;position:relative;overflow:hidden;font-family:Inter,Helvetica,Arial,sans-serif;color:#fff">
<svg style="position:absolute;right:0;top:0" width="1000" height="630" viewBox="0 0 1000 630">${strands}<path d="M0 420 C 280 270, 520 470, 1000 320" fill="none" stroke="#c08560" stroke-width="2.4"/></svg>
<div style="position:absolute;left:80px;top:80px;display:flex;align-items:center;gap:22px">${mark('#ffffff', '#14243b').replace('<svg ', '<svg width="72" height="72" ')}<span style="font-size:34px;font-weight:600;letter-spacing:10px">SNTURCO</span></div>
<div style="position:absolute;left:80px;bottom:150px;font-family:Georgia,serif;font-size:62px;line-height:1.12;max-width:900px">Yarn sourcing from Türkiye<br/>for European buyers.</div>
<div style="position:absolute;left:80px;bottom:80px;font-size:24px;color:#d0a385;letter-spacing:3px;text-transform:uppercase">Textile trading &amp; sourcing · Porto, Portugal</div>
</div></body></html>`);
await page.screenshot({ path: join(pub, 'og-image.png') });

// Company profile PDFs from the built site
try {
  await stat(out);
  const server = await serve();
  const port = server.address().port;
  for (const l of ['en', 'de', 'tr', 'pt', 'it', 'ru', 'ar']) {
    await page.goto(`http://localhost:${port}/${l}/company-profile/`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: join(pub, 'downloads', `snturco-company-profile-${l}.pdf`), format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' } });
    await page.emulateMedia({ media: 'screen' });
  }
  server.close();
} catch (e) {
  console.warn('Skipping PDFs (run "npm run build" first):', e.message);
}

await browser.close();
console.log('Assets generated.');
