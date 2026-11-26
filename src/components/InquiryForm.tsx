'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { site } from '@/config/site';
import { href, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/locales';

/**
 * Quote and contact form. Sends a real email to site.email through Web3Forms (server-side delivery,
 * server-side validation and spam filtering by Web3Forms).
 * - Success is shown only when the service confirms delivery (HTTP 200 and success: true).
 * - Without an access key it shows a clear "temporarily unavailable" message, never a fake success.
 * - Spam: hidden botcheck honeypot (checked by Web3Forms) and a minimum fill time.
 * - Duplicates: the button is locked while sending, and an identical message cannot be sent twice in the same session.
 */
type Kind = 'quote' | 'contact';
type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select';
export type YarnGroup = { label: string; options: { value: string; label: string }[] };
type Field = { name: string; label: string; type: FieldType; required?: boolean; hint?: string; wide?: boolean; autoComplete?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()./-]{6,20}$/;

function fieldsFor(kind: Kind, t: Dictionary['form']): Field[] {
  const f = t.fields;
  const head: Field[] = [
    { name: 'firstName', label: f.firstName, type: 'text', required: true, autoComplete: 'given-name' },
    { name: 'lastName', label: f.lastName, type: 'text', required: true, autoComplete: 'family-name' },
    { name: 'company', label: f.company, type: 'text', required: kind === 'quote', autoComplete: 'organization' },
    { name: 'country', label: f.country, type: 'text', required: true, autoComplete: 'country-name' },
    { name: 'email', label: f.email, type: 'email', required: true, autoComplete: 'email' },
  ];
  if (kind === 'quote')
    return [
      ...head,
      { name: 'phone', label: f.phone, type: 'tel', autoComplete: 'tel' },
      { name: 'yarn', label: f.yarn, type: 'select', required: true },
      { name: 'quantity', label: f.quantity, type: 'text', required: true, hint: f.quantityHint },
      { name: 'message', label: f.message, type: 'textarea', required: true, wide: true, hint: f.messageHint },
    ];
  return [...head, { name: 'subject', label: f.subject, type: 'text', required: true }, { name: 'message', label: f.message, type: 'textarea', required: true, wide: true }];
}

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'duplicate' | 'config';

const SENT_KEY = 'snturco-form-sent';
function fingerprint(v: Record<string, string>) {
  const text = Object.keys(v).sort().map((k) => `${k}=${(v[k] || '').trim().toLowerCase()}`).join('&');
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return String(h >>> 0);
}
function sentBefore(fp: string) {
  try {
    return (JSON.parse(sessionStorage.getItem(SENT_KEY) || '[]') as string[]).includes(fp);
  } catch {
    return false;
  }
}
function rememberSent(fp: string) {
  try {
    const list = JSON.parse(sessionStorage.getItem(SENT_KEY) || '[]') as string[];
    sessionStorage.setItem(SENT_KEY, JSON.stringify([...list, fp].slice(-20)));
  } catch {
    /* storage unavailable: the locked button still prevents double clicks */
  }
}

export function InquiryForm({ kind, locale, t, privacyLabel, yarnGroups = [] }: { kind: Kind; locale: Locale; t: Dictionary['form']; privacyLabel: string; yarnGroups?: YarnGroup[] }) {
  const fields = fieldsFor(kind, t);
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const configured = Boolean(site.formEndpoint && site.formAccessKey);
  const startedAt = useRef(Date.now());
  const sending = useRef(false);
  const idPrefix = kind;
  const allYarns = yarnGroups.flatMap((g) => g.options);

  // ?yarn=cotton preselects the yarn when coming from a product page.
  useEffect(() => {
    if (kind !== 'quote') return;
    const yarn = new URLSearchParams(window.location.search).get('yarn');
    if (yarn && allYarns.some((o) => o.value === yarn)) setValues((v) => ({ ...v, yarn }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  useEffect(() => {
    if (status === 'sent' || status === 'error' || status === 'duplicate' || status === 'config') statusRef.current?.focus();
  }, [status]);

  function validate() {
    const next: Record<string, string> = {};
    for (const field of fields) {
      const v = (values[field.name] || '').trim();
      if (field.required && !v) next[field.name] = t.errors.required;
      else if (field.type === 'email' && v && !EMAIL_RE.test(v)) next[field.name] = t.errors.email;
      else if (field.type === 'tel' && v && !PHONE_RE.test(v)) next[field.name] = t.errors.phone;
    }
    if (!consent) next.consent = t.errors.consent;
    return next;
  }

  const shown = (f: Field) => {
    const raw = (values[f.name] || '').trim();
    return f.type === 'select' ? (allYarns.find((o) => o.value === raw)?.label ?? raw) : raw;
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    const data = new FormData(e.currentTarget);
    const botcheck = Boolean(data.get('botcheck'));

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus('idle');
      formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    if (!configured) {
      setStatus('config');
      return;
    }
    const fp = fingerprint({ kind, ...values });
    if (sentBefore(fp)) {
      setStatus('duplicate');
      return;
    }

    const who = values.company || `${values.firstName} ${values.lastName}`;
    const yarnField = fields.find((f) => f.name === 'yarn');
    const topic = kind === 'quote' && yarnField ? shown(yarnField) : values.subject;
    const subject = `${t.mailSubjects[kind]}: ${topic} – ${who} (snturco.com)`;

    sending.current = true;
    setStatus('sending');
    try {
      const payload: Record<string, string | boolean> = {
        access_key: site.formAccessKey,
        subject,
        from_name: 'SNTURCO website',
        replyto: values.email.trim(),
        form: kind === 'quote' ? 'Quote request' : 'Contact',
        language: locale,
        page: window.location.href,
      };
      for (const f of fields) {
        const v = shown(f);
        if (v) payload[f.label] = v;
      }
      payload.consent = 'yes';
      // Bots usually submit instantly; a human needs a few seconds. Web3Forms rejects messages with botcheck set.
      if (botcheck || Date.now() - startedAt.current < 2500) payload.botcheck = true;
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || json.success !== true) throw new Error(`HTTP ${res.status}`);
      rememberSent(fp);
      setStatus('sent');
      setValues({});
      setConsent(false);
    } catch {
      setStatus('error');
    } finally {
      sending.current = false;
    }
  }

  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  if (status === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-2xl border border-emerald-700/20 bg-emerald-50 p-6 text-emerald-900 outline-none" data-form-status="sent">
        <p className="text-[15.5px] leading-relaxed">{t.success}</p>
        <button
          type="button"
          className="btn-outline mt-5"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus('idle');
          }}
        >
          {t.sendAnother}
        </button>
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean);
  const inputCls = (name: string) =>
    `mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-charcoal outline-none transition placeholder:text-slate/60 focus:border-navy focus:ring-2 focus:ring-navy/15 ${errors[name] ? 'border-red-600' : 'border-line'}`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="relative grid gap-5 sm:grid-cols-2" aria-describedby={hasErrors ? `${idPrefix}-summary` : undefined} data-form={kind}>
      {hasErrors && (
        <p id={`${idPrefix}-summary`} role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-800 sm:col-span-2">
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
                <span className="text-copper-700" aria-hidden="true">
                  {' '}*
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
                {yarnGroups.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <input {...common} type={field.type} maxLength={200} autoComplete={field.autoComplete} dir={field.type === 'email' || field.type === 'tel' ? 'ltr' : undefined} onChange={(e) => set(field.name, e.target.value)} />
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

      {/* Honeypot (Web3Forms botcheck): hidden from people, often ticked by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${idPrefix}-hp`}>Do not tick</label>
        <input id={`${idPrefix}-hp`} type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" />
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
            {t.fields.consent} (
            <Link href={href(locale, 'privacy')} className="underline underline-offset-2">
              {privacyLabel}
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
          <button type="submit" className="btn-primary min-w-[160px]" disabled={status === 'sending'} aria-busy={status === 'sending' || undefined}>
            {status === 'sending' ? t.sending : t.submit}
          </button>
        </div>
        <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
          {(status === 'error' || status === 'config') && (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-800" data-form-status={status}>
              {status === 'config' ? t.errors.config : t.errors.network}{' '}
              <a href={`mailto:${site.email}`} className="font-medium underline" dir="ltr">
                {site.email}
              </a>
            </p>
          )}
          {status === 'duplicate' && (
            <p role="alert" className="rounded-xl border border-line bg-sand px-4 py-3 text-[14px] text-charcoal" data-form-status="duplicate">
              {t.errors.duplicate}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
