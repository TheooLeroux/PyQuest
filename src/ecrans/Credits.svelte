<script lang="ts">
  import { retour, t } from '../jeu/etat.svelte';

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'Escape') retour();
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>{t('credits.titre')}</h1>
  <p class="panneau">{t('credits.texte')}</p>
  <p class="aide">{t('credits.aide')}</p>
</main>
