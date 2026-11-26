import type { MetadataRoute } from 'next';
import { locales, href } from '@/i18n/config';
import { absoluteUrl } from '@/lib/seo';
import { products } from '@/data/products';
import { cottons } from '@/data/cotton';

export const dynamic = 'force-static';

const pageSlugs = ['', 'about', 'products', 'cotton', 'knowledge', 'partners', 'contact', 'request-a-quote', 'privacy', 'cookies', ...products.map((p) => `products/${p.slug}`), ...cottons.map((c) => `cotton/${c.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return pageSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: absoluteUrl(href(locale, slug)),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: slug === '' ? 1 : ['products', 'cotton', 'request-a-quote'].includes(slug) ? 0.9 : ['privacy', 'cookies'].includes(slug) ? 0.3 : 0.7,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(href(l, slug))])) },
    })),
  );
}
