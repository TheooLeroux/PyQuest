export interface Reglages {
  langue: 'fr' | 'en';
  volumeMusique: number; // 0 à 100
  volumeEffets: number; // 0 à 100
  taillePolice: 'petite' | 'normale' | 'grande';
}

export const REGLAGES_DEFAUT: Reglages = {
  langue: 'fr',
  volumeMusique: 80,
  volumeEffets: 80,
  taillePolice: 'normale',
};

const CLE = 'pyquest.reglages';

type LectureStockage = Pick<Storage, 'getItem'>;
type EcritureStockage = Pick<Storage, 'setItem'>;

export function chargerReglages(stockage: LectureStockage): Reglages {
  try {
    const brut = stockage.getItem(CLE);
    if (brut === null) return { ...REGLAGES_DEFAUT };
    const lu: unknown = JSON.parse(brut);
    if (typeof lu !== 'object' || lu === null) return { ...REGLAGES_DEFAUT };
    // Les champs inconnus sont ignorés, les manquants prennent leur valeur par
    // défaut : une save d'une vieille version du jeu reste lisible.
    const ancien = lu as Partial<Reglages> & { volume?: number };
    const reglages = { ...REGLAGES_DEFAUT, ...ancien };
    // Migration : l'ancien volume unique alimente les deux nouveaux.
    if (typeof ancien.volume === 'number') {
      reglages.volumeMusique = ancien.volume;
      reglages.volumeEffets = ancien.volume;
    }
    delete (reglages as Record<string, unknown>).volume;
    return reglages;
  } catch {
    return { ...REGLAGES_DEFAUT };
  }
}

export function sauverReglages(stockage: EcritureStockage, reglages: Reglages): void {
  stockage.setItem(CLE, JSON.stringify(reglages));
}
