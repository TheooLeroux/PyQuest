// Messages échangés entre l'application et le worker Python.

export interface ErreurPython {
  type: string; // NameError, SyntaxError, KeyboardInterrupt…
  message: string;
  ligne: number | null; // dans le code du joueur, à partir de 1
}

export interface ResultatExecution {
  sortie: string; // tout ce que le programme a affiché
  erreur: ErreurPython | null;
  interrompu: boolean; // arrêté par le timeout
}

export type MessageVersWorker =
  | { type: 'init'; tamponInterruption: SharedArrayBuffer }
  | { type: 'executer'; id: number; code: string; entrees: string[] };

export type MessageDepuisWorker =
  { type: 'pret' } | { type: 'resultat'; id: number; resultat: ResultatExecution };
