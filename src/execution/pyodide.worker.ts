import { loadPyodide } from 'pyodide';
import type { MessageDepuisWorker, MessageVersWorker, ResultatExecution } from './protocole';

type Pyodide = Awaited<ReturnType<typeof loadPyodide>>;

// Exécute le code du joueur dans un espace isolé : sortie capturée, input()
// servi par les entrées scriptées du test (vide si épuisées — CONCEPTION §7).
const HARNAIS = `
import builtins, io, json, sys, traceback

def _pyquest_executer(code, entrees_json):
    entrees = json.loads(entrees_json)
    sortie = io.StringIO()

    def _entree(invite=""):
        sortie.write(str(invite))
        return entrees.pop(0) if entrees else ""

    ancien_stdout, ancienne_entree = sys.stdout, builtins.input
    sys.stdout = sortie
    builtins.input = _entree
    erreur = None
    try:
        exec(compile(code, "programme.py", "exec"), {"__name__": "__main__"})
    except SyntaxError as exc:
        erreur = {"type": type(exc).__name__, "message": exc.msg or str(exc), "ligne": exc.lineno}
    except BaseException as exc:
        pile = traceback.extract_tb(exc.__traceback__)
        ligne = next((c.lineno for c in reversed(pile) if c.filename == "programme.py"), None)
        erreur = {"type": type(exc).__name__, "message": str(exc), "ligne": ligne}
    finally:
        sys.stdout = ancien_stdout
        builtins.input = ancienne_entree
    return json.dumps({"sortie": sortie.getvalue(), "erreur": erreur})
`;

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
