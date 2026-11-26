/**
 * Languages. All seven are complete: interface texts in src/locales/<locale>.ts (type-checked against
 * English), product / cotton / knowledge texts in src/data/*.ts (EN, TR) and src/data/i18n/<locale>.ts
 * (DE, PT, IT, RU, AR). `npm run typecheck` fails if anything is missing.
 *
 * To add a language (for example Spanish):
 * 1. add 'es' to `locales` and an entry in `localeMeta`,
 * 2. create src/locales/es.ts (copy src/locales/de.ts and translate) and register it in src/locales/index.ts,
 * 3. create src/data/i18n/es.ts (copy de.ts and translate) and register it in src/data/i18n/index.ts.
 */
export const locales = ['en', 'tr', 'de', 'pt', 'it', 'ru', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { label: string; short: string; dir: 'ltr' | 'rtl'; ogLocale: string; complete: boolean }> = {
  en: { label: 'English', short: 'EN', dir: 'ltr', ogLocale: 'en_GB', complete: true },
  tr: { label: 'Türkçe', short: 'TR', dir: 'ltr', ogLocale: 'tr_TR', complete: true },
  de: { label: 'Deutsch', short: 'DE', dir: 'ltr', ogLocale: 'de_DE', complete: true },
  pt: { label: 'Português', short: 'PT', dir: 'ltr', ogLocale: 'pt_PT', complete: true },
  it: { label: 'Italiano', short: 'IT', dir: 'ltr', ogLocale: 'it_IT', complete: true },
  ru: { label: 'Русский', short: 'RU', dir: 'ltr', ogLocale: 'ru_RU', complete: true },
  ar: { label: 'العربية', short: 'AR', dir: 'rtl', ogLocale: 'ar_AR', complete: true },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Localised text: English and Turkish are required, other languages optional (fallback: English). */
export type L = { en: string; tr: string } & Partial<Record<Locale, string>>;
export type LL = { en: string[]; tr: string[] } & Partial<Record<Locale, string[]>>;

export function tx<T>(value: { en: T } & Partial<Record<Locale, T>>, locale: Locale): T {
  return value[locale] ?? value.en;
}

/** True when `value` has no translation for `locale` and English is shown instead. */
export function isFallback(value: { en: unknown } & Partial<Record<Locale, unknown>>, locale: Locale) {
  return value[locale] === undefined;
}

export function href(locale: Locale, slug = '', query = '') {
  const path = slug ? `/${locale}/${slug.replace(/^\/|\/$/g, '')}/` : `/${locale}/`;
  return query ? `${path}?${query}` : path;
}
