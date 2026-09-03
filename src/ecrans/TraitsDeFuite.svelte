<script lang="ts">
  // Bouffée de traits de fuite radiaux (~0,5 s) : l'élan du voyage
  // quand on avance d'un écran vers la montagne.
  let canvas: HTMLCanvasElement;

  $effect(() => {
    const contexte = canvas.getContext('2d')!;
    const largeur = (canvas.width = canvas.offsetWidth);
    const hauteur = (canvas.height = canvas.offsetHeight);
    const centreX = largeur / 2;
    const centreY = hauteur * 0.55;

    const traits = Array.from({ length: 70 }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: 60 + Math.random() * 160,
      vitesse: 1400 + Math.random() * 1600,
      longueur: 50 + Math.random() * 150,
      epaisseur: 1 + Math.random() * 2,
    }));

    const DUREE_MS = 550;
    const debut = performance.now();
    let anime = 0;

    const dessiner = (instant: number) => {
      const secondes = (instant - debut) / 1000;
      const progres = (instant - debut) / DUREE_MS;
      contexte.clearRect(0, 0, largeur, hauteur);
      if (progres >= 1) return;
      const alpha = progres < 0.15 ? progres / 0.15 : 1 - (progres - 0.15) / 0.85;
      contexte.strokeStyle = `rgba(215, 235, 255, ${0.55 * alpha})`;
      for (const trait of traits) {
        const proche = trait.distance + trait.vitesse * secondes * secondes * 2;
        const loin = proche + trait.longueur * (0.4 + progres);
        contexte.lineWidth = trait.epaisseur;
        contexte.beginPath();
        contexte.moveTo(
          centreX + Math.cos(trait.angle) * proche,
          centreY + Math.sin(trait.angle) * proche,
        );
        contexte.lineTo(
          centreX + Math.cos(trait.angle) * loin,
          centreY + Math.sin(trait.angle) * loin,
        );
        contexte.stroke();
      }
      anime = requestAnimationFrame(dessiner);
    };
    anime = requestAnimationFrame(dessiner);
    return () => cancelAnimationFrame(anime);
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }
</style>
