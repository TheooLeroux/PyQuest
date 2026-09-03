<script lang="ts">
  import type { PlanChaine } from '../scenes/chaine';

  const { plan }: { plan: PlanChaine } = $props();
  const HAUTEUR = 420;
</script>

<svg
  viewBox="0 0 1600 420"
  aria-hidden="true"
  preserveAspectRatio="xMidYMax slice"
  style="opacity: {plan.opacite}"
>
  {#each plan.sommets as sommet (sommet.x)}
    <g transform="translate({sommet.x}, {HAUTEUR - sommet.hauteur})">
      {#each sommet.facettes as facette (facette.points)}
        <polygon points={facette.points} fill={facette.couleur} />
      {/each}
    </g>
  {/each}
</svg>

<style>
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
</style>
