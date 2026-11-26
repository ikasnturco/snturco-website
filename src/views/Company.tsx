import Link from 'next/link';
import { PageHero, CtaBand, SectionTitle, ArrowLink } from '@/components/ui';
import { InquiryForm, type YarnGroup } from '@/components/InquiryForm';
import { ContactList, WhatsAppButton } from '@/components/ContactLinks';
import { site, asset, telHref } from '@/config/site';
import { href, tx, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';
import { partners } from '@/data/partners';
import { products } from '@/data/products';
import { cottons } from '@/data/cotton';

const home = (locale: Locale, dict: Dictionary) => ({ label: dict.common.breadcrumbHome, href: href(locale) });

/* ------------------------------------------------------------------ About */
export function AboutView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const a = dict.about;
  const d = a.details;
  return (
    <>
      <PageHero eyebrow={a.hero.eyebrow} title={a.hero.title} lead={a.hero.lead} image="/images/yarns/cotton/cone.webp" crumbs={[home(locale, dict), { label: dict.nav.about, href: href(locale, 'about') }]} />
      <section className="bg-sand-50 py-20 md:py-28">
        <div className="container">
          <div className="grid gap-px overflow-hidden rounded-[22px] bg-line md:grid-cols-2">
            {a.sections.map((s, i) => (
              <article key={s.key} id={s.key} className={`reveal p-8 md:p-12 ${i === 0 ? 'bg-navy text-white md:col-span-2' : 'bg-white'}`}>
                <p className={`text-[12px] tabular-nums tracking-[0.25em] ${i === 0 ? 'text-copper-300' : 'text-copper-700'}`}>{String(i + 1).padStart(2, '0')}</p>
                <h2 className={`display mt-4 text-[clamp(1.8rem,3vw,2.6rem)] ${i === 0 ? '' : 'text-navy'}`}>{s.title}</h2>
                <p className={`mt-4 max-w-3xl text-[16.5px] leading-relaxed ${i === 0 ? 'text-white/75' : 'text-slate'}`}>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-20 md:py-28">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionTitle eyebrow={dict.home.quality.eyebrow} title={dict.home.quality.title} />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {dict.home.quality.items.map((q) => (
                <div key={q.title} className="border-t border-navy/15 pt-5">
                  <h3 className="display text-[22px] text-navy">{q.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate">{q.text}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="card-surface p-8 lg:sticky lg:top-28">
              <h2 className="display text-[26px] text-navy">{d.title}</h2>
              <dl className="mt-6 space-y-5 text-[15px]">
                <div>
                  <dt className="text-[12.5px] text-slate">{d.legal}</dt>
                  <dd className="mt-1 font-medium text-navy">{site.legalName}</dd>
                </div>
                <div>
                  <dt className="text-[12.5px] text-slate">{d.address}</dt>
                  <dd className="mt-1 text-navy">
                    {site.address.city}, {site.address.country}
                  </dd>
                </div>
                <div>
                  <dt className="text-[12.5px] text-slate">{d.email}</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${site.email}`} className="link-underline text-navy" dir="ltr">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[12.5px] text-slate">{dict.contact.phone}</dt>
                  <dd className="mt-1 space-y-1">
                    {site.phones.map((ph) => (
                      <a key={ph} href={telHref(ph)} className="link-underline block w-fit text-navy tabular-nums" dir="ltr">
                        {ph}
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
              <WhatsAppButton dict={dict} className="mt-8 w-full !border-anthracite/15" />
            </div>
          </aside>
        </div>
      </section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

/* --------------------------------------------------------------- Partners */
export function PartnersView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = dict.partnersPage;
  return (
    <>
      <PageHero eyebrow={p.hero.eyebrow} title={p.hero.title} lead={p.hero.lead} crumbs={[home(locale, dict), { label: dict.nav.partners, href: href(locale, 'partners') }]} />
      <section className="bg-sand-50 py-20 md:py-28">
        <div className="container">
          <ul className="grid gap-6 md:grid-cols-2">
            {partners.map((pt, i) => (
              <li key={pt.id} className="reveal" style={{ ['--d' as string]: `${i * 100}ms` }}>
                <article className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-line">
                  {/* Logo area: typeset name until a real logo file is supplied (data/partners.ts → logo). */}
                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-navy">
                    {pt.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset(pt.logo)} alt={pt.name} className="relative max-h-24 max-w-[60%] object-contain" />
                    ) : (
                      <p className="relative px-6 text-center font-sans text-[clamp(1.5rem,3vw,2.1rem)] font-semibold tracking-[0.18em] text-white">{pt.name}</p>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-copper-700">{p.labels.partner}</p>
                    <h2 className="display mt-2 text-[28px] text-navy">{pt.name}</h2>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-slate">{tx(pt.description, locale)}</p>
                    <dl className="mt-6 space-y-3 border-t border-line pt-5 text-[15px]">
                      <div className="flex gap-4">
                        <dt className="w-24 shrink-0 text-slate">{p.labels.country}</dt>
                        <dd className="text-navy">{tx(pt.country, locale)}</dd>
                      </div>
                      {pt.address && (
                        <div className="flex gap-4">
                          <dt className="w-24 shrink-0 text-slate">{p.labels.address}</dt>
                          <dd className="text-navy">{pt.address}</dd>
                        </div>
                      )}
                      {pt.website && (
                        <div className="flex gap-4">
                          <dt className="w-24 shrink-0 text-slate">{p.labels.website}</dt>
                          <dd>
                            <a href={pt.website} className="link-underline text-navy" target="_blank" rel="noopener noreferrer" dir="ltr">
                              {pt.website.replace(/^https?:\/\//, '')}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[22px] border border-dashed border-navy/20 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="display text-[26px] text-navy">{p.become.title}</h2>
              <p className="mt-2 max-w-xl text-slate">{p.become.text}</p>
            </div>
            <Link href={href(locale, 'contact')} className="btn-primary">
              {dict.cta.contact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------- Contact */
function ContactCard({ locale, dict, showQuote = true }: { locale: Locale; dict: Dictionary; showQuote?: boolean }) {
  return (
    <div className="rounded-[22px] bg-anthracite p-7 text-offwhite md:p-8">
      <p className="font-medium text-offwhite">{site.legalName}</p>
      <div className="mt-6">
        <ContactList dict={dict} />
      </div>
      <WhatsAppButton dict={dict} className="mt-8 w-full" />
      <p className="mt-5 text-[13.5px] text-offwhite/55">{dict.contact.hours}</p>
      {showQuote && (
        <ArrowLink href={href(locale, 'request-a-quote')} tone="dark" className="mt-6">
          {dict.cta.quote}
        </ArrowLink>
      )}
    </div>
  );
}

export function ContactView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.contactPage;
  return (
    <>
      <PageHero compact eyebrow={c.hero.eyebrow} title={c.hero.title} lead={c.hero.lead} crumbs={[home(locale, dict), { label: dict.nav.contact, href: href(locale, 'contact') }]} />
      <section className="bg-sand-50 py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-[22px] bg-white p-7 ring-1 ring-line md:p-10">
              <h2 className="display text-[28px] text-navy">{c.formTitle}</h2>
              <div className="mt-8">
                <InquiryForm kind="contact" locale={locale} t={dict.form} privacyLabel={dict.privacyPage.hero.title} />
              </div>
            </div>
          </div>
          <aside className="lg:col-span-4">
            <ContactCard locale={locale} dict={dict} />
          </aside>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ Quote */
export function yarnGroups(locale: Locale, dict: Dictionary): YarnGroup[] {
  return [
    { label: dict.form.groups.yarns, options: products.map((p) => ({ value: p.slug, label: tx(p.name, locale) })) },
    { label: dict.form.groups.cotton, options: cottons.map((c) => ({ value: c.slug, label: tx(c.name, locale) })) },
    { label: dict.form.groups.other, options: [{ value: 'other', label: dict.form.otherYarn }] },
  ];
}

export function QuoteView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const q = dict.quotePage;
  return (
    <>
      <PageHero compact eyebrow={q.hero.eyebrow} title={q.hero.title} lead={q.hero.lead} crumbs={[home(locale, dict), { label: dict.nav.quote, href: href(locale, 'request-a-quote') }]} />
      <section className="bg-sand-50 py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-[22px] bg-white p-7 ring-1 ring-line md:p-10">
              <InquiryForm kind="quote" locale={locale} t={dict.form} privacyLabel={dict.privacyPage.hero.title} yarnGroups={yarnGroups(locale, dict)} />
            </div>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-[22px] bg-navy p-8 text-white">
              <h2 className="display text-[24px]">{q.aside.title}</h2>
              <ol className="mt-6 space-y-5">
                {q.aside.items.map((it, i) => (
                  <li key={it} className="flex gap-4 text-[15px] leading-relaxed text-white/75">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-copper-300/50 text-[12px] tabular-nums text-copper-200">{i + 1}</span>
                    {it}
                  </li>
                ))}
              </ol>
            </div>
            <ContactCard locale={locale} dict={dict} showQuote={false} />
          </aside>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ Legal */
export function LegalView({ locale, dict, page }: { locale: Locale; dict: Dictionary; page: 'privacy' | 'cookies' }) {
  const p = page === 'privacy' ? dict.privacyPage : dict.cookiesPage;
  return (
    <>
      <PageHero compact eyebrow={p.hero.eyebrow} title={p.hero.title} lead={p.hero.lead} crumbs={[home(locale, dict), { label: p.hero.title, href: href(locale, page) }]} />
      <section className="bg-sand-50 py-16 md:py-24">
        <div className="container max-w-3xl space-y-10">
          {p.sections.map((s) => (
            <div key={s.title}>
              <h2 className="display text-[26px] text-navy">{s.title}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-charcoal">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
