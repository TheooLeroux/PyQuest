// Outil temporaire : capture la séquence d'arrivée sur la carte 3D en
// pilotant le Chrome Windows (vrai rendu GPU). Lancé par Claude, puis supprimé.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

mkdirSync('captures-tmp', { recursive: true });

const navigateur = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const page = await navigateur.newPage({ viewport: { width: 1280, height: 720 } });
page.on('pageerror', (e) => console.log('[pageerror]', e.message.split('\n')[0]));

await page.addInitScript(() => {
  localStorage.setItem(
    'pyquest.slot1',
    JSON.stringify({
      nom: 'Testeur',
      creeLe: new Date().toISOString(),
      dernierJeuLe: new Date().toISOString(),
      positionSalle: '00_03',
      salles: {
        '00_01': {
          statut: 'validee',
          code: '',
          chutes: 3,
          tempsSec: 250,
          fraise: false,
          palierIndice: 1,
        },
        '00_02': {
          statut: 'validee',
          code: '',
          chutes: 3,
          tempsSec: 250,
          fraise: false,
          palierIndice: 1,
        },
      },
    }),
  );
  localStorage.setItem(
    'pyquest.reglages',
    JSON.stringify({ langue: 'fr', volumeMusique: 0, volumeEffets: 0, taillePolice: 'normale' }),
  );
});

await page.goto('http://localhost:5173', { timeout: 120000 });
await page.waitForTimeout(1500);
await page.keyboard.press('Enter'); // logo -> menu
await page.waitForTimeout(400);
await page.keyboard.press('Enter'); // Jouer -> sauvegardes
await page.waitForTimeout(2500);
await page.keyboard.press('Enter'); // slot -> voyage

const debut = Date.now();
for (const instant of [800, 1400, 2100, 2800, 3600, 4600, 6000, 8000]) {
  const attente = debut + instant - Date.now();
  if (attente > 0) await page.waitForTimeout(attente);
  await page.screenshot({ path: `captures-tmp/vol-${String(instant).padStart(4, '0')}.png` });
}
await page.keyboard.press('Enter'); // vignette
await page.waitForTimeout(600);
await page.screenshot({ path: 'captures-tmp/vol-vignette.png' });
await navigateur.close();
console.log('captures Windows OK');
