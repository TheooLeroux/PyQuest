# PyQuest — L'écran de la salle

> Étape 2 du sprint 0 (mise en page des écrans clés). Validé le 2026-08-23.
> L'écran où le joueur passe 90 % de son temps. Fait foi avec [`FLUX_ECRANS.md`](FLUX_ECRANS.md).

## Principe : un écran à deux états

Pas de superposition permanente monde/interface : chacun a **son** moment à pleine puissance.
Référence directe : l'état « dialogue » de Celeste — monde présent, **figé et assombri**,
UI par-dessus.

| État | Quand | Le monde | L'interface |
|---|---|---|---|
| **Mode atelier** | On lit, on code | Figé, assombri ~60 %, seule la bande basse reste claire | Panneaux pleins, opaques, ~85 % de l'écran |
| **Mode monde** | `Ctrl+Entrée` → verdict | Plein écran, animé : traversée de Madeline | Panneaux glissés/estompés, reviennent avec le verdict |

## Mode atelier (on code)

```
┌────────────────────────────────────────────────────────────────┐
│ ░░ ciel figé, assombri ~60 %, désaturé ░░░░░░░░░  ⚑ Ch.3 · 4/7 │
│ ░░░░╭─ CONSIGNE ─────────╮░╭─ ÉDITEUR ────────────────🍓─╮░░░░ │
│ ░░░░│ La pyramide   ★★☆  │░│ 1  # Utilise une boucle for │░░░░ │
│ ░░░░│                    │░│ 2  for i in range(1, 5):    │░░░░ │
│ ░░░░│ Affiche une        │░│ 3      print('*' * i)       │░░░░ │
│ ░░░░│ pyramide de * …    │░│                             │░░░░ │
│ ░░░░╰──────────────────╯░░├─ CONSOLE ────────────────────┤░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░│ >_      [ ▶ Lancer  Ctrl+↵ ] │░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░╰──────────────────────────────╯░░░░ │
│  ── zone claire (~15-18 % de hauteur) ──────────────────────── │
│  🧗 idle  ☠ 3       terrain de la salle         🍓       🚩    │
└────────────────────────────────────────────────────────────────┘
```

- **Une seule scène plein écran** (pas une bande + un fond) : le ciel assombri remplit les
  interstices autour des panneaux ; la seule zone dégagée et à luminosité normale est la
  **bande basse** — terrain, Madeline en idle, compteur de chutes ☠, fraise, drapeau.
- **Figé veut dire figé** : pas de neige, pas de parallaxe, pas de cheveux au vent en mode
  atelier. Au plus un clignement d'yeux de Madeline toutes les 4-5 s. Aucune boucle
  d'animation continue derrière du code — c'est une règle, pas un réglage.
- **Panneaux** : consigne à gauche (compacte, Markdown rendu, dépliable via `Tab` pour les
  consignes longues), éditeur + console à droite (dominants). Fond `#1a1a2e` opaque, coins
  arrondis, liseré subtil. Le contraste du code est stable, toujours.
- **Bandeau minimal** en haut à droite, translucide : `⚑ Chapitre · salle X/Y`. Pas de bouton
  pause visible — Échap.
