import Link from 'next/link';
import { PageHero, CtaBand, FallbackNote } from '@/components/ui';
import { Diagram } from '@/components/knowledge/Diagram';
import { href, tx, isFallback, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';
import { topics } from '@/data/knowledge';
import { productBySlug } from '@/data/products';

export function KnowledgeView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const kp = dict.knowledgePage;
  return (
    <>
      <PageHero eyebrow={kp.hero.eyebrow} title={kp.hero.title} lead={kp.hero.lead} crumbs={[{ label: dict.common.breadcrumbHome, href: href(locale) }, { label: dict.nav.knowledge, href: href(locale, 'knowledge') }]} />
      <section className="bg-sand-50 py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
          <nav aria-label={kp.toc} className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-copper">{kp.toc}</p>
              <ol className="mt-4 space-y-1 border-s border-line">
                {topics.map((tp, i) => (
                  <li key={tp.slug}>
                    <a href={`#${tp.slug}`} className="-ms-px block border-s border-transparent py-1.5 ps-4 text-[14.5px] text-slate transition hover:border-copper hover:text-navy">
                      <span className="me-2 tabular-nums text-copper/70">{String(i + 1).padStart(2, '0')}</span>
                      {tx(tp.title, locale)}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="space-y-8 lg:col-span-9">
            <FallbackNote show={isFallback(topics[0].text, locale)} text={dict.common.fallbackNote} />
            {topics.map((tp, i) => (
              <article key={tp.slug} id={tp.slug} className="reveal scroll-mt-28 overflow-hidden rounded-[22px] bg-white ring-1 ring-line">
                <div className="grid md:grid-cols-2">
                  <div className="p-7 md:p-10">
                    <p className="text-[12px] tabular-nums tracking-[0.25em] text-copper">{String(i + 1).padStart(2, '0')}</p>
                    <h2 className="display mt-3 text-[clamp(1.6rem,2.6vw,2.2rem)] text-navy">{tx(tp.title, locale)}</h2>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-charcoal">{tx(tp.text, locale)}</p>
                  </div>
                  <div className="flex items-center bg-sand/70 p-6 md:p-8">
                    <Diagram visual={tp.visual} locale={locale} />
                  </div>
                </div>
                <div className="grid gap-6 border-t border-line p-7 md:grid-cols-[1fr_auto] md:items-center md:px-10">
                  <p className="text-[15px] leading-relaxed text-slate">
                    <span className="me-2 font-semibold text-navy">{kp.example}:</span>
                    {tx(tp.example, locale)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="sr-only">{kp.related}:</span>
                    {tp.related
                      .map((s) => productBySlug[s])
                      .filter(Boolean)
                      .map((p) => (
                        <Link key={p.slug} href={href(locale, `products/${p.slug}`)} className="rounded-full border border-navy/15 px-3.5 py-1.5 text-[13px] text-navy transition hover:border-copper hover:text-copper">
                          {tx(p.name, locale)} →
                        </Link>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
