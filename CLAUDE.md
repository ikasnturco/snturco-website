# Working rules for this repository

- **Shipments:** change `src/data/shipments.json` only with `npm run shipment:add` / `shipment:status`
  (see `SHIPMENTS.md`), and only when İbrahim gives a real order or shipment update
  ("1 konteyner ekle", "2 konteyner ekle", "SHP-… teslim edildi"). Never change shipment data for design,
  text or code requests. Confirm the order reference, container count, date and status before adding.
  Use internal references only; this repository is public.
- No invented numbers, certificates, customers, references, prices or lead times on the site.
- No phone number on the site. Do not publish supplier or customer names.
- Partners come only from `src/data/partners.ts`; J. R. GOMES and FILHOS, LDA are two separate companies;
  only FILHOS, LDA shows an address ("4100-065 Porto, Portugal").
- English and Turkish must stay complete; other languages may fall back to English.
- Before merging to `main`: `npm run typecheck && npm run build && npm run check`.
