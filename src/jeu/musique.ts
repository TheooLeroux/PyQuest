// Musique d'ambiance. Les fichiers vivent dans public/musiques/ (non versionné :
// assets privés) — s'ils manquent ou que le navigateur bloque la lecture,
// silence, sans erreur (CONCEPTION §5 : fallback silencieux).

// Nommage des fichiers : celui de l'album officiel (« 05. Postcard from
// Celeste Mountain.mp3 »…). C'est la piste 05 qui joue sur l'écran titre.
const SOURCES_TITRE = [
  '/musiques/05. Postcard from Celeste Mountain.mp3',
  '/musiques/05. Postcard from Celeste Mountain.ogg',
  '/musiques/titre.ogg',
  '/musiques/titre.mp3',
];

let audio: HTMLAudioElement | null = null;

function volumeNormalise(volume: number): number {
  return Math.max(0, Math.min(1, volume / 100));
}

export async function jouerMusiqueTitre(volume: number): Promise<void> {
  if (audio) {
    audio.volume = volumeNormalise(volume);
    if (audio.paused) await audio.play().catch(() => {});
    return;
  }
  for (const source of SOURCES_TITRE) {
    const candidat = new Audio(source);
    candidat.loop = true;
    candidat.volume = volumeNormalise(volume);
    try {
      await candidat.play();
      audio = candidat;
      return;
    } catch {
      // Fichier absent ou lecture bloquée avant le premier geste : on retentera.
    }
  }
}

export function reglerVolumeMusique(volume: number): void {
  if (audio) audio.volume = volumeNormalise(volume);
}

/** Pause sans perdre la position : la musique reprendra où elle en était. */
export function mettreMusiqueEnPause(): void {
  audio?.pause();
}
