import { describe, expect, it } from 'vitest';
import { fiches } from '../contenu/catalogue';
import { creerSlot, etatSalleVierge, type Slot } from '../stockage/slots';
import {
  chapitreDebloque,
  pourcentageAscension,
  prochaineSalle,
  salleSuivante,
  statsChapitre,
} from './progression';

function slotAvecValidees(ids: string[]): Slot {
  const slot = creerSlot('Test');
  for (const id of ids) {
    slot.salles[id] = { ...etatSalleVierge(), statut: 'validee' };
  }
  return slot;
}

const idsPrologue = fiches.filter((f) => f.chapitre === 0).map((f) => f.id);

describe('progression', () => {
  it('le Prologue est toujours débloqué, le chapitre 1 non tant que le Prologue n’est pas fini', () => {
    const slot = creerSlot('Test');
    expect(chapitreDebloque(slot, fiches, 0)).toBe(true);
    expect(chapitreDebloque(slot, fiches, 1)).toBe(false);
  });

  it('finir toutes les salles du Prologue débloque le chapitre 1', () => {
    const slot = slotAvecValidees(idsPrologue);
    expect(chapitreDebloque(slot, fiches, 1)).toBe(true);
    expect(chapitreDebloque(slot, fiches, 2)).toBe(false);
  });

  it('la prochaine salle est la première non validée', () => {
    const slot = slotAvecValidees(['00_01']);
    expect(prochaineSalle(slot, fiches, 0)?.id).toBe('00_02');
  });

  it('salleSuivante enchaîne dans le chapitre et s’arrête à la fin', () => {
    expect(salleSuivante(fiches, '00_01')?.id).toBe('00_02');
    expect(salleSuivante(fiches, '00_03')).toBeNull();
  });

  it('les stats se calculent depuis les salles', () => {
    const slot = slotAvecValidees(['00_01', '00_02']);
    slot.salles['00_01'].chutes = 3;
    const stats = statsChapitre(slot, fiches, 0);
    expect(stats).toEqual({ validees: 2, total: 3, chutes: 3, fraises: 0, tempsSec: 0 });
    expect(pourcentageAscension(slot, fiches)).toBe(Math.round((2 / fiches.length) * 100));
  });
});
