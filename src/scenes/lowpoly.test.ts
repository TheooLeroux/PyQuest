import { describe, expect, it } from 'vitest';
import { genererMontagne, type ParametresMontagne } from './lowpoly';

const PARAMETRES: ParametresMontagne = {
  graine: 42,
  largeur: 400,
  hauteur: 300,
  lignes: 8,
  ligneNeige: 0.25,
  probaGlace: 0.05,
  palette: {
    ombre: '#1c3450',
    lumiere: '#5a87a6',
    neigeOmbre: '#b7d9e4',
    neigeLumiere: '#eef7fa',
    glace: '#56cfe1',
  },
};

describe('genererMontagne', () => {
  it('est déterministe : même graine, même montagne', () => {
    expect(genererMontagne(PARAMETRES)).toEqual(genererMontagne(PARAMETRES));
  });

  it('change avec la graine', () => {
    const autre = genererMontagne({ ...PARAMETRES, graine: 43 });
    expect(autre).not.toEqual(genererMontagne(PARAMETRES));
  });

  it('produit un maillage complet (lignes² facettes)', () => {
    expect(genererMontagne(PARAMETRES)).toHaveLength(8 * 8);
  });

  it('reste dans le gabarit demandé', () => {
    for (const facette of genererMontagne(PARAMETRES)) {
      for (const paire of facette.points.split(' ')) {
        const [x, y] = paire.split(',').map(Number);
        expect(Math.abs(x)).toBeLessThan(400);
        expect(y).toBeGreaterThan(-40);
        expect(y).toBeLessThanOrEqual(300);
      }
    }
  });
});
