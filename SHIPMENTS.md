# Shipments and the container counter

The home page shows three counters (Total Successful Shipments, Total Containers Shipped, Completed Orders)
and a 3D container yard with one container per shipped container. They are calculated from
`src/data/shipments.json` at build time.

## Rules

1. Only **real, confirmed** orders are recorded. A design, text or code change never changes the numbers.
2. A shipment counts only when it is **verified** and its status is **delivered** or **completed**.
   `pending` and `in_transit` records are stored but not counted.
3. A **completed order** is an order whose shipments are all verified and `completed`.
4. The same order is not added twice: an identical record is refused, and a second shipment of an existing
   order needs `--split` (partial shipment).
5. Records are never deleted. Every change is written to `src/data/shipments-log.json` with the totals before and after.
6. **The repository is public.** Use internal references (for example `SNT-ORD-0001`), never customer names,
   supplier names or customer PO numbers.

## Commands

```bash
# "1 konteyner ekle" for order SNT-ORD-0007, delivered on 10 December 2026:
npm run shipment:add -- --order SNT-ORD-0007 --containers 1 --date 2026-12-10 --status delivered

# "2 konteyner ekle", 40ft high cube, still on the way:
npm run shipment:add -- --order SNT-ORD-0008 --containers 2 --size "40ft HC" --status in_transit

# second shipment of the same order
npm run shipment:add -- --order SNT-ORD-0008 --containers 1 --split --status in_transit

# when it arrives / the order is closed
npm run shipment:status -- --id SHP-2026-002 --status completed

npm run shipment:list    # all records and the totals
npm run data:check       # validation (also runs before every build)
```

Options: `--size 20ft | 40ft | 40ft HC` (default 40ft), `--status pending | in_transit | delivered | completed`
(default completed), `--date YYYY-MM-DD` (default today), `--desc "short description"`, `--unverified`
(stored but not counted until `shipment:status -- --id … --verify`).

Commit both JSON files and push to `main`; the site updates after the deploy (about 2 minutes).
The newest containers are highlighted in the 3D yard.

## Before the first record

While `shipments.json` has no records, the home page shows the container scene without any numbers or
labels (no "demo" text). The first real record switches it to live data and shows the counters.
Only one container in the scene carries the SNTURCO logo; all others are plain.
