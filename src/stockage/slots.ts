// Les sauvegardes du joueur — voir docs/DONNEES.md (domaine 2).
// On ne stocke jamais ce qui se calcule (stats, %) : tout dérive des salles.

export interface EtatSalle {
  statut: 'en_cours' | 'validee';
  code: string; // le dernier code écrit, conservé même après validation
  chutes: number;
  tempsSec: number;
  fraise: boolean;
  palierIndice: 0 | 1 | 2 | 3;
}

export interface Slot {
  nom: string;
  creeLe: string; // ISO
  dernierJeuLe: string; // ISO
  positionSalle: string | null; // cible de « Reprendre »
  salles: Record<string, EtatSalle>;
}

export const NOMBRE_SLOTS = 3;

const cle = (numero: number) => `pyquest.slot${numero}`;

type LectureStockage = Pick<Storage, 'getItem'>;
type EcritureStockage = Pick<Storage, 'setItem' | 'removeItem'>;

export function creerSlot(nom: string, maintenant: Date = new Date()): Slot {
  return {
    nom,
    creeLe: maintenant.toISOString(),
    dernierJeuLe: maintenant.toISOString(),
    positionSalle: null,
    salles: {},
  };
}

export function etatSalleVierge(): EtatSalle {
  return { statut: 'en_cours', code: '', chutes: 0, tempsSec: 0, fraise: false, palierIndice: 0 };
}

export function chargerSlot(stockage: LectureStockage, numero: number): Slot | null {
  try {
    const brut = stockage.getItem(cle(numero));
    if (brut === null) return null;
    const lu: unknown = JSON.parse(brut);
    if (typeof lu !== 'object' || lu === null) return null;
    const slot = lu as Partial<Slot>;
    if (typeof slot.nom !== 'string' || typeof slot.salles !== 'object' || slot.salles === null) {
      return null;
    }
    return { ...creerSlot(slot.nom), ...slot } as Slot;
  } catch {
    return null;
  }
}

export function chargerSlots(stockage: LectureStockage): (Slot | null)[] {
  return Array.from({ length: NOMBRE_SLOTS }, (_, i) => chargerSlot(stockage, i + 1));
}

export function sauverSlot(stockage: EcritureStockage, numero: number, slot: Slot): void {
  stockage.setItem(cle(numero), JSON.stringify(slot));
}

export function supprimerSlot(stockage: EcritureStockage, numero: number): void {
  stockage.removeItem(cle(numero));
}
