<script lang="ts">
  // L'élan du voyage : des traits de fuite radiaux, nés en deux vagues,
  // assez lents et lumineux pour être lus (~0,9 s au total).
  let canvas: HTMLCanvasElement;

  $effect(() => {
    const contexte = canvas.getContext('2d')!;
    const largeur = (canvas.width = canvas.offsetWidth);
    const hauteur = (canvas.height = canvas.offsetHeight);
    const centreX = largeur / 2;
    const centreY = hauteur * 0.55;
    const rayonMax = Math.hypot(largeur, hauteur) / 2;

    const traits = Array.from({ length: 60 }, () => ({
      angle: Math.random() * Math.PI * 2,
      depart: 40 + Math.random() * 100,
      vitesse: 500 + Math.random() * 600, // px/s — lisible, pas un flash
      longueur: 90 + Math.random() * 180,
      epaisseur: 1.5 + Math.random() * 2,
      retard: Math.random() * 0.25, // deux vagues plutôt qu'une seule salve
      teinte: Math.random() < 0.3 ? '150, 220, 240' : '225, 238, 255',
    }));

    const DUREE_MS = 900;
    const debut = performance.now();
    let anime = 0;

    const dessiner = (instant: number) => {
      const progres = (instant - debut) / DUREE_MS;
      contexte.clearRect(0, 0, largeur, hauteur);
      if (progres >= 1) return;
      // Fondu global : montée rapide (10 %), tenue, sortie douce (40 %).
      const enveloppe = progres < 0.1 ? progres / 0.1 : progres > 0.6 ? (1 - progres) / 0.4 : 1;

      for (const trait of traits) {
        const secondes = Math.max(0, (instant - debut) / 1000 - trait.retard);
        if (secondes === 0) continue;
        const proche = trait.depart + trait.vitesse * secondes * (1 + secondes * 1.5);
        if (proche > rayonMax) continue;
        const loin = proche + trait.longueur;
        const cos = Math.cos(trait.angle);
        const sin = Math.sin(trait.angle);
        // Plus le trait s'éloigne, plus il s'estompe.
        const alpha = 0.85 * enveloppe * Math.max(0, 1 - proche / rayonMax);
        contexte.strokeStyle = `rgba(${trait.teinte}, ${alpha})`;
        contexte.lineWidth = trait.epaisseur;
        contexte.beginPath();
        contexte.moveTo(centreX + cos * proche, centreY + sin * proche);
        contexte.lineTo(centreX + cos * loin, centreY + sin * loin);
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
