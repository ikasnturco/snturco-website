import '@fontsource-variable/inter';
import '@fontsource/playfair-display/500.css';
import './globals.css';
import type { Metadata } from 'next';
import { LogoMark } from '@/components/Logo';
import { getDictionary, locales, localeMeta } from '@/i18n';
import { site } from '@/config/site';

export const metadata: Metadata = { title: 'Page not found | SNTURCO', robots: { index: false } };

export default function GlobalNotFound() {
  const en = getDictionary('en');
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-navy px-6 text-white">
        <main className="max-w-lg text-center">
          <div className="flex justify-center">
            <LogoMark size={56} inverted />
          </div>
          <p className="eyebrow mt-8 text-copper-300">404</p>
          <h1 className="display mt-3 text-4xl">{en.notFound.title}</h1>
          <p className="mt-4 text-white/75">{en.notFound.text}</p>
          <nav className="mt-8 flex flex-wrap justify-center gap-3">
            {locales.map((l) => (
              <a key={l} href={`${site.basePath}/${l}/`} lang={l} className="btn-ghost-light">
                {localeMeta[l].label}
              </a>
            ))}
          </nav>
        </main>
      </body>
    </html>
  );
}
