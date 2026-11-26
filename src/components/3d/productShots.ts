/**
 * Compositions for the product images (rendered offline into WebP by scripts/render).
 * macro: close-up of the twisted yarn; cone: a wound yarn cone; fibres: the loose fibre structure.
 */
import * as THREE from 'three';
import { buildYarn, fibreMaterial, line, sCurve, rng, type FibreLook } from './yarn';
import { gradientTexture, lightRig, brand } from './stage';

export type ShotKind = 'macro' | 'cone' | 'fibres';
export type ShotOptions = { look: FibreLook; seed: number; aspect: number; tint?: string; background?: 'dark' | 'light'; angle?: number; quality?: number };

function darkBg(scene: THREE.Scene, seed: number) {
  const r = rng(seed);
  scene.background = gradientTexture('#1a2c47', brand.navy900, { color: brand.copper, x: 0.2 + r() * 0.6, y: 0.15 + r() * 0.3, r: 0.55, a: 0.22 });
  scene.fog = new THREE.Fog(brand.navy900, 14, 34);
}

function lightBg(scene: THREE.Scene, seed: number) {
  const r = rng(seed);
  scene.background = gradientTexture('#f7f3ec', '#ddd3c3', { color: '#ffffff', x: 0.3 + r() * 0.4, y: 0.25, r: 0.5, a: 0.5 });
}

function withTint(look: FibreLook, tint?: string): FibreLook {
  return tint ? { ...look, color: tint } : look;
}

export function macroShot(o: ShotOptions) {
  const scene = new THREE.Scene();
  const look = withTint(o.look, o.tint);
  const r = rng(o.seed);
  darkBg(scene, o.seed);
  lightRig(scene, { key: 2.8, rim: 2.6 });
  const q = o.quality ?? 1;
  const ang = o.angle ?? (r() * 2 - 1) * 0.45;
  const dx = Math.cos(ang) * 11;
  const dy = Math.sin(ang) * 11;
  const main = buildYarn({
    curve: sCurve([
      [-dx, -dy, -1.5],
      [-dx * 0.3, -dy * 0.3 + 0.25, 0.4],
      [dx * 0.3, dy * 0.3 - 0.2, 0.2],
      [dx, dy, -1.8],
    ]),
    radius: 1,
    look,
    fibres: Math.round((look.filament ? 320 : 420) * q),
    seed: o.seed,
    density: 9,
    radial: 5,
  });
  const mat = fibreMaterial(look);
  scene.add(new THREE.Mesh(main, mat));
  // a second strand behind for depth
  const back = buildYarn({
    curve: sCurve([
      [-12, dy * 0.4 + 3.2, -9],
      [-3, dy * 0.2 + 2.2, -7],
      [5, -dy * 0.3 + 3.6, -8],
      [13, 2.4, -10],
    ]),
    radius: 0.8,
    look,
    fibres: Math.round(160 * q),
    seed: o.seed + 11,
    density: 4,
    radial: 4,
    hairs: Math.round(look.hair * 120),
  });
  scene.add(new THREE.Mesh(back, mat));
  const camera = new THREE.PerspectiveCamera(o.aspect < 1 ? 40 : 30, o.aspect, 0.1, 100);
  camera.position.set((r() * 2 - 1) * 1.2, 0.6 + r() * 0.8, 9.5);
  camera.lookAt(0, 0, 0);
  return { scene, camera };
}

/** Cross-wound yarn texture for cones. */
function woundTexture(color: string, seed: number, hairy: number) {
  const s = 1024;
  const c = document.createElement('canvas');
  c.width = s;
  c.height = s;
  const g = c.getContext('2d')!;
  const base = new THREE.Color(color);
  g.fillStyle = `#${base.clone().multiplyScalar(0.72).getHexString()}`;
  g.fillRect(0, 0, s, s);
  const r = rng(seed);
  const strands = 150;
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < strands; i++) {
      const y0 = (i / strands) * s * 2 - s * 0.5;
      const w = 5 + r() * 3;
      const shade = 0.82 + r() * 0.26;
      const col = base.clone().multiplyScalar(shade);
      g.strokeStyle = `#${col.getHexString()}`;
      g.lineWidth = w;
      g.lineCap = 'round';
      g.beginPath();
      const slope = pass === 0 ? 0.28 : -0.28;
      for (let x = -20; x <= s + 20; x += 16) {
        const y = y0 + x * slope + Math.sin(x * 0.02 + i) * 1.2;
        if (x === -20) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
      // highlight line
      g.strokeStyle = `rgba(255,255,255,${0.12 + r() * 0.1})`;
      g.lineWidth = 0.9;
      g.stroke();
    }
  }
  // fuzz
  g.globalAlpha = 0.25 * hairy;
  for (let i = 0; i < 6000 * hairy; i++) {
    const x = r() * s;
    const y = r() * s;
    g.strokeStyle = r() > 0.5 ? '#ffffff' : `#${base.getHexString()}`;
    g.lineWidth = 0.6;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + (r() - 0.5) * 10, y + (r() - 0.5) * 10, x + (r() - 0.5) * 14, y + (r() - 0.5) * 14);
    g.stroke();
  }
  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

