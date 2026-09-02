<script lang="ts">
  import { fiches } from '../contenu/catalogue';
  import { aller, retour, t } from '../jeu/etat.svelte';
  import { creerEtOuvrirSlot, effacerSlot, listerSlots, ouvrirSlot } from '../jeu/partie.svelte';
  import { pourcentageAscension } from '../jeu/progression';
  import { NOMBRE_SLOTS } from '../stockage/slots';

  let slots = $state(listerSlots());
  let index = $state(0);
  let mode: 'liste' | 'creation' | 'suppression' = $state('liste');
  let nomSaisi = $state('');

  function ouvrir() {
    const slot = slots[index];
    if (slot) {
      ouvrirSlot(index + 1, slot);
      aller('carte');
    } else {
      nomSaisi = '';
      mode = 'creation';
    }
  }

  function creer() {
    const nom = nomSaisi.trim();
    if (nom === '') return;
    creerEtOuvrirSlot(index + 1, nom);
    aller('carte');
  }

  function surTouche(e: KeyboardEvent) {
    if (mode === 'creation') return; // le champ de saisie gère ses touches
    if (mode === 'suppression') {
      if (e.key === 'Enter') {
        effacerSlot(index + 1);
        slots = listerSlots();
      }
      mode = 'liste';
      return;
    }
    if (e.key === 'ArrowUp') {
      index = (index + NOMBRE_SLOTS - 1) % NOMBRE_SLOTS;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      index = (index + 1) % NOMBRE_SLOTS;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      ouvrir();
    } else if (e.key === 'Delete' && slots[index]) {
      mode = 'suppression';
    } else if (e.key === 'Escape') {
      retour();
    }
  }

  function surToucheSaisie(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === 'Enter') creer();
    else if (e.key === 'Escape') mode = 'liste';
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>{t('sauvegardes.titre')}</h1>
  <ul class="menu panneau">
    {#each slots as slot, i (i)}
      <li class={i === index ? 'actif' : ''}>
        <button
          onclick={() => {
            index = i;
            ouvrir();
          }}
        >
          {#if slot}
            {i + 1} · {slot.nom} — {pourcentageAscension(slot, fiches)} %
            {#if mode === 'suppression' && i === index}
              <span class="danger">{t('sauvegardes.confirmerSuppression')}</span>
            {/if}
          {:else}
            {i + 1} · {t('sauvegardes.slotVide')}
          {/if}
        </button>
      </li>
    {/each}
  </ul>

  {#if mode === 'creation'}
    <div class="panneau saisie">
      <label>
        {t('sauvegardes.nomQuestion')}
        <!-- svelte-ignore a11y_autofocus -->
        <input autofocus maxlength="20" bind:value={nomSaisi} onkeydown={surToucheSaisie} />
      </label>
    </div>
  {/if}

  <p class="aide">{t('sauvegardes.aide')}</p>
</main>

<style>
  .danger {
    color: var(--rose);
    margin-left: 1rem;
  }

  .saisie label {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .saisie input {
    font: inherit;
    color: var(--creme);
    background: var(--nuit);
    border: 1px solid rgba(244, 236, 216, 0.25);
    border-radius: 6px;
    padding: 0.35rem 0.6rem;
  }
</style>
