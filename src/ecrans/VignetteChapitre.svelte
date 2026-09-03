<script lang="ts">
  import { formaterDuree } from '../jeu/affichage';
  import { t } from '../jeu/etat.svelte';
  import type { StatsChapitre } from '../jeu/progression';

  export interface ChoixVignette {
    libelle: string;
    salleId: string;
  }

  const {
    numero,
    nom,
    stats,
    coeur, // null = pas de cœur de cristal dans ce chapitre
    choix,
    index,
    onchoisir,
  }: {
    numero: number;
    nom: string;
    stats: StatsChapitre;
    coeur: 'verrouille' | 'valide' | null;
    choix: ChoixVignette[];
    index: number;
    onchoisir: (salleId: string) => void;
  } = $props();
</script>

<aside class="vignette panneau">
  <h2>{numero}. {nom}</h2>

  <div class="onglets">
    <span class="onglet actif">A</span>
    <span class="onglet grise">B</span>
    <span class="onglet grise">C</span>
    <span class="note">{t('vignette.aVenir')}</span>
  </div>

  <p class="stats">
    ⚑ {stats.validees}/{stats.total} · 🍓 ×{stats.fraises} · ☠ ×{stats.chutes} · ⏱
    {formaterDuree(stats.tempsSec)}
  </p>

  {#if coeur !== null}
    <p class="coeur">◈ {t('vignette.coeur')} {coeur === 'valide' ? '✔' : '🔒'}</p>
  {/if}

  <ul class="choix">
    {#each choix as option, i (option.libelle)}
      <li class={i === index ? 'actif' : ''}>
        <button onclick={() => onchoisir(option.salleId)}>{option.libelle}</button>
      </li>
    {/each}
  </ul>

  <p class="aideV">{t('vignette.aide')}</p>
</aside>

<style>
  .vignette {
    position: absolute;
    right: 2rem;
    top: 50%;
    translate: 0 -50%;
    width: min(24rem, 44vw);
    z-index: 2;
    animation: glissade 0.25s ease-out both;
  }

  @keyframes glissade {
    from {
      opacity: 0;
      transform: translateX(24px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  h2 {
    margin: 0 0 0.8rem;
    font-size: 1.25em;
    letter-spacing: 0.05em;
  }

  .onglets {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    margin-bottom: 0.9rem;
  }

  .onglet {
    padding: 0.15rem 0.7rem;
    border: 1px solid rgba(244, 236, 216, 0.3);
    border-radius: 5px;
  }

  .onglet.actif {
    background: rgba(224, 76, 106, 0.25);
    border-color: var(--rose);
  }

  .onglet.grise {
    opacity: 0.35;
    text-decoration: line-through;
  }

  .note {
    font-size: 0.75em;
    opacity: 0.5;
    margin-left: 0.3rem;
  }

  .stats {
    margin: 0 0 0.5rem;
    color: var(--cyan);
    font-size: 0.9em;
  }

  .coeur {
    margin: 0 0 0.5rem;
    color: var(--jaune);
    font-size: 0.9em;
  }

  .choix {
    list-style: none;
    margin: 0.8rem 0 0;
    padding: 0.6rem 0 0;
    border-top: 1px solid rgba(244, 236, 216, 0.15);
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .choix button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    padding: 0.4rem 0.7rem 0.4rem 1.6rem;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }

  .choix button::before {
    content: '▸';
    position: absolute;
    left: 0.5rem;
    opacity: 0;
  }

  .choix .actif button {
    background: rgba(224, 76, 106, 0.18);
    color: var(--rose);
  }

  .choix .actif button::before {
    opacity: 1;
  }

  .aideV {
    margin: 0.9rem 0 0;
    font-size: 0.78em;
    opacity: 0.5;
    text-align: center;
  }
</style>
