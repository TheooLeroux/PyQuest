// Renomme les fichiers téléchargés depuis Bandcamp vers le format du projet :
//   « Lena Raine - Celeste Original Soundtrack - 01 Prologue.mp3 » → « 01. Prologue.mp3 »
// Usage : node scripts/renommer-musiques.mjs
import { readdirSync, renameSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dossier = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'musiques');
const MOTIF = /^.*?-\s*(\d{2})\s+(.+)\.(mp3|ogg|flac)$/i;

let renommes = 0;
for (const fichier of readdirSync(dossier)) {
  const trouve = MOTIF.exec(fichier);
  if (!trouve) continue;
  const nouveau = `${trouve[1]}. ${trouve[2]}.${trouve[3].toLowerCase()}`;
  if (nouveau === fichier) continue;
  renameSync(join(dossier, fichier), join(dossier, nouveau));
  console.log(`${fichier} → ${nouveau}`);
  renommes += 1;
}
console.log(renommes === 0 ? 'Rien à renommer.' : `${renommes} fichier(s) renommé(s).`);
