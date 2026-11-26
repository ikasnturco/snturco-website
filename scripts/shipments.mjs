#!/usr/bin/env node
/**
 * Shipment records for the container counter on the home page.
 *
 *   npm run shipment:add -- --order SNT-ORD-0001 --containers 2 --date 2026-12-10 --status completed [--size 40ft] [--desc "Cotton yarn"] [--split]
 *   npm run shipment:status -- --id SHP-2026-001 --status delivered
 *   npm run shipment:list
 *   npm run data:check
 *
 * Rules:
 * - Only real, confirmed orders are recorded. Records are never deleted or reset.
 * - Successful = verified + status delivered/completed. Pending and in-transit records are stored but not counted.
 * - The same order reference cannot be added twice by accident: a second shipment for an existing order
 *   needs --split (partial shipment of the same order). An identical record is always refused.
 * - Every change is appended to src/data/shipments-log.json with a timestamp.
 * - The repository is public: use internal references, no customer or supplier names.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA = resolve('src/data/shipments.json');
const LOG = resolve('src/data/shipments-log.json');
const STATUSES = ['pending', 'in_transit', 'delivered', 'completed'];
const SIZES = ['20ft', '40ft', '40ft HC'];

const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const write = (f, v) => writeFileSync(f, JSON.stringify(v, null, 2) + '\n');
const fail = (msg) => {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
};

function args() {
  const out = {};
  const a = process.argv.slice(3);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    const key = a[i].slice(2);
    const next = a[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function totals(list) {
  const ok = list.filter((s) => s.verified && (s.status === 'delivered' || s.status === 'completed'));
  const orders = new Map();
  for (const s of list) orders.set(s.orderRef, [...(orders.get(s.orderRef) || []), s]);
  return {
    successfulShipments: ok.length,
    containersShipped: ok.reduce((n, s) => n + s.containers, 0),
    completedOrders: [...orders.values()].filter((g) => g.every((s) => s.verified && s.status === 'completed')).length,
    pending: list.filter((s) => s.status === 'pending').length,
    inTransit: list.filter((s) => s.status === 'in_transit').length,
    records: list.length,
  };
}

function printTotals(list) {
  const t = totals(list);
  console.log(`  Successful shipments : ${t.successfulShipments}`);
  console.log(`  Containers shipped   : ${t.containersShipped}`);
  console.log(`  Completed orders     : ${t.completedOrders}`);
  console.log(`  Pending / in transit : ${t.pending} / ${t.inTransit}`);
  console.log(`  Records in file      : ${t.records}`);
}

export function check(data, log) {
  const errors = [];
  const ids = new Set();
  const seen = new Set();
  if (!Array.isArray(data.shipments)) errors.push('shipments must be an array');
  for (const s of data.shipments || []) {
    const where = s.id || JSON.stringify(s);
    if (!/^SHP-\d{4}-\d{3,}$/.test(s.id || '')) errors.push(`${where}: id must look like SHP-2026-001`);
    if (ids.has(s.id)) errors.push(`${where}: duplicate id`);
    ids.add(s.id);
    if (!s.orderRef || typeof s.orderRef !== 'string') errors.push(`${where}: orderRef missing`);
    if (!Number.isInteger(s.containers) || s.containers < 1) errors.push(`${where}: containers must be a whole number ≥ 1`);
    if (s.containerSize && !SIZES.includes(s.containerSize)) errors.push(`${where}: containerSize must be one of ${SIZES.join(', ')}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date || '') || Number.isNaN(Date.parse(s.date))) errors.push(`${where}: date must be YYYY-MM-DD`);
    if (!STATUSES.includes(s.status)) errors.push(`${where}: status must be one of ${STATUSES.join(', ')}`);
    if (typeof s.verified !== 'boolean') errors.push(`${where}: verified must be true or false`);
    const sig = `${s.orderRef}|${s.date}|${s.containers}|${s.containerSize || ''}`;
    if (seen.has(sig)) errors.push(`${where}: same order, date and containers as another record (double count?)`);
    seen.add(sig);
    if (log && !log.entries.some((e) => e.action === 'add' && e.id === s.id)) errors.push(`${where}: no "add" entry in shipments-log.json`);
  }
  return errors;
}

const cmd = process.argv[2];
const data = read(DATA);
const log = read(LOG);
const o = args();

if (cmd === 'add') {
  if (!o.order || typeof o.order !== 'string') fail('Missing --order <internal order reference>');
  const containers = Number(o.containers);
  if (!Number.isInteger(containers) || containers < 1) fail('--containers must be a whole number ≥ 1 (for example 1 or 2)');
  const status = (o.status || 'completed').replace('-', '_');
  if (!STATUSES.includes(status)) fail(`--status must be one of ${STATUSES.join(', ')}`);
  const date = o.date || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail('--date must be YYYY-MM-DD');
  const size = o.size || '40ft';
  if (!SIZES.includes(size)) fail(`--size must be one of ${SIZES.join(', ')}`);

  const sameOrder = data.shipments.filter((s) => s.orderRef === o.order);
  if (sameOrder.some((s) => s.date === date && s.containers === containers)) fail(`Order ${o.order} with ${containers} container(s) on ${date} is already recorded (${sameOrder.map((s) => s.id).join(', ')}). Nothing added.`);
  if (sameOrder.length && !o.split) fail(`Order ${o.order} already has ${sameOrder.length} shipment(s): ${sameOrder.map((s) => `${s.id} (${s.containers} × ${s.date}, ${s.status})`).join('; ')}.\n  If this is an additional, separate shipment of the same order, run again with --split. To change a status, use shipment:status.`);

  const year = date.slice(0, 4);
  const n = data.shipments.filter((s) => s.id.startsWith(`SHP-${year}-`)).length + 1;
  const id = `SHP-${year}-${String(n).padStart(3, '0')}`;
  const now = new Date().toISOString();
  const rec = { id, orderRef: o.order, containers, containerSize: size, date, status, verified: o.unverified ? false : true, description: typeof o.desc === 'string' ? o.desc : '', addedAt: now };
  const before = totals(data.shipments);
  data.shipments.push(rec);
  const errors = check(data, null);
  if (errors.length) fail(errors.join('\n  '));
  log.entries.push({ at: now, action: 'add', id, orderRef: o.order, containers, status, verified: rec.verified, totalsBefore: before, totalsAfter: totals(data.shipments) });
  write(DATA, data);
  write(LOG, log);
  console.log(`\n✓ Added ${id}: ${containers} × ${size}, order ${o.order}, ${date}, ${status}${rec.verified ? '' : ' (not verified, not counted)'}\n`);
  printTotals(data.shipments);
  console.log('');
} else if (cmd === 'status') {
  if (!o.id) fail('Missing --id SHP-YYYY-NNN');
  if (o.status) o.status = o.status.replace('-', '_');
  if (!STATUSES.includes(o.status)) fail(`--status must be one of ${STATUSES.join(', ')}`);
  const rec = data.shipments.find((s) => s.id === o.id);
  if (!rec) fail(`No shipment ${o.id}`);
  if (rec.status === o.status && !o.verify) fail(`${o.id} is already ${o.status}`);
  const now = new Date().toISOString();
  const before = totals(data.shipments);
  const from = rec.status;
  rec.status = o.status;
  if (o.verify) rec.verified = true;
  log.entries.push({ at: now, action: 'status', id: rec.id, from, to: o.status, verified: rec.verified, totalsBefore: before, totalsAfter: totals(data.shipments) });
  write(DATA, data);
  write(LOG, log);
  console.log(`\n✓ ${rec.id}: ${from} → ${o.status}\n`);
  printTotals(data.shipments);
  console.log('');
} else if (cmd === 'list') {
  if (!data.shipments.length) console.log('\nNo shipment records yet. The home page shows the illustrative demo scene.\n');
  for (const s of data.shipments) console.log(`${s.id}  ${s.date}  ${s.orderRef.padEnd(16)} ${String(s.containers).padStart(2)} × ${(s.containerSize || '40ft').padEnd(7)} ${s.status.padEnd(10)} ${s.verified ? 'verified' : 'NOT verified'}`);
  console.log('');
  printTotals(data.shipments);
  console.log('');
} else if (cmd === 'check') {
  const errors = check(data, log);
  if (errors.length) fail(`shipments.json has problems:\n  ${errors.join('\n  ')}`);
  console.log(`✓ shipments.json OK (${data.shipments.length} records)`);
} else {
  console.log('Usage: node scripts/shipments.mjs add|status|list|check [options]');
  process.exit(1);
}
