<script lang="ts">
  import Etoiles from './Etoiles.svelte';
  import MontagneLointaine from './MontagneLointaine.svelte';
  import Neige from './Neige.svelte';

  // zoom 1 = la montagne au loin (sauvegardes) ; > 1 = on voyage vers elle
  // (carte). Le fond reste monté d'un écran à l'autre : le zoom glisse.
  const { zoom = 1 }: { zoom?: number } = $props();

  // Au montage, la scène part de plus loin (72 % de la cible) puis glisse
  // vers elle : l'arrivée est un zoom, pas une apparition sèche.
  // svelte-ignore state_referenced_locally
  let zoomCourant = $state(zoom * 0.72);

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
  <div class="scene" style="--zoom: {zoomCourant}">
    <div class="derive">
      <MontagneLointaine />
    </div>
  </div>
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
    animation: apparition 0.5s ease-out both;
  }

  @keyframes apparition {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .scene {
    position: absolute;
    inset: 0;
    transform: scale(var(--zoom));
    transform-origin: 50% 72%;
    transition: transform 1.6s cubic-bezier(0.16, 0.7, 0.3, 1);
  }

  /* La lente respiration du décor en idle (la carte a le droit de vivre). */
  .derive {
    position: absolute;
    inset: 0;
    animation: respiration 22s ease-in-out infinite alternate;
  }

  @keyframes respiration {
    from {
      transform: translateY(0) scale(1);
    }
    to {
      transform: translateY(7px) scale(1.015);
    }
  }
</style>
