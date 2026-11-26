export const locales = ['en', 'de', 'tr', 'pt', 'it', 'ru', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeMeta: Record<Locale, { label: string; short: string; dir: 'ltr' | 'rtl'; ogLocale: string }> = {
  en: { label: 'English', short: 'EN', dir: 'ltr', ogLocale: 'en_GB' },
  de: { label: 'Deutsch', short: 'DE', dir: 'ltr', ogLocale: 'de_DE' },
  tr: { label: 'Türkçe', short: 'TR', dir: 'ltr', ogLocale: 'tr_TR' },
  pt: { label: 'Português', short: 'PT', dir: 'ltr', ogLocale: 'pt_PT' },
  it: { label: 'Italiano', short: 'IT', dir: 'ltr', ogLocale: 'it_IT' },
  ru: { label: 'Русский', short: 'RU', dir: 'ltr', ogLocale: 'ru_RU' },
  ar: { label: 'العربية', short: 'AR', dir: 'rtl', ogLocale: 'ar_AR' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Page slugs, shared by every language. '' is the home page. */
export const pages = [
  '',
  'about',
  'products',
  'yarns',
  'fabrics',
  'trading-sourcing',
  'global-markets',
  'suppliers-partners',
  'request-a-quote',
  'contact',
  'company-profile',
  'privacy',
] as const;
export type PageSlug = (typeof pages)[number];

export function href(locale: Locale, slug: PageSlug | string = '', query = '') {
  const path = slug ? `/${locale}/${slug}/` : `/${locale}/`;
  return query ? `${path}?${query}` : path;
}
