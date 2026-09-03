<!-- La nappe de nuages.
     Mode « arrivee » : elle couvre déjà la scène et se dissipe (premier
     affichage). Mode « voyage » : les nuages naissent invisibles près de
     l'horizon, montent en opacité et traversent le champ — on avance à
     travers eux, rien ne surgit d'un coup. -->
<script lang="ts">
  const { mode = 'arrivee' }: { mode?: 'arrivee' | 'voyage' } = $props();

  const nuages = [
    { gauche: -12, haut: 22, largeur: 55, hauteur: 34, retard: 40, dx: -16 },
    { gauche: 18, haut: 10, largeur: 48, hauteur: 26, retard: 0, dx: -6 },
    { gauche: 30, haut: 38, largeur: 62, hauteur: 38, retard: 140, dx: 8 },
    { gauche: 58, haut: 18, largeur: 50, hauteur: 30, retard: 80, dx: 20 },
    { gauche: 2, haut: 55, largeur: 66, hauteur: 42, retard: 220, dx: -14 },
    { gauche: 42, haut: 60, largeur: 72, hauteur: 44, retard: 300, dx: 6 },
    { gauche: 72, haut: 44, largeur: 58, hauteur: 38, retard: 170, dx: 24 },
    { gauche: 22, haut: 78, largeur: 80, hauteur: 40, retard: 380, dx: -4 },
  ];
</script>

{#each nuages as nuage, i (i)}
  <span
    class="nuage {mode}"
    style="left: {nuage.gauche}vw; top: {nuage.haut}vh; width: {nuage.largeur}vw;
      height: {nuage.hauteur}vh; --dx: {nuage.dx}vw; animation-delay: {nuage.retard}ms"
  ></span>
{/each}

<style>
  .nuage {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(
      closest-side,
      rgba(199, 213, 235, 0.6),
      rgba(151, 173, 206, 0.3) 55%,
      transparent 78%
    );
    filter: blur(26px);
    pointer-events: none;
    z-index: 4;
  }

  .nuage.arrivee {
    animation: balayage 3.2s cubic-bezier(0.35, 0.55, 0.3, 1) both;
  }

  .nuage.voyage {
    animation: traversee 3.4s cubic-bezier(0.35, 0.5, 0.3, 1) both;
  }

  @keyframes balayage {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    30% {
      opacity: 0.95;
    }
    100% {
      transform: translate(var(--dx), 42vh) scale(1.35);
      opacity: 0;
    }
  }

  @keyframes traversee {
    0% {
      transform: translate(calc(var(--dx) * -0.4), -8vh) scale(0.82);
      opacity: 0;
    }
    35% {
      opacity: 0.9;
    }
    100% {
      transform: translate(var(--dx), 40vh) scale(1.45);
      opacity: 0;
    }
  }
</style>
