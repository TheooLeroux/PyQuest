<script lang="ts">
  import { etat } from './jeu/etat.svelte';
  import Titre from './ecrans/Titre.svelte';
  import Sauvegardes from './ecrans/Sauvegardes.svelte';
  import Options from './ecrans/Options.svelte';
  import Credits from './ecrans/Credits.svelte';
  import Carte from './ecrans/Carte.svelte';
  import Salle from './ecrans/Salle.svelte';

  const ecrans = {
    titre: Titre,
    sauvegardes: Sauvegardes,
    options: Options,
    credits: Credits,
    carte: Carte,
    salle: Salle,
  };

  const Ecran = $derived(ecrans[etat.ecran]);

  $effect(() => {
    document.documentElement.dataset.taille = etat.reglages.taillePolice;
    document.documentElement.lang = etat.reglages.langue;
  });
</script>

<Ecran />
