<script lang="ts">
  let canvas: HTMLCanvasElement;

  interface Flocon {
    x: number;
    y: number;
    rayon: number;
    vitesse: number;
    derive: number;
    alpha: number;
  }

  $effect(() => {
    const contexte = canvas.getContext('2d')!;
    let largeur = (canvas.width = canvas.offsetWidth);
    let hauteur = (canvas.height = canvas.offsetHeight);

    const flocons: Flocon[] = Array.from({ length: 90 }, () => ({
      x: Math.random() * largeur,
      y: Math.random() * hauteur,
      rayon: 0.6 + Math.random() * 2.2,
      vitesse: 0.15 + Math.random() * 0.5,
      derive: -0.35 + Math.random() * 0.25,
      alpha: 0.25 + Math.random() * 0.65,
    }));

    const surRedimension = () => {
      largeur = canvas.width = canvas.offsetWidth;
      hauteur = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', surRedimension);

    let anime = 0;
    const dessiner = () => {
      contexte.clearRect(0, 0, largeur, hauteur);
      contexte.fillStyle = '#ffffff';
      for (const flocon of flocons) {
        flocon.y += flocon.vitesse;
        flocon.x += flocon.derive;
        if (flocon.y > hauteur + 4) {
          flocon.y = -4;
          flocon.x = Math.random() * largeur;
        }
        if (flocon.x < -4) flocon.x = largeur + 4;
        contexte.globalAlpha = flocon.alpha;
        contexte.beginPath();
        contexte.arc(flocon.x, flocon.y, flocon.rayon, 0, Math.PI * 2);
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
