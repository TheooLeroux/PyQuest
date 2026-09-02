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

## Musique (optionnelle)

La bande originale de *Celeste* n'est pas distribuée avec ce dépôt. Pour
l'expérience complète :

1. Récupérez la BO (prix libre) sur le Bandcamp officiel de Lena Raine :
   [radicaldreamland.bandcamp.com](https://radicaldreamland.bandcamp.com/album/celeste-original-soundtrack)
2. Placez les MP3 dans `public/musiques/` au format `01. Prologue.mp3`
   (`node scripts/renommer-musiques.mjs` renomme un téléchargement Bandcamp
   automatiquement).

Sans ces fichiers, le jeu fonctionne normalement, en silence.

## Sous le capot

- Interface : [Svelte 5](https://svelte.dev) + TypeScript, construite avec [Vite](https://vite.dev)
- Le Python du joueur s'exécute dans le navigateur via [Pyodide](https://pyodide.org)
  (CPython compilé en WebAssembly) — isolé, interruptible, sans installation
- Éditeur de code : [CodeMirror](https://codemirror.net)

La conception complète (game design, écrans, modèle de données, architecture)
vit dans [`docs/`](docs/).

## Statut du projet

Projet personnel, développé en français d'abord (interface FR/EN prévue).

## Crédits & disclaimer

**PyQuest est un projet de fan, strictement non commercial.** Il n'est ni
développé, ni approuvé, ni affilié à EXOK Games / Maddy Makes Games, Inc.

- *Celeste*, son univers et ses assets visuels sont la propriété de
  **Maddy Makes Games, Inc.** Leur présence ici s'inscrit dans le cadre de la
  politique fan works publiée par EXOK (dépôt Celeste 64) : usage non
  commercial, avec mention claire de non-affiliation.
- La musique de *Celeste* est l'œuvre de **Lena Raine** (éditée par Materia
  Collective).

Ce projet ne sera jamais vendu ni monétisé. Si vous êtes un ayant droit et
souhaitez le retrait d'un asset, ouvrez une issue : il sera retiré aussitôt.
