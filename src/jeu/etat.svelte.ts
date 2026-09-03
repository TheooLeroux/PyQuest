import { chargerReglages, sauverReglages } from '../stockage/reglages';
import { textes, type CleTexte } from './textes';

export type Ecran = 'titre' | 'sauvegardes' | 'options' | 'credits' | 'carte' | 'salle';

export const etat = $state({
  ecran: 'titre' as Ecran,
  // D'où Options/Crédits ont été ouverts, pour y revenir à l'Échap.
  ecranPrecedent: 'titre' as Ecran,
  // Mémoire de l'écran titre : revenir des Options ramène au menu, pas au logo.
  phaseTitre: 'logo' as 'logo' | 'menu',
  indexTitre: 0,
  // Le voyage vers la carte démarre AVANT de quitter l'écran des sauvegardes.
  enVoyage: false,
  reglages: chargerReglages(localStorage),
});

export function aller(ecran: Ecran): void {
  etat.ecranPrecedent = etat.ecran;
  etat.ecran = ecran;
}

const RETOURS: Partial<Record<Ecran, Ecran>> = {
  salle: 'carte',
  carte: 'sauvegardes',
  sauvegardes: 'titre',
};

export function retour(): void {
  if (etat.ecran === 'options' || etat.ecran === 'credits') {
    etat.ecran = etat.ecranPrecedent;
    return;
  }
  const cible = RETOURS[etat.ecran];
  if (cible) etat.ecran = cible;
}

export function enregistrerReglages(): void {
  sauverReglages(localStorage, etat.reglages);
}

export function t(cle: CleTexte): string {
  return textes[etat.reglages.langue][cle];
}
