# PyQuest — Document de conception

> Jeu éducatif pour apprendre Python, inspiré de *Celeste* (Maddy Makes Games).
> Version 0.3 — 2026-09-02 — document **pur produit** : les choix techniques
> (langage de l'application, frameworks, formats de fichiers, architecture) seront
> traités dans un document séparé, le moment venu.

---

## 1. Vision

**Pitch en une phrase :** *Tu gravis le mont PyQuest. Chaque palier est un concept Python. Chaque chute t'apprend quelque chose.*

Ce que l'on emprunte à Celeste — et pourquoi c'est pertinent pour l'apprentissage :

| Élément de Celeste | Transposition PyQuest | Valeur pédagogique |
|---|---|---|
| L'ascension du mont Celeste, chapitre par chapitre | Un chapitre = un concept (variables, boucles, fonctions…) | Progression linéaire, lisible, motivante |
| Les écrans (salles) courts, un défi = une salle | Un exercice = une salle : 2 à 10 minutes max | Feedback rapide, pas de tunnel |
| La mort n'est pas punitive, on réapparaît instantanément | Un test qui échoue = « chute », on relance en un clic, le compteur est affiché avec bienveillance | Dédramatiser l'erreur, culture de l'itération |
| Les fraises (collectibles optionnels) | Défis bonus dans certaines salles (contrainte supplémentaire : « sans boucle `while` », « en une ligne »…) | Approfondissement pour ceux qui veulent |
| Les faces B / C | Version difficile de chaque chapitre, débloquée après la face A | Rejouabilité, différenciation des niveaux |
| Le Mode Assisté | Aide graduée : indice → pseudo-code → solution commentée, sans jugement | Accessibilité, pas de blocage |
| Madeline & Badeline (le doute) | Un personnage-guide qui commente les erreurs avec humour et encouragement | Ton, narration légère |
| Le cœur de cristal | Le mini-projet final de chaque chapitre | Consolidation |
| Direction artistique : pixel-art, montagnes low-poly, palette froide/violette | Interface épurée, fond animé de montagnes, palette Celeste | Identité forte, on ne fait pas « un IDE de plus » |

**Ce qu'on ne fait pas :** un vrai platformer jouable au clavier. Le cœur du jeu est
*écrire du code*. On construit un jeu d'apprentissage habillé et rythmé comme Celeste,
pas un clone de Celeste avec du Python dedans. *(L'idée d'un platformer piloté par le
code du joueur — `move_right(3); jump()` — a été envisagée puis écartée : surcoût
énorme, et le vocabulaire enseigné deviendrait une API maison plutôt que du vrai
Python. Possible en mini-jeu bonus, bien plus tard.)*

## 2. Public cible & objectifs

- **Cible principale :** grand débutant (15 ans et +), zéro connaissance en programmation, francophone. Interface FR/EN.
- **Objectif à la fin de l'ascension :** être capable d'écrire un petit programme Python autonome (~50–100 lignes) avec fonctions, listes, dictionnaires, gestion d'erreurs.
- **Durée totale visée :** 8 à 12 heures de jeu pour les faces A.
- **Non-objectifs (v1) :** POO avancée, bibliothèques externes, async, environnement multi-fichiers.

## 3. Boucle de jeu

> Le flux d'écrans détaillé est dans [`FLUX_ECRANS.md`](FLUX_ECRANS.md), qui fait foi.

```
Carte de la montagne
   └─▶ Vignette d'un chapitre débloqué (stats, faces A/B/C, point de reprise)
         └─▶ Salle (exercice) — les salles s'enchaînent séquentiellement
               ├─ Lire la consigne (exemples inclus)
               ├─ Écrire le code dans l'éditeur
               ├─ ▶ Lancer  →  les tests s'exécutent
               │      ├─ ✔ tous verts  → salle validée, animation, salle suivante
               │      └─ ✘ échec       → « chute » : message de Madeline, diff attendu/obtenu, compteur +1
               ├─ Demander un indice (3 paliers)
               └─ (option) Tenter la fraise
   Chapitre complété (toutes les salles) ─▶ cœur de cristal (mini-projet) ─▶ chapitre suivant débloqué
```

**Boucle courte (30 s – 5 min) :** lire → coder → lancer → corriger.
**Boucle moyenne (20–40 min) :** un chapitre.
**Boucle longue :** l'ascension, avec le sommet comme récompense (générique + statistiques : nombre de chutes, fraises, temps).

### Règles de déblocage
- Chapitre N+1 débloqué quand toutes les salles obligatoires de N sont validées (les fraises ne bloquent jamais).
- Face B d'un chapitre débloquée à la fin de sa face A.
- Une salle validée reste rejouable (« retourner dans la salle »).

### Feedback en cas d'échec — l'élément le plus important du design
L'écran d'erreur doit être *meilleur* qu'un traceback brut :
1. **Traduction du message d'erreur** en français simple pour les erreurs courantes (`NameError`, `IndentationError`, `TypeError`… tableau de correspondance).
2. **Diff visuel** attendu / obtenu (surlignage des espaces, retours à la ligne — première cause d'échec des débutants).
3. **Ligne fautive surlignée** dans l'éditeur.
4. **Phrase du guide**, tirée d'un pool selon le type d'erreur et le nombre de chutes (jamais moqueur, de plus en plus encourageant).

## 4. Programme pédagogique (faces A)

Sept chapitres, un par concept, en écho aux chapitres de Celeste. Chaque chapitre : 6 à 8 salles + 1 cœur de cristal (mini-projet). Fraises : 2 à 3 par chapitre.

| # | Nom (clin d'œil) | Concept | Exemples de salles | Cœur de cristal |
|---|---|---|---|---|
| 0 | **Prologue** | Prise en main : `print`, l'éditeur, lancer, échouer | « Dis bonjour », « Deux lignes », « Casse le programme exprès » | — |
| 1 | **La Cité abandonnée** | Variables, types, `input`, opérations, f-strings | Calculs, conversion, concaténation | Convertisseur d'unités |
| 2 | **Le Vieux Site** | Conditions `if/elif/else`, booléens, comparaisons | Majeur/mineur, FizzBuzz partiel, année bissextile | Mini « choose your own adventure » |
| 3 | **Le Resort céleste** | Boucles `for`/`while`, `range`, `break/continue` | Tables, compteurs, deviner un nombre | Pyramide d'étoiles / dessin ASCII |
| 4 | **La Crête dorée** | Listes, indexation, slicing, `append`, parcours | Moyenne, max sans `max()`, inverser | Gestion d'un inventaire |
| 5 | **Le Temple des miroirs** | Fonctions : `def`, paramètres, `return`, portée | Refactoriser un code répété, fonctions pures | Bibliothèque de fonctions de test |
| 6 | **Réflexion** | Chaînes avancées, dictionnaires, tuples, ensembles | Compter les mots, annuaire, palindrome | Analyseur de texte |
| 7 | **Le Sommet** | Exceptions `try/except`, fichiers, modules stdlib (`random`, `math`) | Saisie robuste, lecture de fichier | Projet final : petit jeu texte complet |

**Faces B (post-MVP) :** mêmes concepts, exercices plus durs (algorithmique légère : tri à bulles, recherche, récursivité en 5, compréhensions de listes en 4…).

**Épilogue / Cœur (post-MVP) :** classes et objets, si on veut aller au-delà.

### Types d'exercices
| Type | Ce que fait le joueur | Validation |
|---|---|---|
| `output` | Écrit un programme qui affiche quelque chose | Comparaison de la sortie affichée (normalisée : espaces de fin, retours à la ligne) |
| `output_input` | Idem, mais le programme lit `input()` | Plusieurs jeux d'entrées → sorties attendues |
| `function` | Implémente une fonction avec une signature imposée | La fonction est appelée sur des cas de test |
| `fix` | Un code buggé est fourni, il faut le réparer | Comme `output` ou `function` |
| `fill` | Code à trous (`____`) | Comme `output` ou `function` |
| `read` | QCM : « qu'affiche ce code ? » | Réponse exacte |

Une salle peut avoir des **tests cachés** (anti-triche « je hardcode la sortie ») et des **contraintes** vérifiées automatiquement sur la forme du code : « interdit d'utiliser `sum` », « doit contenir une boucle `for` » — c'est ce qui rend les fraises possibles.

## 5. Direction artistique & UX

- **Palette** (Celeste) : fond nuit `#1a1a2e` → violet `#3d2b6b`, accents rose/rouge (Madeline) `#e04c6a`, cyan (cristal) `#59d3e8`, jaune fraise `#f7d774`, texte crème `#f4ecd8`.
- **Typo** : pixel/monospace lisible pour l'UI (ex. *Press Start 2P* avec parcimonie pour les titres), monospace confortable pour l'éditeur (*JetBrains Mono* / *Fira Code*), taille réglable (accessibilité).
- **Fond** : montagnes low-poly procédurales, parallaxe lente, neige. Le décor s'assombrit / s'éclaircit selon l'altitude (chapitre).
- **Carte** : la montagne en coupe, un drapeau par chapitre, un petit sprite de Madeline positionné au chapitre courant qui grimpe à chaque déblocage.
- **Sons** : *ding* validation, *pouf* chute, musique d'ambiance douce par chapitre (fallback silencieux si l'audio est indisponible).
- **Accessibilité** : mode assisté toujours accessible, taille de police, contraste, tout jouable au clavier (`Ctrl+Entrée` = lancer, `Ctrl+H` = indice).

## 6. Feuille de route

| Étape | Contenu | Résultat vérifiable |
|---|---|---|
| **0 — Socle** | Navigation entre les écrans, réglages, FR/EN | Menu → carte → salle vide |
| **1 — Cœur de jeu** | Exercices `output`, éditeur, console, chutes, indices, progression | Prologue + chapitre 1 jouables de bout en bout |
| **2 — Pédagogie** | Autres types d'exercices, contraintes, traducteur d'erreurs, diff visuel, fraises | Chapitres 2–4 |
| **3 — Habillage** | Fond animé, carte de la montagne, guide, sons, écran sommet, animations | Ça ressemble à un jeu |
| **4 — Contenu** (continu) | Chapitres 5–7, cœurs de cristal | Ascension complète |
| **Post-MVP** | Faces B, épilogue POO, mode « bac à sable », export/import de progression, distribution | — |

**MVP = fin de l'étape 2** : on peut faire tester à un vrai débutant.

## 7. Risques

| Risque | Mitigation |
|---|---|
| Comparaison de sortie trop stricte → frustration | Normalisation, diff visuel explicite, messages sur les espaces |
| Boucle infinie / `input()` bloquant | Limite de temps d'exécution, une entrée est toujours fournie (vide si non spécifiée) |
| Contenu pédagogique long à écrire | Format de salle simple, validation automatique du contenu, écrire les chapitres 0–1 avant tout le reste pour valider le format |
| L'app a l'air d'un IDE, pas d'un jeu | Étape 3 dédiée ; guide, sons, carte, animations de validation |

## 8. Décisions — tranchées le 2026-08-22

1. **Nom** : **PyQuest**. Comme « Celeste », le titre est aussi le nom de la montagne :
   on gravit le mont PyQuest comme Madeline gravit le mont Celeste.
2. **Cible** : **grand débutant 15 ans et +**.
3. **Ambition v1** : **les 7 chapitres complets** (faces A). Post-v1, dans l'ordre : faces B,
   faces C, chapitre bonus **« Le Noyau »** (The Core) puis **« Farewell »** (contenu avancé,
   reprend l'épilogue POO du §4).
4. **Personnage-guide** : **Madeline telle quelle** (référence directe à Celeste). ⚠️ OK tant que
   le projet reste privé/personnel ; à reconsidérer (droits) avant toute diffusion publique.
5. **Sauvegarde du code du joueur** : **par salle** — le dernier code écrit dans chaque salle est
   conservé dans la progression, même après validation.
