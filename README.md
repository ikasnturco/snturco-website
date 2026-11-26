# SNTURCO website

Corporate website of **SNTURCO, LDA.** (Porto, Portugal): yarn sourcing and trading from Türkiye.

- Next.js 15 (static export), React 19, TypeScript, Tailwind CSS 3, Three.js, GSAP ScrollTrigger
- Languages: **English and Turkish complete**; German, Portuguese, Italian, Russian and Arabic (RTL) have translated
  menus, buttons, forms and home page headings, and show the English text for product content with a small note.
- No server, no database, no paid service. Hosted free on GitHub Pages.

## 1. Run the project

```bash
npm ci
npm run dev          # http://localhost:3000/en/
npm run build        # static site in ./out (runs the shipment data check first)
npm run check        # crawls ./out: broken links and console errors
npm run typecheck
```

## Where things live

| What | File |
| --- | --- |
| Email, address, social links | `src/config/site.ts` (empty values are hidden; no phone is shown) |
| Interface texts | `src/locales/en.ts`, `tr.ts` (complete); `de/pt/it/ru/ar.ts` (partial, English fallback) |
| Yarns (14) | `src/data/products.ts` |
| Cotton collection (9) | `src/data/cotton.ts` |
| Textile knowledge (12 topics) | `src/data/knowledge.ts`, diagrams in `src/components/knowledge/Diagram.tsx` |
| Partners | `src/data/partners.ts` |
| Shipments (container counter) | `src/data/shipments.json`, only via the scripts, see `SHIPMENTS.md` |
| Pages | `src/views/*.tsx`; routes in `src/app/[locale]/` |
| 3D scenes | `src/components/3d/` (yarn engine, hero, story, container yard) |
| Colours and fonts | `tailwind.config.ts`, `src/app/globals.css` |

## 2. Add a product

1. Add an entry to `src/data/products.ts` (copy an existing one; every text has `en` and `tr`).
   Fields: slug, name, category (`natural` / `synthetic` / `regenerated`), tagline, intro, source, structure,
   classification, properties, texture, advantages, uses, products, care, related, compare levels (1–5).
2. Images go in `public/images/yarns/<slug>/`: `macro.webp`, `cone.webp`, `fibres.webp` (1600×1200) and
   `-800.webp` versions. Real photos can replace the renders with the same file names.
   Or render them: add a look in `src/components/3d/looks.ts` and run `npm run render -- products <slug>`.
3. The product page, filters, search, comparison, quote form option and sitemap update automatically.

A cotton variety works the same way in `src/data/cotton.ts` and `public/images/cotton/<slug>/`.

## 3. Update partners

Edit `src/data/partners.ts`. Each partner is a separate entry: `name`, `country`, optional `address`,
`description`, optional `logo` (file in `public/images/partners/`) and optional `website`. Empty fields are hidden.
Use only real, approved information.

## 4–5. Record containers and increase the counters

See **`SHIPMENTS.md`**. In short: `npm run shipment:add -- --order <ref> --containers 2 --date 2026-12-10`.
The counters and the 3D container yard update on the next deploy. Nothing else changes the numbers.
While there are no records, the home page shows a clearly labelled demo scene and no numbers.

## 6. Adding an admin panel later

The site reads everything from typed data files, so a CMS can replace them without touching the pages:

- **Git-based CMS (free, simplest):** Decap CMS or TinaCMS edit the same files in `src/data/` through a login page
  and commit to GitHub; the deploy runs automatically. Convert the `.ts` data to JSON first.
- **Headless CMS:** Sanity, Strapi or Directus. Replace the exports in `src/data/*.ts` with a fetch at build time
  and trigger a rebuild (webhook) when content changes.
- **Shipments:** keep the add/verify rules of `scripts/shipments.mjs` (no duplicates, history log, only verified
  delivered/completed records count) in whatever admin replaces it. Never put admin actions in the public frontend.

## 3D images and animation

All yarn images, the hero poster and the scroll story frames are **original procedural 3D renders**
(`scripts/render/`): a fibre-level yarn model rendered offline in headless Chromium.

```bash
npm run render -- products [filter]   # 14 yarns × 3 images
npm run render -- cotton [filter]     # 9 cottons × 2 images
npm run render -- story desktop|mobile
npm run render -- hero
```

The hero and the container yard also run live in WebGL; without WebGL or with reduced motion the site shows
still images instead.

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
