/**
 * Logistics yard with ISO shipping containers built procedurally (corrugated steel walls, frame,
 * corner castings, door bars) in SNTURCO colours. One container per shipment record. The scroll
 * progress (0..1) drives the choreography: first container lands, the second slides in, the rest
 * follow, the camera pulls back over the whole composition.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { smooth, lerp, rng } from './yarn';
import { brand } from './stage';

export type YardContainer = { size: '20ft' | '40ft' | '40ft HC'; isNew?: boolean };

const W = 2.44;
const dims = { '20ft': { L: 6.06, H: 2.59 }, '40ft': { L: 12.19, H: 2.59 }, '40ft HC': { L: 12.19, H: 2.9 } } as const;
const PAINTS = ['#1d3352', '#a86b45', '#e9e2d6', '#14243b', '#8f5a39', '#2a4468'];

/** Corrugated panel: profile repeats along `len`, extruded over `height`. Facing +z. */
function corrugated(len: number, height: number, pitch = 0.278, depth = 0.036) {
  const n = Math.max(2, Math.round(len / pitch));
  const p = len / n;
  const xs: number[] = [];
  const zs: number[] = [];
  for (let i = 0; i < n; i++) {
    const x0 = -len / 2 + i * p;
    xs.push(x0, x0 + p * 0.18, x0 + p * 0.5, x0 + p * 0.68);
    zs.push(0, depth, depth, 0);
  }
  xs.push(len / 2);
  zs.push(0);
  const pos: number[] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    const a = [xs[i], 0, zs[i]];
    const b = [xs[i + 1], 0, zs[i + 1]];
    const c = [xs[i + 1], height, zs[i + 1]];
    const d = [xs[i], height, zs[i]];
    pos.push(...a, ...b, ...c, ...a, ...c, ...d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  const uv: number[] = [];
  for (let i = 0; i < pos.length; i += 3) uv.push(pos[i] / len + 0.5, pos[i + 1] / height);
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return g;
}

function box(w: number, h: number, d: number, x: number, y: number, z: number) {
  const g = new THREE.BoxGeometry(w, h, d);
  g.translate(x, y, z);
  return g;
}

/** Painted body and dark steel details for one container size. */
function containerGeometry(size: keyof typeof dims) {
  const { L, H } = dims[size];
  const painted: THREE.BufferGeometry[] = [];
  const steel: THREE.BufferGeometry[] = [];
  const post = 0.16;
  // side walls
  const side = corrugated(L - post * 2, H - 0.3);
  const s1 = side.clone();
  s1.translate(0, 0.15, W / 2 - 0.05);
  const s2 = side.clone();
  s2.rotateY(Math.PI);
  s2.translate(0, 0.15, -W / 2 + 0.05);
  painted.push(s1, s2);
  // front end (corrugated vertical)
  const end = corrugated(W - post * 2, H - 0.3, 0.33, 0.04);
  end.rotateY(-Math.PI / 2);
  end.translate(-L / 2 + 0.05, 0.15, 0);
  painted.push(end);
  // doors at the back
  for (const zz of [-1, 1]) {
    const door = box(0.05, H - 0.32, W / 2 - post - 0.02, L / 2 - 0.03, H / 2, (zz * (W / 2 - post)) / 2);
    painted.push(door);
    for (let r = 0; r < 4; r++) {
      const z = zz * (0.18 + r * 0.17);
      if (Math.abs(z) > W / 2 - post) continue;
      painted.push(box(0.03, H - 0.4, 0.04, L / 2 + 0.01, H / 2, z));
    }
    for (const bz of [0.25, 0.62]) {
      const bar = new THREE.CylinderGeometry(0.022, 0.022, H - 0.2, 8);
      bar.translate(L / 2 + 0.06, H / 2, zz * bz);
      steel.push(bar);
      steel.push(box(0.05, 0.08, 0.08, L / 2 + 0.06, H * 0.45, zz * (bz - 0.06)));
    }
  }
  // roof
  const roof = corrugated(L - 0.1, W - 0.12, 0.6, 0.02);
  roof.rotateX(-Math.PI / 2);
  roof.translate(0, H - 0.02, (W - 0.12) / 2);
  painted.push(roof);
  // frame: corner posts, rails
  for (const x of [-L / 2 + post / 2, L / 2 - post / 2]) for (const z of [-W / 2 + post / 2, W / 2 - post / 2]) painted.push(box(post, H, post, x, H / 2, z));
  for (const z of [-W / 2 + 0.06, W / 2 - 0.06]) {
    painted.push(box(L, 0.14, 0.12, 0, H - 0.07, z));
    steel.push(box(L, 0.16, 0.14, 0, 0.08, z));
  }
  for (const x of [-L / 2 + 0.06, L / 2 - 0.06]) {
    painted.push(box(0.12, 0.2, W, x, H - 0.1, 0));
    steel.push(box(0.14, 0.18, W, x, 0.09, 0));
  }
  // corner castings
  for (const x of [-L / 2 + 0.09, L / 2 - 0.09]) for (const z of [-W / 2 + 0.09, W / 2 - 0.09]) for (const y of [0.09, H - 0.09]) steel.push(box(0.18, 0.18, 0.18, x, y, z));
  // floor
  steel.push(box(L - 0.2, 0.06, W - 0.2, 0, 0.12, 0));
  const strip = (list: THREE.BufferGeometry[]) => list.map((g) => (g.index ? g.toNonIndexed() : g)).map((g) => {
    if (!g.getAttribute('uv')) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((g.getAttribute('position').count) * 2), 2));
    return g;
  });
  return { painted: mergeGeometries(strip(painted))!, steel: mergeGeometries(strip(steel))!, L, H };
}

