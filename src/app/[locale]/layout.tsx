import '@fontsource-variable/inter';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/ibm-plex-sans-arabic/400.css';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/600.css';
import '../globals.css';

import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RevealObserver } from '@/components/Reveal';
import { JsonLd } from '@/components/ui';
import { isLocale, locales, localeMeta } from '@/i18n/config';
import { getDictionary } from '@/locales';
import { organizationJsonLd } from '@/lib/seo';
import { asset } from '@/config/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: '#18191b', width: 'device-width', initialScale: 1 };

export const metadata = {
  icons: { icon: [{ url: asset('/favicon.svg'), type: 'image/svg+xml' }, { url: asset('/favicon.ico'), sizes: '32x32' }], apple: asset('/apple-touch-icon.png') },
};

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  return (
    <html lang={locale} dir={localeMeta[locale].dir} className="no-js">
      <body>
        <JsonLd data={organizationJsonLd(locale)} />
        <Header locale={locale} dict={dict} />
        <main id="main">{children}</main>
        <Footer locale={locale} dict={dict} />
        <RevealObserver />
      </body>
    </html>
  );
}
