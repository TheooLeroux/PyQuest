// Règles de progression et de déblocage — CONCEPTION §3.
import type { FicheSalle } from '../contenu/types';
import { sallesDuChapitre } from '../contenu/chapitres';
import type { Slot } from '../stockage/slots';

export function salleValidee(slot: Slot, idSalle: string): boolean {
  return slot.salles[idSalle]?.statut === 'validee';
}

export function chapitreValide(slot: Slot, fiches: FicheSalle[], num: number): boolean {
  const salles = sallesDuChapitre(fiches, num);
  return salles.length > 0 && salles.every((salle) => salleValidee(slot, salle.id));
}

// Le chapitre N+1 se débloque quand toutes les salles de N sont validées
// (les fraises ne bloquent jamais). Le Prologue est toujours ouvert.
export function chapitreDebloque(slot: Slot, fiches: FicheSalle[], num: number): boolean {
  if (num === 0) return true;
  return chapitreValide(slot, fiches, num - 1);
}

/** La salle où « Gravir » ou « Reprendre » mène : la première non validée. */
export function prochaineSalle(slot: Slot, fiches: FicheSalle[], num: number): FicheSalle | null {
  const salles = sallesDuChapitre(fiches, num);
  return salles.find((salle) => !salleValidee(slot, salle.id)) ?? salles[0] ?? null;
}

/** La salle qui suit dans le même chapitre, ou null en fin de chapitre. */
export function salleSuivante(fiches: FicheSalle[], idSalle: string): FicheSalle | null {
  const courante = fiches.find((fiche) => fiche.id === idSalle);
  if (!courante) return null;
  const salles = sallesDuChapitre(fiches, courante.chapitre);
  const position = salles.findIndex((salle) => salle.id === idSalle);
  return salles[position + 1] ?? null;
}

export interface StatsChapitre {
  validees: number;
  total: number;
  chutes: number;
}

export function statsChapitre(slot: Slot, fiches: FicheSalle[], num: number): StatsChapitre {
  const salles = sallesDuChapitre(fiches, num);
  return {
    validees: salles.filter((salle) => salleValidee(slot, salle.id)).length,
    total: salles.length,
    chutes: salles.reduce((somme, salle) => somme + (slot.salles[salle.id]?.chutes ?? 0), 0),
  };
}

export function fraisesTotales(slot: Slot): number {
  return Object.values(slot.salles).filter((salle) => salle.fraise).length;
}

export function tempsTotalSec(slot: Slot): number {
  return Object.values(slot.salles).reduce((somme, salle) => somme + salle.tempsSec, 0);
}

/** Pourcentage d'ascension du slot, calculé — jamais stocké (DONNEES.md). */
export function pourcentageAscension(slot: Slot, fiches: FicheSalle[]): number {
  if (fiches.length === 0) return 0;
  const validees = fiches.filter((fiche) => salleValidee(slot, fiche.id)).length;
  return Math.round((validees / fiches.length) * 100);
}