function paintTexture(seed: number) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 256, 256);
  const r = rng(seed);
  for (let i = 0; i < 140; i++) {
    g.fillStyle = `rgba(30,25,20,${0.015 + r() * 0.04})`;
    const x = r() * 256;
    g.fillRect(x, r() * 40, 1 + r() * 3, 60 + r() * 200);
  }
  for (let i = 0; i < 2500; i++) {
    g.fillStyle = `rgba(0,0,0,${r() * 0.05})`;
    g.fillRect(r() * 256, r() * 256, 1, 1);
  }
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, 'rgba(0,0,0,0.12)');
  grad.addColorStop(0.15, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function logoTexture(light: boolean) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.clearRect(0, 0, 1024, 256);
  const col = light ? '#14243b' : '#f5f1ea';
  g.fillStyle = col;
  g.font = '600 120px "Inter Variable", "Helvetica Neue", Arial, sans-serif';
  g.textBaseline = 'middle';
  (g as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = '34px';
  g.fillText('SNTURCO', 60, 130);
  g.fillStyle = '#c08560';
  g.fillRect(64, 205, 300, 6);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function concreteTexture() {
  const s = 1024;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d')!;
  g.fillStyle = '#454c57';
  g.fillRect(0, 0, s, s);
  const r = rng(9);
  for (let i = 0; i < 40000; i++) {
    const v = 100 + r() * 50;
    g.fillStyle = `rgba(${v},${v + 4},${v + 10},0.18)`;
    g.fillRect(r() * s, r() * s, 1 + r() * 2, 1 + r() * 2);
  }
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(40,45,55,${0.015 + r() * 0.025})`;
    g.beginPath();
    g.ellipse(r() * s, r() * s, 30 + r() * 120, 20 + r() * 80, r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  // slab joints
  g.strokeStyle = 'rgba(30,34,42,0.22)';
  g.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    g.beginPath();
    g.moveTo((i * s) / 4, 0);
    g.lineTo((i * s) / 4, s);
    g.stroke();
    g.beginPath();
    g.moveTo(0, (i * s) / 4);
    g.lineTo(s, (i * s) / 4);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(7, 7);
  t.anisotropy = 8;
  return t;
}

function skyTexture() {
  const c = document.createElement('canvas');
  c.width = 16;
  c.height = 512;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#0b1524');
  grad.addColorStop(0.45, '#1d3352');
  grad.addColorStop(0.62, '#7a5a4a');
  grad.addColorStop(0.7, '#c08560');
  grad.addColorStop(1, '#1d2a3c');
  g.fillStyle = grad;
  g.fillRect(0, 0, 16, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Plan positions for N containers: columns of 40ft footprint, two 20ft per tier, up to 3 tiers. */
function layout(list: YardContainer[]) {
  const rows = 4;
  const columns: { x: number; z: number; tiers: { left: boolean; right: boolean }[] }[] = [];
  const bayLen = 12.9;
  const rowGap = W + 0.35;
  const aisle = 4.2;
  for (let b = 0; b < 8; b++) {
    for (let r = 0; r < rows; r++) {
      const z = r * rowGap + (r >= 2 ? aisle : 0) - (rowGap * 1.5 + aisle / 2);
      const x = (b % 2 ? 1 : -1) * Math.ceil(b / 2) * (bayLen + 1.6) + (b % 2 ? 0 : 0);
      columns.push({ x, z, tiers: [] });
    }
  }
  columns.sort((a, b) => Math.hypot(a.x * 0.55, a.z) - Math.hypot(b.x * 0.55, b.z));
  const maxTier = list.length > 40 ? 4 : 3;
  const active = Math.max(2, Math.ceil(list.length / (maxTier * 0.8)));
  const out: { x: number; y: number; z: number; rotY: number }[] = [];
  for (const c of list) {
    const isLong = c.size !== '20ft';
    let placed = false;
    for (let tier = 0; tier < maxTier && !placed; tier++) {
      for (let k = 0; k < Math.min(columns.length, active) && !placed; k++) {
        const col = columns[k];
        const below = tier === 0 || (col.tiers[tier - 1]?.left && col.tiers[tier - 1]?.right);
        if (!below) continue;
        const t = (col.tiers[tier] ||= { left: false, right: false });
        const y = tier * 2.9;
        if (isLong && !t.left && !t.right) {
          t.left = t.right = true;
          out.push({ x: col.x, y, z: col.z, rotY: 0 });
          placed = true;
        } else if (!isLong && (!t.left || !t.right)) {
          const half = !t.left ? -1 : 1;
          if (half < 0) t.left = true;
          else t.right = true;
          out.push({ x: col.x + half * 3.2, y, z: col.z, rotY: 0 });
          placed = true;
        }
      }
    }
    if (!placed) out.push({ x: (out.length % 10) * 14 - 60, y: 0, z: 26, rotY: 0 });
  }
  return out;
}

export function createYard({ containers, aspect, mobile = false, env }: { containers: YardContainer[]; aspect: number; mobile?: boolean; env?: THREE.Texture }) {
  const scene = new THREE.Scene();
  if (env) {
    scene.environment = env;
    scene.environmentIntensity = 0.45;
  }
  scene.background = skyTexture();
  scene.fog = new THREE.Fog('#2a3650', 45, mobile ? 150 : 175);
  const camera = new THREE.PerspectiveCamera(aspect < 1 ? 55 : 36, aspect, 0.5, 600);

  const hemi = new THREE.HemisphereLight('#b9c8de', '#2e2622', 0.65);
  const sun = new THREE.DirectionalLight('#ffd9b5', 4.2);
  sun.position.set(-60, 45, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -70;
  sc.right = 70;
  sc.top = 70;
  sc.bottom = -70;
  sc.near = 1;
  sc.far = 220;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  const fill = new THREE.DirectionalLight('#8fa6c8', 0.7);
  fill.position.set(50, 30, -40);
  scene.add(hemi, sun, sun.target, fill);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ map: concreteTexture(), roughness: 0.92, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  // painted lane markings
  const markMat = new THREE.MeshBasicMaterial({ color: '#d9cdb8', transparent: true, opacity: 0.3 });
  for (const z of [-9.2, 9.2]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(260, 0.18), markMat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, 0.02, z);
    scene.add(m);
  }
  // distant container stacks (plain, unbranded) to suggest a port
  const farMat = new THREE.MeshStandardMaterial({ color: '#3a4860', roughness: 0.8, metalness: 0.3 });
  const farGeo = new THREE.BoxGeometry(12.2, 2.6, 2.44);
  const rr = rng(77);
  for (let row = 0; row < 6; row++) {
    for (let b = -6; b <= 6; b++) {
      const tiers = 1 + Math.floor(rr() * 4);
      for (let t = 0; t < tiers; t++) {
        const m = new THREE.Mesh(farGeo, farMat);
        m.position.set(b * 13 + (row % 2) * 4, 1.3 + t * 2.62, -70 - row * 3.1);
        scene.add(m);
      }
    }
  }

  // shared container assets
  const geos = { '20ft': containerGeometry('20ft'), '40ft': containerGeometry('40ft'), '40ft HC': containerGeometry('40ft HC') };
  const wear = paintTexture(3);
  const paintMats = PAINTS.map((c) => new THREE.MeshStandardMaterial({ color: c, map: wear, roughness: 0.58, metalness: 0.35 }));
  const steelMat = new THREE.MeshStandardMaterial({ color: '#1a1f27', roughness: 0.6, metalness: 0.6 });
  const logoDark = new THREE.MeshStandardMaterial({ map: logoTexture(false), transparent: true, roughness: 0.6, metalness: 0.1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
  const logoLight = new THREE.MeshStandardMaterial({ map: logoTexture(true), transparent: true, roughness: 0.6, metalness: 0.1, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });

  const glowTexture = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(64, 64, 10, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,0.9)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const slots = layout(containers);
  const r = rng(12);
  const items = containers.map((c, i) => {
    const g = geos[c.size];
    const paintIndex = i === 0 ? 0 : i === 1 ? 1 : Math.floor(r() * PAINTS.length);
    const body = new THREE.Mesh(g.painted, paintMats[paintIndex]);
    const steel = new THREE.Mesh(g.steel, steelMat);
    body.castShadow = body.receiveShadow = true;
    steel.castShadow = true;
    const grp = new THREE.Group();
    grp.add(body, steel);
    const light = PAINTS[paintIndex] === '#e9e2d6';
    const lw = Math.min(g.L * 0.62, 6.4);
    for (const side of [1, -1]) {
      const logo = new THREE.Mesh(new THREE.PlaneGeometry(lw, lw / 4), light ? logoLight : logoDark);
      logo.position.set(0, g.H * 0.58, side * (W / 2 + 0.002));
      if (side < 0) logo.rotation.y = Math.PI;
      grp.add(logo);
    }
    const slot = slots[i];
    grp.position.set(slot.x, slot.y, slot.z);
    scene.add(grp);
    let ring: THREE.Mesh | null = null;
    if (c.isNew && slot.y === 0) {
      ring = new THREE.Mesh(new THREE.PlaneGeometry(g.L + 2.4, W + 2.4), new THREE.MeshBasicMaterial({ map: glowTexture, color: brand.copperLight, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(slot.x, 0.03, slot.z);
      ring.visible = false;
      scene.add(ring);
    }
    return { grp, slot, size: c.size, isNew: !!c.isNew, H: g.H, L: g.L, ring };
  });

  // bounding box of final composition
  const box3 = new THREE.Box3();
  for (const it of items) box3.expandByPoint(new THREE.Vector3(it.slot.x - it.L / 2, it.slot.y + it.H, it.slot.z - W));
  for (const it of items) box3.expandByPoint(new THREE.Vector3(it.slot.x + it.L / 2, it.slot.y, it.slot.z + W));
  if (!items.length) box3.set(new THREE.Vector3(-10, 0, -5), new THREE.Vector3(10, 3, 5));
  const center = box3.getCenter(new THREE.Vector3());
  const radius = Math.max(14, box3.getSize(new THREE.Vector3()).length() / 2);

  const N = items.length;
  const newCount = items.filter((i) => i.isNew).length;
  /** Arrival window for container k (0..1 of scroll). New containers arrive last. */
  function arrival(k: number) {
    if (k === 0) return [0, 0.12];
    if (k === 1) return [0.16, 0.3];
    const rest = Math.max(1, N - 2);
    const start = 0.32 + ((k - 2) / rest) * (newCount ? 0.3 : 0.38);
    const isNew = items[k].isNew;
    if (isNew) {
      const j = items.slice(0, k).filter((i) => i.isNew).length;
      const s = 0.82 + (j / Math.max(1, newCount)) * 0.08;
      return [s, s + 0.07];
    }
    return [start, Math.min(0.8, start + 0.08)];
  }

  const c0 = items[0]?.slot ?? { x: 0, y: 0, z: 0 };
  const tmpP = new THREE.Vector3();
  const tmpT = new THREE.Vector3();
  const closeP = new THREE.Vector3(c0.x + 9, 3.2, c0.z + 11);
  const closeT = new THREE.Vector3(c0.x, 1.4, c0.z);
  const midP = new THREE.Vector3(c0.x + 22, 9, c0.z + 24);
  const farP = new THREE.Vector3(center.x + radius * 0.7, center.y + radius * 0.45 + 3, center.z + radius * 1.7);
  if (aspect < 1) farP.multiplyScalar(1.35);
  const farT = center.clone().setY(2.6);
  if (aspect >= 1) farT.x -= radius * 0.38;

  function update(p: number, time = 0) {
    items.forEach((it, k) => {
      const [a, b] = arrival(k);
      const t = smooth(a, b, p);
      const { x, y, z } = it.slot;
      if (k === 0) {
        // the first container is in view from the start and settles onto the ground
        it.grp.position.set(x, lerp(y + 3.2, y, t), z);
        it.grp.rotation.y = lerp(-0.12, 0, t);
        it.grp.visible = true;
        return;
      }
      if (k === 1) {
        // the second container slides in along the ground from another angle
        it.grp.position.set(lerp(x + 40, x, t), y, lerp(z + 30, z, t));
        it.grp.rotation.y = lerp(0.9, 0, t);
      } else {
        it.grp.position.set(x, lerp(y + 26, y, t), z);
        it.grp.rotation.y = lerp(k % 2 ? 0.25 : -0.25, 0, t);
      }
      it.grp.visible = t > 0.001;
      if (it.ring) {
        const glow = smooth(0.88, 0.96, p);
        it.ring.visible = glow > 0;
        (it.ring.material as THREE.MeshBasicMaterial).opacity = glow * (0.55 + 0.25 * Math.sin(time * 2.4));
      }
    });
    // camera: close on the first container → medium → pull back over the composition
    const k1 = smooth(0.1, 0.32, p);
    const k2 = smooth(0.45, 0.85, p);
    tmpP.copy(closeP).lerp(midP, k1).lerp(farP, k2);
    tmpT.copy(closeT).lerp(farT, Math.max(k1 * 0.4, k2));
    const orbit = (1 - k2) * Math.sin(p * Math.PI * 1.2) * 4;
    tmpP.x += orbit;
    camera.position.copy(tmpP);
    camera.lookAt(tmpT);
  }

  function resize(a: number) {
    camera.aspect = a;
    camera.fov = a < 1 ? 55 : 36;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.MeshStandardMaterial | undefined;
      mat?.map?.dispose?.();
      mat?.dispose?.();
    });
  }

  return { scene, camera, update, resize, dispose, count: N };
}
