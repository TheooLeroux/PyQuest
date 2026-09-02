# PyQuest — Architecture de l'application

> Comment le code est organisé en grands blocs, et qui a le droit de parler à qui.
> Validé le 2026-09-02. S'appuie sur [`TECH.md`](TECH.md) et [`DONNEES.md`](DONNEES.md).

## Les blocs

```
src/
├── ecrans/      Les pages visibles (Svelte) : titre, sauvegardes, options,
│                carte, salle. Que de l'affichage — aucune logique de jeu.
├── jeu/         L'orchestrateur : état de la partie (slot chargé, salle en
│                cours), navigation entre écrans, règles de déblocage.
├── contenu/     Chargement + validation des fiches de salle au démarrage.
├── execution/   Le worker Pyodide + le jugement : exécute le code du joueur,
│                applique la tolérance d'affichage, vérifie les contraintes.
├── scenes/      La montagne (Three.js) et la scène de la salle (PixiJS).
├── dialogues/   Choisit la réplique adaptée : situation × personnage × chutes.
└── stockage/    Lit/écrit les slots JSON et les réglages.

contenu/         (à la racine du dépôt) Les fiches de salle, par chapitre.
```

## La règle d'or : le cœur ne connaît pas l'habillage

`execution/`, `jeu/`, `contenu/` et `stockage/` ignorent l'existence de Svelte, PixiJS
et Three.js. **Pourquoi :**

- On peut juger un code Python sans aucun écran → c'est ce que testent les suites
  Vitest (TECH.md, décision 6).
- La coquille desktop (Tauri/Electron, décision 2) et un éventuel portage mobile
  n'affectent que l'habillage, jamais le cerveau.

## Le trajet d'un lancement (`Ctrl+Entrée`)

```
écran salle (éditeur) ──▶ jeu/ « le joueur lance »
                            ├──▶ execution/ : code + tests de la fiche ──▶ verdict
                            ├──▶ scenes/    : traversée de Madeline
                            ├──▶ dialogues/ : phrase du verdict
                            └──▶ stockage/  : code + chute/validation sauvegardés
```

Chaque flèche est à sens unique : `execution/` ne rappelle jamais un écran, il répond ;
`jeu/` distribue. **Pourquoi :** éviter le couplage circulaire où tout appelle tout —
la première cause de code inmaintenable dans les jeux à écrans multiples.
