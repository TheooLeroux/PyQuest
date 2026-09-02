# PyQuest — Choix techniques

> Chantier ② du pré-code, entamé le 2026-09-02. Chaque décision est actée **avec son
> pourquoi** ; rien n'est marqué « validé » sans le feu vert explicite de Théo.
> Le comparatif s'appuie sur une recherche web du 2026-09-02, pas sur des souvenirs.

## Décisions actées

### 1. Famille de stack : web desktop — validé le 2026-09-02

L'application est écrite en technologies web et empaquetée en app desktop installable.
Le Python du joueur s'exécute via **Pyodide** (le vrai CPython compilé en WebAssembly,
Python 3.14 en 2026, activement maintenu).

**Pourquoi :**
- **Seule famille qui résout la contrainte reine sans compromis** : vrai CPython
  (vrais messages d'erreur), sandboxé *par construction* (aucun accès disque/réseau),
  `input()` synchrone résolu (SharedArrayBuffer/Atomics, ex. `pyodide-worker-runner`),
  boucle infinie interruptible (`setInterruptBuffer`).
- **Meilleur éditeur de code gratuit du marché** (CodeMirror, qualité VS Code) — le
  cœur du jeu est d'écrire du code.
- Diff visuel, Markdown des consignes, panneaux, accessibilité : les forces du web
  sont exactement nos écrans.
- Mobile futur crédible à moindre coût (même code UI) — cité, pas creusé, comme voulu.
- Alternatives écartées : **Godot 4** (bindings Python non production, sandbox
  impossible proprement, CodeEdit en dessous de CodeMirror — on affaiblirait l'organe
  principal) ; **tout Python/Qt** (rendu jeu = point faible de Qt, sandbox artisanale,
  packaging lourd, mobile exclu).
- Précédents du genre : JOY OF PROGRAMMING et CodeCombat ont pris un runtime de code +
  UI riche ; The Farmer Was Replaced (Unity) a dû renoncer au vrai Python — exactement
  ce que refuse le §1 de la conception.
- Théo connaît un peu TypeScript (et un peu Python) : il pourra lire le code.
- C'est la stack où Claude produit le code le plus fiable et peut vérifier
  visuellement son travail en boucle courte.

**Risque assumé :** le game feel (animations, particules, caméra) est à fabriquer à la
main — c'est l'étape 3 de la roadmap, attaquable par itérations. Discipline requise
pour ne pas ressembler à un site web.

## Questions ouvertes (l'arbre restant, dans l'ordre)

1. Coquille desktop : Tauri vs Electron
2. Framework UI et langage (TypeScript pressenti)
3. Rendu : carte 3D (Three.js pressenti), scène 2D de la salle (Canvas/PixiJS/DOM)
4. Architecture d'exécution du Python joueur (worker, timeout, input, tests)
5. Stockage local : saves des 3 slots, format du contenu pédagogique (→ DONNEES.md)
6. Outillage : build, tests, lint
7. Packaging & distribution (installateur) ; Registre = post-MVP, schéma serveur plus tard
