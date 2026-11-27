# Working rules for this repository

- **Shipments:** change `src/data/shipments.json` only with `npm run shipment:add` / `shipment:status`
  (see `SHIPMENTS.md`), and only when İbrahim gives a real order or shipment update
  ("1 konteyner ekle", "2 konteyner ekle", "SHP-… teslim edildi"). Never change shipment data for design,
  text or code requests. Confirm the order reference, container count, date and status before adding.
  Use internal references only; this repository is public.
- No invented numbers, certificates, customers, references, prices or lead times on the site.
- Phones shown on the site (İbrahim, 26 Nov 2026): +49 162 564 1453 and +90 535 701 4603, as `tel:` links;
  WhatsApp is +49 162 564 1453. Location everywhere is "Porto, Portugal" only: no street, building or postal code.
  Do not publish supplier or customer names.
- Partners come only from `src/data/partners.ts`; J. R. GOMES and FILHOS, LDA are two separate companies;
  only FILHOS, LDA shows a location ("Porto, Portugal").
- All 7 languages must stay complete (`npm run typecheck` checks interface and content texts).
- Forms send through Web3Forms only; never a mailto hand-off and never a success message without confirmation.
- Palette: Anthracite #202124, Off-White #F1EEE9, Champagne #C6A98E, Taupe #B8AAA0, Grey #858B91.
- Before merging to `main`: `npm run typecheck && npm run build && npm run check`.
