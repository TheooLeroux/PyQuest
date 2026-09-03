<script lang="ts">
  import { etat } from './jeu/etat.svelte';
  import { jouerMusiqueTitre, mettreMusiqueEnPause, reglerVolumeMusique } from './jeu/musique';
  import FondMontagne from './ecrans/FondMontagne.svelte';
  import TraitsDeFuite from './ecrans/TraitsDeFuite.svelte';
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

  $effect(() => {
    reglerVolumeMusique(etat.reglages.volumeMusique);
  });

  $effect(() => {
    // La musique est continue sur tous les écrans ; elle se met en pause dans
    // la salle (concentration) et reprend où elle en était en sortant.
    if (etat.ecran === 'salle') mettreMusiqueEnPause();
    else jouerMusiqueTitre(etat.reglages.volumeMusique);
  });

  // Le navigateur interdit le son avant le premier geste (clic ou touche) :
  // on saisit le tout premier, où qu'il ait lieu, pour lancer la musique.
  function relancerMusique() {
    if (etat.ecran !== 'salle') jouerMusiqueTitre(etat.reglages.volumeMusique);
  }

  // Écrans joués devant la montagne ; entrer dans l'un d'eux lance les
  // traits de fuite, et le zoom du fond fait le voyage sauvegardes ↔ carte.
  const surLaMontagne = $derived(etat.ecran === 'sauvegardes' || etat.ecran === 'carte');
  const versLaCarte = $derived(etat.ecran === 'carte' || etat.enVoyage);
  let fuite = $state(false);
  let timerFuite: ReturnType<typeof setTimeout>;
  let etapePrecedente = '';
  $effect(() => {
    // Une salve par étape du périple : arrivée aux sauvegardes, départ du
    // voyage — pas de doublon quand l'écran bascule en plein vol.
    const etape = versLaCarte ? 'voyage' : etat.ecran;
    if (etape === etapePrecedente) return;
    etapePrecedente = etape;
    if (surLaMontagne) {
      fuite = true;
      clearTimeout(timerFuite);
      timerFuite = setTimeout(() => (fuite = false), 1450);
    }
  });

  $effect(() => {
    // Arrivé sur la carte (ou revenu ailleurs), le drapeau de voyage retombe.
    if (etat.ecran !== 'sauvegardes') etat.enVoyage = false;
  });
</script>

<svelte:window onkeydown={relancerMusique} onpointerdown={relancerMusique} />

{#if surLaMontagne}
  <FondMontagne zoom={versLaCarte ? 1.9 : 1} cle={versLaCarte ? 'carte' : etat.ecran} />
{/if}

<Ecran />

{#if surLaMontagne && fuite}
  <TraitsDeFuite />
{/if}
