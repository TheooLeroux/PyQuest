<script lang="ts">
  import { fiches } from '../contenu/catalogue';
  import { formaterDate, formaterDuree } from '../jeu/affichage';
  import { aller, etat, retour, t } from '../jeu/etat.svelte';
  import { creerEtOuvrirSlot, effacerSlot, listerSlots, ouvrirSlot } from '../jeu/partie.svelte';
  import {
    chutesTotales,
    fraisesTotales,
    pourcentageAscension,
    tempsTotalSec,
  } from '../jeu/progression';
  import { jouerSon } from '../jeu/sons';
  import { NOMBRE_SLOTS } from '../stockage/slots';

  let slots = $state(listerSlots());
  let index = $state(0);
  let mode: 'liste' | 'creation' | 'suppression' = $state('liste');
  let nomSaisi = $state('');
  let depart = $state(false);

  // Le voyage décolle ICI : la caméra et les nuages partent tout de suite,
  // les tickets s'envolent, puis l'écran bascule en plein vol.
  function demarrerVoyage() {
    depart = true;
    etat.enVoyage = true;
    setTimeout(() => aller('carte'), 750);
  }

  function ouvrir() {
    const slot = slots[index];
    if (slot) {
      jouerSon('slotOuvrir');
      ouvrirSlot(index + 1, slot);
      demarrerVoyage();
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
    demarrerVoyage();
  }

  function cliquerCarte(i: number) {
    if (depart) return;
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
    if (depart) return; // en plein décollage, on ne pilote plus
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

<main class="ecran" class:depart>
  <h1>{t('sauvegardes.titre')}</h1>

  <div class="tickets">
    {#each slots as slot, i (i)}
      {#if mode === 'creation' && i === index && !slot}
        <div class="ticket actif creation" style="--angle: 0deg; --retard: 0ms">
          <span class="photo"><span class="scotch"></span>{i + 1}</span>
          <label>
            {t('sauvegardes.nomQuestion')}
            <!-- svelte-ignore a11y_autofocus -->
            <input autofocus maxlength="20" bind:value={nomSaisi} onkeydown={surToucheSaisie} />
          </label>
        </div>
      {:else}
        <button
          class="ticket"
          class:actif={i === index}
          class:danger={mode === 'suppression' && i === index}
          style="--angle: {i === index ? 0 : i % 2 === 0 ? -0.8 : 0.7}deg; --retard: {650 +
            i * 110}ms"
          onclick={() => cliquerCarte(i)}
        >
          <span class="photo"><span class="scotch"></span>{i + 1}</span>
          {#if slot}
            <span class="contenu">
              <span class="nom">{slot.nom}</span>
              <span class="stats">
                ⚑ {pourcentageAscension(slot, fiches)} % · 🍓 ×{fraisesTotales(slot)}
              </span>
              {#if i === index && mode !== 'suppression'}
                <span class="stats etendues">
                  ☠ ×{chutesTotales(slot)} · ⏱ {formaterDuree(tempsTotalSec(slot))}
                </span>
              {/if}
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
  .tickets {
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
    width: min(38rem, 92vw);
  }

  /* Au décollage, tout s'envole : dépassé par la caméra qui avance. */
  .depart .ticket {
    animation: envol 0.65s ease-in both;
  }

  .depart h1,
  .depart .aide {
    animation: envol 0.5s ease-in both;
  }

  @keyframes envol {
    to {
      opacity: 0;
      transform: translateY(48px) scale(1.08);
    }
  }

  /* Chaque ticket arrive en cascade, après le début du zoom du fond. */
  @keyframes entree {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Un ticket de papier : encoches latérales, léger désordre, encre foncée. */
  .ticket {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.3rem;
    font: inherit;
    text-align: left;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    padding: 1rem 1.6rem;
    min-height: 5.2rem;
    color: #57493a;
    background: linear-gradient(174deg, #e3ddcd 0%, #d3ccba 100%);
    box-shadow:
      0 4px 14px rgba(0, 0, 0, 0.45),
      inset 0 0 26px rgba(120, 100, 70, 0.14);
    rotate: var(--angle);
    transition:
      rotate 0.15s,
      scale 0.15s,
      background 0.15s;
    animation: entree 0.45s ease-out var(--retard) both;
    mask:
      radial-gradient(circle 13px at 0 50%, transparent 97%, #000),
      radial-gradient(circle 13px at 100% 50%, transparent 97%, #000);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }

  .ticket.actif {
    scale: 1.04;
    color: #59391b;
    background: linear-gradient(174deg, #f3c775 0%, #e5ab4e 100%);
    box-shadow:
      0 6px 22px rgba(0, 0, 0, 0.55),
      inset 0 0 30px rgba(150, 95, 25, 0.22);
  }

  .ticket.danger {
    background: linear-gradient(174deg, #e8987b 0%, #d97f60 100%);
    color: #5c2415;
  }

  /* La « photo » scotchée (le portrait viendra plus tard). */
  .photo {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.2rem;
    height: 3.2rem;
    flex: none;
    font-size: 1.6em;
    font-weight: bold;
    color: #efe8d8;
    background: linear-gradient(160deg, #6b5f8f 0%, #3d2b6b 100%);
    border: 3px solid #f4efe2;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    rotate: -2.5deg;
  }

  .scotch {
    position: absolute;
    top: -0.7rem;
    left: 50%;
    translate: -50% 0;
    rotate: -6deg;
    width: 2.4rem;
    height: 0.85rem;
    background: rgba(190, 215, 230, 0.5);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  }

  .contenu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .nom {
    font-size: 1.3em;
    font-weight: bold;
    letter-spacing: 0.04em;
  }

  .stats {
    font-size: 0.9em;
    opacity: 0.85;
  }

  .etendues {
    opacity: 0.7;
  }

  .vide {
    opacity: 0.55;
    font-style: italic;
  }

  .date {
    opacity: 0.55;
    font-size: 0.85em;
  }

  .alerte {
    font-weight: bold;
    font-size: 0.9em;
    max-width: 11rem;
    text-align: right;
  }

  .creation label {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    color: #59391b;
  }

  .creation input {
    font: inherit;
    color: #3c2a12;
    background: rgba(255, 250, 235, 0.85);
    border: 1px solid rgba(90, 60, 20, 0.4);
    border-radius: 4px;
    padding: 0.35rem 0.6rem;
    flex: 1;
  }
</style>
