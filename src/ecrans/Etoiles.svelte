<script lang="ts">
  // Champ d'étoiles au scintillement lent.
  let canvas: HTMLCanvasElement;

  $effect(() => {
    const contexte = canvas.getContext('2d')!;
    let largeur = (canvas.width = canvas.offsetWidth);
    let hauteur = (canvas.height = canvas.offsetHeight);

    const etoiles = Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.78,
      rayon: 0.4 + Math.random() * 1.3,
      base: 0.25 + Math.random() * 0.6,
      vitesse: 0.3 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
    }));

    const surRedimension = () => {
      largeur = canvas.width = canvas.offsetWidth;
      hauteur = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', surRedimension);

    let anime = 0;
    const dessiner = (instant: number) => {
      contexte.clearRect(0, 0, largeur, hauteur);
      contexte.fillStyle = '#ffffff';
      for (const etoile of etoiles) {
        const scintillement =
          0.7 + 0.3 * Math.sin((instant / 1000) * etoile.vitesse + etoile.phase);
        contexte.globalAlpha = etoile.base * scintillement;
        contexte.beginPath();
        contexte.arc(etoile.x * largeur, etoile.y * hauteur, etoile.rayon, 0, Math.PI * 2);
        contexte.fill();
      }
      contexte.globalAlpha = 1;
      anime = requestAnimationFrame(dessiner);
    };
    anime = requestAnimationFrame(dessiner);

    return () => {
      cancelAnimationFrame(anime);
      window.removeEventListener('resize', surRedimension);
    };
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
  }
</style>
