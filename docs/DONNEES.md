# PyQuest — Modèle de données

> Le modèle de données du jeu : d'abord le modèle **conceptuel** (entités, relations),
> puis le stockage physique. Chaque décision est datée et accompagnée de son pourquoi.
> Complète [`TECH.md`](TECH.md) et les docs de conception.

## Vue d'ensemble : trois domaines — validé le 2026-09-02

```
┌─ CONTENU PÉDAGOGIQUE ──────┐   ┌─ PROGRESSION ───────────────┐
│ écrit par NOUS,            │   │ écrite par LE JEU,          │
│ embarqué dans l'app,       │◄──│ sur le disque du joueur,    │
│ versionné dans git         │ref│ 3 slots                     │
│ (chapitres, salles, tests, │   │ (statuts, code, chutes,     │
│  indices, dialogues)       │   │  fraises, temps)            │
└────────────────────────────┘   └──────────────┬──────────────┘
                                                │ copie sync (post-MVP)
                                 ┌─ REGISTRE ───▼──────────────┐
                                 │ serveur, post-MVP           │
                                 │ (cordées, saves gravées)    │
                                 └─────────────────────────────┘
```

**Pourquoi cette séparation :** le contenu est *du code* (évolue avec le jeu, se relit,
se valide automatiquement) ; la progression est *de la donnée utilisateur* (survit aux
mises à jour). Les mélanger est la source classique de saves corrompues. La progression
ne contient jamais de contenu — elle le **référence par identifiant**.

## Domaine 1 — Contenu pédagogique

### Carte des entités — validée le 2026-09-02

```
Chapitre (0 à 7, puis 8-9 post-v1)
│  nom, concept, prétexte narratif, palette/altitude
│
│ 1..N salles, groupées par Face (A │ B │ C)
▼
Salle  ── id stable "03_04" — sert aussi de seed au terrain procédural
│  titre, type, consigne (Markdown), code de départ, difficulté ★,
│  drapeau « cœur de cristal »
│
├── 1..N  JeuDeTest      entrées fournies → attendu ; visible ou caché
├── 0..N  Contrainte     forme du code : « interdit sum » / « requiert for »
├── 0..1  Fraise         libellé du défi + ses propres Contraintes en plus
├── 0..3  Indice         palier 1 (Mamie, cryptique) → 2 (pseudo-code) → 3 (solution)
└── 0..N  RépliqueLocale dialogues propres à cette salle (accueil spécial, cameo)

Transverses (pas rattachés à une salle) :
├── PoolRépliques        situation × personnage × palier de chutes
└── TraductionErreur     type d'erreur Python → explication en français
```

**Pourquoi (choix structurants) :**
- **Cœur de cristal = une Salle avec un drapeau**, pas une entité à part : même
  mécanique (consigne, tests, contraintes), seul l'habillage change ; une entité
  séparée doublerait le code de validation.
- **La Face (A/B/C) groupe les salles dès le jour 1** : la vignette affiche déjà les
  onglets A│B│C en v1 — sinon refonte des saves à l'arrivée des faces B.
- **Dialogues en deux étages** (pools transverses + répliques locales) : le pool couvre
  ~95 % des besoins (WORLDBUILDING les définit par situation et palier de chutes) ; les
  répliques locales permettent le sur-mesure (« Oshiro apparaît au chapitre 5 »).
- **JeuDeTest visible/caché dès le modèle** : l'anti-triche du §4 de la conception est
  une propriété du test, pas une mécanique greffée après coup.
- **Contrainte = entité réutilisée** par la salle (obligatoires) et la fraise (bonus) :
  même vérificateur, deux usages.
- **Id de salle stable et signifiant** (`03_04`) : référencé par la progression et seed
  du terrain (ECRAN_SALLE : silhouette stable). Règle : on ne renumérote jamais, on
  numérote large.

## Questions ouvertes

1. Détail des champs Salle & JeuDeTest (types d'exercices, normalisation de sortie)
2. Détail Indice, Contrainte, PoolRépliques, TraductionErreur
3. Domaine 2 — Progression (slots, statuts, point de reprise)
4. Domaine 3 — Registre (esquisse seulement, post-MVP)
5. Stockage physique : format des fichiers de contenu, format et emplacement des saves
