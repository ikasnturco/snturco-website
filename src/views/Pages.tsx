import Link from 'next/link';
import { ArrowLink, Card, CtaBand, IconBadge, JsonLd, PageHero, Section, SectionTitle } from '@/components/ui';
import { InquiryForm } from '@/components/InquiryForm';
import { LogoMark } from '@/components/Logo';
import {
  IconCheck,
  IconCone,
  IconDocument,
  IconFabric,
  IconGlobe,
  IconMail,
  IconPin,
  IconWhatsApp,
  iconByKey,
  serviceIcons,
} from '@/components/Icons';
import { site, asset } from '@/config/site';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';
import { absoluteUrl } from '@/lib/seo';

type Props = { locale: Locale; dict: Dictionary };

function crumbs(locale: Locale, dict: Dictionary, label: string, slug: string, parent?: { label: string; slug: string }) {
  return [
    { label: dict.common.breadcrumbHome, href: href(locale) },
    ...(parent ? [{ label: parent.label, href: href(locale, parent.slug) }] : []),
    { label, href: href(locale, slug) },
  ];
}

function CheckList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed">
          <IconCheck width={20} height={20} strokeWidth={2} className="mt-0.5 shrink-0 text-copper" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CompanyDetails({ dict }: { dict: Dictionary }) {
  const d = dict.about.details;
  return (
    <dl className="grid gap-6 text-[15px]">
      <div>
        <dt className="eyebrow text-slate">{d.legal}</dt>
        <dd className="mt-1.5 text-navy">{site.legalName}</dd>
      </div>
      <div>
        <dt className="eyebrow text-slate">{d.address}</dt>
        <dd className="mt-1.5 text-navy" dir="ltr">
          {site.address.street}
          <br />
          {site.address.postalCode} {site.address.city}, {site.address.country}
        </dd>
      </div>
      <div>
        <dt className="eyebrow text-slate">{d.email}</dt>
        <dd className="mt-1.5">
          <a href={`mailto:${site.email}`} className="text-navy underline decoration-copper/50 underline-offset-4" dir="ltr">
            {site.email}
          </a>
        </dd>
      </div>
    </dl>
  );
}

