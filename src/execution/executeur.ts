import type { MessageDepuisWorker, MessageVersWorker, ResultatExecution } from './protocole';

export const TIMEOUT_MS = 5000;
// Si le worker ne répond toujours pas après l'interruption, on le remplace.
const DELAI_MASSUE_MS = 2000;

interface Attente {
  resoudre: (resultat: ResultatExecution) => void;
}

export class Executeur {
  private worker: Worker | null = null;
  private tampon = new SharedArrayBuffer(1);
  private interruption = new Uint8Array(this.tampon);
  private pret: Promise<void> = Promise.resolve();
  private compteur = 0;
  private attentes = new Map<number, Attente>();

  constructor() {
    this.demarrerWorker();
  }

  private demarrerWorker(): void {
    this.worker?.terminate();
    this.attentes.clear();
    this.interruption[0] = 0;

    const worker = new Worker(new URL('./pyodide.worker.ts', import.meta.url), {
      type: 'module',
    });
    this.worker = worker;
    this.pret = new Promise((resoudre) => {
      worker.onmessage = (evenement: MessageEvent<MessageDepuisWorker>) => {
        const message = evenement.data;
        if (message.type === 'pret') {
          resoudre();
          return;
        }
        const attente = this.attentes.get(message.id);
        if (attente) {
          this.attentes.delete(message.id);
          attente.resoudre(message.resultat);
        }
      };
      worker.postMessage({
        type: 'init',
        tamponInterruption: this.tampon,
      } satisfies MessageVersWorker);
    });
  }

  /** Précharge Pyodide (à appeler dès l'entrée dans une salle). */
  prechauffer(): Promise<void> {
    return this.pret;
  }

  async executer(code: string, entrees: string[]): Promise<ResultatExecution> {
    await this.pret;
    const id = ++this.compteur;

    return new Promise<ResultatExecution>((resoudre) => {
      // 1er étage : demander poliment l'arrêt (KeyboardInterrupt dans le worker).
      const timerInterruption = setTimeout(() => {
        this.interruption[0] = 2;
      }, TIMEOUT_MS);

      // 2e étage : worker coincé malgré tout — on le détruit et on le relance.
      const timerMassue = setTimeout(() => {
        this.attentes.delete(id);
        this.demarrerWorker();
        resoudre({
          sortie: '',
          erreur: { type: 'KeyboardInterrupt', message: 'programme interrompu', ligne: null },
          interrompu: true,
        });
      }, TIMEOUT_MS + DELAI_MASSUE_MS);

      this.attentes.set(id, {
        resoudre: (resultat) => {
          clearTimeout(timerInterruption);
          clearTimeout(timerMassue);
          this.interruption[0] = 0;
          resoudre(resultat);
        },
      });

      this.worker!.postMessage({
        type: 'executer',
        id,
        code,
        entrees,
      } satisfies MessageVersWorker);
    });
  }
}

let instance: Executeur | null = null;

export function obtenirExecuteur(): Executeur {
  instance ??= new Executeur();
  return instance;
}
