import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { href, isLocale, locales, tx } from '@/i18n/config';
import { getDictionary } from '@/locales';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/ui';
import { CottonDetailView } from '@/views/Cotton';
import { cottons, cottonBySlug, cottonImages } from '@/data/cotton';

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => cottons.map((c) => ({ locale, slug: c.slug })));
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = cottonBySlug[slug];
  if (!isLocale(locale) || !c) return {};
  return buildMetadata(locale, `cotton/${slug}`, { title: tx(c.name, locale), description: tx(c.character, locale) }, { image: cottonImages(slug).main });
}

export default async function CottonPage({ params }: Params) {
  const { locale, slug } = await params;
  const c = cottonBySlug[slug];
  if (!isLocale(locale) || !c) notFound();
  const dict = getDictionary(locale);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.breadcrumbHome, path: href(locale) },
          { name: dict.nav.cotton, path: href(locale, 'cotton') },
          { name: tx(c.name, locale), path: href(locale, `cotton/${slug}`) },
        ])}
      />
      <CottonDetailView locale={locale} dict={dict} cotton={c} />
    </>
  );
}
