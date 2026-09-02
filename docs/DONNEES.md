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
├── 1..N  JeuDeTest      entrées fournies → attendu ; cas variés fixés d'avance
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
- **Pas de notion de « test caché »** (décidé le 2026-09-02) : une salle a simplement
  plusieurs jeux de tests aux cas variés, fixés d'avance (déterministes, rejouables),
  dont la consigne ne montre qu'un exemple. L'anti-par-cœur vient de la multiplicité
  des cas (entrées variables) et des contraintes (salles à résultat fixe) — un concept
  de moins, même protection.
- **Contrainte = entité réutilisée** par la salle (obligatoires) et la fraise (bonus) :
  même vérificateur, deux usages.
- **Id de salle stable et signifiant** (`03_04`) : référencé par la progression et seed
  du terrain (ECRAN_SALLE : silhouette stable). Règle : on ne renumérote jamais, on
  numérote large.

### Salle : « donné au joueur » et « jugé par » séparés — validé le 2026-09-02

Chaque salle porte deux informations indépendantes :

- **Donné au joueur** : `standard` (éditeur + code de départ) │ `buggé` (code à
  réparer) │ `à trous` (`____` à compléter) │ `qcm` (pas d'éditeur)
- **Jugé par** : `affichage` (comparaison de la sortie console) │ `fonction` (la
  fonction du joueur est appelée sur des cas) │ `qcm` (réponse exacte)

**Pourquoi :** un exercice « code buggé à réparer » doit de toute façon être jugé par
affichage ou par fonction — un champ `type` unique mélangerait les deux notions et
dupliquerait la logique de jugement. Le moteur ne connaît que 3 modes de jugement ;
toutes les combinaisons de présentation fonctionnent sans code supplémentaire. Les 6
types du §4 de CONCEPTION restent le vocabulaire d'auteur (`output_input` = standard +
affichage + entrées scriptées ; `fix` = buggé + affichage ou fonction ; etc.).

### Jugement par affichage : règles de tolérance — validé le 2026-09-02

| Différence avec l'attendu | Verdict | Pourquoi |
|---|---|---|
| Espace(s) en **fin de ligne** | Validé quand même | Invisible, n'apprend rien — première cause d'échec débutant (CONCEPTION §3) |
| Ligne(s) vide(s) **finale(s)** | Validé quand même | Un `print()` de trop à la fin = différence invisible |
| Espaces **au milieu** d'une ligne | Chute | Visible : le diff surligne l'espace en trop |
| Casse, accents | Chute | Visible : corriger apprend quelque chose |

**Pourquoi :** on pardonne l'invisible qui n'enseigne rien, on reste strict sur tout ce
que l'écran de chute sait montrer (CONCEPTION §7 : « comparaison trop stricte →
frustration »). **Surcharge par salle** possible : une salle peut se déclarer plus
stricte ou plus tolérante si son exercice l'exige (ex. une salle du Prologue qui
enseigne précisément les espaces invisibles).

### La fiche de salle — modèle de référence, validé le 2026-09-02

```
identifiant      : 03_04            (stable à jamais ; seed du terrain)
titre            : La pyramide
difficulté       : ★★☆
donné au joueur  : standard         (│ buggé │ à trous │ qcm)
jugé par         : affichage        (│ fonction │ qcm)
consigne         : Markdown, avec un exemple montré
code de départ   : # Utilise une boucle for
tests            : plusieurs cas variés fixés d'avance ; le 1er sert d'exemple
contraintes      : 0..N (forme du code, avec message d'explication)
fraise           : 0..1 (libellé + contraintes supplémentaires)
indices          : 1. Mamie (cryptique) · 2. pseudo-code · 3. solution commentée
répliques locales: 0..N (situation, personnage, texte)
```

Les répliques génériques (pools par situation × personnage × palier de chutes) et le
traducteur d'erreurs Python → français vivent dans des fichiers communs, pas dans les
fiches (sinon recopiés dans 50 salles).

## Domaine 2 — Données du joueur

### Le slot de sauvegarde — validé le 2026-09-02

```
Slot (1, 2 ou 3)
├── nom du joueur, créé le, dernier jeu le, temps de jeu total
├── position : chapitre courant + salle courante (cible de « Reprendre »)
└── pour chaque salle visitée :
    ├── statut      : en cours │ validée
    ├── code        : le dernier écrit, conservé même après validation (CONCEPTION §8.5)
    ├── chutes      : compteur
    ├── temps passé
    ├── fraise      : obtenue ou non
    └── indices     : palier atteint (0-3), pour ne jamais re-payer un indice vu
```

**On ne stocke jamais ce qui se calcule** : % d'ascension, stats par chapitre
(salles X/Y, chutes cumulées…) dérivent des salles. **Pourquoi :** une donnée stockée
en double finit toujours par diverger de sa source (« le slot dit 40 %, la carte 43 % »).

### Réglages : globaux — validé le 2026-09-02

Langue, volume, taille de police vivent au niveau de l'app, pas du slot.
**Pourquoi :** standard des jeux console (dont Celeste) ; l'écran titre connaît la
langue avant le choix du slot ; un joueur multi-slots ne règle rien deux fois.

## Stockage physique — validé le 2026-09-02

- **Contenu pédagogique : un fichier texte par salle** (en-tête structuré YAML +
  consigne en Markdown), rangés par chapitre (`contenu/03-resort/03_04.md`), embarqués
  dans l'app au build, validés automatiquement (schéma) pour attraper les fautes de
  frappe. **Pourquoi :** ~60 fiches écrites à la main — le confort d'écriture et la
  relecture en diff git priment ; JSON écarté (consignes multi-lignes pénibles).
- **Sauvegardes : un fichier JSON par slot** (`slot1.json`…`slot3.json` +
  `reglages.json`) dans le dossier utilisateur standard. **Pourquoi :** une save = un
  fichier copiable (export/import de la roadmap quasi gratuit), lisible/réparable,
  volume minuscule ; SQLite écarté (puissance sans besoin, dépendance en plus).
  En développement navigateur, même contenu stocké côté navigateur ; la coquille
  desktop branchera l'écriture disque.

## Questions ouvertes

1. Détail fin des champs : Contrainte (vocabulaire des règles), pools de répliques,
   traducteur d'erreurs — à fixer au moment de l'implémentation, sur exemples réels
2. Détail Indice, Contrainte, PoolRépliques, TraductionErreur
3. Domaine 2 — Progression (slots, statuts, point de reprise)
4. Domaine 3 — Registre (esquisse seulement, post-MVP)
5. Stockage physique : format des fichiers de contenu, format et emplacement des saves
