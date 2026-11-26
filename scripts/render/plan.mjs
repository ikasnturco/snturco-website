// What the offline renderer produces. Product images: 3 per yarn (macro, cone, fibres); cotton: 2 per variety.
const T = process.env.TEST_OUT || 'public/images';

// Tints give each yarn its own character on the page; natural fibres keep their own colour.
const tints = { polyester: '#4a5f82', acrylic: '#a8653f', nylon: '#7b8aa3', polyamide: '#2c3b55', polypropylene: '#9aa1a8', elastane: undefined, lycra: '#c9a48a', viscose: '#e8dccb' };
const coneTints = { cotton: undefined, wool: undefined, linen: undefined, hemp: undefined, silk: undefined, bamboo: undefined };
const yarnSlugs = ['cotton', 'polyester', 'viscose', 'acrylic', 'nylon', 'wool', 'silk', 'linen', 'bamboo', 'elastane', 'lycra', 'polyamide', 'polypropylene', 'hemp'];
const cottonSlugs = ['american-cotton', 'egyptian-cotton', 'turkish-cotton', 'pima-cotton', 'supima-cotton', 'giza-cotton', 'organic-cotton', 'anatolian-cotton', 'sea-island-cotton'];
const W = 1600, H = 1200;
const products = yarnSlugs.flatMap((key, i) => [
  { kind: 'macro', key, tint: tints[key], w: W, h: H, seed: 11 + i * 7, ss: 2, q: 0.84, out: `${T}/yarns/${key}/macro.webp` },
  { kind: 'cone', key, tint: tints[key] ?? coneTints[key], w: W, h: H, seed: 12 + i * 7, ss: 2, q: 0.84, background: i % 2 ? 'dark' : 'light', out: `${T}/yarns/${key}/cone.webp` },
  { kind: 'fibres', key, tint: tints[key], w: W, h: H, seed: 13 + i * 7, ss: 2, q: 0.84, out: `${T}/yarns/${key}/fibres.webp` },
]);
const cotton = cottonSlugs.flatMap((key, i) => [
  { kind: 'macro', key, cotton: true, w: W, h: H, seed: 201 + i * 5, ss: 2, q: 0.84, angle: ((i % 3) - 1) * 0.35, out: `${T}/cotton/${key}/macro.webp` },
  { kind: 'fibres', key, cotton: true, w: W, h: H, seed: 202 + i * 5, ss: 2, q: 0.84, out: `${T}/cotton/${key}/fibres.webp` },
]);
export default {
  products,
  cotton,
  test: [
    { kind: 'macro', key: 'cotton', w: 800, h: 600, seed: 1, ss: 1, out: 'tmp-render/macro-cotton.webp' },
    { kind: 'cone', key: 'cotton', w: 800, h: 600, seed: 2, ss: 1, out: 'tmp-render/cone-cotton.webp' },
    { kind: 'fibres', key: 'wool', w: 800, h: 600, seed: 3, ss: 1, out: 'tmp-render/fibres-wool.webp' },
    { kind: 'macro', key: 'silk', w: 800, h: 600, seed: 4, ss: 1, out: 'tmp-render/macro-silk.webp' },
  ],
  story: [
    { name: 'desktop', frames: 144, w: 1440, h: 810, ss: 2, q: 0.78, quality: 1, out: 'public/animations/story/desktop' },
    { name: 'mobile', frames: 96, w: 720, h: 1280, ss: 2, q: 0.76, quality: 0.85, out: 'public/animations/story/mobile' },
  ],
  hero: [
    { w: 1920, h: 1080, out: 'public/images/hero/poster.webp' },
    { w: 828, h: 1600, mobile: true, out: 'public/images/hero/poster-mobile.webp' },
  ],
};
