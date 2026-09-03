import { describe, expect, it } from 'vitest';
import { formaterDuree } from './affichage';

describe('formaterDuree', () => {
  it('affiche les secondes sous la minute', () => {
    expect(formaterDuree(45)).toBe('45 s');
  });

  it('affiche les minutes sous l’heure', () => {
    expect(formaterDuree(12 * 60 + 30)).toBe('12 min');
  });

  it('affiche heures et minutes au-delà', () => {
    expect(formaterDuree(3600 + 4 * 60)).toBe('1 h 04');
  });
});
