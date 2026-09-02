<script lang="ts">
  import { retour, t } from '../jeu/etat.svelte';

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'Escape') retour();
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>{t('salle.titre')}</h1>
  <p class="panneau">🧗 {t('salle.enConstruction')}</p>
  <p class="aide">{t('salle.aide')}</p>
</main>
