# PyQuest — Worldbuilding & fiche de ton

> Étape 3 du sprint 0. Validé le 2026-08-23.
> Parti pris : **redite parodique de Celeste, au second degré assumé.** Pas d'histoire
> originale à écrire, le droit de tout déformer. Le jeu sait qu'il est un cours de
> Python déguisé en Celeste — et il en joue.

## Les chapitres — noms Celeste conservés (définitif)

La table du §4 de la conception devient définitive. Une ligne de « prétexte narratif »
par chapitre — déformable sans scrupule, ce n'est pas un lore, c'est une excuse.

| # | Nom | Concept | Prétexte narratif (une ligne) |
|---|---|---|---|
| 0 | Prologue | `print`, l'éditeur, échouer | Le pont s'effondre. Apprends à crier (`print`) avant de tomber. |
| 1 | La Cité abandonnée | Variables, types, `input` | Une ville pleine de boîtes vides. Range des choses dedans, donne-leur des noms. |
| 2 | Le Vieux Site | Conditions, booléens | Les rêves bifurquent. `if` tu avances, `else` tu creuses. |
| 3 | Le Resort céleste | Boucles, `range` | M. Oshiro veut que tu nettoies 200 chambres. Tu ne vas PAS le faire à la main. |
| 4 | La Crête dorée | Listes, slicing | Le vent souffle en rafales — apprends à en tenir toute une liste. |
| 5 | Le Temple des miroirs | Fonctions, `return` | Le temple reflète ton code : ce qui se répète doit devenir reflet (fonction). |
| 6 | Réflexion | Chaînes, dicts, tuples | Au fond du gouffre, on fait l'inventaire : chaque chose a sa clé. |
| 7 | Le Sommet | Exceptions, fichiers | Tout peut échouer près du sommet. `try` quand même. |
| 8* | Le Noyau | *(post-v1)* | La montagne a un cœur chaud. Lui aussi segfault parfois. |
| 9* | Farewell | POO *(post-v1)* | Au-delà du sommet. Les objets, les classes, l'au revoir. |

## Le casting (rôles fixes, tout est réutilisé de Celeste)

