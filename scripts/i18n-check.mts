// Fails when a product, cotton or knowledge text, or a partner text, is missing in any of the 7 languages.
// Run: npm run i18n:check
import { locales } from '../src/i18n/config';
import { products } from '../src/data/products';
import { cottons } from '../src/data/cotton';
import { topics } from '../src/data/knowledge';
import { partners } from '../src/data/partners';

type Obj = Record<string, unknown>;
const missing: string[] = [];
function walk(v: unknown, path: string) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return;
  const o = v as Obj;
  if ('en' in o && 'tr' in o) {
    for (const l of locales) {
      const t = o[l];
      const en = o.en;
      if (t === undefined || t === '' || (Array.isArray(en) && (!Array.isArray(t) || t.length !== en.length))) missing.push(`${path} [${l}]`);
    }
    return;
  }
  for (const [k, x] of Object.entries(o)) walk(x, `${path}.${k}`);
}
for (const p of products) walk(p, `products.${p.slug}`);
for (const c of cottons) walk(c, `cotton.${c.slug}`);
for (const t of topics) walk(t, `knowledge.${t.slug}`);
for (const p of partners) walk(p, `partners.${p.id}`);
if (missing.length) {
  console.error(`Missing translations (${missing.length}):\n` + missing.join('\n'));
  process.exit(1);
}
console.log(`i18n check: all content complete in ${locales.length} languages.`);
