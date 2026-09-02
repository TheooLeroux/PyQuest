import type { FicheSalle } from './types';

export interface Chapitre {
  num: number;
  nom: string;
  concept: string;
}

// Les noms et concepts sont fixés par docs/CONCEPTION.md §4 et WORLDBUILDING.md.
export const CHAPITRES: Chapitre[] = [
  { num: 0, nom: 'Prologue', concept: 'print, l’éditeur, échouer' },
  { num: 1, nom: 'La Cité abandonnée', concept: 'variables, types, input' },
  { num: 2, nom: 'Le Vieux Site', concept: 'conditions, booléens' },
  { num: 3, nom: 'Le Resort céleste', concept: 'boucles' },
  { num: 4, nom: 'La Crête dorée', concept: 'listes' },
  { num: 5, nom: 'Le Temple des miroirs', concept: 'fonctions' },
  { num: 6, nom: 'Réflexion', concept: 'chaînes, dictionnaires' },
  { num: 7, nom: 'Le Sommet', concept: 'exceptions, fichiers' },
];

export function sallesDuChapitre(fiches: FicheSalle[], num: number): FicheSalle[] {
  return fiches.filter((fiche) => fiche.chapitre === num);
}
