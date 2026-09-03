// La montagne 3D low-poly : le pendant volumétrique du générateur 2D —
// un cône bruité (anneaux × secteurs), faces non indexées pour le flat
// shading, couleurs par face (roche, neige d'altitude, éclats de glace).
import * as THREE from 'three';
import { creerAlea } from './lowpoly';

export const HAUTEUR_MONT = 30;
const RAYON_BASE = 26;

/** Rayon du profil du mont à la hauteur t (0 = base, 1 = sommet). */
export function rayonProfil(t: number): number {
  return Math.max(0.7, RAYON_BASE * Math.pow(1 - Math.min(1, t), 1.12));
}

export interface Ancre3D {
  angle: number;
  t: number;
  position: THREE.Vector3;
}

/** Les paliers des chapitres : une spirale montante autour du mont. */
export function calculerAncres(): Ancre3D[] {
  return Array.from({ length: 8 }, (_, i) => {
    const t = 0.09 + i * 0.104;
    const angle = -0.6 + i * 1.05;
    const rayon = rayonProfil(t) * 1.02;
    return {
      angle,
      t,
      position: new THREE.Vector3(
        Math.cos(angle) * rayon,
        t * HAUTEUR_MONT,
        Math.sin(angle) * rayon,
      ),
    };
  });
}

const ROCHE_OMBRE = new THREE.Color('#2b4a66');
const ROCHE_CLAIRE = new THREE.Color('#587f9e');
const NEIGE_OMBRE = new THREE.Color('#c2dde8');
const NEIGE_CLAIRE = new THREE.Color('#eef7fa');
const GLACE = new THREE.Color('#56cfe1');

export function genererMontagne3D(
  graine: number,
  ligneNeige = 0.62,
  probaGlace = 0.05,
): THREE.BufferGeometry {
  const alea = creerAlea(graine);
  const ANNEAUX = 20;
  const SECTEURS = 32;

  // Grille de sommets bruités (l'anneau -1 est une jupe qui plonge sous le sol).
  const grille: THREE.Vector3[][] = [];
  for (let a = -1; a <= ANNEAUX; a += 1) {
    const t = a / ANNEAUX;
    const anneau: THREE.Vector3[] = [];
    for (let s = 0; s < SECTEURS; s += 1) {
      const theta = (s / SECTEURS) * Math.PI * 2;
      const bruit = 1 + (alea() * 2 - 1) * 0.16;
      const rayon = (a < 0 ? RAYON_BASE * 1.12 : rayonProfil(t)) * bruit;
      const y = a < 0 ? -2.5 : t * HAUTEUR_MONT + (alea() * 2 - 1) * (HAUTEUR_MONT / ANNEAUX) * 0.4;
      anneau.push(new THREE.Vector3(Math.cos(theta) * rayon, y, Math.sin(theta) * rayon));
    }
    grille.push(anneau);
  }
  const apex = new THREE.Vector3((alea() - 0.5) * 0.8, HAUTEUR_MONT + 0.9, (alea() - 0.5) * 0.8);

  const positions: number[] = [];
  const couleurs: number[] = [];
  const couleurTravail = new THREE.Color();

  const ajouterFace = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number) => {
    positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z);
    const enneige = t > ligneNeige * (0.85 + alea() * 0.35);
    if (enneige) {
      couleurTravail.lerpColors(NEIGE_OMBRE, NEIGE_CLAIRE, alea());
    } else if (alea() < probaGlace) {
      couleurTravail.copy(GLACE);
    } else {
      couleurTravail.lerpColors(ROCHE_OMBRE, ROCHE_CLAIRE, 0.25 + alea() * 0.5);
    }
    for (let i = 0; i < 3; i += 1) {
      couleurs.push(couleurTravail.r, couleurTravail.g, couleurTravail.b);
    }
  };

  for (let a = 0; a < grille.length - 1; a += 1) {
    const bas = grille[a];
    const haut = grille[a + 1];
    const t = (a - 0.5) / ANNEAUX;
    for (let s = 0; s < SECTEURS; s += 1) {
      const s2 = (s + 1) % SECTEURS;
      ajouterFace(bas[s], haut[s], bas[s2], t);
      ajouterFace(haut[s], haut[s2], bas[s2], t);
    }
  }
  // Le bouchon du sommet, toujours enneigé.
  const dernier = grille[grille.length - 1];
  for (let s = 0; s < SECTEURS; s += 1) {
    const s2 = (s + 1) % SECTEURS;
    ajouterFace(dernier[s], apex, dernier[s2], 1);
  }

  const geometrie = new THREE.BufferGeometry();
  geometrie.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometrie.setAttribute('color', new THREE.Float32BufferAttribute(couleurs, 3));
  geometrie.computeVertexNormals();
  return geometrie;
}

/** Un sapin low-poly (tronc + deux étages + pointe neigeuse). */
export function creerSapin(alea: () => number): THREE.Group {
  const groupe = new THREE.Group();
  const matiere = (couleur: string) =>
    new THREE.MeshStandardMaterial({ color: couleur, flatShading: true, roughness: 1 });

  const tronc = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.42, 5), matiere('#4a3b2e'));
  tronc.position.y = 0.21;
  const etage1 = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.9, 6), matiere('#2e6b5e'));
  etage1.position.y = 0.8;
  const etage2 = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.7, 6), matiere('#387d6d'));
  etage2.position.y = 1.3;
  const pointe = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.28, 6), matiere('#e8f2f7'));
  pointe.position.y = 1.75;

  groupe.add(tronc, etage1, etage2, pointe);
  const echelle = 0.7 + alea() * 0.6;
  groupe.scale.setScalar(echelle);
  groupe.rotation.y = alea() * Math.PI * 2;
  return groupe;
}
