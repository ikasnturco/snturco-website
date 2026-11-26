import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomeView } from '@/views/Home';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/locales';
import { buildMetadata, organizationJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/ui';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata(locale, '', getDictionary(locale).home.meta, { image: '/images/hero/poster.webp' });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <JsonLd data={organizationJsonLd(locale)} />
      <HomeView locale={locale} dict={getDictionary(locale)} />
    </>
  );
}
