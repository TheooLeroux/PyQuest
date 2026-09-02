// Copie la distribution Pyodide dans public/ pour que l'app la serve elle-même
// (pas de CDN : l'app doit rester jouable hors-ligne, et la coquille desktop
// embarquera ces fichiers).
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(racine, 'node_modules', 'pyodide');
const cible = join(racine, 'public', 'pyodide');

const FICHIERS = [
  'pyodide.mjs',
  'pyodide.asm.mjs',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

mkdirSync(cible, { recursive: true });
for (const fichier of FICHIERS) {
  copyFileSync(join(source, fichier), join(cible, fichier));
}
console.log(`Pyodide copié dans public/pyodide (${FICHIERS.length} fichiers).`);
