const fr = {
  'titre.jouer': 'Jouer',
  'titre.options': 'Options',
  'titre.credits': 'Crédits',
  'titre.quitter': 'Quitter',

  'sauvegardes.titre': 'Les ascensions',
  'sauvegardes.slotVide': 'Vide — commencer une ascension',
  'sauvegardes.aide': '↑↓ choisir · Entrée ouvrir · Échap retour',

  'options.titre': 'Options',
  'options.langue': 'Langue',
  'options.volume': 'Volume',
  'options.taillePolice': 'Taille du texte',
  'options.taille.petite': 'Petite',
  'options.taille.normale': 'Normale',
  'options.taille.grande': 'Grande',
  'options.aide': 'Échap retour',

  'credits.titre': 'Crédits',
  'credits.texte': 'PyQuest — un hommage à Celeste (Maddy Makes Games).',
  'credits.aide': 'Échap retour',

  'carte.titre': 'Le mont PyQuest',
  'carte.enConstruction': 'La carte de la montagne arrive bientôt.',
  'carte.aide': 'Entrée entrer dans la salle · Échap retour',

  'salle.titre': 'Salle',
  'salle.enConstruction': "L'atelier arrive bientôt.",
  'salle.aide': 'Échap retour à la carte',
};

export type CleTexte = keyof typeof fr;

const en: Record<CleTexte, string> = {
  'titre.jouer': 'Play',
  'titre.options': 'Options',
  'titre.credits': 'Credits',
  'titre.quitter': 'Quit',

  'sauvegardes.titre': 'Ascents',
  'sauvegardes.slotVide': 'Empty — start an ascent',
  'sauvegardes.aide': '↑↓ select · Enter open · Esc back',

  'options.titre': 'Options',
  'options.langue': 'Language',
  'options.volume': 'Volume',
  'options.taillePolice': 'Text size',
  'options.taille.petite': 'Small',
  'options.taille.normale': 'Normal',
  'options.taille.grande': 'Large',
  'options.aide': 'Esc back',

  'credits.titre': 'Credits',
  'credits.texte': 'PyQuest — a tribute to Celeste (Maddy Makes Games).',
  'credits.aide': 'Esc back',

  'carte.titre': 'Mount PyQuest',
  'carte.enConstruction': 'The mountain map is coming soon.',
  'carte.aide': 'Enter enter the room · Esc back',

  'salle.titre': 'Room',
  'salle.enConstruction': 'The workshop is coming soon.',
  'salle.aide': 'Esc back to the map',
};

export const textes = { fr, en };
