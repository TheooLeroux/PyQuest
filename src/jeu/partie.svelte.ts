// La partie en cours : quel slot est ouvert, dans quelle salle on se trouve.
import { fiches } from '../contenu/catalogue';
import {
  chargerSlots,
  creerSlot,
  etatSalleVierge,
  sauverSlot,
  supprimerSlot,
  type EtatSalle,
  type Slot,
} from '../stockage/slots';
import { prochaineSalle } from './progression';

export const partie = $state({
  numeroSlot: 0, // 1 à 3, 0 = aucun
  slot: null as Slot | null,
  salleId: null as string | null,
});

export function listerSlots(): (Slot | null)[] {
  return chargerSlots(localStorage);
}

export function creerEtOuvrirSlot(numero: number, nom: string): void {
  const slot = creerSlot(nom);
  sauverSlot(localStorage, numero, slot);
  partie.numeroSlot = numero;
  partie.slot = slot;
}

export function ouvrirSlot(numero: number, slot: Slot): void {
  partie.numeroSlot = numero;
  partie.slot = slot;
}

export function effacerSlot(numero: number): void {
  supprimerSlot(localStorage, numero);
}

export function enregistrerPartie(): void {
  if (partie.slot && partie.numeroSlot > 0) {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- Date jetable, converti aussitôt en texte
    partie.slot.dernierJeuLe = new Date().toISOString();
    sauverSlot(localStorage, partie.numeroSlot, $state.snapshot(partie.slot) as Slot);
  }
}

/** L'état de la salle courante dans le slot, créé au premier accès. */
export function etatSalle(idSalle: string): EtatSalle {
  const slot = partie.slot!;
  slot.salles[idSalle] ??= etatSalleVierge();
  return slot.salles[idSalle];
}

export function entrerDansChapitre(num: number): void {
  const salle = prochaineSalle(partie.slot!, fiches, num);
  if (!salle) return;
  partie.salleId = salle.id;
  partie.slot!.positionSalle = salle.id;
  enregistrerPartie();
}
