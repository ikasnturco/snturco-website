import Link from 'next/link';
import { ArrowLink, Card, CtaBand, IconBadge, Section, SectionTitle } from '@/components/ui';
import { ThreadArt } from '@/components/ThreadArt';
import { IconCheck, iconByKey } from '@/components/Icons';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

const tradeLink: Record<string, string> = { yarns: 'yarns', fabrics: 'fabrics', raw: 'products' };

export function HomeView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home;
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <ThreadArt className="pointer-events-none absolute inset-y-0 end-0 h-full w-full opacity-70 md:w-[75%] rtl:-scale-x-100" />
        <div className="container relative py-24 md:py-32">
          <p className="eyebrow animate-rise text-copper-300">{h.hero.eyebrow}</p>
          <h1 className="display mt-5 max-w-3xl animate-rise text-[clamp(2.4rem,5.6vw,4.4rem)] [animation-delay:80ms]">{h.hero.title}</h1>
          <p className="mt-7 max-w-2xl animate-rise text-[clamp(1.05rem,1.7vw,1.3rem)] leading-relaxed text-white/80 [animation-delay:160ms]">{h.hero.lead}</p>
          <div className="mt-10 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            <Link href={href(locale, 'request-a-quote')} className="btn-copper">
              {dict.common.cta.request}
            </Link>
            <Link href={href(locale, 'yarns')} className="btn-ghost-light">
              {dict.common.cta.viewYarns}
            </Link>
          </div>
        </div>
      </section>

      <Section>
        <p className="display max-w-4xl text-[clamp(1.35rem,2.4vw,1.9rem)] leading-snug text-navy">{h.intro}</p>
      </Section>

      <Section tone="sand">
        <SectionTitle eyebrow={dict.common.nav.products} title={h.tradeTitle} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {h.trade.map((item) => {
            const Icon = iconByKey[item.key as keyof typeof iconByKey];
            return (
              <Card key={item.key} className="flex flex-col">
                <IconBadge>
                  <Icon />
                </IconBadge>
                <h3 className="mt-6 text-[20px] font-semibold text-navy">{item.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-slate">{item.text}</p>
                <ArrowLink href={href(locale, tradeLink[item.key])} className="mt-6">
                  {dict.common.cta.learnMore}
                </ArrowLink>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionTitle eyebrow={dict.common.nav.sourcing} title={h.howTitle} />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-3">
          {h.how.map((step, i) => (
            <li key={step.title} className="bg-white p-8">
              <span className="font-display text-[44px] leading-none text-copper">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-5 text-[19px] font-semibold text-navy">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-slate">{step.text}</p>
            </li>
          ))}
        </ol>
        <ArrowLink href={href(locale, 'trading-sourcing')} className="mt-10">
          {dict.common.nav.sourcing}
        </ArrowLink>
      </Section>

      <Section tone="mist">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionTitle eyebrow={dict.common.nav.about} title={h.whyTitle} />
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {h.why.map((w) => (
              <div key={w.title} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                  <IconCheck width={16} height={16} strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-navy">{w.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand locale={locale} dict={dict} />
    </>
  );
}
