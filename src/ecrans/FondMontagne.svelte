<script lang="ts">
  import { camera, poserCamera, volerVers } from '../jeu/camera.svelte';
  import { PLANS } from '../scenes/chaine';
  import Etoiles from './Etoiles.svelte';
  import Neige from './Neige.svelte';
  import Nuages from './Nuages.svelte';
  import PlanMontagnes from './PlanMontagnes.svelte';

  // zoom 1 = la montagne au loin (sauvegardes) ; > 1 = on voyage vers elle
  // (carte). Chaque plan zoome selon son facteur de parallaxe : le voyage se
  // fait DANS le massif. `cle` rejoue la nappe de nuages à chaque étape.
  const { zoom = 1, cle = '' }: { zoom?: number; cle?: string } = $props();

  // Au montage, la caméra part de loin (72 %) puis vole vers sa place.
  // svelte-ignore state_referenced_locally
  poserCamera(zoom * 0.72);

  $effect(() => {
    volerVers(zoom);
  });

  // Premier affichage : nuages déjà en place qui se dissipent. Tout
  // changement d'étape ensuite : nuages qui TRAVERSENT le champ en fondu.
  // svelte-ignore state_referenced_locally
  let cleCourante = cle;
  let modeNuages: 'arrivee' | 'voyage' = $state('arrivee');
  $effect(() => {
    if (cle !== cleCourante) {
      cleCourante = cle;
      modeNuages = 'voyage';
    }
  });
</script>

<div class="fond" aria-hidden="true">
  <Etoiles />

  <div class="massif">
    {#each PLANS as plan, i (i)}
      <div class="plan" style="--facteur: {plan.facteur}; --zoom: {camera.zoom}">
        <div class="derive" style="animation-delay: {i * -6}s">
          <PlanMontagnes {plan} />
        </div>
      </div>
      {#if i < PLANS.length - 1}
        <div class="voile" style="height: {34 - i * 7}%"></div>
      {/if}
    {/each}

    <div class="brume"></div>
  </div>

  {#key cle}
    <Nuages mode={modeNuages} />
  {/key}

  <Neige />
</div>

<style>
  .fond {
    position: absolute;
    inset: 0;
    overflow: hidden;
    /* pas de fond propre : le ciel vit sur le body, commun à tous les écrans */
  }

  .massif {
    position: absolute;
    inset: 0;
    animation: apparition 0.6s ease-out both;
  }

  @keyframes apparition {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Chaque plan déborde largement de l'écran (aucun bord visible en voyage)
     et zoome selon son facteur de profondeur : parallaxe réelle. */
  .plan {
    position: absolute;
    inset: -10% -22% -3% -22%;
    transform: scale(calc(1 + (var(--zoom) - 1) * var(--facteur)))
      translateY(calc((var(--zoom) - 1) * var(--facteur) * 4%));
    transform-origin: 50% 80%;
    /* pas de transition : la caméra est pilotée image par image en JS */
    will-change: transform;
  }

  /* La lente respiration du décor en idle, déphasée par plan. */
  .derive {
    position: absolute;
    inset: 0;
    animation: respiration 26s ease-in-out infinite alternate;
  }

  @keyframes respiration {
    from {
      transform: translateY(0) scale(1);
    }
    to {
      transform: translateY(6px) scale(1.012);
    }
  }

  /* Voiles atmosphériques entre les plans — hors des SVG : ils ne se
     déforment pas pendant le voyage. */
  .voile {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent, rgba(11, 15, 34, 0.55));
    pointer-events: none;
  }

  .brume {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 20%;
    background: linear-gradient(180deg, transparent, rgba(11, 15, 34, 0.92));
    pointer-events: none;
  }
</style>
