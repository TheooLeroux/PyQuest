<script lang="ts">
  import { fiches } from '../contenu/catalogue';
  import { partie } from '../jeu/partie.svelte';
  import SalleContenu from './SalleContenu.svelte';

  const fiche = $derived(fiches.find((f) => f.id === partie.salleId));
</script>

{#if fiche}
  <!-- Changer de salle recrée tout l'écran (éditeur et console compris). -->
  {#key fiche.id}
    <SalleContenu {fiche} />
  {/key}
{/if}
