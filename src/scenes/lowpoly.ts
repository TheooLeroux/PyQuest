// Générateur de montagne low-poly : un maillage triangulaire jitteré, éclairé
// facette par facette. Déterministe (même graine → même montagne). C'est le
// même principe que la future montagne 3D de la carte, en version 2D projetée.

export interface Facette {
  points: string; // "x1,y1 x2,y2 x3,y3" prêt pour <polygon>
  couleur: string;
}

export interface PaletteMontagne {
  ombre: string;
  lumiere: string;
  neigeOmbre: string;
  neigeLumiere: string;
  glace: string;
}

export interface ParametresMontagne {
  graine: number;
  largeur: number; // base, apex centré en (0,0), base à y = hauteur
  hauteur: number;
  lignes: number; // finesse du maillage (~lignes² facettes)
  ligneNeige: number; // fraction du haut enneigée (0..1)
  probaGlace: number; // chance qu'une facette éclairée soit un éclat de glace
  palette: PaletteMontagne;
}

interface Point {
  x: number;
  y: number;
  z: number;
}

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
export function creerAlea(graine: number): () => number {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexVersRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function melanger(depuis: string, vers: string, t: number): string {
  const a = hexVersRgb(depuis);
  const b = hexVersRgb(vers);
  const canal = (i: number) => Math.round(a[i] + (b[i] - a[i]) * t);
  return `rgb(${canal(0)}, ${canal(1)}, ${canal(2)})`;
}

// Lumière venant du haut-gauche, légèrement de face.
const LUMIERE = normaliser({ x: -0.55, y: -0.65, z: 0.52 });

function normaliser(v: Point): Point {
  const n = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / n, y: v.y / n, z: v.z / n };
}

function eclairement(a: Point, b: Point, c: Point): number {
  const u = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  const v = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
  let n = {
    x: u.y * v.z - u.z * v.y,
    y: u.z * v.x - u.x * v.z,
    z: u.x * v.y - u.y * v.x,
  };
  if (n.z < 0) n = { x: -n.x, y: -n.y, z: -n.z }; // face tournée vers nous
  n = normaliser(n);
  const d = n.x * LUMIERE.x + n.y * LUMIERE.y + n.z * LUMIERE.z;
  return Math.max(0, d) ** 0.85;
}

export function genererMontagne(parametres: ParametresMontagne): Facette[] {
  const { largeur, hauteur, lignes, ligneNeige, probaGlace, palette } = parametres;
  const alea = creerAlea(parametres.graine);
  const jitterX = (largeur / lignes) * 0.34;
  const jitterY = (hauteur / lignes) * 0.3;
  const relief = (largeur / lignes) * 0.6;

  // La grille : la ligne r possède r+1 points, de l'apex (1 point) à la base.
  const rangees: Point[][] = [];
  for (let r = 0; r <= lignes; r += 1) {
    const t = r / lignes;
    const y = Math.pow(t, 1.12) * hauteur;
    const demi = Math.pow(t, 0.92) * (largeur / 2);
    const nombre = r + 1;
    const rangee: Point[] = [];
    for (let i = 0; i < nombre; i += 1) {
      const u = nombre === 1 ? 0 : (i / (nombre - 1)) * 2 - 1;
      rangee.push({
        x: u * demi + (alea() * 2 - 1) * jitterX,
        y: r === 0 ? 0 : r === lignes ? hauteur : y + (alea() * 2 - 1) * jitterY,
        z: (alea() * 2 - 1) * relief,
      });
    }
    rangees.push(rangee);
  }

  const facettes: Facette[] = [];
  const ajouter = (a: Point, b: Point, c: Point, tMoyen: number) => {
    const clarte = eclairement(a, b, c);
    const enneige = tMoyen < ligneNeige * (0.8 + alea() * 0.45);
    let couleur: string;
    if (enneige) {
      couleur = melanger(palette.neigeOmbre, palette.neigeLumiere, clarte);
    } else if (clarte > 0.55 && alea() < probaGlace) {
      couleur = palette.glace;
    } else {
      couleur = melanger(palette.ombre, palette.lumiere, clarte);
    }
    facettes.push({
      points: `${a.x.toFixed(1)},${a.y.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`,
      couleur,
    });
  };

  for (let r = 0; r < lignes; r += 1) {
    const haut = rangees[r];
    const bas = rangees[r + 1];
    const tMoyen = (r + 0.5) / lignes;
    for (let i = 0; i < haut.length; i += 1) {
      ajouter(bas[i], haut[i], bas[i + 1], tMoyen);
      if (i < haut.length - 1) ajouter(haut[i], haut[i + 1], bas[i + 1], tMoyen);
    }
  }
  return facettes;
}
