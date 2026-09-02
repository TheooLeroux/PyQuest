# PyQuest — Flux des écrans

> Étape 1 du sprint 0 (concept écran par écran). Validé le 2026-08-22.
> Complète le §3 de [`CONCEPTION.md`](CONCEPTION.md) — en cas d'écart, ce document fait foi.

## Vue d'ensemble

```
                    ÉCRAN TITRE (menu)
                    ┌──────┬─────────┬─────────┐
                    │      │         │         │
                    ▼      ▼         ▼         ▼
              [Jouer]   Options   Crédits   Quitter
                    │
                    ▼
            LES SAUVEGARDES  (3 slots fixes)
                    │  choisir / créer / supprimer un slot
                    ▼
            LA CARTE DU MONT PYQUEST
                    │  sélection d'un chapitre
                    ▼
       VIGNETTE CHAPITRE (panneau sur la carte, pas un écran)
                    │
                    ▼
                 EN JEU  (les salles s'enchaînent)
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   Chapitre fini         Menu pause (Échap)
         │                     │
         └──────────┬──────────┘
                    ▼
        RETOUR CARTE — stats mises à jour,
        Madeline grimpe d'un palier si chapitre validé
```

La fin de l'ascension (écran sommet) : **à concevoir plus tard**, quand on y sera —
dans l'esprit Celeste.

## Détail des écrans

### Écran titre
- Montagne low-poly animée plein cadre, neige, titre *PyQuest*.
- Menu : **Jouer · Options · Crédits · Quitter**. Aucun chrome d'application.

### Les sauvegardes
- **3 slots fixes** (esprit console, comme Celeste).
- Un slot affiche : nom du joueur, % d'ascension, fraises totales, temps de jeu —
  et le cas échéant ◈ *Inscrit au Registre* (sync en ligne, cf. WORLDBUILDING.md).
- Actions : choisir, créer, supprimer (avec confirmation).
- Ligne sobre sous les slots : « *Reprendre une ascension du Registre* » (nom de
  cordée + code de grimpe → récupération de la save depuis un autre PC).

### Options
- Réglages classiques (langue, volume, taille de police…) + section **« Registre »** :
  revoir/copier son code de grimpe, reprendre une ascension (connexion), dissocier ce
  PC, email de secours optionnel.

### La carte du mont PyQuest
- La montagne en coupe, un drapeau par chapitre, sprite de Madeline au palier courant.
- Navigation clavier (←/→ entre chapitres débloqués, Entrée = ouvrir la vignette).
- La carte est *macro* : les salles individuelles n'y figurent pas.

### La vignette chapitre (panneau superposé à la carte)
- Stats du chapitre : salles X/Y, fraises, chutes, temps.
- **Onglets Face A │ B │ C** — B et C grisés « à venir » dès la v1 (scalabilité sans refonte d'UI).
- **[Gravir]** (depuis le début) / **[Reprendre]** / **choix du point de reprise** :
  liste des paliers (salles) déjà validés, on choisit d'où on repart — comme le choix
  de checkpoint dans Celeste (rejouer une salle, retenter une fraise ratée).

### En jeu
- Les salles **s'enchaînent séquentiellement** dans le chapitre — pas de menu de sélection
  de salle en cours de jeu (on joue la face d'une traite, à la Celeste).
- **Menu pause (Échap)** : Reprendre / Options / Retour à la carte.
  Retour à la carte = tout est sauvegardé (progression + code en cours, par salle).
- Chute (tests rouges) et validation : **en surimpression dans la salle**, jamais un
  changement d'écran — la boucle courte de 30 s ne doit jamais casser.

### Retour carte
- Stats du chapitre mises à jour dans la vignette.
- Si le chapitre vient d'être validé : animation de Madeline qui grimpe au palier suivant.

## Décisions actées ici

| Décision | Choix |
|---|---|
| Slots de sauvegarde | 3 fixes |
| Écran chapitre dédié | Non — remplacé par la vignette sur la carte |
| Sélection de salle | Via point de reprise dans la vignette, enchaînement séquentiel en jeu |
| Menu pause | Reprendre / Options / Retour carte (Échap) |
| Chute / validation | Overlay dans la salle, pas d'écran séparé |
| Écran sommet | Reporté — à concevoir dans l'esprit Celeste le moment venu |
