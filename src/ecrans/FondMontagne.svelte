<script lang="ts">
  import MontagneLointaine from './MontagneLointaine.svelte';
  import Neige from './Neige.svelte';

  // zoom 1 = la montagne au loin (sauvegardes) ; > 1 = on voyage vers elle
  // (carte). Le fond restant monté d'un écran à l'autre, le changement de
  // zoom se joue en glissement continu.
  const { zoom = 1 }: { zoom?: number } = $props();
</script>

<div class="fond" aria-hidden="true">
  <div class="scene" style="--zoom: {zoom}">
    <MontagneLointaine />
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
  }

  .scene {
    position: absolute;
    inset: 0;
    transform: scale(var(--zoom));
    transform-origin: 50% 72%;
    transition: transform 1.5s cubic-bezier(0.22, 0.8, 0.3, 1);
  }
</style>
