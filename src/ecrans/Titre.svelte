<script lang="ts">
  import { aller, etat, t } from '../jeu/etat.svelte';
  import { jouerMusiqueTitre } from '../jeu/musique';
  import { jouerSon } from '../jeu/sons';
  import LogoPyQuest from './LogoPyQuest.svelte';
  import Neige from './Neige.svelte';

  const VERSION = 'v.0.1.0';

  let phase: 'logo' | 'menu' = $state('logo');
  let index = $state(0);

  const actions = [
    { cle: 'titre.jouer', faire: () => aller('sauvegardes') },
    { cle: 'titre.options', faire: () => aller('options') },
    { cle: 'titre.credits', faire: () => aller('credits') },
    { cle: 'titre.quitter', faire: () => window.close() },
  ] as const;

  $effect(() => {
    // Tentative de musique dès l'arrivée ; si le navigateur exige un geste,
    // la prochaine touche pressée la lancera (silence si fichier absent).
    jouerMusiqueTitre(etat.reglages.volume);
  });

  function surTouche(e: KeyboardEvent) {
    jouerMusiqueTitre(etat.reglages.volume);

    if (phase === 'logo') {
      jouerSon('valider');
      phase = 'menu';
      e.preventDefault();
      return;
    }
    if (e.key === 'ArrowUp') {
      jouerSon('menuHaut');
      index = (index + actions.length - 1) % actions.length;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      jouerSon('menuBas');
      index = (index + 1) % actions.length;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      jouerSon('valider');
      actions[index].faire();
    } else if (e.key === 'Escape') {
      jouerSon('retour');
      phase = 'logo';
    }
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="titre">
  <Neige />

  <div class="scene">
    <LogoPyQuest />

    {#if phase === 'logo'}
      <p class="appuie">{t('titre.appuie')}</p>
    {:else}
      <ul class="menu">
        {#each actions as action, i (action.cle)}
          <li class={i === index ? 'actif' : ''}>
            <button
              onclick={() => {
                index = i;
                action.faire();
              }}>{t(action.cle)}</button
            >
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <span class="version">{VERSION}</span>
  <span class="mentions">
    {t('titre.musique')}<br />
    {t('titre.disclaimer')}
  </span>
</main>

<style>
  .titre {
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(ellipse 90% 70% at 70% 20%, rgba(61, 43, 107, 0.55), transparent 60%),
      linear-gradient(200deg, #16102b 0%, #0a0716 55%, #070510 100%);
  }

  .scene {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 1;
  }

  .appuie {
    margin-top: 2.5rem;
    letter-spacing: 0.15em;
    opacity: 0.75;
    animation: pulsation 2.2s ease-in-out infinite;
  }

  @keyframes pulsation {
    0%,
    100% {
      opacity: 0.75;
    }
    50% {
      opacity: 0.25;
    }
  }

  .menu {
    margin-top: 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    list-style: none;
    padding: 0;
    z-index: 1;
  }

  .menu button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0.5rem 2.4rem;
    cursor: pointer;
    border-radius: 6px;
    letter-spacing: 0.08em;
  }

  .menu .actif button {
    background: rgba(224, 76, 106, 0.18);
    color: var(--rose);
  }

  .menu button {
    position: relative;
  }

  .menu button::before {
    content: '▸';
    position: absolute;
    left: 0.9rem;
    opacity: 0;
  }

  .menu .actif button::before {
    opacity: 1;
  }

  .version {
    position: absolute;
    left: 1.4rem;
    bottom: 1.2rem;
    opacity: 0.45;
    font-size: 0.8em;
    color: #b8a5df;
  }

  .mentions {
    position: absolute;
    right: 1.4rem;
    bottom: 1.2rem;
    opacity: 0.6;
    font-size: 0.85em;
    color: #b8a5df;
    text-align: right;
    line-height: 1.5;
  }
</style>
