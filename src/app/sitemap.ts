import type { MetadataRoute } from 'next';
import { locales, pages, href } from '@/i18n/config';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pages.flatMap((slug) =>
    locales.map((locale) => ({
      url: absoluteUrl(href(locale, slug)),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: slug === '' ? 1 : slug === 'request-a-quote' || slug === 'yarns' ? 0.9 : slug === 'privacy' ? 0.3 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(href(l, slug))])) },
    })),
  );
}
