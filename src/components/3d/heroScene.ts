/**
 * Live hero scene: real fibre-built yarn strands of different thickness, two of them twisted around
 * each other, floating at several depths. A vertex wave makes them drift; the camera reacts to
 * scroll and pointer. Also rendered offline as the poster image (scripts/render).
 */
import * as THREE from 'three';
import { buildYarn, fibreMaterial, FnCurve, sCurve, type FibreLook } from './yarn';
import { gradientTexture, lightRig, brand } from './stage';
import { looks } from './looks';

type Strand = { curve: THREE.Curve<THREE.Vector3>; radius: number; look: FibreLook; fibres: number; seed: number; amp: number; speed: number; density?: number };

function pairCurve(base: THREE.CatmullRomCurve3, r: number, turns: number, phase: number) {
  const frames = base.computeFrenetFrames(200, false);
  const p = new THREE.Vector3();
  return new FnCurve((u, out) => {
    base.getPointAt(Math.min(0.9999, u), p);
    const i = Math.min(200, Math.round(u * 200));
    const a = phase + u * Math.PI * 2 * turns;
    return out.copy(p).addScaledVector(frames.normals[i], Math.cos(a) * r).addScaledVector(frames.binormals[i], Math.sin(a) * r);
  });
}

export function heroStrands(mobile: boolean): Strand[] {
  const base = sCurve([
    [-15, -6.5, -1.5],
    [-5, -2.6, 0.2],
    [2, 0.6, 0.6],
    [8, 1.6, -0.4],
    [17, 5.2, -2.5],
  ]);
  const q = mobile ? 0.6 : 1;
  const copper: FibreLook = { ...looks.cotton, color: '#9c5a34', hair: 0.55 };
  const ecru: FibreLook = { ...looks.cotton, color: '#efe6d4' };
  const strands: Strand[] = [
    { curve: pairCurve(base, 0.62, 4.5, 0), radius: 0.5, look: copper, fibres: Math.round(110 * q), seed: 1, amp: 0.18, speed: 0.35 },
    { curve: pairCurve(base, 0.62, 4.5, Math.PI), radius: 0.44, look: ecru, fibres: Math.round(100 * q), seed: 2, amp: 0.18, speed: 0.35 },
    {
      curve: sCurve([
        [-18, 6.5, -9],
        [-6, 3.8, -8],
        [4, 4.6, -7],
        [18, 0.5, -8.5],
      ]),
      radius: 0.85,
      look: { ...looks.wool, color: '#e3d4b6' },
      fibres: Math.round(120 * q),
      seed: 3,
      amp: 0.3,
      speed: 0.22,
      density: 3,
    },
    {
      curve: sCurve([
        [-14, -5.2, 3.2],
        [-3, -3.6, 2.6],
        [6, -3.9, 2.2],
        [15, -1.6, 1.4],
      ]),
      radius: 0.2,
      look: { ...looks.silk, color: '#5d7192' },
      fibres: Math.round(60 * q),
      seed: 4,
      amp: 0.12,
      speed: 0.5,
      density: 9,
    },
  ];
  if (!mobile)
    strands.push({
      curve: sCurve([
        [-15, 2.2, -4.5],
        [-2, 5.2, -4],
        [9, 6.2, -3],
        [17, 8.5, -4],
      ]),
      radius: 0.3,
      look: { ...looks.polyester, color: '#f3f5f7' },
      fibres: 70,
      seed: 5,
      amp: 0.22,
      speed: 0.3,
      density: 6,
    });
  return strands;
}

/** Inject a travelling wave into a material so strands drift like floating thread. */
function waveMaterial(mat: THREE.MeshPhysicalMaterial, amp: number, speed: number, uniforms: { uTime: { value: number } }) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float w = uTime * ${speed.toFixed(3)};
        transformed.y += sin(position.x * 0.32 + w) * ${amp.toFixed(3)} + sin(position.x * 0.11 - w * 0.6) * ${(amp * 1.6).toFixed(3)};
        transformed.z += cos(position.x * 0.27 + w * 0.8) * ${(amp * 0.8).toFixed(3)};`,
      );
  };
  return mat;
}

export function createHero({ aspect, mobile = false }: { aspect: number; mobile?: boolean }) {
  const scene = new THREE.Scene();
  scene.background = gradientTexture('#17293f', brand.navy900, { color: brand.copper, x: 0.78, y: 0.3, r: 0.55, a: 0.2 }, 1600, 1000);
  scene.fog = new THREE.Fog(brand.navy900, 12, 30);
  lightRig(scene, { key: 2.6, rim: 3, fill: 0.7 });
  const camera = new THREE.PerspectiveCamera(aspect < 1 ? 52 : 34, aspect, 0.1, 100);
  const uniforms = { uTime: { value: 0 } };
  const group = new THREE.Group();
  scene.add(group);
  const strands = heroStrands(mobile);

  /** Build strands one by one so the page stays responsive; resolves when all are in the scene. */
  async function build(onProgress?: (p: number) => void, yieldFn: () => Promise<void> = () => Promise.resolve()) {
    for (let i = 0; i < strands.length; i++) {
      const s = strands[i];
      const geo = buildYarn({ curve: s.curve, radius: s.radius, look: s.look, fibres: s.fibres, seed: s.seed, density: s.density ?? 5, radial: mobile ? 3 : 4, hairs: Math.round(s.look.hair * (mobile ? 300 : 900) * s.radius) });
      const mesh = new THREE.Mesh(geo, waveMaterial(fibreMaterial(s.look), s.amp, s.speed, uniforms));
      mesh.frustumCulled = false;
      group.add(mesh);
      onProgress?.((i + 1) / strands.length);
      await yieldFn();
    }
  }

  const target = new THREE.Vector3();
  /** time in seconds, scroll 0..1 through the hero, pointer -1..1 */
  function update(time: number, scroll = 0, px = 0, py = 0) {
    uniforms.uTime.value = time;
    const portrait = camera.aspect < 1;
    camera.position.set(px * 0.7 + (portrait ? 1.5 : 0), py * 0.45 + scroll * 1.4, (portrait ? 17 : 14) - scroll * 6.5);
    target.set(portrait ? 2 : 1.2, scroll * 2.2, 0);
    camera.lookAt(target);
    group.rotation.z = Math.sin(time * 0.05) * 0.02 - scroll * 0.08;
  }

  function resize(a: number) {
    camera.aspect = a;
    camera.fov = a < 1 ? 52 : 34;
    camera.updateProjectionMatrix();
  }

  function dispose() {
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      (m.material as THREE.Material | undefined)?.dispose?.();
    });
    (scene.background as THREE.Texture)?.dispose?.();
  }

  return { scene, camera, build, update, resize, dispose };
}
