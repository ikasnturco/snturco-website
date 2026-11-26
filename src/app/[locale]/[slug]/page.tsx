import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { notFound } from 'next/navigation';
import { href, isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary, type Dictionary } from '@/locales';
import { breadcrumbJsonLd, buildMetadata, absoluteUrl } from '@/lib/seo';
import { JsonLd } from '@/components/ui';
import { ProductsView } from '@/views/Products';
import { CottonView } from '@/views/Cotton';
import { KnowledgeView } from '@/views/Knowledge';
import { AboutView, PartnersView, ContactView, QuoteView, LegalView } from '@/views/Company';
import { site } from '@/config/site';

type View = ComponentType<{ locale: Locale; dict: Dictionary }>;
type Entry = { view: View; meta: (d: Dictionary) => { title: string; description: string }; label: (d: Dictionary) => string };

/** Every top-level page. Add a page here and in src/app/sitemap.ts (via `pageSlugs`). */
const routes: Record<string, Entry> = {
  about: { view: AboutView, meta: (d) => d.about.meta, label: (d) => d.nav.about },
  products: { view: ProductsView, meta: (d) => d.productsPage.meta, label: (d) => d.nav.allYarns },
  cotton: { view: CottonView, meta: (d) => d.cottonPage.meta, label: (d) => d.nav.cotton },
  knowledge: { view: KnowledgeView, meta: (d) => d.knowledgePage.meta, label: (d) => d.nav.knowledge },
  partners: { view: PartnersView, meta: (d) => d.partnersPage.meta, label: (d) => d.nav.partners },
  contact: { view: ContactView, meta: (d) => d.contactPage.meta, label: (d) => d.nav.contact },
  'request-a-quote': { view: QuoteView, meta: (d) => d.quotePage.meta, label: (d) => d.nav.quote },
  privacy: { view: (p) => <LegalView {...p} page="privacy" />, meta: (d) => d.privacyPage.meta, label: (d) => d.nav.privacy },
  cookies: { view: (p) => <LegalView {...p} page="cookies" />, meta: (d) => d.cookiesPage.meta, label: (d) => d.nav.cookies },
};

/** Old URLs from the previous site, kept so existing links and search results still work. */
const legacy: Record<string, string> = {
  yarns: 'products',
  fabrics: 'products',
  'trading-sourcing': 'about',
  'global-markets': 'about',
  'suppliers-partners': 'partners',
  'company-profile': 'about',
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => [...Object.keys(routes), ...Object.keys(legacy)].map((slug) => ({ locale, slug })));
}

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  if (legacy[slug]) return { title: 'SNTURCO', robots: { index: false }, alternates: { canonical: absoluteUrl(href(locale, legacy[slug])) } };
  const route = routes[slug];
  if (!route) return {};
  return buildMetadata(locale, slug, route.meta(getDictionary(locale)));
}

export default async function Page({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (legacy[slug]) {
    const to = `${site.basePath}${href(locale, legacy[slug])}`;
    return (
      <section className="container py-48 text-center">
        <meta httpEquiv="refresh" content={`0;url=${to}`} />
        <a href={to} className="btn-primary">
          → {to}
        </a>
      </section>
    );
  }
  const route = routes[slug];
  if (!route) notFound();
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
