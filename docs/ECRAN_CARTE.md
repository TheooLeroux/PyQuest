# PyQuest — La carte de la montagne

> Étape 2 du sprint 0 (mise en page des écrans clés). Validé le 2026-08-23.
> Objectif assumé : **la redite de l'overworld de Celeste** — montagne 3D low-poly,
> caméra sur rails, panneau de chapitre. Projet perso : le but est de s'amuser,
> la 3D bricolée fait partie du contenu.

## La scène

- **Montagne 3D low-poly flat-shaded** (style Celeste : facettes de couleur, pas de
  textures, option wireframe subtil par-dessus), ciel dégradé, nuages en billboards.
- La montagne **dérive lentement** en idle (contrairement à la salle, la carte a le
  droit de vivre — il n'y a pas de code à lire ici).
- Ambiance par altitude : plus on monte, plus la palette refroidit et s'assombrit
  (§5 de la conception).
- **Progression lisible dans la scène** : drapeau planté sur chaque chapitre validé,
  fraises cueillies affichées sous les drapeaux, sprite de Madeline (billboard 2D)
  campé au palier courant. Chapitres verrouillés : visibles dans la brume au-dessus —
  on voit qu'il y a une suite, pas ce qu'elle est.

## Navigation — grammaire Celeste exacte

| Entrée | Action |
|---|---|
| ←/→ | Chapitre précédent / suivant (débloqués) : la caméra **orbite et glisse** vers l'ancre du chapitre (~0,5 s, easing), carte-titre flottante pendant le voyage |
| Entrée | Ouvre la **vignette chapitre** (panneau latéral par-dessus la vue 3D) |
| Échap | Ferme la vignette / remonte à l'écran des sauvegardes |

**Retour de chapitre validé** : la caméra suit **Madeline qui grimpe** jusqu'au palier
suivant — c'est l'animation-récompense du retour carte (cf. FLUX_ECRANS.md).

## La vignette chapitre — le panneau Celeste, trait pour trait

```
╭─ 3. LE RESORT CÉLESTE ────────────╮
│  ┌───┬───┬───┐                    │
│  │ A │ B̶ │ C̶ │   faces (B/C       │
│  ├───┴───┴───┤   grisées « à      │
│  │           │   venir » en v1)   │
│  │ salles 4/7 · 🍓 1/3            │
│  │ ☠ 23 · ⏱ 41 min                │
│  │ ◈ cœur de cristal 🔒           │
│  ├───────────────────────────────┤
│  │ Point de reprise :            │
│  │   ▸ salle 5 (courante)        │
│  │   · salles 1-4 (validées)     │
│  │ [ GRAVIR ]   [ REPRENDRE ]    │
╰───────────────────────────────────╯
```

- Panneau **latéral** : il ne masque ni Madeline ni le palier sélectionné.
- Onglets Face A │ B │ C présents dès la v1 (B/C grisés) — scalabilité sans refonte.
- Stats : salles X/Y, fraises, chutes, temps ; état du cœur de cristal.
- **Point de reprise** : salle courante + salles validées rejouables (fraise ratée, etc.).
  [Gravir] = depuis le début ; [Reprendre] = salle courante.

## Repli assumé

Si la 3D s'avère trop coûteuse : **coupe 2D à caméra sur rails** — la montagne en coupe
verticale, caméra qui glisse le long de la pente. **Même grammaire d'interaction**
(←/→, vignette, ancres par chapitre) : la permutation est bon marché. Ne pas y penser
tant que la 3D avance.

## Décisions actées ici

| Décision | Choix |
|---|---|
| Présentation | 3D low-poly façon Celeste, caméra sur rails (fun assumé), repli coupe 2D si besoin |
| Navigation | ←/→ en orbite entre chapitres, Entrée = vignette, Échap = retour |
| Vignette | Panneau latéral, décalque du panneau Celeste (faces A/B/C, stats, reprise) |
| Vie de l'écran | Dérive lente en idle autorisée (pas de code à lire sur cet écran) |
| Montagne | Modélisée low-poly maison de préférence, rip Celeste en secours (usage privé) |