| Personnage | Rôle dans PyQuest | Registre |
|---|---|---|
| **Madeline** | Le guide. Accueille chaque salle, encourage, explique après une chute. Vit l'ascension *avec* le joueur. | Chaleureuse, directe, jamais ironique envers le joueur |
| **Badeline** (Part de Toi) | Le snark. Apparaît quand ça se corse (dès 3 chutes d'affilée, ou en cameo aléatoire). Vise **le code, la situation, le jeu — jamais la personne**. Madeline la recadre : leur dispute est le canal d'humour. | Second degré, méta, pince-sans-rire |
| **Mamie** | L'indice palier 1 : un aphorisme cryptique et amusé. | Sagesse moqueuse (du monde, pas du joueur) |
| **Théo** | Cameo récompense : prend un selfie avec toi à chaque fin de chapitre et à chaque fraise. **C'est aussi lui qui introduit le Registre du mont PyQuest** (le compte en ligne déguisé — voir section dédiée) : le gardien des souvenirs propose de graver l'ascension. *(Oui, le photographe de Celeste s'appelle Théo. Oui, l'auteur de ce jeu aussi. Non, ce n'est pas une coïncidence, c'est du second degré.)* | Enthousiasme de photographe |
| **M. Oshiro** | Hôte du chapitre 3. Panique quand une boucle plante dans son hôtel. | Politesse au bord de la crise |
| **L'Oiseau** | Le tutoriel : affiche les raccourcis (`CTRL+↵`, `CTRL+H`) comme il enseigne le dash. | Ne parle pas, montre |

## Fiche de ton — les règles d'écriture

1. **Court.** 1-2 phrases par bulle, jamais de pavé. Si c'est long, c'est la consigne, pas un dialogue.
2. **Le snark est un rôle, pas un ton global.** Seule Badeline pique — et jamais le joueur.
   Test avant d'écrire une réplique : remplacer « ton code » par « toi ». Si ça devient
   blessant, c'est que la réplique visait la personne → réécrire.
3. **Progression émotionnelle des chutes** (par salle) :
   - Chutes 1-2 : léger, factuel, une pointe d'humour.
   - Chutes 3-5 : Badeline peut apparaître ; Madeline oriente concrètement + suggère `Ctrl+H`.
   - Chutes 6+ : plus de vannes. Madeline douce et sérieuse, propose le mode assisté sans jugement.
4. **Le méta est permis et encouragé** (le jeu sait qu'il est un jeu, l'histoire est
   déformable) — mais le méta n'excuse jamais la règle 2.
5. **FR d'abord, EN ensuite.** On écrit tout en français ; la version anglaise
   s'écrit dans une passe de traduction dédiée.

## Répliques d'exemple (le pool de départ, par situation)

**Accueil de salle** — Madeline : « Nouvelle salle. Respire, lis, et on grimpe. »

**NameError** — Badeline : « Python dit qu'il n'a jamais entendu parler de "pyramide".
Vous vous êtes présentés, au moins ? » / Madeline : « Vérifie l'orthographe : une
variable doit s'écrire exactement pareil partout. »

**IndentationError** — Madeline : « L'escalade, c'est une question d'alignement. Ton
code aussi : regarde les espaces au début de la ligne surlignée. »

**Timeout (5 s)** — Badeline : « Ton programme court toujours. On l'attend, ou… ? » /
Madeline : « Boucle infinie, sûrement. Ta condition de sortie peut-elle devenir vraie un jour ? »

**Diff : espace en trop** — Madeline : « Presque parfait — il y a un espace invisible
tout au bout. Les invisibles comptent, comme le vent. »

**6ᵉ chute** — Madeline : « Hé. Respire. La montagne ne bouge pas, on a le temps.
`Ctrl+H` n'est pas de la triche — c'est grimper à deux. »

**Validation** — Badeline : « Bon. C'était pas si dur. » / Madeline : « Ne l'écoute pas.
C'était bien joué. »

**Fraise réussie** — Madeline : « UNE FRAISE. Théo va vouloir une photo. »

**Indice palier 1 (Mamie)** — « Héhé. Celui qui compte les étages sait combien
d'étoiles poser dessus. »

**Indice palier 3 (la solution)** — Madeline : « Tu veux vraiment ? Tu y étais
presque… Bon. La voilà — mais relis-la ligne par ligne, promis ? »

## Le Registre du mont PyQuest — l'habillage diégétique du compte en ligne

Le compte/sync (fonctionnalité post-MVP) n'apparaît **jamais** comme du web dans le jeu.
Habillage : le registre de sommet des alpinistes, où les cordées signent.

**Vocabulaire unique** (les mots « compte », « connexion », « serveur », « en ligne »
n'existent nulle part dans les textes du jeu) :

| Concept technique | Mot du jeu |
|---|---|
| Créer un compte | **Inscrire cette ascension au Registre** |
| Identifiant | **Nom de cordée** |
| Mot de passe | **Code de grimpe** (4 mots générés, style `fraise-neige-vieux-site-47`) |
| Se connecter ailleurs | **Reprendre une ascension du Registre** |
| Slot synchronisé | ◈ *Inscrit au Registre* |

**Mise en place (storyboard, placement exact à affiner) :**

1. **La création passe par Théo** (décidé) : après un selfie de fin de chapitre
   (pressenti : fin du chapitre 1 — première vraie ascension, le joueur a quelque chose
   à perdre), une bulle : « Je la note dans le Registre du mont PyQuest ? Comme ça, même si
   ce PC finit dans une crevasse, ton ascension reste gravée. » `[D'accord]` `[Plus tard]`.
   **« Plus tard » = plus jamais de relance** — une seule sollicitation dans la vie du jeu.
2. **Inscription en jeu** : la question « Ton nom de cordée ? » en dialogue, puis une
   **page de carnet dessinée** (nom calligraphié, code de grimpe dessous, `[Copier]`),
   Madeline : « Note-le quelque part de plus solide qu'un PC. »
3. **Ensuite, silence** : sync en arrière-plan (sortie de salle, retour carte), état
   visible uniquement sur l'écran des sauvegardes (◈). **Le réseau n'interrompt jamais
   le jeu** : pas de spinner, pas de toast d'erreur ; une sync ratée réessaie sans rien dire.
4. **Autre PC** : ligne sobre sous les slots — « Reprendre une ascension du Registre »
   → même page de carnet, nom + code.
5. **Options** : section **« Registre »** — revoir/copier son code, connexion
   (reprendre une ascension), déconnexion/dissocier ce PC, email de secours *(optionnel)*.

**Les interdits** : jamais au premier lancement, jamais modal hors du moment Théo,
jamais deux sollicitations, aucun élément d'UI web, hors-ligne jouable pour toujours
sans mention de ce qui « manque ».

## Ce que ce parti pris nous épargne

- Aucune histoire originale à écrire ni à maintenir cohérente.
- Aucun personnage à concevoir (sprites Celeste rippés, usage privé — cf. ECRAN_SALLE.md).
- La liberté de déformer : si une salle a besoin qu'Oshiro apparaisse au chapitre 5,
  il apparaît, point.
