<script lang="ts">
  import { aller, retour, t } from '../jeu/etat.svelte';

  const SLOTS = [1, 2, 3];
  let index = $state(0);

  function ouvrir() {
    // La création/lecture réelle des slots arrive à l'étape 1 ;
    // pour l'instant, ouvrir un slot mène directement à la carte.
    aller('carte');
  }

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      index = (index + SLOTS.length - 1) % SLOTS.length;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      index = (index + 1) % SLOTS.length;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      ouvrir();
    } else if (e.key === 'Escape') {
      retour();
    }
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>{t('sauvegardes.titre')}</h1>
  <ul class="menu panneau">
    {#each SLOTS as slot, i (slot)}
      <li class={i === index ? 'actif' : ''}>
        <button
          onclick={() => {
            index = i;
            ouvrir();
          }}
        >
          {slot} · {t('sauvegardes.slotVide')}
        </button>
      </li>
    {/each}
  </ul>
  <p class="aide">{t('sauvegardes.aide')}</p>
</main>
