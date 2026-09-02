<script lang="ts">
  import { retour, t } from '../jeu/etat.svelte';
  import { jouerSon } from '../jeu/sons';

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      jouerSon('retour');
      retour();
    }
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>{t('credits.titre')}</h1>
  <div class="panneau credits">
    <p class="jeu">{t('credits.texte')}</p>
    <p>{t('credits.celeste')}</p>
    <p>{t('credits.musique')}</p>
    <p class="disclaimer">{t('credits.disclaimer')}</p>
  </div>
  <p class="aide">{t('credits.aide')}</p>
</main>

<style>
  .credits {
    max-width: 34rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    line-height: 1.5;
  }

  .jeu {
    color: var(--cyan);
    margin: 0;
  }

  p {
    margin: 0;
  }

  .disclaimer {
    font-size: 0.85em;
    opacity: 0.75;
    border-top: 1px solid rgba(244, 236, 216, 0.15);
    padding-top: 0.9rem;
  }
</style>
