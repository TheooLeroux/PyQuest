// La chaîne du mont PyQuest, organisée en plans de profondeur indépendants :
// chaque plan est une couche que le fond anime avec son propre facteur de
// parallaxe (0 = infiniment loin, 1 = premier plan).
import { genererMontagne, type Facette, type PaletteMontagne } from './lowpoly';

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
        { graine: 3, x: 110, largeur: 420, hauteur: 150 },
        { graine: 9, x: 420, largeur: 380, hauteur: 175 },
        { graine: 17, x: 760, largeur: 460, hauteur: 140 },
        { graine: 23, x: 1120, largeur: 400, hauteur: 185 },
        { graine: 31, x: 1440, largeur: 440, hauteur: 155 },
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
        { graine: 7, x: 230, largeur: 480, hauteur: 235 },
        { graine: 13, x: 620, largeur: 430, hauteur: 205 },
        { graine: 19, x: 1035, largeur: 500, hauteur: 250 },
        { graine: 29, x: 1420, largeur: 460, hauteur: 215 },
      ],
      PALETTE_MOYENNE,
      0.14,
    ),
  },
  {
    facteur: 0.8,
    opacite: 1,
    sommets: chaine(
      [
        { graine: 41, x: -30, largeur: 420, hauteur: 225 },
        { graine: 43, x: 335, largeur: 440, hauteur: 260 },
        { graine: 47, x: 1250, largeur: 470, hauteur: 285 },
        { graine: 53, x: 1630, largeur: 430, hauteur: 235 },
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
        hauteur: 355,
        facettes: genererMontagne({
          graine: 20180125,
          largeur: 500,
          hauteur: 355,
          lignes: 11,
          ligneNeige: 0.26,
          probaGlace: 0.06,
          palette: PALETTE_PRINCIPALE,
        }),
      },
    ],
  },
];
