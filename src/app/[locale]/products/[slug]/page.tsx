import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { href, isLocale, locales, tx } from '@/i18n/config';
import { getDictionary } from '@/locales';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/ui';
import { ProductDetailView } from '@/views/Products';
import { products, productBySlug, productImages } from '@/data/products';

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = productBySlug[slug];
  if (!isLocale(locale) || !p) return {};
  return buildMetadata(locale, `products/${slug}`, { title: `${tx(p.name, locale)} – ${tx(p.tagline, locale)}`, description: tx(p.intro, locale) }, { image: productImages(slug).main });
}

export default async function ProductPage({ params }: Params) {
  const { locale, slug } = await params;
  const p = productBySlug[slug];
  if (!isLocale(locale) || !p) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.breadcrumbHome, path: href(locale) },
          { name: dict.nav.allYarns, path: href(locale, 'products') },
          { name: tx(p.name, locale), path: href(locale, `products/${slug}`) },
        ])}
      />
      <ProductDetailView locale={locale} dict={dict} product={p} />
    </>
  );
}
