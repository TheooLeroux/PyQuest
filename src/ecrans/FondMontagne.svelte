<script lang="ts">
  import { PLANS } from '../scenes/chaine';
  import Etoiles from './Etoiles.svelte';
  import Neige from './Neige.svelte';
  import Nuages from './Nuages.svelte';
  import PlanMontagnes from './PlanMontagnes.svelte';

  // zoom 1 = la montagne au loin (sauvegardes) ; > 1 = on voyage vers elle
  // (carte). Chaque plan zoome selon son facteur de parallaxe : le voyage se
  // fait DANS le massif. `cle` rejoue la nappe de nuages à chaque étape.
  const { zoom = 1, cle = '' }: { zoom?: number; cle?: string } = $props();

  // Au montage, la scène part de plus loin puis glisse vers sa place.
  // svelte-ignore state_referenced_locally
  let zoomCourant = $state(zoom * 0.82);

  $effect(() => {
    const cible = zoom;
    // Double rAF : l'état de départ est peint avant de lancer la transition.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        zoomCourant = cible;
      });
    });
    return () => cancelAnimationFrame(id);
  });
</script>

<div class="fond" aria-hidden="true">
  <Etoiles />

  {#each PLANS as plan, i (i)}
    <div class="plan" style="--facteur: {plan.facteur}; --zoom: {zoomCourant}">
      <div class="derive" style="animation-delay: {i * -6}s">
        <PlanMontagnes {plan} />
      </div>
    </div>
    {#if i < PLANS.length - 1}
      <div class="voile" style="height: {34 - i * 7}%"></div>
    {/if}
  {/each}

  <div class="brume"></div>

  {#key cle}
    <Nuages />
  {/key}

  <Neige />
</div>

<style>
  .fond {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 55% at 50% 100%, rgba(51, 88, 111, 0.35), transparent 65%),
      linear-gradient(195deg, #131933 0%, #0b0f22 45%, #081019 100%);
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
    inset: -8% -20% -2% -20%;
    transform: scale(calc(1 + (var(--zoom) - 1) * var(--facteur)))
      translateY(calc((var(--zoom) - 1) * var(--facteur) * 2.5%));
    transform-origin: 50% 80%;
    transition: transform 2.4s cubic-bezier(0.22, 0.85, 0.25, 1);
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