export function coneShot(o: ShotOptions) {
  const scene = new THREE.Scene();
  const look = withTint(o.look, o.tint);
  const light = o.background !== 'dark';
  if (light) lightBg(scene, o.seed);
  else darkBg(scene, o.seed);
  const r = rng(o.seed);
  const rig = lightRig(scene, { key: light ? 3.2 : 2.6, rim: light ? 1.2 : 2.4, fill: 0.8 });
  rig.key.castShadow = true;
  rig.key.shadow.mapSize.set(2048, 2048);
  rig.key.shadow.camera.left = -8;
  rig.key.shadow.camera.right = 8;
  rig.key.shadow.camera.top = 8;
  rig.key.shadow.camera.bottom = -8;
  rig.key.shadow.radius = 8;
  rig.key.shadow.bias = -0.0004;

  const tex = woundTexture(look.color, o.seed, look.hair);
  tex.repeat.set(1.5, 1);
  const bump = tex.clone();
  bump.colorSpace = THREE.NoColorSpace;
  const mat = new THREE.MeshPhysicalMaterial({
    map: tex,
    bumpMap: bump,
    bumpScale: 4,
    roughness: look.roughness,
    sheen: look.sheen,
    sheenColor: new THREE.Color(0xffffff),
    sheenRoughness: 0.5,
    clearcoat: (look.clearcoat ?? 0) * 0.5,
  });

  const group = new THREE.Group();
  const h = 4.4;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 2.35, h, 160, 1, true), mat);
  body.castShadow = true;
  group.add(body);
  // top and bottom wound faces
  const topFace = new THREE.Mesh(new THREE.RingGeometry(0.55, 1.25, 128, 1), mat);
  topFace.rotation.x = -Math.PI / 2;
  topFace.position.y = h / 2;
  group.add(topFace);
  // paper core
  const kraft = new THREE.MeshStandardMaterial({ color: '#b98e62', roughness: 0.85 });
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.9, h + 1.0, 96, 1, true), kraft);
  core.position.y = 0.3;
  core.castShadow = true;
  const coreInner = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.86, h + 1.0, 96, 1, true), new THREE.MeshStandardMaterial({ color: '#6f5236', roughness: 0.9, side: THREE.BackSide }));
  coreInner.position.y = 0.3;
  const coreRim = new THREE.Mesh(new THREE.RingGeometry(0.46, 0.5, 96), kraft);
  coreRim.rotation.x = -Math.PI / 2;
  coreRim.position.y = h / 2 + 0.8;
  group.add(core, coreInner, coreRim);
  scene.add(group);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: light ? 0.22 : 0.45 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -h / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // a loose end of yarn leaving the cone
  const end = buildYarn({
    curve: sCurve([
      [1.6, 0.8, 1.2],
      [2.6, -0.6, 2.2],
      [3.4, -2.1, 2.8],
      [5.2, -2.18, 3.6],
    ]),
    radius: 0.09,
    look,
    fibres: 26,
    seed: o.seed + 3,
    density: 60,
    radial: 4,
    hairs: Math.round(look.hair * 60),
  });
  const endMesh = new THREE.Mesh(end, fibreMaterial(look));
  endMesh.castShadow = true;
  scene.add(endMesh);

  group.rotation.y = r() * Math.PI;
  const camera = new THREE.PerspectiveCamera(o.aspect < 1 ? 38 : 30, o.aspect, 0.1, 100);
  const a = (o.angle ?? r() * 0.6 - 0.3) + 0.2;
  camera.position.set(Math.sin(a) * 13, 3.6 + r() * 1.5, Math.cos(a) * 13);
  camera.lookAt(0.8, -0.2, 0);
  return { scene, camera, shadows: true };
}

export function fibresShot(o: ShotOptions) {
  const scene = new THREE.Scene();
  const look = withTint(o.look, o.tint);
  const r = rng(o.seed);
  darkBg(scene, o.seed + 5);
  lightRig(scene, { key: 2.6, rim: 3 });
  const q = o.quality ?? 1;
  const yarn = buildYarn({
    curve: sCurve([
      [-12, -1.5 + r(), -2],
      [-5, 1.2, 0],
      [1, -0.8, 0.6],
      [6, 1.1, -0.5],
      [12, -0.6 + r(), -2.5],
    ]),
    radius: 0.9,
    look: { ...look, plies: 1 },
    fibres: Math.round((look.filament ? 260 : 360) * q),
    seed: o.seed + 21,
    untwist: 0.92,
    spread: look.filament ? 0.32 : 0.62,
    density: 8,
    radial: 5,
    hairs: Math.round(look.hair * 260),
  });
  scene.add(new THREE.Mesh(yarn, fibreMaterial(look)));
  const camera = new THREE.PerspectiveCamera(o.aspect < 1 ? 42 : 32, o.aspect, 0.1, 100);
  camera.position.set(-1.5 + r() * 3, 2.5 + r(), 10);
  camera.lookAt(0, 0, 0);
  return { scene, camera };
}

export const shots = { macro: macroShot, cone: coneShot, fibres: fibresShot };

// keep `line` exported for other compositions
export { line };
