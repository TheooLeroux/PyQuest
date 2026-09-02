<script lang="ts">
  import { enregistrerReglages, etat, retour, t } from '../jeu/etat.svelte';
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
  <h1>{t('options.titre')}</h1>
  <div class="panneau reglages">
    <label>
      {t('options.langue')}
      <select bind:value={etat.reglages.langue} onchange={enregistrerReglages}>
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </label>

    <label>
      {t('options.volume')}
      <input
        type="range"
        min="0"
        max="100"
        bind:value={etat.reglages.volume}
        onchange={enregistrerReglages}
      />
      <span class="valeur">{etat.reglages.volume}</span>
    </label>

    <label>
      {t('options.taillePolice')}
      <select bind:value={etat.reglages.taillePolice} onchange={enregistrerReglages}>
        <option value="petite">{t('options.taille.petite')}</option>
        <option value="normale">{t('options.taille.normale')}</option>
        <option value="grande">{t('options.taille.grande')}</option>
      </select>
    </label>
  </div>
  <p class="aide">{t('options.aide')}</p>
</main>

<style>
  .reglages {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
  }

  select,
  input[type='range'] {
    accent-color: var(--rose);
    font: inherit;
    color: var(--creme);
    background: var(--nuit);
    border: 1px solid rgba(244, 236, 216, 0.25);
    border-radius: 6px;
    padding: 0.3rem 0.5rem;
  }

  .valeur {
    min-width: 2.5rem;
    text-align: right;
    color: var(--cyan);
  }
</style>
