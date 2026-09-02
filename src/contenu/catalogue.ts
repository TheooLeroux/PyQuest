import { analyserFiche } from './fiches';
import type { FicheSalle } from './types';

// Toutes les fiches du dossier contenu/ sont embarquées au build et validées
// au chargement : une fiche mal écrite fait échouer l'app (et les tests) tôt.
const bruts = import.meta.glob('/contenu/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const fiches: FicheSalle[] = Object.entries(bruts)
  .map(([chemin, texte]) => analyserFiche(chemin.split('/').pop()!, texte))
  .sort((a, b) => a.id.localeCompare(b.id));
