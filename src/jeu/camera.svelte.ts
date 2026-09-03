// La caméra du décor : un zoom courant unique, animé en douceur, partagé
// entre le fond (plans de parallaxe) et les calques qui doivent rester
// collés à la scène (les repères de chapitres sur la carte).

export const camera = $state({ zoom: 1 });

let animation = 0;

// Départ doux → croisière visible → atterrissage doux.
function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
}

/** Pose la caméra instantanément (point de départ d'une arrivée). */
export function poserCamera(valeur: number): void {
  cancelAnimationFrame(animation);
  camera.zoom = valeur;
}

/** Vol continu vers la cible, piloté image par image. */
export function volerVers(cible: number, dureeMs = 4200): void {
  const depart = camera.zoom;
  if (Math.abs(cible - depart) < 0.001) return;
  cancelAnimationFrame(animation);
  const debut = performance.now();
  const pas = (instant: number) => {
    const progres = Math.min(1, (instant - debut) / dureeMs);
    camera.zoom = depart + (cible - depart) * easeInOutCubic(progres);
    if (progres < 1) animation = requestAnimationFrame(pas);
  };
  animation = requestAnimationFrame(pas);
}