/* ---------------------------------- About --------------------------------- */
export function AboutView({ locale, dict }: Props) {
  const a = dict.about;
  return (
    <>
      <PageHero {...a.hero} crumbs={crumbs(locale, dict, dict.common.nav.about, 'about')} />
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr]">
          <div className="prose-body max-w-2xl text-[18px] leading-relaxed text-charcoal">
            {a.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <aside className="rounded-lg border border-line bg-sand p-8">
            <h2 className="text-[18px] font-semibold text-navy">{a.detailsTitle}</h2>
            <div className="mt-6">
              <CompanyDetails dict={dict} />
            </div>
          </aside>
        </div>
      </Section>
      <Section tone="mist">
        <SectionTitle title={a.valuesTitle} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {a.values.map((v) => (
            <Card key={v.title}>
              <h3 className="text-[19px] font-semibold text-navy">{v.title}</h3>
              <p className="mt-3 leading-relaxed text-slate">{v.text}</p>
            </Card>
          ))}
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

/* --------------------------------- Products ------------------------------- */
const groupLink: Record<string, { slug: string; product: string }> = {
  yarns: { slug: 'yarns', product: 'cotton' },
  fabrics: { slug: 'fabrics', product: 'fabrics' },
  raw: { slug: 'request-a-quote', product: 'rawMaterials' },
};

export function ProductsView({ locale, dict }: Props) {
  const p = dict.productsPage;
  return (
    <>
      <PageHero {...p.hero} crumbs={crumbs(locale, dict, dict.common.nav.products, 'products')} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {p.groups.map((g) => {
            const Icon = iconByKey[g.key as keyof typeof iconByKey];
            const link = groupLink[g.key];
            return (
              <Card key={g.key} className="flex flex-col">
                <IconBadge>
                  <Icon />
                </IconBadge>
                <h2 className="mt-6 text-[22px] font-semibold text-navy">{g.title}</h2>
                <p className="mt-3 leading-relaxed text-slate">{g.text}</p>
                <CheckList items={g.items} className="mt-6 flex-1 text-[15px] text-charcoal" />
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  {link.slug !== 'request-a-quote' && <ArrowLink href={href(locale, link.slug)}>{dict.common.cta.learnMore}</ArrowLink>}
                  <Link href={href(locale, 'request-a-quote', `product=${link.product}`)} className="text-[15px] font-medium text-copper-600 hover:underline">
                    {dict.common.cta.inquire}
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
        <p className="mt-10 text-[15px] text-slate">{p.note}</p>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

/* ---------------------------------- Yarns --------------------------------- */
export function YarnsView({ locale, dict }: Props) {
  const y = dict.yarnsPage;
  const productList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: y.meta.title,
    itemListElement: y.categories.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: c.title,
        description: c.text,
        category: 'Yarn',
        brand: { '@type': 'Brand', name: site.name },
        url: absoluteUrl(`${href(locale, 'yarns')}#${c.key}`),
      },
    })),
  };
  return (
    <>
      <JsonLd data={productList} />
      <PageHero {...y.hero} crumbs={crumbs(locale, dict, dict.common.nav.yarns, 'yarns', { label: dict.common.nav.products, slug: 'products' })} />
      <Section>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {y.categories.map((c) => (
            <article key={c.key} id={c.key} className="flex scroll-mt-28 flex-col rounded-lg border border-line bg-white p-7 transition hover:border-navy/25">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-mist text-navy">
                  <IconCone width={24} height={24} />
                </span>
                <h2 className="text-[20px] font-semibold text-navy">{c.title}</h2>
              </div>
              <p className="mt-5 leading-relaxed text-charcoal">{c.text}</p>
              <p className="mt-4 flex-1 text-[14px] leading-relaxed text-slate">
                <span className="font-medium text-navy">{y.usesLabel}: </span>
                {c.uses}
              </p>
              <ArrowLink href={href(locale, 'request-a-quote', `product=${c.key}`)} className="mt-6">
                {y.requestLabel}
              </ArrowLink>
            </article>
          ))}
        </div>
      </Section>
      <Section tone="sand">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <SectionTitle title={y.checklistTitle} text={dict.common.ctaBand.text} />
          <div className="rounded-lg border border-line bg-white p-8">
            <CheckList items={y.checklist} className="text-[16px] text-charcoal" />
            <Link href={href(locale, 'request-a-quote')} className="btn-primary mt-8">
              {dict.common.cta.request}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

/* --------------------------------- Fabrics -------------------------------- */
export function FabricsView({ locale, dict }: Props) {
  const f = dict.fabricsPage;
  return (
    <>
      <PageHero {...f.hero} crumbs={crumbs(locale, dict, dict.common.nav.fabrics, 'fabrics', { label: dict.common.nav.products, slug: 'products' })} />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {f.types.map((t) => (
            <Card key={t.title}>
              <IconBadge>
                <IconFabric />
              </IconBadge>
              <h2 className="mt-6 text-[22px] font-semibold text-navy">{t.title}</h2>
              <p className="mt-3 leading-relaxed text-slate">{t.text}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section tone="sand">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle title={f.specTitle} />
            <p className="mt-6 max-w-xl leading-relaxed text-slate">{f.note}</p>
          </div>
          <div className="rounded-lg border border-line bg-white p-8">
            <CheckList items={f.spec} className="text-[16px] text-charcoal" />
            <Link href={href(locale, 'request-a-quote', 'product=fabrics')} className="btn-primary mt-8">
              {dict.common.cta.inquire}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

/* --------------------------------- Sourcing ------------------------------- */
export function SourcingView({ locale, dict }: Props) {
  const s = dict.sourcingPage;
  return (
    <>
      <PageHero {...s.hero} crumbs={crumbs(locale, dict, dict.common.nav.sourcing, 'trading-sourcing')} />
      <Section>
        <SectionTitle title={s.servicesTitle} />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {s.services.map((svc, i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            return (
              <Card key={svc.title}>
                <IconBadge>
                  <Icon />
                </IconBadge>
                <h3 className="mt-6 text-[19px] font-semibold text-navy">{svc.title}</h3>
                <p className="mt-3 leading-relaxed text-slate">{svc.text}</p>
              </Card>
            );
          })}
        </div>
      </Section>
      <Section tone="mist">
        <SectionTitle title={s.processTitle} />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
          <span aria-hidden="true" className="absolute inset-x-0 top-6 hidden h-px bg-navy/15 md:block" />
          {s.process.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-navy/15 bg-white font-display text-[18px] text-copper">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[17px] font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

/* --------------------------------- Markets -------------------------------- */
function RouteArt() {
  return (
    <svg viewBox="0 0 520 300" className="h-auto w-full" aria-hidden="true" direction="ltr">
      <rect width="520" height="300" rx="12" fill="#14243b" />
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`h${i}`} x1="0" x2="520" y1={i * 25} y2={i * 25} stroke="#fff" strokeOpacity=".05" />
      ))}
      {Array.from({ length: 21 }, (_, i) => (
        <line key={`v${i}`} y1="0" y2="300" x1={i * 26} x2={i * 26} stroke="#fff" strokeOpacity=".05" />
      ))}
      <path d="M92 150 C 200 60, 330 70, 420 168" fill="none" stroke="#c08560" strokeWidth="2" strokeDasharray="6 6" />
      <circle cx="92" cy="150" r="7" fill="#fff" />
      <circle cx="92" cy="150" r="16" fill="none" stroke="#fff" strokeOpacity=".3" />
      <circle cx="420" cy="168" r="7" fill="#c08560" />
      <circle cx="420" cy="168" r="16" fill="none" stroke="#c08560" strokeOpacity=".4" />
      <text x="92" y="190" fill="#fff" fontSize="15" textAnchor="middle" fontFamily="Inter Variable, sans-serif">Porto</text>
      <text x="420" y="208" fill="#fff" fontSize="15" textAnchor="middle" fontFamily="Inter Variable, sans-serif">Türkiye</text>
    </svg>
  );
}

export function MarketsView({ locale, dict }: Props) {
  const m = dict.marketsPage;
  return (
    <>
      <PageHero {...m.hero} crumbs={crumbs(locale, dict, dict.common.nav.markets, 'global-markets')} />
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-8 sm:grid-cols-2">
            {m.regions.map((r) => (
              <div key={r.title}>
                <IconGlobe className="text-copper" />
                <h2 className="mt-4 text-[18px] font-semibold text-navy">{r.title}</h2>
                <p className="mt-2 leading-relaxed text-slate">{r.text}</p>
              </div>
            ))}
          </div>
          <RouteArt />
        </div>
      </Section>
      <Section tone="sand">
        <div className="max-w-3xl">
          <SectionTitle title={m.termsTitle} />
          <p className="mt-5 text-[17px] leading-relaxed text-charcoal">{m.terms}</p>
        </div>
      </Section>
      <CtaBand locale={locale} dict={dict} />
    </>
  );
}

/* --------------------------------- Partners ------------------------------- */
export function PartnersView({ locale, dict }: Props) {
  const p = dict.partnersPage;
  return (
    <>
      <PageHero {...p.hero} crumbs={crumbs(locale, dict, dict.common.nav.partners, 'suppliers-partners')} />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-[22px] font-semibold text-navy">{p.suppliersTitle}</h2>
            <p className="mt-3 leading-relaxed text-slate">{p.suppliersText}</p>
            <CheckList items={p.lookFor} className="mt-6 text-[15px] text-charcoal" />
          </Card>
          <Card>
            <h2 className="text-[22px] font-semibold text-navy">{p.partnersTitle}</h2>
            <p className="mt-3 leading-relaxed text-slate">{p.partnersText}</p>
            <p className="mt-6 rounded-md bg-mist p-4 text-[14px] leading-relaxed text-charcoal">{p.privacyNote}</p>
          </Card>
        </div>
      </Section>
      <Section tone="mist" id="form">
        <div className="mx-auto max-w-3xl rounded-lg border border-line bg-white p-8 md:p-10">
          <h2 className="display text-[28px] text-navy">{p.formTitle}</h2>
          <div className="mt-8">
            <InquiryForm kind="partner" locale={locale} dict={dict} />
          </div>
        </div>
      </Section>
    </>
  );
}

/* ---------------------------------- Quote --------------------------------- */
export function QuoteView({ locale, dict }: Props) {
  const q = dict.quotePage;
  return (
    <>
      <PageHero {...q.hero} crumbs={crumbs(locale, dict, dict.common.nav.quote, 'request-a-quote')} />
      <Section tone="mist">
        <div className="grid items-start gap-10 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-lg border border-line bg-white p-7 md:p-10">
            <InquiryForm kind="quote" locale={locale} dict={dict} />
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-lg bg-navy p-8 text-white">
              <h2 className="text-[18px] font-semibold">{q.asideTitle}</h2>
              <ol className="mt-5 space-y-4">
                {q.aside.map((s, i) => (
                  <li key={s} className="flex gap-3 text-[15px] leading-relaxed text-white/80">
                    <span className="font-display text-copper-300">{i + 1}.</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-lg border border-line bg-white p-8">
              <h2 className="text-[16px] font-semibold text-navy">{dict.yarnsPage.checklistTitle}</h2>
              <CheckList items={dict.yarnsPage.checklist} className="mt-4 text-[14px] text-charcoal" />
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

/* --------------------------------- Contact -------------------------------- */
export function ContactView({ locale, dict }: Props) {
  const c = dict.contactPage;
  return (
    <>
      <PageHero {...c.hero} crumbs={crumbs(locale, dict, dict.common.nav.contact, 'contact')} />
      <Section tone="mist">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-5">
            <div className="rounded-lg border border-line bg-white p-7">
              <IconPin className="text-copper" />
              <h2 className="mt-4 text-[17px] font-semibold text-navy">{c.officeTitle}</h2>
              <address className="mt-2 not-italic leading-relaxed text-charcoal" dir="ltr">
                {site.legalName}
                <br />
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}
                <br />
                {site.address.country}
              </address>
            </div>
            <div className="rounded-lg border border-line bg-white p-7">
              <IconMail className="text-copper" />
              <h2 className="mt-4 text-[17px] font-semibold text-navy">{c.emailTitle}</h2>
              <a href={`mailto:${site.email}`} className="mt-2 inline-block text-navy underline decoration-copper/50 underline-offset-4" dir="ltr">
                {site.email}
              </a>
            </div>
            {site.whatsapp && (
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn border border-[#25D366] text-[#128C7E]">
                <IconWhatsApp width={20} height={20} /> {dict.common.cta.whatsapp}
              </a>
            )}
          </div>
          <div className="rounded-lg border border-line bg-white p-7 md:p-10">
            <h2 className="display text-[28px] text-navy">{c.formTitle}</h2>
            <div className="mt-8">
              <InquiryForm kind="contact" locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------ Company profile --------------------------- */
export function ProfileView({ locale, dict }: Props) {
  const p = dict.profilePage;
  const pdf = asset(`/downloads/snturco-company-profile-${locale}.pdf`);
  return (
    <>
      <div className="no-print">
        <PageHero {...p.hero} crumbs={crumbs(locale, dict, dict.common.nav.profile, 'company-profile')}>
          <a href={pdf} download className="btn-copper">
            <IconDocument width={20} height={20} /> {dict.common.cta.download}
          </a>
        </PageHero>
      </div>
      <section className="bg-mist py-16 print:bg-white print:py-0">
        <div className="container">
          <article id="profile-sheet" className="mx-auto max-w-[820px] rounded-lg border border-line bg-white p-10 md:p-14 print:max-w-none print:rounded-none print:border-0 print:p-0">
            <header className="flex items-center justify-between border-b border-line pb-8">
              <div className="flex items-center gap-4" dir="ltr">
                <LogoMark size={52} />
                <div>
                  <p className="text-[24px] font-semibold tracking-brand text-navy">SNTURCO</p>
                  <p lang="en" className="mt-1 text-[12px] uppercase tracking-[0.16em] text-slate">Textile trading &amp; sourcing</p>
                </div>
              </div>
              <p className="eyebrow hidden text-copper sm:block">{p.hero.eyebrow}</p>
            </header>
            <div className="mt-8 grid gap-8">
              <section>
                <h2 className="eyebrow text-copper">{p.sections.company}</h2>
                <p className="mt-3 text-[16px] leading-relaxed text-charcoal">{p.companyText}</p>
                <p className="mt-3 text-[16px] leading-relaxed text-charcoal">{dict.home.intro}</p>
              </section>
              <section>
                <h2 className="eyebrow text-copper">{p.sections.products}</h2>
                <ul className="mt-3 grid gap-x-8 gap-y-2 text-[15px] text-charcoal sm:grid-cols-2">
                  {dict.yarnsPage.categories.map((c) => (
                    <li key={c.key}>
                      <strong className="font-semibold text-navy">{c.title}</strong> – {c.text.split('. ')[0].replace(/\.$/, '')}
                    </li>
                  ))}
                  <li>
                    <strong className="font-semibold text-navy">{dict.products.fabrics}</strong> – {dict.fabricsPage.types.map((t) => t.title).join(', ')}
                  </li>
                  <li>
                    <strong className="font-semibold text-navy">{dict.products.rawMaterials}</strong>
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="eyebrow text-copper">{p.sections.services}</h2>
                <ul className="mt-3 grid gap-x-8 gap-y-2 text-[15px] text-charcoal sm:grid-cols-2">
                  {dict.sourcingPage.services.map((s) => (
                    <li key={s.title}>• {s.title}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="eyebrow text-copper">{p.sections.how}</h2>
                <ol className="mt-3 grid gap-4 sm:grid-cols-3">
                  {dict.home.how.map((h, i) => (
                    <li key={h.title} className="text-[14px] leading-relaxed text-charcoal">
                      <strong className="block text-navy">
                        {i + 1}. {h.title}
                      </strong>
                      {h.text}
                    </li>
                  ))}
                </ol>
              </section>
              <section className="rounded-md bg-navy p-6 text-white">
                <h2 className="eyebrow text-copper-300">{p.sections.contact}</h2>
                <div className="mt-3 grid gap-4 text-[14px] sm:grid-cols-2" dir="ltr">
                  <p className="leading-relaxed text-white/85">
                    {site.legalName}
                    <br />
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}, {site.address.country}
                  </p>
                  <p className="leading-relaxed text-white/85">
                    {site.email}
                    <br />
                    {site.url.replace(/^https?:\/\//, '')}
                    {site.phone && (
                      <>
                        <br />
                        {site.phone}
                      </>
                    )}
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

/* --------------------------------- Privacy -------------------------------- */
export function PrivacyView({ locale, dict }: Props) {
  const p = dict.privacyPage;
  return (
    <>
      <PageHero {...p.hero} crumbs={crumbs(locale, dict, dict.common.nav.privacy, 'privacy')} />
      <Section>
        <div className="max-w-3xl space-y-10">
          {p.sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-[20px] font-semibold text-navy">{s.title}</h2>
              <p className="mt-3 leading-relaxed text-charcoal">{s.text}</p>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
