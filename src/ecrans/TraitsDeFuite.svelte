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

    // Discrets : peu nombreux, fins, translucides, étalés dans le temps —
    // un courant d'air, pas une explosion (vérifié frame par frame).
    const traits = Array.from({ length: 22 }, () => ({
      angle: Math.random() * Math.PI * 2,
      depart: 60 + Math.random() * 140,
      vitesse: 420 + Math.random() * 480,
      longueur: 70 + Math.random() * 130,
      epaisseur: 0.8 + Math.random() * 1,
      retard: Math.random() * 0.5, // naissance étalée sur une demi-seconde
      teinte: Math.random() < 0.3 ? '150, 220, 240' : '225, 238, 255',
    }));

    const DUREE_MS = 1400;
    const debut = performance.now();
    let anime = 0;

    const dessiner = (instant: number) => {
      const progres = (instant - debut) / DUREE_MS;
      contexte.clearRect(0, 0, largeur, hauteur);
      if (progres >= 1) return;
      // Fondu global : montée douce (30 %), sortie douce (40 %).
      const enveloppe = progres < 0.3 ? progres / 0.3 : progres > 0.6 ? (1 - progres) / 0.4 : 1;

      for (const trait of traits) {
        const secondes = Math.max(0, (instant - debut) / 1000 - trait.retard);
        if (secondes === 0) continue;
        // Chaque trait naît transparent puis s'affirme.
        const naissance = Math.min(1, secondes / 0.35);
        const proche = trait.depart + trait.vitesse * secondes * (1 + secondes * 1.2);
        if (proche > rayonMax) continue;
        const loin = proche + trait.longueur;
        const cos = Math.cos(trait.angle);
        const sin = Math.sin(trait.angle);
        // Plus le trait s'éloigne, plus il s'estompe.
        const alpha = 0.35 * enveloppe * naissance * Math.max(0, 1 - proche / rayonMax);
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
