import en, { type Dictionary } from './en';
import tr from './tr';
import de from './de';
import pt from './pt';
import it from './it';
import ru from './ru';
import ar from './ar';
import type { PartialDictionary } from './types';
import type { Locale } from '@/i18n/config';

const partial: Record<Exclude<Locale, 'en' | 'tr'>, PartialDictionary> = { de, pt, it, ru, ar };

function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over)) return base;
    return base.map((b, i) => merge(b, over[i])) as T;
  }
  if (typeof base === 'object' && base !== null && typeof over === 'object') {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(base)) out[k] = merge((base as Record<string, unknown>)[k], (over as Record<string, unknown>)[k]);
    return out as T;
  }
  return over as T;
}

const cache = new Map<Locale, Dictionary>();

/** Texts for a language. English fills in anything a language file does not translate. */
export function getDictionary(locale: Locale): Dictionary {
  if (locale === 'en') return en;
  if (locale === 'tr') return tr;
  if (!cache.has(locale)) cache.set(locale, merge(en, partial[locale]));
  return cache.get(locale)!;
}

export type { Dictionary };
