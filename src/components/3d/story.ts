/**
 * The scroll story: one yarn → macro → untwisting → fibres → four fibre types → woven together.
 * Rendered offline into a frame sequence (scripts/render), scrubbed on the home page by scroll.
 * update(t) rebuilds the fibre geometry for the moment t (0..1).
 */
import * as THREE from 'three';
import { buildYarn, fibreMaterial, FnCurve, lerp, smooth, line } from './yarn';
import { gradientTexture, lightRig, brand } from './stage';
import { looks } from './looks';

/** Story timeline (also used for the captions on the page). */
export const storyBeats = [0, 0.1, 0.28, 0.38, 0.52, 0.64, 0.7, 0.86, 0.96] as const;

type Key = { t: number; p: [number, number, number]; l: [number, number, number] };
const camKeys: Key[] = [
  { t: 0, p: [0, 0, 46], l: [0, 0, 0] },
  { t: 0.1, p: [0, -1.5, 38], l: [0, 0, 0] },
  { t: 0.28, p: [1.6, 1.8, 12], l: [0, 0, 0] },
  { t: 0.38, p: [0.9, 0.7, 4.3], l: [0.3, 0, 0] },
  { t: 0.47, p: [0.4, 1.1, 5.6], l: [0, 0, 0] },
  { t: 0.6, p: [0, 1.5, 12], l: [0, 0, 0] },
  { t: 0.67, p: [-2, 0.6, 21], l: [-1, 0, 0] },
  { t: 0.72, p: [-6, 4.6, 4.4], l: [-3.5, 3.9, 0] },
  { t: 0.76, p: [-2, 1.9, 4.4], l: [0.5, 1.3, 0] },
  { t: 0.8, p: [2, -0.7, 4.4], l: [4.5, -1.3, 0] },
  { t: 0.84, p: [6, -3.3, 4.4], l: [8.5, -3.9, 0] },
  { t: 0.9, p: [1, 0.5, 26], l: [0, 0, 0] },
  { t: 0.96, p: [2.5, 1.2, 14], l: [0, 0, 0] },
  { t: 1, p: [1.2, 0.4, 5.2], l: [0, 0, 0] },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

function cameraAt(t: number, pos: THREE.Vector3, look: THREE.Vector3) {
  let i = 0;
  while (i < camKeys.length - 2 && t > camKeys[i + 1].t) i++;
  const a = camKeys[i];
  const b = camKeys[i + 1];
  const k = smooth(a.t, b.t, t);
  pos.copy(tmpA.fromArray(a.p)).lerp(tmpB.fromArray(b.p), k);
  look.copy(tmpA.fromArray(a.l)).lerp(tmpB.fromArray(b.l), k);
}

export const storyYarns = [
  { key: 'cotton', color: '#efe6d4' },
  { key: 'polyester', color: '#f4f5f6' },
  { key: 'viscose', color: '#c6a98e' },
  { key: 'wool', color: '#e3d4b6' },
] as const;

export function createStory({ aspect, quality = 1 }: { aspect: number; quality?: number }) {
  const scene = new THREE.Scene();
  scene.background = gradientTexture('#2b2c30', brand.navy900, { color: brand.copper, x: 0.72, y: 0.22, r: 0.6, a: 0.18 }, 1600, 900);
  scene.fog = new THREE.Fog(brand.navy900, 40, 130);
  lightRig(scene, { key: 2.8, rim: 2.8, fill: 0.7 });
  const portrait = aspect < 1;
  const camera = new THREE.PerspectiveCamera(portrait ? 52 : 30, aspect, 0.05, 200);

  const heroLook = looks.cotton;
  const heroMat = fibreMaterial(heroLook);
  const heroMesh = new THREE.Mesh(new THREE.BufferGeometry(), heroMat);
  scene.add(heroMesh);

  const group = new THREE.Group();
  scene.add(group);
  const lanes = [3.9, 1.3, -1.3, -3.9];
  const yarnMeshes = storyYarns.map((y) => {
    const look = { ...looks[y.key], color: y.color };
    const m = new THREE.Mesh(new THREE.BufferGeometry(), fibreMaterial(look));
    group.add(m);
    return { mesh: m, look };
  });
  const heroCurve = line([-26, -7.4, 0], [26, 7.4, 0]);
  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();

  function update(t: number) {
    cameraAt(t, pos, look);
    camera.position.copy(pos);
    // portrait screens: roll the camera so the first yarn runs top to bottom
    const roll = portrait ? lerp(1.05, 0, smooth(0.6, 0.68, t)) : 0;
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(look);
    camera.updateProjectionMatrix();

    // Phase A: the single yarn
    heroMesh.geometry.dispose();
    if (t < 0.7) {
      const fly = smooth(0.6, 0.69, t);
      heroMesh.visible = true;
      heroMesh.geometry = buildYarn({
        curve: heroCurve,
        radius: 1,
        look: heroLook,
        fibres: Math.round(220 * quality),
        seed: 4,
        untwist: smooth(0.38, 0.5, t),
        plySplit: smooth(0.36, 0.45, t) * (1 - smooth(0.47, 0.52, t)),
        spread: smooth(0.46, 0.6, t) + fly * 3,
        density: t < 0.2 ? 3 : 9,
        radial: t < 0.2 ? 4 : 5,
        time: t * 20,
        hairs: Math.round(heroLook.hair * 700 * (1 - smooth(0.4, 0.5, t))),
      });
      heroMesh.position.z = fly * 26;
      heroMesh.rotation.x = t * 0.6;
    } else {
      heroMesh.visible = false;
      heroMesh.geometry = new THREE.BufferGeometry();
    }

    // Phase B: four fibre types slide in, are shown one by one, then twist into one cord
    const enter = smooth(0.62, 0.7, t);
    const converge = smooth(0.85, 0.93, t);
    group.visible = enter > 0;
    group.rotation.z = lerp(0, -0.32, converge);
    yarnMeshes.forEach((y, j) => {
      y.mesh.geometry.dispose();
      if (!group.visible) {
        y.mesh.geometry = new THREE.BufferGeometry();
        return;
      }
      const slide = (1 - smooth(0.62 + j * 0.012, 0.7 + j * 0.008, t)) * (j % 2 ? 60 : -60);
      const phase = (j / 4) * Math.PI * 2;
      const rc = 1.12;
      const curve = new FnCurve((u, out) => {
        const x = lerp(-34, 34, u);
        const a = phase + u * Math.PI * 2 * 8.5;
        const ly = lerp(lanes[j], Math.cos(a) * rc, converge);
        const lz = lerp(j % 2 ? -0.6 : 0.3, Math.sin(a) * rc, converge);
        return out.set(x + slide, ly, lz);
      });
      y.mesh.geometry = buildYarn({
        curve,
        radius: 0.72,
        look: y.look,
        fibres: Math.round((y.look.filament ? 80 : 110) * quality),
        seed: 30 + j,
        density: 7,
        radial: 4,
      });
    });
  }

  return { scene, camera, update };
}
