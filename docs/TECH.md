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

### 2. Coquille desktop : choix reporté — décidé le 2026-09-02

Tauri v2 et Electron restent en lice ; on développe en pur web (navigateur) et on
tranchera au plus tard à l'étape 3 (habillage). **Pourquoi :** ~95 % du code ne dépend
pas de la coquille. **Garde-fou :** valider tôt (dès l'étape 0-1) que SharedArrayBuffer
(nécessaire à `input()` synchrone et à l'interruption) fonctionne dans la coquille
pressentie, pour ne pas découvrir un blocage à l'étape 3. Penchant indicatif de Claude :
Tauri (léger, voie mobile).

### 3. Langage & framework UI : TypeScript strict + Vite + Svelte 5 — validé le 2026-09-02

**Pourquoi :**
- **TypeScript strict** : Théo en connaît un peu ; le typage attrape les bugs avant
  l'exécution. **Vite** : standard de facto (dev server + build), rechargement instantané.
- **Svelte 5** (contre React et vanilla TS) : le plus lisible pour le niveau de Théo
  (~4 concepts : `$state`, `$props`, `$derived`, blocs de template), léger et compilé
  (esprit « jeu léger »), réactivité fine sans re-rendus surprises — cohabite bien avec
  des scènes canvas impératives ; CSS scopé et état global inclus (pas de décisions
  annexes à prendre). Moins assumés : écosystème plus petit (impact faible : quasi aucun
  composant tiers prévu), compétence moins transférable que React, syntaxe runes récente.
- Les scènes de jeu (carte 3D, salle 2D) restent du code canvas impératif **hors**
  framework ; Svelte ne gère que écrans, panneaux et menus.

### 4. Rendu : Three.js (carte) + PixiJS (salle) — validé le 2026-09-02

**Pourquoi :**
- **Three.js** pour la montagne 3D (contre Babylon.js) : la référence du 3D web,
  léger, recettes connues pour low-poly/flat shading/brume/billboards, meilleure
  maîtrise de Claude. À écrire nous-mêmes : caméra sur rails et transitions (raisonnable).
  Babylon écarté : plus lourd, et ses atouts (physique, XR, PBR) sont inutiles ici.
- **PixiJS** pour la scène 2D de la salle (contre Canvas 2D natif et tout-Three) :
  moteur 2D WebGL fait pour sprites/spritesheets/particules/filtres — l'écran où
  « ça ressemble à un jeu, pas à un IDE » (risque n°4 de la conception) se gagne ;
  mauvais endroit pour économiser une dépendance. Canvas 2D écarté (mini-moteur maison
  à écrire, chaque effet devient un chantier, perfs CPU) ; tout-Three écarté (2D
  pixel-perfect dans un outil 3D = combat permanent).
- Coût assumé : deux renderers dans le projet — acceptable, ils ne se croisent jamais
  (un par écran).

### 5. Exécution du Python joueur — validé le 2026-09-02

- **Pyodide dans un Web Worker dédié** : l'UI ne gèle jamais, même si le code du
  joueur boucle à l'infini. Protocole de messages maison, léger.
- **`input()` scripté par les tests** : chaque jeu de test fournit ses entrées
  d'avance, la console les rejoue visuellement. **Pourquoi :** simple, déterministe
  (la validation l'exige de toute façon), conforme aux §4/§7 de la conception.
  L'interactif temps réel (SharedArrayBuffer bloquant) est écarté pour le MVP —
  complexité sans bénéfice de validation — mais le protocole worker réserve un
  message « demande d'entrée » pour le mode bac à sable post-MVP.
- **Timeout ~5 s, arrêt à deux étages** : interrupt buffer Pyodide (SharedArrayBuffer
  → vrai `KeyboardInterrupt`, arrêt instantané et pédagogique) + filet universel
  (destruction/relance du worker) si le buffer est indisponible. **Pourquoi :** les
  boucles infinies seront fréquentes chez les débutants ; « réapparition instantanée »
  oblige ; méthode documentée par Pyodide. Requiert les en-têtes COOP/COEP (une ligne
  dans Vite ; à re-valider dans la coquille — garde-fou déjà acté en décision 2).

## Questions ouvertes (l'arbre restant, dans l'ordre)
5. Stockage local : saves des 3 slots, format du contenu pédagogique (→ DONNEES.md, chantier ③)
6. Outillage : tests, lint (proposition en cours)
7. Packaging & distribution (installateur) — lié à la coquille, reporté (décision 2) ;
   Registre = post-MVP, schéma serveur le moment venu
