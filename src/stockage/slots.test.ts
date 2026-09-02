import { describe, expect, it } from 'vitest';
import { chargerSlot, chargerSlots, creerSlot, sauverSlot, supprimerSlot } from './slots';

function fauxStockage() {
  const donnees = new Map<string, string>();
  return {
    getItem: (cle: string) => donnees.get(cle) ?? null,
    setItem: (cle: string, valeur: string) => void donnees.set(cle, valeur),
    removeItem: (cle: string) => void donnees.delete(cle),
  };
}

describe('slots', () => {
  it('un slot jamais créé est null', () => {
    expect(chargerSlots(fauxStockage())).toEqual([null, null, null]);
  });

  it('relit ce qui a été sauvé', () => {
    const stockage = fauxStockage();
    const slot = creerSlot('Théo');
    slot.salles['00_01'] = {
      statut: 'validee',
      code: 'print("Bonjour, PyQuest !")',
      chutes: 2,
      tempsSec: 90,
      fraise: false,
      palierIndice: 1,
    };
    sauverSlot(stockage, 2, slot);
    expect(chargerSlot(stockage, 2)).toEqual(slot);
    expect(chargerSlot(stockage, 1)).toBeNull();
  });

  it('une save corrompue redevient un slot vide plutôt que de planter', () => {
    const stockage = fauxStockage();
    stockage.setItem('pyquest.slot1', '{corrompu');
    expect(chargerSlot(stockage, 1)).toBeNull();
  });

  it('supprime un slot', () => {
    const stockage = fauxStockage();
    sauverSlot(stockage, 3, creerSlot('X'));
    supprimerSlot(stockage, 3);
    expect(chargerSlot(stockage, 3)).toBeNull();
  });
});
