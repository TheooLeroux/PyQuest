import { describe, expect, it } from 'vitest';
import { textes } from './textes';

describe('textes', () => {
  it('chaque clé française existe en anglais, et rien de plus', () => {
    expect(Object.keys(textes.en).sort()).toEqual(Object.keys(textes.fr).sort());
  });

  it('aucun texte n’est vide', () => {
    for (const langue of ['fr', 'en'] as const) {
      for (const [cle, valeur] of Object.entries(textes[langue])) {
        expect(valeur.trim(), `${langue}:${cle}`).not.toBe('');
      }
    }
  });
});
