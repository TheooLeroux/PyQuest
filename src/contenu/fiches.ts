import { load } from 'js-yaml';
import type { FicheSalle, JeuDeTest } from './types';

// Une fiche = un en-tête YAML entre deux « --- », puis la consigne en Markdown.

function erreur(nomFichier: string, probleme: string): never {
  throw new Error(`Fiche ${nomFichier} : ${probleme}`);
}

function texteRequis(nomFichier: string, valeur: unknown, champ: string): string {
  if (typeof valeur !== 'string' || valeur.trim() === '') {
    erreur(nomFichier, `champ « ${champ} » manquant ou vide`);
  }
  return valeur;
}

function analyserTests(nomFichier: string, brut: unknown, attendreErreur: boolean): JeuDeTest[] {
  if (attendreErreur) return [];
  if (!Array.isArray(brut) || brut.length === 0) {
    erreur(nomFichier, 'au moins un jeu de tests est requis');
  }
  return brut.map((test, i) => {
    const objet = (test ?? {}) as Record<string, unknown>;
    const entrees = objet.entrees ?? [];
    if (!Array.isArray(entrees) || entrees.some((e) => typeof e !== 'string')) {
      erreur(nomFichier, `test ${i + 1} : « entrees » doit être une liste de textes`);
    }
    if (typeof objet.attendu !== 'string') {
      erreur(nomFichier, `test ${i + 1} : champ « attendu » manquant`);
    }
    // Le YAML « attendu: | » termine par un retour à la ligne : on l'enlève,
    // la tolérance du jugement s'en charge de toute façon.
    return { entrees: entrees as string[], attendu: objet.attendu.replace(/\n$/, '') };
  });
}

export function analyserFiche(nomFichier: string, texte: string): FicheSalle {
  const morceaux = texte.split(/^---$/m);
  if (morceaux.length < 3) {
    erreur(nomFichier, 'en-tête YAML introuvable (délimiteurs « --- »)');
  }
  const entete = load(morceaux[1]) as Record<string, unknown> | null;
  if (entete === null || typeof entete !== 'object') {
    erreur(nomFichier, 'en-tête YAML vide');
  }
  const consigne = morceaux.slice(2).join('---').trim();
  if (consigne === '') erreur(nomFichier, 'consigne vide');

  const id = nomFichier.replace(/\.md$/, '');
  const correspondance = /^(\d{2})_(\d{2})$/.exec(id);
  if (!correspondance) {
    erreur(nomFichier, 'le nom du fichier doit suivre le motif « CC_SS.md » (ex. 03_04.md)');
  }

  const difficulte = entete.difficulte;
  if (difficulte !== 1 && difficulte !== 2 && difficulte !== 3) {
    erreur(nomFichier, '« difficulte » doit valoir 1, 2 ou 3');
  }

  const attendreErreur = entete.attendre_erreur === true;

  const indices = entete.indices;
  if (!Array.isArray(indices) || indices.length !== 3) {
    erreur(nomFichier, 'exactement 3 indices sont requis (cryptique, pseudo-code, solution)');
  }

  return {
    id,
    chapitre: Number(correspondance[1]),
    ordre: Number(correspondance[2]),
    titre: texteRequis(nomFichier, entete.titre, 'titre'),
    difficulte,
    donne: 'standard',
    jugePar: 'affichage',
    attendreErreur,
    coeur: entete.coeur === true,
    codeDepart: typeof entete.code_depart === 'string' ? entete.code_depart.replace(/\n$/, '') : '',
    consigne,
    tests: analyserTests(nomFichier, entete.tests, attendreErreur),
    indices: indices.map((indice, i) =>
      texteRequis(nomFichier, indice, `indices[${i + 1}]`),
    ) as string[],
  };
}
