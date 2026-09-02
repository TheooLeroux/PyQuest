// Le garde-fou du contenu : la solution officielle de chaque salle (indice 3)
// est exécutée dans le vrai Pyodide et doit passer tous les tests de sa fiche.
// Une fiche dont la solution échoue est une fiche cassée.
import { loadPyodide } from 'pyodide';
import { beforeAll, describe, expect, it } from 'vitest';
import { HARNAIS } from '../execution/harnais';
import { jugerErreurAttendue, jugerTest } from '../execution/jugement';
import type { ResultatExecution } from '../execution/protocole';
import { fiches } from './catalogue';

type Pyodide = Awaited<ReturnType<typeof loadPyodide>>;
let pyodide: Pyodide;

beforeAll(async () => {
  pyodide = await loadPyodide();
  pyodide.runPython(HARNAIS);
}, 120_000);

function executer(code: string, entrees: string[]): ResultatExecution {
  const executerPy = pyodide.globals.get('_pyquest_executer');
  try {
    const brut: string = executerPy(code, JSON.stringify(entrees));
    const lu = JSON.parse(brut) as Omit<ResultatExecution, 'interrompu'>;
    return { ...lu, interrompu: false };
  } finally {
    executerPy.destroy();
  }
}

function extraireSolution(indice: string): string {
  const bloc = /```python\n([\s\S]*?)```/.exec(indice);
  if (!bloc) throw new Error('pas de bloc ```python dans l’indice 3');
  return bloc[1];
}

describe('les solutions officielles passent leurs propres tests', () => {
  for (const fiche of fiches) {
    it(`${fiche.id} — ${fiche.titre}`, () => {
      const solution = extraireSolution(fiche.indices[2]);

      if (fiche.attendreErreur) {
        const resultat = jugerErreurAttendue(executer(solution, []));
        expect(resultat.reussi, 'la solution devait planter').toBe(true);
        return;
      }

      for (const [i, test] of fiche.tests.entries()) {
        const resultat = jugerTest(test.attendu, executer(solution, test.entrees));
        expect(
          resultat.reussi,
          `test ${i + 1} : attendu ${JSON.stringify(resultat.attendu)}, ` +
            `obtenu ${JSON.stringify(resultat.obtenu)}` +
            (resultat.erreur ? ` (${resultat.erreur.type}: ${resultat.erreur.message})` : ''),
        ).toBe(true);
      }
    });
  }
});
