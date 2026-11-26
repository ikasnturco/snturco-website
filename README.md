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

### Connecting snturco.com (later, after approval)

1. Repository → Settings → Pages → Custom domain: `www.snturco.com`.
2. Add a repository variable `SITE_URL` = `https://www.snturco.com` and re-run the deploy.
3. DNS (Google Workspace / Squarespace Domains): add **one** record
   `CNAME  www  →  <user>.github.io`.
   Optionally redirect the bare domain `snturco.com` to `www` with the registrar's forwarding feature,
   or add GitHub's four `A` records for `@` (185.199.108.153, .109.153, .110.153, .111.153).
   **Do not change MX, SPF, DKIM or nameserver records** — they carry the company email.
4. When the certificate is ready, tick "Enforce HTTPS".
