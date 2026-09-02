import { describe, expect, it } from 'vitest';
import { analyserFiche } from './fiches';
import { fiches } from './catalogue';
import { CHAPITRES } from './chapitres';

const FICHE_VALIDE = `---
titre: Test
difficulte: 2
code_depart: |
  # go
tests:
  - entrees: ["a"]
    attendu: "ok"
indices:
  - un
  - deux
  - trois
---
La consigne.
`;

describe('analyserFiche', () => {
  it('lit une fiche complète', () => {
    const fiche = analyserFiche('03_04.md', FICHE_VALIDE);
    expect(fiche).toMatchObject({
      id: '03_04',
      chapitre: 3,
      ordre: 4,
      titre: 'Test',
      difficulte: 2,
      consigne: 'La consigne.',
    });
    expect(fiche.tests[0]).toEqual({ entrees: ['a'], attendu: 'ok' });
  });

  it('refuse un nom de fichier hors motif', () => {
    expect(() => analyserFiche('salle.md', FICHE_VALIDE)).toThrow(/CC_SS/);
  });

  it('refuse une fiche sans tests (hors attendre_erreur)', () => {
    const texte = FICHE_VALIDE.replace(/tests:[\s\S]*?indices:/, 'indices:');
    expect(() => analyserFiche('03_04.md', texte)).toThrow(/jeu de tests/);
  });

  it('exige exactement 3 indices', () => {
    const texte = FICHE_VALIDE.replace('  - trois\n', '');
    expect(() => analyserFiche('03_04.md', texte)).toThrow(/3 indices/);
  });
});

describe('catalogue', () => {
  it('toutes les fiches embarquées sont valides et rattachées à un chapitre connu', () => {
    expect(fiches.length).toBeGreaterThan(0);
    for (const fiche of fiches) {
      expect(
        CHAPITRES.some((c) => c.num === fiche.chapitre),
        fiche.id,
      ).toBe(true);
    }
  });

  it('les identifiants sont uniques', () => {
    const ids = fiches.map((fiche) => fiche.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
