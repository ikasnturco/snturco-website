import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary, isLocale, locales, href, type Dictionary, type Locale } from '@/i18n';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/ui';
import {
  AboutView,
  ContactView,
  FabricsView,
  MarketsView,
  PartnersView,
  PrivacyView,
  ProductsView,
  ProfileView,
  QuoteView,
  SourcingView,
  YarnsView,
} from '@/views/Pages';

type View = ComponentType<{ locale: Locale; dict: Dictionary }>;
type Entry = { view: View; meta: (d: Dictionary) => { title: string; description: string }; label: (d: Dictionary) => string };

const routes: Record<string, Entry> = {
  about: { view: AboutView, meta: (d) => d.about.meta, label: (d) => d.common.nav.about },
  products: { view: ProductsView, meta: (d) => d.productsPage.meta, label: (d) => d.common.nav.products },
  yarns: { view: YarnsView, meta: (d) => d.yarnsPage.meta, label: (d) => d.common.nav.yarns },
  fabrics: { view: FabricsView, meta: (d) => d.fabricsPage.meta, label: (d) => d.common.nav.fabrics },
  'trading-sourcing': { view: SourcingView, meta: (d) => d.sourcingPage.meta, label: (d) => d.common.nav.sourcing },
  'global-markets': { view: MarketsView, meta: (d) => d.marketsPage.meta, label: (d) => d.common.nav.markets },
  'suppliers-partners': { view: PartnersView, meta: (d) => d.partnersPage.meta, label: (d) => d.common.nav.partners },
  'request-a-quote': { view: QuoteView, meta: (d) => d.quotePage.meta, label: (d) => d.common.nav.quote },
  contact: { view: ContactView, meta: (d) => d.contactPage.meta, label: (d) => d.common.nav.contact },
  'company-profile': { view: ProfileView, meta: (d) => d.profilePage.meta, label: (d) => d.common.nav.profile },
  privacy: { view: PrivacyView, meta: (d) => d.privacyPage.meta, label: (d) => d.common.nav.privacy },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => Object.keys(routes).map((slug) => ({ locale, slug })));
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const route = routes[slug];
  if (!isLocale(locale) || !route) return {};
  return buildMetadata(locale, slug, route.meta(getDictionary(locale)));
}

export default async function Page({ params }: Params) {
  const { locale, slug } = await params;
  const route = routes[slug];
  if (!isLocale(locale) || !route) notFound();
  const dict = getDictionary(locale);
  const View = route.view;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.breadcrumbHome, path: href(locale) },
          { name: route.label(dict), path: href(locale, slug) },
        ])}
      />
      <View locale={locale} dict={dict} />
    </>
  );
}