- **Console toujours visible**, vide au départ avec une invite grisée (« Lance ton code pour
  voir ce qu'il affiche ») : le débutant intègre dès la première seconde qu'un programme
  produit une sortie.

## Mode monde (exécution)

Au `Ctrl+Entrée` : les panneaux glissent vers le haut / s'estompent franchement, le voile
s'ôte, la scène prend l'écran. 1 à 2 secondes de théâtre, **skippable dès la 2ᵉ fois**
(toute touche). Puis retour atelier avec le verdict dans la console.

### Machine à états de la scène

| État | Déclencheur | Ce qu'on voit |
|---|---|---|
| **Repos** | Mode atelier | Madeline idle au bord gauche du segment, terrain de la salle, drapeau éteint, fraise flottante si défi |
| **Traversée** | `Ctrl+Entrée` | Course + dash pendant que le code s'exécute. Durée minimale ~1 s (le verdict attend la fin de la traversée). Temps dépassé → suspendue en plein dash : « ton programme tourne encore… » |
| **Victoire** | Tous tests verts | Elle atteint le bout, plante le drapeau, petit éclat. Fraise réussie → cueillette + son iconique |
| **Chute** | Tests rouges | Elle tombe **à l'endroit proportionnel aux tests passés** (2/3 passés → chute aux deux tiers), *pouf*, réapparition instantanée au départ. ☠ +1 avec micro-animation |
| **Salle suivante** | Validation + Entrée | Caméra glisse latéralement vers le terrain suivant, Madeline dash pour entrer |

### Terrain « différent à chaque salle »

**Procédural seedé** par l'id de la salle (stable : 03_04 a toujours la même silhouette).
Pente et rugosité croissent avec la difficulté ; palette par chapitre (l'altitude
assombrit/refroidit, §5 de la conception). Habillage : tiles/décor Celeste (usage privé).
Possibilité plus tard de dessiner à la main le terrain des salles spéciales
(cœurs de cristal).

## Retour de chute (dans la console, mode atelier)

- La console passe en mode **diff deux colonnes** : ATTENDU │ OBTENU, caractères invisibles
  matérialisés (espaces de fin, lignes vides — première cause d'échec des débutants).
- Erreur Python → message **traduit en français** au-dessus du diff (tableau de
  correspondance, §3 de la conception) + **ligne fautive surlignée** dans l'éditeur.
- Madeline commente (bulle au-dessus d'elle, dans le monde) selon le type d'erreur et le
  nombre de chutes — jamais moqueuse, de plus en plus encourageante.
- Rien ne bloque, rien ne change d'écran : `Ctrl+Entrée` relance immédiatement.

## Validation

Console verte avec la sortie, le drapeau du segment planté, et **en bas de la console** :
« Salle suivante (Entrée) · Rester ici ». Pas de modale. Fraise non tentée → Madeline
glisse : « Tu as vu la fraise ? »

## La fraise (défi bonus)

- **Tentable après la première validation** de la salle (ne noie pas le débutant) :
  un toggle « 🍓 mode fraise » apparaît alors.
- **Badge 🍓** épinglé au coin du panneau éditeur quand la salle a un défi.
  Un **clic** épingle la contrainte en bandeau sous le titre de la consigne ; après la
  première validation, la contrainte s'affiche d'office. Le survol (infobulle) existe en
  bonus, **jamais comme seul chemin** — le hover-only est un anti-pattern pour ce public.
- La fraise physique flotte dans le décor, en écho.

## Madeline

Vit **dans le monde** (bande basse), pas dans un panneau. Sa bulle de dialogue apparaît
au-dessus d'elle : phrase d'accueil de la salle, indices (`Ctrl+H`, 3 paliers, confirmation
douce avant le palier 3 : « Tu veux vraiment ? Tu y étais presque. »), commentaires de chute.

## Raccourcis

| Touche | Action |
|---|---|
| `Ctrl+Entrée` | Lancer / relancer |
| `Ctrl+H` | Indice (palier suivant) |
| `Tab` (hors éditeur) | Déplier/replier la consigne |
| `Entrée` (après validation) | Salle suivante |
| `Échap` | Pause : Reprendre / Options / Retour carte |
| Toute touche (mode monde) | Skip du théâtre (dès la 2ᵉ traversée) |

Reset du code au starter : **dans le menu pause uniquement** (pas de bouton visible —
évite le clic accidentel qui efface tout).

## Décisions actées ici

| Décision | Choix |
|---|---|
| Composition | Deux états (atelier / monde), état dialogue de Celeste comme référence |
| Monde visible en atelier | Scène plein écran figée + assombrie ~60 %, zone claire = bande basse ~15-18 % |
| Animation en atelier | Aucune boucle continue (clignement d'yeux max) |
| Écrans écartés | Grille d'application ; UI flottante sur monde animé permanent ; cadre tout autour ; split 50/50 |
| Chute | Overlay console (diff 2 colonnes) + chute proportionnelle aux tests dans la scène |
| Fraise | Après 1re validation ; badge cliquable, jamais hover-only |
| Reset code | Menu pause uniquement |
