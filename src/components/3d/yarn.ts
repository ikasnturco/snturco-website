/**
 * Procedural yarn engine.
 *
 * A yarn is built from individual fibres: each fibre is a thin tube whose centre line follows the
 * yarn path, twisted around it (and around its ply), with staple ends, crimp, slubs and hairiness.
 * The same builder renders the live hero (few, thick "ply" tubes) and the offline frame sequences and
 * product images (hundreds of real fibres).
 */
import * as THREE from 'three';

export type Rng = () => number;

export function rng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 1D value noise, deterministic per seed. */
export function noise1(seed: number) {
  const r = rng(seed);
  const table = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const a = table[i & 255];
    const b = table[(i + 1) & 255];
    const u = f * f * (3 - 2 * f);
    return a + (b - a) * u;
  };
}

export const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Visual character of a fibre type. */
export type FibreLook = {
  color: string;
  /** Random brightness variation between fibres, 0..0.3 */
  jitter: number;
  roughness: number;
  sheen: number;
  clearcoat?: number;
  /** Continuous filament (polyester, silk, nylon) instead of staple fibres. */
  filament: boolean;
  /** Staple length as a multiple of the yarn radius. */
  staple: number;
  /** Hairiness, 0..1 */
  hair: number;
  /** Crimp (waviness), 0..1 */
  crimp: number;
  /** Thick and thin places along the yarn, 0..1 */
  slub: number;
  /** Fibre radius relative to the yarn radius. */
  fibre: number;
  /** Surface twist angle in degrees. */
  twistDeg: number;
  plies: number;
  /** Optional second colour mixed into a share of the fibres (melange). */
  mix?: { color: string; share: number };
};

/** A path the yarn follows. Any THREE.Curve works; the yarn uses its arc length. */
export type YarnSpec = {
  curve: THREE.Curve<THREE.Vector3>;
  radius: number;
  look: FibreLook;
  /** Number of fibre lanes across the yarn. */
  fibres: number;
  seed: number;
  /** 0 = twisted, 1 = fully untwisted (fibres parallel) */
  untwist?: number;
  /** 0 = compact, 1 = fibres pulled apart in different directions */
  spread?: number;
  /** Separate the plies from each other, 0..1 */
  plySplit?: number;
  /** Samples per world unit along the yarn. */
  density?: number;
  radial?: number;
  hairs?: number;
  /** Only build the part of the curve between these arc-length fractions. */
  range?: [number, number];
  /** Fibre radius override in world units. */
  fibreRadius?: number;
  /** Drift fibres along the yarn over time (for spreading animations). */
  time?: number;
};

type Buffers = { pos: number[]; nor: number[]; col: number[]; uv: number[]; idx: number[] };

const _v = new THREE.Vector3();
const _n = new THREE.Vector3();
const _b = new THREE.Vector3();

/** Append a tube around a polyline to the buffers. Radii can vary per point (tapered ends). */
export function addTube(buf: Buffers, pts: THREE.Vector3[], radii: number[], color: THREE.Color, shade: number[], radial: number, uvLen = 1) {
  const n = pts.length;
  if (n < 2) return;
  const base = buf.pos.length / 3;
  // Parallel transport frames
  const tangents: THREE.Vector3[] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    tangents.push(new THREE.Vector3().subVectors(b, a).normalize());
  }
  const normal = new THREE.Vector3();
  const t0 = tangents[0];
  const ax = Math.abs(t0.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  normal.crossVectors(t0, ax).normalize();
  let along = 0;
  for (let i = 0; i < n; i++) {
    if (i > 0) {
      const tPrev = tangents[i - 1];
      const t = tangents[i];
      const axis = _v.crossVectors(tPrev, t);
      const len = axis.length();
      if (len > 1e-6) {
        axis.divideScalar(len);
        const ang = Math.acos(Math.min(1, Math.max(-1, tPrev.dot(t))));
        normal.applyAxisAngle(axis, ang);
      }
      along += pts[i].distanceTo(pts[i - 1]);
    }
    const bin = _b.crossVectors(tangents[i], normal).normalize();
    const nn = _n.crossVectors(bin, tangents[i]).normalize();
    const r = radii[i];
    const s = shade[i];
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const cx = Math.cos(a);
      const sy = Math.sin(a);
      const nx = nn.x * cx + bin.x * sy;
      const ny = nn.y * cx + bin.y * sy;
      const nz = nn.z * cx + bin.z * sy;
      buf.pos.push(pts[i].x + nx * r, pts[i].y + ny * r, pts[i].z + nz * r);
      buf.nor.push(nx, ny, nz);
      buf.col.push(color.r * s, color.g * s, color.b * s);
      buf.uv.push((along / uvLen) , j / radial);
    }
  }
  const row = radial + 1;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < radial; j++) {
      const a = base + i * row + j;
      const b = base + (i + 1) * row + j;
      buf.idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
}

