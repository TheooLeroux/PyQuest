<script lang="ts">
  import { aller, t } from '../jeu/etat.svelte';

  const actions = [
    { cle: 'titre.jouer', faire: () => aller('sauvegardes') },
    { cle: 'titre.options', faire: () => aller('options') },
    { cle: 'titre.credits', faire: () => aller('credits') },
    { cle: 'titre.quitter', faire: () => window.close() },
  ] as const;

  let index = $state(0);

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      index = (index + actions.length - 1) % actions.length;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      index = (index + 1) % actions.length;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      actions[index].faire();
    }
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>PyQuest</h1>
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
</main>
