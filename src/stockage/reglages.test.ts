import { describe, expect, it } from 'vitest';
import { chargerReglages, REGLAGES_DEFAUT, sauverReglages, type Reglages } from './reglages';

function fauxStockage(initial: Record<string, string> = {}) {
  const donnees = new Map(Object.entries(initial));
  return {
    getItem: (cle: string) => donnees.get(cle) ?? null,
    setItem: (cle: string, valeur: string) => void donnees.set(cle, valeur),
  };
}

describe('chargerReglages', () => {
  it('renvoie les défauts quand rien n’est stocké', () => {
    expect(chargerReglages(fauxStockage())).toEqual(REGLAGES_DEFAUT);
  });

  it('renvoie les défauts quand le contenu est corrompu', () => {
    const stockage = fauxStockage({ 'pyquest.reglages': '{pas du json' });
    expect(chargerReglages(stockage)).toEqual(REGLAGES_DEFAUT);
  });

  it('complète les champs manquants d’une vieille version', () => {
    const stockage = fauxStockage({ 'pyquest.reglages': '{"langue":"en"}' });
    expect(chargerReglages(stockage)).toEqual({ ...REGLAGES_DEFAUT, langue: 'en' });
  });

  it('migre l’ancien volume unique vers les deux volumes', () => {
    const stockage = fauxStockage({ 'pyquest.reglages': '{"volume":30}' });
    expect(chargerReglages(stockage)).toEqual({
      ...REGLAGES_DEFAUT,
      volumeMusique: 30,
      volumeEffets: 30,
    });
  });

  it('relit ce que sauverReglages a écrit', () => {
    const stockage = fauxStockage();
    const reglages: Reglages = {
      langue: 'en',
      volumeMusique: 30,
      volumeEffets: 55,
      taillePolice: 'grande',
    };
    sauverReglages(stockage, reglages);
    expect(chargerReglages(stockage)).toEqual(reglages);
  });
});
