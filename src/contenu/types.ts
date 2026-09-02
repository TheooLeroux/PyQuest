// Le modèle du contenu pédagogique — voir docs/DONNEES.md (fiche de salle).

export interface JeuDeTest {
  entrees: string[]; // servies à input() dans l'ordre
  attendu: string; // sortie attendue (jugement par affichage)
}

export interface FicheSalle {
  id: string; // "03_04" — stable à jamais, seed du terrain
  chapitre: number;
  ordre: number;
  titre: string;
  difficulte: 1 | 2 | 3;
  donne: 'standard'; // buggé / à trous / qcm : à venir
  jugePar: 'affichage'; // fonction / qcm : à venir
  attendreErreur: boolean; // la salle est réussie si le programme PLANTE
  coeur: boolean; // cœur de cristal (mini-projet de fin de chapitre)
  codeDepart: string;
  consigne: string; // Markdown
  tests: JeuDeTest[];
  indices: string[]; // 3 paliers : cryptique → pseudo-code → solution
}
