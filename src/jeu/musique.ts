// Musique d'ambiance. Les fichiers vivent dans public/musiques/ (non versionné :
// assets privés) — s'ils manquent ou que le navigateur bloque la lecture,
// silence, sans erreur (CONCEPTION §5 : fallback silencieux).

const SOURCES_TITRE = ['/musiques/titre.ogg', '/musiques/titre.mp3'];

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

export function arreterMusique(): void {
  audio?.pause();
  audio = null;
}
