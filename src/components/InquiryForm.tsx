'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { site } from '@/config/site';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

type Kind = 'quote' | 'contact' | 'partner';
type FieldType = 'text' | 'email' | 'url' | 'textarea' | 'select';
type Field = { name: string; label: string; type: FieldType; required?: boolean; hint?: string; options?: { value: string; label: string }[]; wide?: boolean; autoComplete?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function fieldsFor(kind: Kind, dict: Dictionary): Field[] {
  const f = dict.form.fields;
  const p = dict.products;
  const productOptions = (Object.keys(p) as (keyof typeof p)[]).map((k) => ({ value: k, label: p[k] }));
  const pt = dict.form.partnerTypes;
  const partnerOptions = (Object.keys(pt) as (keyof typeof pt)[]).map((k) => ({ value: k, label: pt[k] }));

  const name: Field = { name: 'name', label: f.name, type: 'text', required: true, autoComplete: 'name' };
  const company = (required: boolean): Field => ({ name: 'company', label: f.company, type: 'text', required, autoComplete: 'organization' });
  const email: Field = { name: 'email', label: f.email, type: 'email', required: true, autoComplete: 'email' };
  const country: Field = { name: 'country', label: f.country, type: 'text', required: true, autoComplete: 'country-name' };

  if (kind === 'quote')
    return [
      name,
      company(true),
      email,
      country,
      { name: 'product', label: f.product, type: 'select', required: true, options: productOptions },
      { name: 'quantity', label: f.quantity, type: 'text', required: true, hint: f.quantityHint },
      { name: 'spec', label: f.spec, type: 'text', hint: f.specHint, wide: true },
      { name: 'destination', label: f.destination, type: 'text' },
      { name: 'timing', label: f.timing, type: 'text' },
      { name: 'message', label: f.message, type: 'textarea', required: true, wide: true },
    ];
  if (kind === 'partner')
    return [
      name,
      company(true),
      email,
      country,
      { name: 'partnerType', label: f.partnerType, type: 'select', required: true, options: partnerOptions },
      { name: 'website', label: f.website, type: 'url', autoComplete: 'url' },
      { name: 'message', label: f.messageGeneral, type: 'textarea', required: true, wide: true },
    ];
  return [name, email, company(false), { ...country, required: false }, { name: 'message', label: f.messageGeneral, type: 'textarea', required: true, wide: true }];
}

type Status = { state: 'idle' } | { state: 'sending' } | { state: 'sent' } | { state: 'mailto' } | { state: 'error' };

export function InquiryForm({ kind, locale, dict, idPrefix = kind }: { kind: Kind; locale: Locale; dict: Dictionary; idPrefix?: string }) {
  const t = dict.form;
  const fields = fieldsFor(kind, dict);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ state: 'idle' });
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const usesEndpoint = Boolean(site.formEndpoint);

  // Pre-select a product when arriving from a "Request this yarn" link (?product=cotton).
  useEffect(() => {
    if (kind !== 'quote') return;
    const product = new URLSearchParams(window.location.search).get('product');
    if (product && product in dict.products) setValues((v) => ({ ...v, product }));
  }, [kind, dict.products]);

  useEffect(() => {
    if (status.state !== 'idle' && status.state !== 'sending') statusRef.current?.focus();
  }, [status.state]);

  function validate() {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const v = (values[field.name] || '').trim();
      if (field.required && !v) next[field.name] = t.errors.required;
      else if (field.type === 'email' && v && !EMAIL_RE.test(v)) next[field.name] = t.errors.email;
    }
    if (!consent) next.consent = t.errors.consent;
    return next;
  }

  function summaryText() {
    const lines = fields
      .filter((f) => (values[f.name] || '').trim())
      .map((f) => {
        const raw = values[f.name].trim();
        const shown = f.options?.find((o) => o.value === raw)?.label ?? raw;
        return f.type === 'textarea' ? `\n${f.label}:\n${shown}` : `${f.label}: ${shown}`;
      });
    return lines.join('\n');
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get('company_website')) return; // honeypot: ignore automated submissions

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const subject = `${t.subjects[kind]} – ${values.company || values.name} (SNTURCO website)`;

    if (!usesEndpoint) {
      const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summaryText())}`;
      window.location.href = mailto;
      setStatus({ state: 'mailto' });
      return;
    }

    setStatus({ state: 'sending' });
    try {
      const payload: Record<string, string> = { subject, form: kind, language: locale, ...values, consent: 'yes' };
      if (site.formAccessKey) {
        payload.access_key = site.formAccessKey;
        payload.from_name = 'SNTURCO website';
      }
      if (values.email) payload.replyto = values.email;
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean; ok?: boolean };
      if (!res.ok || json.success === false || json.ok === false) throw new Error(`HTTP ${res.status}`);
      setStatus({ state: 'sent' });
      setValues({});
      setConsent(false);
    } catch {
      setStatus({ state: 'error' });
    }
  }

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  if (status.state === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-lg border border-emerald-700/20 bg-emerald-50 p-6 text-emerald-900 outline-none">
        {t.success}
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);
  const inputCls = (name: string) =>
    `mt-2 block w-full rounded-md border bg-white px-3.5 py-3 text-[15px] text-charcoal outline-none transition placeholder:text-slate/60 focus:border-navy focus:ring-2 focus:ring-navy/15 ${
      errors[name] ? 'border-red-600' : 'border-line'
    }`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" aria-describedby={hasErrors ? `${idPrefix}-summary` : undefined}>
      {hasErrors && (
        <p id={`${idPrefix}-summary`} role="alert" className="rounded-md bg-red-50 px-4 py-3 text-[14px] text-red-800 sm:col-span-2">
          {t.errors.summary}
        </p>
      )}
      {fields.map((field) => {
        const id = `${idPrefix}-${field.name}`;
        const err = errors[field.name];
        const describedBy = [field.hint ? `${id}-hint` : '', err ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined;
        const common = {
          id,
          name: field.name,
          value: values[field.name] || '',
          'aria-invalid': err ? true : undefined,
          'aria-describedby': describedBy,
          'aria-required': field.required || undefined,
          className: inputCls(field.name),
        };
        return (
          <div key={field.name} className={field.wide ? 'sm:col-span-2' : ''}>
            <label htmlFor={id} className="text-[14px] font-medium text-navy">
              {field.label}
              {field.required ? (
                <span className="text-copper" aria-hidden="true">
                  {' '}
                  *
                </span>
              ) : (
                <span className="font-normal text-slate"> ({t.optional})</span>
              )}
            </label>
            {field.type === 'textarea' ? (
              <textarea {...common} rows={6} maxLength={5000} onChange={(e) => set(field.name, e.target.value)} />
            ) : field.type === 'select' ? (
              <select {...common} onChange={(e) => set(field.name, e.target.value)}>
                <option value="">{t.select}</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...common}
                type={field.type}
                maxLength={200}
                autoComplete={field.autoComplete}
                dir={field.type === 'email' || field.type === 'url' ? 'ltr' : undefined}
                onChange={(e) => set(field.name, e.target.value)}
              />
            )}
            {field.hint && (
              <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-slate">
                {field.hint}
              </p>
            )}
            {err && (
              <p id={`${id}-err`} className="mt-1.5 text-[13px] text-red-700">
                {err}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot: hidden from people, often filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${idPrefix}-hp`}>Company website</label>
        <input id={`${idPrefix}-hp`} name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-charcoal">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (errors.consent) setErrors((er) => ({ ...er, consent: '' }));
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${idPrefix}-consent-err` : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-navy"
          />
          <span>
            {t.fields.consent}{' '}
            (
            <Link href={href(locale, 'privacy')} className="underline underline-offset-2">
              {dict.privacyPage.hero.title}
            </Link>
            )
          </span>
        </label>
        {errors.consent && (
          <p id={`${idPrefix}-consent-err`} className="mt-1.5 text-[13px] text-red-700">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2">
        <div>
          <button type="submit" className="btn-primary" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? t.sending : usesEndpoint ? t.submit : t.submitEmail}
          </button>
        </div>
        {!usesEndpoint && <p className="text-[13px] text-slate">{t.emailFallbackNote}</p>}
        <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
          {status.state === 'mailto' && (
            <p className="rounded-md border border-line bg-mist px-4 py-3 text-[14px] text-charcoal">
              {t.emailOpened}{' '}
              <a href={`mailto:${site.email}`} className="font-medium text-navy underline" dir="ltr">
                {site.email}
              </a>
            </p>
          )}
          {status.state === 'error' && (
            <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-[14px] text-red-800">
              {t.errors.network}{' '}
              <a href={`mailto:${site.email}`} className="font-medium underline" dir="ltr">
                {site.email}
              </a>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
