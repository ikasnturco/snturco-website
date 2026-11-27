/**
 * Interactive product viewer: one yarn segment, built from the same fibre model as the product renders,
 * under the same studio light. The visitor rotates and zooms it (OrbitControls).
 */
import * as THREE from 'three';
import { buildYarn, fibreMaterial, sCurve, type FibreLook } from './yarn';
import { brand, gradientTexture, lightRig } from './stage';

export function createViewer({ look, seed, aspect, mobile = false }: { look: FibreLook; seed: number; aspect: number; mobile?: boolean }) {
  const scene = new THREE.Scene();
  scene.background = gradientTexture('#2e2f33', brand.navy900, { color: brand.copper, x: 0.5, y: 0.2, r: 0.6, a: 0.16 });
  lightRig(scene, { key: 2.8, rim: 2.6 });

  const q = mobile ? 0.55 : 1;
  const geo = buildYarn({
    curve: sCurve([
      [-7, -0.6, 0],
      [-2.4, 0.5, 0.6],
      [2.4, -0.4, -0.5],
      [7, 0.5, 0],
    ]),
    radius: 1,
    look,
    fibres: Math.round((look.filament ? 320 : 420) * q),
    seed,
    density: mobile ? 6 : 9,
    radial: mobile ? 4 : 5,
    hairs: Math.round(look.hair * (mobile ? 160 : 320)),
  });
  const mat = fibreMaterial(look);
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const camera = new THREE.PerspectiveCamera(aspect < 1 ? 42 : 32, aspect, 0.1, 100);
  const home = new THREE.Vector3(0, 1.2, aspect < 1 ? 16 : 11);
  camera.position.copy(home);
  camera.lookAt(0, 0, 0);

  return {
    scene,
    camera,
    home,
    resize(a: number) {
      camera.aspect = a;
      camera.fov = a < 1 ? 42 : 32;
      camera.updateProjectionMatrix();
    },
    dispose() {
      geo.dispose();
      mat.dispose();
      (scene.background as THREE.Texture | null)?.dispose?.();
    },
  };
}
