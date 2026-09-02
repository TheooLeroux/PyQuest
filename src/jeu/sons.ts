// Bruitages d'interface. Fichiers dans public/sons/ (non versionnés — extraits
// de la copie locale de Celeste via scripts/extraire_sons.py). S'ils manquent,
// silence, sans erreur (CONCEPTION §5 : fallback silencieux).
import { etat } from './etat.svelte';

const FICHIERS = {
  premiereTouche: 'ui_main_title_firstinput',
  menuHaut: 'ui_main_roll_up',
  menuBas: 'ui_main_roll_down',
  valider: 'ui_main_button_select',
  retour: 'ui_main_button_back',
  invalide: 'ui_main_button_invalid',
  slotDefile: 'ui_main_savefile_roll_01',
  slotOuvrir: 'ui_main_savefile_begin',
  slotSupprimer: 'ui_main_savefile_delete',
  nomAccepte: 'ui_main_rename_entry_accept',
  carteGauche: 'ui_world_icon_roll_left',
  carteDroite: 'ui_world_icon_roll_right',
  carteChoisir: 'ui_world_icon_select',
  carteRetour: 'ui_world_chapter_back',
  pause: 'ui_game_pause',
  reprise: 'ui_game_unpause',
} as const;

export type NomSon = keyof typeof FICHIERS;

const cache = new Map<NomSon, HTMLAudioElement>();

export function jouerSon(nom: NomSon): void {
  try {
    let audio = cache.get(nom);
    if (!audio) {
      audio = new Audio(`/sons/${FICHIERS[nom]}.ogg`);
      cache.set(nom, audio);
    }
    audio.volume = Math.max(0, Math.min(1, etat.reglages.volume / 100));
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // Audio indisponible : le jeu reste silencieux, jamais bloqué.
  }
}
