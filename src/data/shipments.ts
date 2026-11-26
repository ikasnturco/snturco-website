/**
 * Shipment records → counters and containers on the home page.
 * Only verified shipments with status "delivered" or "completed" count as successful.
 * Data lives in shipments.json and is changed only through scripts/shipments.mjs.
 */
import data from './shipments.json';

export const statuses = ['pending', 'in_transit', 'delivered', 'completed'] as const;
export type ShipmentStatus = (typeof statuses)[number];
export type ContainerSize = '20ft' | '40ft' | '40ft HC';

export type Shipment = {
  id: string;
  orderRef: string;
  containers: number;
  containerSize?: ContainerSize;
  date: string;
  status: ShipmentStatus;
  verified: boolean;
  description?: string;
  addedAt: string;
};

export const shipments = data.shipments as Shipment[];

const successful = (s: Shipment) => s.verified && (s.status === 'delivered' || s.status === 'completed');

export function shipmentTotals(list: Shipment[] = shipments) {
  const ok = list.filter(successful);
  const orders = new Map<string, Shipment[]>();
  for (const s of list) orders.set(s.orderRef, [...(orders.get(s.orderRef) || []), s]);
  const completedOrders = [...orders.values()].filter((group) => group.every((s) => s.verified && s.status === 'completed')).length;
  return {
    successfulShipments: ok.length,
    containersShipped: ok.reduce((n, s) => n + s.containers, 0),
    completedOrders,
    pending: list.filter((s) => s.status === 'pending').length,
    inTransit: list.filter((s) => s.status === 'in_transit').length,
  };
}

/** What the home page receives: no order references or descriptions (they stay out of the public bundle). */
export type PublicContainer = { size: ContainerSize; date: string; isNew: boolean };
export type PublicShipmentData = {
  demo: boolean;
  totals: { successfulShipments: number; containersShipped: number; completedOrders: number };
  containers: PublicContainer[];
  updated: string | null;
};

/** Number of illustrative containers shown while there are no verified records. */
export const DEMO_CONTAINERS = 7;

export function publicShipmentData(): PublicShipmentData {
  const ok = shipments.filter(successful).sort((a, b) => a.date.localeCompare(b.date) || a.addedAt.localeCompare(b.addedAt));
  const totals = shipmentTotals();
  if (!ok.length) {
    const sizes: ContainerSize[] = ['40ft', '20ft', '40ft HC', '40ft', '20ft', '40ft', '40ft HC'];
    return {
      demo: true,
      totals: { successfulShipments: 0, containersShipped: 0, completedOrders: 0 },
      containers: sizes.slice(0, DEMO_CONTAINERS).map((size) => ({ size, date: '', isNew: false })),
      updated: null,
    };
  }
  const lastAdded = ok.reduce((m, s) => (s.addedAt > m ? s.addedAt : m), '');
  const containers: PublicContainer[] = [];
  for (const s of ok) {
    for (let i = 0; i < s.containers; i++) containers.push({ size: s.containerSize || '40ft', date: s.date, isNew: s.addedAt === lastAdded });
  }
  return {
    demo: false,
    totals: { successfulShipments: totals.successfulShipments, containersShipped: totals.containersShipped, completedOrders: totals.completedOrders },
    containers,
    updated: lastAdded.slice(0, 10),
  };
}
