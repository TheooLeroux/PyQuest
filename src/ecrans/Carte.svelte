<script lang="ts">
  import { aller, retour, t } from '../jeu/etat.svelte';

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'Enter') aller('salle');
    else if (e.key === 'Escape') retour();
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>{t('carte.titre')}</h1>
  <p class="panneau montagne">⛰ {t('carte.enConstruction')}</p>
  <p class="aide">{t('carte.aide')}</p>
</main>

<style>
  .montagne {
    color: var(--cyan);
  }
</style>
