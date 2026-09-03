<script lang="ts">
  import { HAUTEUR_SCENE, LARGEUR_SCENE, type PlanChaine } from '../scenes/chaine';

  const { plan }: { plan: PlanChaine } = $props();
</script>

<svg
  viewBox="0 0 {LARGEUR_SCENE} {HAUTEUR_SCENE}"
  aria-hidden="true"
  preserveAspectRatio="xMidYMax slice"
  style="opacity: {plan.opacite}"
>
  {#each plan.sommets as sommet (sommet.x)}
    <g transform="translate({sommet.x}, {HAUTEUR_SCENE - sommet.hauteur})">
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
