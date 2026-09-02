# PyQuest

> Tu gravis le mont PyQuest. Chaque palier est un concept Python.
> Chaque chute t'apprend quelque chose.

**PyQuest** est un jeu pour apprendre Python en partant de zéro, inspiré de
*Celeste* (Maddy Makes Games). On gravit une montagne chapitre par chapitre —
variables, conditions, boucles, fonctions… — en écrivant du **vrai code Python**
dans de courtes salles-exercices. Échouer fait partie du jeu : un test raté est
une « chute », on réapparaît aussitôt, et un guide bienveillant explique ce qui
s'est passé.

🚧 **En construction.** Le jeu n'est pas encore jouable.

## Lancer la version de développement

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:5173 — tout se joue au clavier.

## Sous le capot

- Interface : [Svelte 5](https://svelte.dev) + TypeScript, construite avec [Vite](https://vite.dev)
- Le Python du joueur s'exécute dans le navigateur via [Pyodide](https://pyodide.org)
  (CPython compilé en WebAssembly) — isolé, interruptible, sans installation
- Éditeur de code : [CodeMirror](https://codemirror.net)

La conception complète (game design, écrans, modèle de données, architecture)
vit dans [`docs/`](docs/).

## Statut du projet

Projet personnel, développé en français d'abord (interface FR/EN prévue).
Hommage assumé à Celeste — aucune affiliation avec Maddy Makes Games.
