import type { Metadata } from 'next';
import { site } from '@/config/site';
import { href, locales, localeMeta, defaultLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/locales';

export function absoluteUrl(path: string) {
  return `${site.url}${path}`;
}

export function buildMetadata(locale: Locale, slug: string, meta: { title: string; description: string }, opts: { image?: string } = {}): Metadata {
  const path = href(locale, slug);
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(href(l, slug));
  languages['x-default'] = absoluteUrl(href(defaultLocale, slug));
  const title = `${meta.title} | ${site.name}`;
  const image = absoluteUrl(opts.image || '/og-image.png');

  return {
    title,
    description: meta.description,
    metadataBase: new URL(site.url),
    alternates: { canonical: absoluteUrl(path), languages },
    openGraph: {
      type: 'website',
      url: absoluteUrl(path),
      siteName: site.name,
      title,
      description: meta.description,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].ogLocale),
      images: [{ url: image, alt: site.legalName }],
    },
    twitter: { card: 'summary_large_image', title, description: meta.description, images: [image] },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const sameAs = [site.linkedin].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl(href(locale)),
    logo: absoluteUrl('/logo.png'),
    email: site.email,
    description: dict.meta.siteDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode,
    },
    telephone: site.phones[0],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: site.email,
        telephone: site.phones[0],
        availableLanguage: ['English', 'Turkish', 'German', 'Portuguese', 'Italian', 'Russian', 'Arabic'],
      },
    ],
    knowsAbout: ['Yarn trading', 'Cotton yarn', 'Polyester yarn', 'Viscose yarn', 'Wool yarn', 'Linen yarn', 'Textile sourcing'],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