function toGeometry(buf: Buffers) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(buf.pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(buf.nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(buf.col, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(buf.uv, 2));
  g.setIndex(buf.idx.length > 65535 ? new THREE.Uint32BufferAttribute(buf.idx, 1) : new THREE.Uint16BufferAttribute(buf.idx, 1));
  g.computeBoundingSphere();
  return g;
}

/** Sample position + frame along a curve by arc-length fraction. */
function frameSampler(curve: THREE.Curve<THREE.Vector3>, samples: number) {
  const frames = curve.computeFrenetFrames(samples, false);
  return (u: number, outP: THREE.Vector3, outT: THREE.Vector3, outN: THREE.Vector3, outB: THREE.Vector3) => {
    const t = Math.min(0.99999, Math.max(0, u));
    curve.getPointAt(t, outP);
    const f = t * samples;
    const i = Math.floor(f);
    const k = f - i;
    const i2 = Math.min(samples, i + 1);
    outT.copy(frames.tangents[i]).lerp(frames.tangents[i2], k).normalize();
    outN.copy(frames.normals[i]).lerp(frames.normals[i2], k).normalize();
    outB.crossVectors(outT, outN).normalize();
  };
}

/**
 * Build the fibre geometry of one yarn.
 * Returns a geometry with vertex colours (fibre colour × ambient occlusion).
 */
export function buildYarn(spec: YarnSpec): THREE.BufferGeometry {
  const { curve, radius: R, look } = spec;
  const r = rng(spec.seed);
  const untwist = spec.untwist ?? 0;
  const spread = spec.spread ?? 0;
  const plySplit = spec.plySplit ?? 0;
  const length = curve.getLength();
  const density = spec.density ?? 10 / R;
  const radial = spec.radial ?? 5;
  const [u0, u1] = spec.range ?? [0, 1];
  const fr = spec.fibreRadius ?? R * look.fibre;
  const sampler = frameSampler(curve, Math.max(64, Math.ceil(length * 4)));
  const slubN = noise1(spec.seed + 7);
  const twistTurns = Math.tan((look.twistDeg * Math.PI) / 180) / (2 * Math.PI * R); // turns per unit at surface
  const plies = Math.max(1, look.plies);
  const plyR = plies === 1 ? 0 : R * (plies === 2 ? 0.5 : 0.56);
  const fibreZone = plies === 1 ? R : R * (plies === 2 ? 0.52 : 0.46);
  const base = new THREE.Color(look.color);
  const mixC = look.mix ? new THREE.Color(look.mix.color) : null;
  const buf: Buffers = { pos: [], nor: [], col: [], uv: [], idx: [] };
  const time = spec.time ?? 0;

  const P = new THREE.Vector3();
  const T = new THREE.Vector3();
  const N = new THREE.Vector3();
  const B = new THREE.Vector3();

  const slubAt = (d: number) => 1 + look.slub * 0.45 * slubN(d / (R * 3.2)) + look.slub * 0.2 * slubN(d / (R * 0.9) + 40);

  // Each lane is a fibre position in the cross-section; staple yarns get a chain of fibres per lane.
  for (let lane = 0; lane < spec.fibres; lane++) {
    const ply = lane % plies;
    const plyPhase = (ply / plies) * Math.PI * 2;
    const rad = Math.sqrt(r()) * fibreZone * 0.95;
    const phase = r() * Math.PI * 2;
    const tw = (0.85 + r() * 0.3) * (plies > 1 ? 1.1 : 1);
    const crimpPh = r() * 100;
    const crimpF = (1.3 + r() * 1.0) / (R * 0.5);
    const jit = 1 + (r() * 2 - 1) * look.jitter;
    const color = mixC && r() < (look.mix?.share ?? 0) ? mixC.clone() : base.clone();
    color.multiplyScalar(jit);
    // spread direction (in the cross-section plane plus a little along the yarn)
    const sAng = r() * Math.PI * 2;
    const sAmt = (0.4 + r() * 1.6) * R * 2.4;
    const sAlong = (r() * 2 - 1) * R * 1.5;
    const sWave = r() * 10;
    const thick = fr * (0.75 + r() * 0.5);

    // staple segments in arc-length (world units)
    const segs: [number, number][] = [];
    const startD = u0 * length;
    const endD = u1 * length;
    if (look.filament) segs.push([startD, endD]);
    else {
      const L = look.staple * R;
      let d = startD - r() * L;
      while (d < endD) {
        const len = L * (0.55 + r() * 0.7);
        segs.push([Math.max(startD, d), Math.min(endD, d + len)]);
        d += len * (0.75 + r() * 0.3);
      }
    }

    for (const [d0, d1] of segs) {
      if (d1 - d0 < fr * 4) continue;
      const n = Math.max(3, Math.ceil((d1 - d0) * density));
      const pts: THREE.Vector3[] = [];
      const radii: number[] = [];
      const shade: number[] = [];
      for (let i = 0; i <= n; i++) {
        const d = d0 + ((d1 - d0) * i) / n;
        sampler(d / length, P, T, N, B);
        const sl = slubAt(d);
        const twist = 1 - untwist;
        // ply centre
        let y = 0;
        let z = 0;
        if (plies > 1) {
          const pa = plyPhase - 2 * Math.PI * twistTurns * 0.8 * d * twist;
          const pr = plyR * sl * (1 + plySplit * 1.6);
          y += Math.cos(pa) * pr;
          z += Math.sin(pa) * pr;
        }
        const fa = phase + 2 * Math.PI * twistTurns * tw * d * twist * (plies > 1 ? 1.25 : 1);
        let fr2 = rad * sl;
        if (look.crimp > 0) fr2 += Math.sin(d * crimpF + crimpPh) * look.crimp * R * 0.04;
        y += Math.cos(fa) * fr2;
        z += Math.sin(fa) * fr2;
        let along = 0;
        if (look.crimp > 0) {
          const c = Math.sin(d * crimpF * 1.7 + crimpPh * 2) * look.crimp * R * 0.05;
          y += c * Math.cos(fa + 1.3);
          z += c * Math.sin(fa + 1.3);
        }
        if (spread > 0) {
          const env = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(d / (R * 2.5) + sWave + time * 0.6));
          const amt = spread * sAmt * env;
          y += Math.cos(sAng) * amt;
          z += Math.sin(sAng) * amt;
          along += spread * sAlong * Math.sin(d / (R * 4) + sWave);
        }
        const p = new THREE.Vector3().copy(P).addScaledVector(N, y).addScaledVector(B, z).addScaledVector(T, along);
        pts.push(p);
        const endTaper = look.filament ? 1 : Math.min(1, ((i / n) * (d1 - d0)) / (fr * 10), ((1 - i / n) * (d1 - d0)) / (fr * 10));
        radii.push(thick * (0.35 + 0.65 * endTaper));
        const depth = Math.min(1, Math.sqrt(y * y + z * z) / (R * 1.05));
        const ao = lerp(0.58, 1.08, Math.min(1, depth + spread * 0.9));
        shade.push(ao);
      }
      addTube(buf, pts, radii, color, shade, radial, R * 2);
    }
  }

  // Hairs: short fibres leaving the yarn surface
  const hairs = spec.hairs ?? Math.round((look.hair * length * 64) / R);
  for (let h = 0; h < hairs; h++) {
    const d = lerp(u0, u1, r()) * length;
    sampler(d / length, P, T, N, B);
    const a = r() * Math.PI * 2;
    const len = R * (0.12 + r() * r() * 0.72) * (0.5 + look.hair * 0.6);
    const curl = (r() * 2 - 1) * 2.6;
    const lean = (r() * 2 - 1) * 0.9;
    const pts: THREE.Vector3[] = [];
    const radii: number[] = [];
    const shade: number[] = [];
    const steps = 9;
    const color = base.clone().multiplyScalar(1 + (r() * 2 - 1) * look.jitter);
    for (let i = 0; i <= steps; i++) {
      const k = i / steps;
      const rr = R * slubAt(d) * 0.92 + len * k * (0.55 + 0.45 * k);
      const ang = a + curl * k;
      const y = Math.cos(ang) * rr;
      const z = Math.sin(ang) * rr;
      const along = lean * len * k + len * 0.6 * k * k;
      pts.push(new THREE.Vector3().copy(P).addScaledVector(N, y).addScaledVector(B, z).addScaledVector(T, along));
      radii.push(fr * 0.34 * (1 - k * 0.5));
      shade.push(lerp(0.7, 1, k));
    }
    addTube(buf, pts, radii, color, shade, 3, R * 2);
  }

  return toGeometry(buf);
}

/** Physically based material for a fibre type. */
export function fibreMaterial(look: FibreLook, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) {
  return new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    color: 0xffffff,
    roughness: look.roughness,
    metalness: 0,
    sheen: look.sheen,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color(0xffffff),
    clearcoat: look.clearcoat ?? 0,
    clearcoatRoughness: 0.25,
    ...extra,
  });
}

/** A gentle S-curve between two points, for hero strands. */
export function sCurve(points: [number, number, number][]) {
  return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'centripetal');
}

/** Straight line curve helper. */
export function line(a: [number, number, number], b: [number, number, number]) {
  return new THREE.LineCurve3(new THREE.Vector3(...a), new THREE.Vector3(...b));
}

/** Curve defined by a function of u (0..1), arc-length is approximated by three.js. */
export class FnCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private fn: (u: number, out: THREE.Vector3) => THREE.Vector3) {
    super();
    this.arcLengthDivisions = 400;
  }
  getPoint(u: number, out = new THREE.Vector3()) {
    return this.fn(u, out);
  }
}
