<script lang="ts">
  import { fiches } from '../contenu/catalogue';
  import { formaterDate, formaterDuree } from '../jeu/affichage';
  import { aller, etat, retour, t } from '../jeu/etat.svelte';
  import { creerEtOuvrirSlot, effacerSlot, listerSlots, ouvrirSlot } from '../jeu/partie.svelte';
  import { fraisesTotales, pourcentageAscension, tempsTotalSec } from '../jeu/progression';
  import { jouerSon } from '../jeu/sons';
  import { NOMBRE_SLOTS } from '../stockage/slots';

  let slots = $state(listerSlots());
  let index = $state(0);
  let mode: 'liste' | 'creation' | 'suppression' = $state('liste');
  let nomSaisi = $state('');

  function ouvrir() {
    const slot = slots[index];
    if (slot) {
      jouerSon('slotOuvrir');
      ouvrirSlot(index + 1, slot);
      aller('carte');
    } else {
      jouerSon('valider');
      nomSaisi = '';
      mode = 'creation';
    }
  }

  function creer() {
    const nom = nomSaisi.trim();
    if (nom === '') return;
    jouerSon('nomAccepte');
    jouerSon('slotOuvrir');
    creerEtOuvrirSlot(index + 1, nom);
    aller('carte');
  }

  function cliquerCarte(i: number) {
    if (mode === 'suppression' && i === index) {
      jouerSon('slotSupprimer');
      effacerSlot(index + 1);
      slots = listerSlots();
      mode = 'liste';
      return;
    }
    mode = 'liste';
    index = i;
    ouvrir();
  }

  function surTouche(e: KeyboardEvent) {
    if (mode === 'creation') return; // le champ de saisie gère ses touches
    if (mode === 'suppression') {
      if (e.key === 'Enter') {
        jouerSon('slotSupprimer');
        effacerSlot(index + 1);
        slots = listerSlots();
      } else {
        jouerSon('retour');
      }
      mode = 'liste';
      return;
    }
    if (e.key === 'ArrowUp') {
      jouerSon('slotDefile');
      index = (index + NOMBRE_SLOTS - 1) % NOMBRE_SLOTS;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      jouerSon('slotDefile');
      index = (index + 1) % NOMBRE_SLOTS;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      ouvrir();
    } else if (e.key === 'Delete' && slots[index]) {
      jouerSon('invalide');
      mode = 'suppression';
    } else if (e.key === 'Escape') {
      jouerSon('retour');
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

  <div class="cartes">
    {#each slots as slot, i (i)}
      {#if mode === 'creation' && i === index && !slot}
        <div class="carte active creation">
          <span class="numero">{i + 1}</span>
          <label>
            {t('sauvegardes.nomQuestion')}
            <!-- svelte-ignore a11y_autofocus -->
            <input autofocus maxlength="20" bind:value={nomSaisi} onkeydown={surToucheSaisie} />
          </label>
        </div>
      {:else}
        <button
          class="carte"
          class:active={i === index}
          class:danger={mode === 'suppression' && i === index}
          onclick={() => cliquerCarte(i)}
        >
          <span class="numero">{i + 1}</span>
          {#if slot}
            <span class="contenu">
              <span class="nom">{slot.nom}</span>
              <span class="stats">
                ⚑ {pourcentageAscension(slot, fiches)} % · 🍓 {fraisesTotales(slot)} · ⏱
                {formaterDuree(tempsTotalSec(slot))}
              </span>
            </span>
            {#if mode === 'suppression' && i === index}
              <span class="alerte">{t('sauvegardes.confirmerSuppression')}</span>
            {:else}
              <span class="date">{formaterDate(slot.dernierJeuLe, etat.reglages.langue)}</span>
            {/if}
          {:else}
            <span class="contenu">
              <span class="vide">{t('sauvegardes.slotVide')}</span>
            </span>
          {/if}
        </button>
      {/if}
    {/each}
  </div>

  <p class="aide">{t('sauvegardes.aide')}</p>
</main>

<style>
  .cartes {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: min(36rem, 92vw);
  }

  .carte {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
    background: rgba(26, 26, 46, 0.75);
    border: 1px solid rgba(244, 236, 216, 0.12);
    border-radius: 10px;
    padding: 1.1rem 1.5rem;
    min-height: 4.6rem;
    transition:
      border-color 0.12s,
      transform 0.12s;
  }

  .carte.active {
    border-color: var(--rose);
    box-shadow: 0 0 18px rgba(224, 76, 106, 0.18);
    transform: translateX(0.4rem);
  }

  .carte.danger {
    border-color: var(--rose);
    background: rgba(224, 76, 106, 0.16);
  }

  .numero {
    font-size: 1.5em;
    opacity: 0.45;
    min-width: 1.4rem;
    text-align: center;
  }

  .contenu {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    flex: 1;
  }

  .nom {
    font-size: 1.25em;
    letter-spacing: 0.05em;
  }

  .stats {
    opacity: 0.8;
    font-size: 0.9em;
    color: var(--cyan);
  }

  .vide {
    opacity: 0.6;
    font-style: italic;
  }

  .date {
    opacity: 0.5;
    font-size: 0.85em;
  }

  .alerte {
    color: var(--rose);
    font-size: 0.9em;
    max-width: 11rem;
    text-align: right;
  }

  .creation label {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }

  .creation input {
    font: inherit;
    color: var(--creme);
    background: var(--nuit);
    border: 1px solid rgba(244, 236, 216, 0.25);
    border-radius: 6px;
    padding: 0.35rem 0.6rem;
    flex: 1;
  }
</style>
