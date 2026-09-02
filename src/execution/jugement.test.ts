import { describe, expect, it } from 'vitest';
import { jugerErreurAttendue, jugerTest, normaliser, sortiesEquivalentes } from './jugement';
import type { ResultatExecution } from './protocole';

function execution(sortie: string, partiel: Partial<ResultatExecution> = {}): ResultatExecution {
  return { sortie, erreur: null, interrompu: false, ...partiel };
}

describe('normaliser', () => {
  it('ignore les espaces en fin de ligne', () => {
    expect(normaliser('Bonjour !  \nSuite\t')).toBe('Bonjour !\nSuite');
  });

  it('ignore les lignes vides finales', () => {
    expect(normaliser('Bonjour\n\n\n')).toBe('Bonjour');
  });

  it('reste strict sur les espaces au milieu, la casse et les accents', () => {
    expect(sortiesEquivalentes('Bonjour Théo', 'Bonjour  Théo')).toBe(false);
    expect(sortiesEquivalentes('Bonjour', 'bonjour')).toBe(false);
    expect(sortiesEquivalentes('Théo', 'Theo')).toBe(false);
  });

  it('reste strict sur les lignes vides au milieu', () => {
    expect(sortiesEquivalentes('a\n\nb', 'a\nb')).toBe(false);
  });

  it('unifie les fins de ligne Windows', () => {
    expect(sortiesEquivalentes('a\r\nb', 'a\nb')).toBe(true);
  });
});

describe('jugerTest', () => {
  it('réussit quand la sortie correspond, à la tolérance près', () => {
    expect(jugerTest('Bonjour !', execution('Bonjour ! \n')).reussi).toBe(true);
  });

  it('échoue sur une sortie différente', () => {
    expect(jugerTest('Bonjour !', execution('Salut !')).reussi).toBe(false);
  });

  it('échoue quand le programme a planté, même avec la bonne sortie', () => {
    const resultat = jugerTest(
      'Bonjour !',
      execution('Bonjour !', { erreur: { type: 'NameError', message: 'x', ligne: 2 } }),
    );
    expect(resultat.reussi).toBe(false);
    expect(resultat.erreur?.type).toBe('NameError');
  });
});

describe('jugerErreurAttendue', () => {
  it('réussit quand le programme plante', () => {
    const resultat = jugerErreurAttendue(
      execution('', { erreur: { type: 'ZeroDivisionError', message: 'division', ligne: 1 } }),
    );
    expect(resultat.reussi).toBe(true);
  });

  it('échoue quand le programme se déroule sans erreur', () => {
    expect(jugerErreurAttendue(execution('tout va bien')).reussi).toBe(false);
  });

  it('un timeout ne compte pas comme une erreur réussie', () => {
    const resultat = jugerErreurAttendue(
      execution('', {
        erreur: { type: 'KeyboardInterrupt', message: '', ligne: null },
        interrompu: true,
      }),
    );
    expect(resultat.reussi).toBe(false);
  });
});
