// Prints the English texts of the data files as JSON (the source for src/data/i18n/<locale>.json).
import { products } from '../src/data/products';
import { cottons } from '../src/data/cotton';
import { topics } from '../src/data/knowledge';
import { partners } from '../src/data/partners';

type Any = Record<string, unknown>;
function en(obj: Any): Any {
  const out: Any = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const o = v as Any;
      if ('en' in o && 'tr' in o) out[k] = o.en;
      else {
        const inner = en(o);
        if (Object.keys(inner).length) out[k] = inner;
      }
    } else if (Array.isArray(v) && v.length && typeof v[0] === 'object') {
      const arr = v.map((x) => en(x as Any));
      if (arr.some((x) => Object.keys(x).length)) out[k] = arr;
    }
  }
  return out;
}
const key = (x: Any) => (x.slug ?? x.id) as string;
const pick = (list: Any[]) => Object.fromEntries(list.map((x) => [key(x), en(x)]));
console.log(JSON.stringify({ products: pick(products as never), cotton: pick(cottons as never), knowledge: pick(topics as never), partners: pick(partners as never) }, null, 1));
