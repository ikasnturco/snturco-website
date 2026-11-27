import type { Locale } from '@/i18n/config';
import type { ContentTranslation } from './types';
import de from './de';
import pt from './pt';
import it from './it';
import ru from './ru';
import ar from './ar';

export const contentTranslations: Partial<Record<Locale, ContentTranslation>> = { de, pt, it, ru, ar };

type Obj = Record<string, unknown>;
const isLocalised = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v) && 'en' in (v as Obj) && 'tr' in (v as Obj);

/** Writes translated texts into the localised fields ({ en, tr, ... }) of a data item. */
function merge(target: Obj, texts: Obj, locale: Locale) {
  for (const [k, v] of Object.entries(texts)) {
    const t = target[k];
    if (isLocalised(t)) t[locale] = v;
    else if (t && typeof t === 'object' && v && typeof v === 'object' && !Array.isArray(v)) merge(t as Obj, v as Obj, locale);
  }
}

/** Adds DE, PT, IT, RU and AR texts to products, cotton varieties or knowledge topics. */
export function applyTranslations<T extends { slug: string }>(items: T[], section: keyof ContentTranslation) {
  for (const [locale, tr] of Object.entries(contentTranslations) as [Locale, ContentTranslation][]) {
    const table = tr[section] as Record<string, Obj>;
    for (const item of items) {
      const texts = table[item.slug];
      if (texts) merge(item as unknown as Obj, texts, locale);
    }
  }
  return items;
}
