# SNTURCO website

Corporate website of **SNTURCO, LDA.** (Porto, Portugal): textile trading and yarn sourcing from Türkiye.

- Next.js 15 (static export), React 19, TypeScript, Tailwind CSS 3
- 4 languages: English (default), Turkish, Russian, Arabic (right-to-left)
- 12 pages per language: Home, About Us, Products, Yarn Categories, Textile Fabrics, Trading & Sourcing, Global Markets, Suppliers & Partners, Request a Quote, Contact, Company Profile, Privacy
- No server, no database, no paid service. Hosted free on GitHub Pages.

## Where to change things

| What | File |
| --- | --- |
| Email, address, phone, WhatsApp, LinkedIn | `src/config/site.ts` (empty values are hidden on the site) |
| All texts | `src/i18n/dictionaries/en.ts`, `tr.ts`, `ru.ts`, `ar.ts` (same structure in each) |
| Colours and fonts | `tailwind.config.ts`, `src/app/globals.css` |
| Logo | `src/components/Logo.tsx`; image versions in `public/brand/` |
| Pages | `src/views/Home.tsx`, `src/views/Pages.tsx`; routes in `src/app/[locale]/[slug]/page.tsx` |

After changing texts, regenerate the company profile PDFs so they match:

```bash
npm ci
npm run build && npm run assets && npm run build
```

(`npm run assets` needs Playwright: `npm i -D playwright && npx playwright install chromium` if it is not installed.)

## Local preview

```bash
npm ci
npm run dev          # http://localhost:3000/en/
npm run build        # static site in ./out
npm run check        # crawls ./out: broken links and console errors
```

## Forms

Static hosting has no server, so forms work in one of two ways:

1. **Default (no setup):** the form validates the input, then opens the visitor's email program with the message
   addressed to the company email. The page says clearly that the message is sent only when they press send there.
2. **Direct sending (free):** create a free form endpoint, for example at Web3Forms (access key sent to your email,
   free tier) or Formspree (free tier). Then add these GitHub repository variables
   (Settings → Secrets and variables → Actions → Variables) and re-run the deploy:
   - `FORM_ENDPOINT`: e.g. `https://api.web3forms.com/submit`
   - `FORM_ACCESS_KEY`: the Web3Forms access key (public by design, it can only send to your inbox)

   The form only shows "sent" when the service confirms it.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Repository → Settings → Pages → Source: **GitHub Actions**.
2. Push to `main`. The site appears at `https://<user>.github.io/<repo>/`.

### Custom domain snturco.com

The Pages custom domain is `snturco.com`. Canonical URLs use `https://snturco.com`
(override with a repository variable `SITE_URL`). DNS at the registrar (Squarespace Domains, managed through Google Workspace):

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | ikasnturco.github.io |

Remove any other A/AAAA records on `@` (old Squarespace site). **Do not change MX, SPF (TXT), DKIM (TXT) or nameserver records** — they carry the company email.
When GitHub shows the certificate is ready, tick "Enforce HTTPS" in Settings → Pages.
