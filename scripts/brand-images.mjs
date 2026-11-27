// Regenerates the PNG brand images (favicon PNGs, logo, Open Graph image) from the SVG mark in the
// Dark Luxury palette. Run: node scripts/brand-images.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const mark = readFileSync('public/favicon.svg');
await sharp(mark, { density: 900 }).resize(512, 512).png().toFile('public/logo.png');
await sharp(mark, { density: 900 }).resize(512, 512).png().toFile('public/brand/snturco-mark-512.png');
await sharp(mark, { density: 400 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');

const lines = Array.from({ length: 26 }, (_, i) => {
  const y = 20 + i * 24;
  return `<path d="M200 ${y + 60} C 500 ${y - 20}, 800 ${y + 40}, 1200 ${y - 30}" fill="none" stroke="#F1EEE9" stroke-opacity="0.07" stroke-width="1.2"/>`;
}).join('');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#202124"/>
  ${lines}
  <path d="M560 250 C 760 200, 940 260, 1060 230 S 1160 200, 1200 190" fill="none" stroke="#C6A98E" stroke-width="2"/>
  <g transform="translate(80 80) scale(1.5)">
    <rect width="48" height="48" rx="10" fill="#F1EEE9"/>
    <path d="M32.5 15.2c-2-2.3-5-3.6-8.4-3.6-4.8 0-8.3 2.6-8.3 6.4 0 4 3.7 5.4 8.4 6.5 4.8 1.1 8.5 2.6 8.5 6.7 0 4-3.7 6.9-8.8 6.9-3.6 0-6.8-1.4-8.8-3.9" fill="none" stroke="#202124" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M15.1 34.2c-1.6-1.9-3.8-2.5-6.1-1.9" fill="none" stroke="#C6A98E" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="32.5" cy="15.2" r="2.1" fill="#C6A98E"/>
  </g>
  <text x="175" y="128" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="600" letter-spacing="7" fill="#F1EEE9">SNTURCO</text>
  <text x="80" y="395" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="#F1EEE9">Yarn sourcing from Türkiye</text>
  <text x="80" y="465" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="#F1EEE9">for manufacturers worldwide.</text>
  <text x="80" y="545" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="4" fill="#C6A98E">TEXTILE YARNS · PORTO, PORTUGAL</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');
console.log('brand images written');
