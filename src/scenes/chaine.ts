// La chaîne du mont PyQuest, organisée en plans de profondeur indépendants :
// chaque plan est une couche que le fond anime avec son propre facteur de
// parallaxe (0 = infiniment loin, 1 = premier plan).
//
// La scène est composée dans un cadre aux proportions d'écran (1600×900) :
// le recadrage « slice » reste minime sur tous les formats, les facettes
// gardent une taille de facettes.
import { genererMontagne, type Facette, type PaletteMontagne } from './lowpoly';

export const LARGEUR_SCENE = 1600;
export const HAUTEUR_SCENE = 900;

export interface Sommet {
  x: number;
  hauteur: number;
  facettes: Facette[];
}

export interface PlanChaine {
  facteur: number; // amplitude de parallaxe au zoom
  opacite: number;
  sommets: Sommet[];
}

// Les paliers des chapitres, DANS le repère de la scène, en zigzag sur le
// versant du mont principal (apex ≈ (800, 220), base ≈ y 900, demi-base 440).
export const ANCRES: Record<number, { x: number; y: number }> = {
  0: { x: 560, y: 845 },
  1: { x: 980, y: 780 },
  2: { x: 640, y: 700 },
  3: { x: 950, y: 615 },
  4: { x: 690, y: 535 },
  5: { x: 920, y: 455 },
  6: { x: 740, y: 375 },
  7: { x: 805, y: 260 },
};

const PALETTE_LOINTAINE: PaletteMontagne = {
  ombre: '#0b1526',
  lumiere: '#182c44',
  neigeOmbre: '#33475e',
  neigeLumiere: '#4c637c',
  glace: '#1d3a52',
};
const PALETTE_MOYENNE: PaletteMontagne = {
  ombre: '#0f1c30',
  lumiere: '#24405c',
  neigeOmbre: '#5d7891',
  neigeLumiere: '#8fa9bf',
  glace: '#2e5670',
};
const PALETTE_COMPAGNE: PaletteMontagne = {
  ombre: '#16293f',
  lumiere: '#40607a',
  neigeOmbre: '#8fb0c2',
  neigeLumiere: '#c5dde8',
  glace: '#3f92ab',
};
const PALETTE_PRINCIPALE: PaletteMontagne = {
  ombre: '#1c3450',
  lumiere: '#5a87a6',
  neigeOmbre: '#b7d9e4',
  neigeLumiere: '#eef7fa',
  glace: '#56cfe1',
};

function chaine(
  entrees: { graine: number; x: number; largeur: number; hauteur: number }[],
  palette: PaletteMontagne,
  ligneNeige: number,
  probaGlace = 0,
  lignes = 6,
): Sommet[] {
  return entrees.map((entree) => ({
    x: entree.x,
    hauteur: entree.hauteur,
    facettes: genererMontagne({ ...entree, lignes, ligneNeige, probaGlace, palette }),
  }));
}

export const PLANS: PlanChaine[] = [
  {
    facteur: 0.3,
    opacite: 0.6,
    sommets: chaine(
      [
        { graine: 3, x: 110, largeur: 520, hauteur: 300 },
        { graine: 9, x: 420, largeur: 480, hauteur: 330 },
        { graine: 17, x: 760, largeur: 560, hauteur: 280 },
        { graine: 23, x: 1120, largeur: 500, hauteur: 340 },
        { graine: 31, x: 1440, largeur: 520, hauteur: 300 },
      ],
      PALETTE_LOINTAINE,
      0.1,
      0,
      5,
    ),
  },
  {
    facteur: 0.55,
    opacite: 0.85,
    sommets: chaine(
      [
        { graine: 7, x: 230, largeur: 600, hauteur: 430 },
        { graine: 13, x: 620, largeur: 540, hauteur: 390 },
        { graine: 19, x: 1035, largeur: 620, hauteur: 470 },
        { graine: 29, x: 1420, largeur: 560, hauteur: 410 },
      ],
      PALETTE_MOYENNE,
      0.14,
      0,
      7,
    ),
  },
  {
    facteur: 0.8,
    opacite: 1,
    sommets: chaine(
      [
        { graine: 41, x: -30, largeur: 520, hauteur: 420 },
        { graine: 43, x: 335, largeur: 560, hauteur: 500 },
        { graine: 47, x: 1250, largeur: 580, hauteur: 540 },
        { graine: 53, x: 1630, largeur: 540, hauteur: 440 },
      ],
      PALETTE_COMPAGNE,
      0.2,
      0.03,
      8,
    ),
  },
  {
    facteur: 1,
    opacite: 1,
    sommets: [
      {
        x: 800,
        hauteur: 680,
        facettes: genererMontagne({
          graine: 20180125,
          largeur: 880,
          hauteur: 680,
          lignes: 13,
          ligneNeige: 0.24,
          probaGlace: 0.06,
          palette: PALETTE_PRINCIPALE,
        }),
      },
    ],
  },
];
