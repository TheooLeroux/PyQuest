// Le harnais Python : exécute le code du joueur dans un espace isolé,
// capture la sortie, sert input() avec les entrées scriptées du test
// (vide si épuisées — CONCEPTION §7), et rapporte l'erreur éventuelle.
export const HARNAIS = `
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
