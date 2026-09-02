import { loadPyodide } from 'pyodide';
import { HARNAIS } from './harnais';
import type { MessageDepuisWorker, MessageVersWorker, ResultatExecution } from './protocole';

type Pyodide = Awaited<ReturnType<typeof loadPyodide>>;

let pyodidePromesse: Promise<Pyodide> | null = null;

async function demarrer(tampon: SharedArrayBuffer): Promise<Pyodide> {
  const pyodide = await loadPyodide({ indexURL: '/pyodide/' });
  pyodide.setInterruptBuffer(new Uint8Array(tampon));
  pyodide.runPython(HARNAIS);
  return pyodide;
}

function repondre(message: MessageDepuisWorker) {
  self.postMessage(message);
}

self.onmessage = async (evenement: MessageEvent<MessageVersWorker>) => {
  const message = evenement.data;

  if (message.type === 'init') {
    pyodidePromesse = demarrer(message.tamponInterruption);
    await pyodidePromesse;
    repondre({ type: 'pret' });
    return;
  }

  const pyodide = await pyodidePromesse!;
  let resultat: ResultatExecution;
  const executer = pyodide.globals.get('_pyquest_executer');
  try {
    const brut: string = executer(message.code, JSON.stringify(message.entrees));
    const lu = JSON.parse(brut) as Omit<ResultatExecution, 'interrompu'>;
    resultat = { ...lu, interrompu: lu.erreur?.type === 'KeyboardInterrupt' };
  } catch (exc) {
    resultat = {
      sortie: '',
      erreur: { type: 'ErreurInterne', message: String(exc), ligne: null },
      interrompu: false,
    };
  } finally {
    executer.destroy();
  }
  repondre({ type: 'resultat', id: message.id, resultat });
};
