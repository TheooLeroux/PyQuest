import type { ErreurPython, ResultatExecution } from './protocole';

// Règles de tolérance du jugement par affichage (docs/DONNEES.md) :
// on pardonne l'invisible qui n'enseigne rien, on reste strict sur le visible.
export interface Tolerance {
  finsDeLigne: boolean; // ignorer les espaces en fin de ligne
  lignesFinales: boolean; // ignorer les lignes vides à la toute fin
}

export const TOLERANCE_DEFAUT: Tolerance = {
  finsDeLigne: true,
  lignesFinales: true,
};

export function normaliser(texte: string, tolerance: Tolerance = TOLERANCE_DEFAUT): string {
  let lignes = texte.replace(/\r\n/g, '\n').split('\n');
  if (tolerance.finsDeLigne) {
    lignes = lignes.map((ligne) => ligne.replace(/[ \t]+$/, ''));
  }
  if (tolerance.lignesFinales) {
    while (lignes.length > 0 && lignes[lignes.length - 1] === '') {
      lignes.pop();
    }
  }
  return lignes.join('\n');
}

export function sortiesEquivalentes(
  attendu: string,
  obtenu: string,
  tolerance: Tolerance = TOLERANCE_DEFAUT,
): boolean {
  return normaliser(attendu, tolerance) === normaliser(obtenu, tolerance);
}

export interface ResultatTest {
  reussi: boolean;
  attendu: string;
  obtenu: string;
  erreur: ErreurPython | null;
  interrompu: boolean;
}

export function jugerTest(
  attendu: string,
  execution: ResultatExecution,
  tolerance: Tolerance = TOLERANCE_DEFAUT,
): ResultatTest {
  return {
    reussi: execution.erreur === null && sortiesEquivalentes(attendu, execution.sortie, tolerance),
    attendu,
    obtenu: execution.sortie,
    erreur: execution.erreur,
    interrompu: execution.interrompu,
  };
}

// Cas particulier du Prologue (« Casse le programme exprès ») : la salle est
// réussie si le programme PLANTE — n'importe quelle erreur, sauf le timeout.
export function jugerErreurAttendue(execution: ResultatExecution): ResultatTest {
  return {
    reussi: execution.erreur !== null && !execution.interrompu,
    attendu: '',
    obtenu: execution.sortie,
    erreur: execution.erreur,
    interrompu: execution.interrompu,
  };
}
