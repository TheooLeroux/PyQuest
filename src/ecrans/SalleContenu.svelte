<script lang="ts">
  import { marked } from 'marked';
  import { fiches } from '../contenu/catalogue';
  import { CHAPITRES, sallesDuChapitre } from '../contenu/chapitres';
  import type { FicheSalle, JeuDeTest } from '../contenu/types';
  import { obtenirExecuteur } from '../execution/executeur';
  import { jugerErreurAttendue, jugerTest, type ResultatTest } from '../execution/jugement';
  import { aller, t } from '../jeu/etat.svelte';
  import { enregistrerPartie, etatSalle, partie } from '../jeu/partie.svelte';
  import { salleSuivante } from '../jeu/progression';
  import Editeur from './Editeur.svelte';

  const { fiche }: { fiche: FicheSalle } = $props();

  // L'écran est recréé à chaque salle ({#key}) : capturer la fiche initiale est voulu.
  // svelte-ignore state_referenced_locally
  const etat = etatSalle(fiche.id);
  const chapitre = $derived(CHAPITRES.find((c) => c.num === fiche.chapitre)!);
  const sallesChapitre = $derived(sallesDuChapitre(fiches, fiche.chapitre));
  const positionSalle = $derived(sallesChapitre.findIndex((s) => s.id === fiche.id) + 1);
  const suivante = $derived(salleSuivante(fiches, fiche.id));
  const consigneHtml = $derived(marked.parse(fiche.consigne) as string);

  // svelte-ignore state_referenced_locally
  let code = $state(etat.code || fiche.codeDepart);

  let phase: 'preparation' | 'repos' | 'execution' | 'valide' | 'chute' = $state('preparation');
  let echec: { numero: number; test: JeuDeTest | null; resultat: ResultatTest } | null =
    $state(null);
  let sortieValidee = $state('');
  let confirmationSolution = $state(false);
  let debut = performance.now();

  $effect(() => {
    obtenirExecuteur()
      .prechauffer()
      .then(() => {
        if (phase === 'preparation') phase = 'repos';
      });
  });

  function memoriserTemps() {
    etat.tempsSec += Math.round((performance.now() - debut) / 1000);
    debut = performance.now();
  }

  async function lancer() {
    if (phase === 'execution' || phase === 'preparation') return;
    etat.code = code;
    echec = null;
    phase = 'execution';
    const executeur = obtenirExecuteur();

    if (fiche.attendreErreur) {
      const execution = await executeur.executer(code, []);
      const resultat = jugerErreurAttendue(execution);
      if (resultat.reussi) {
        sortieValidee = `${execution.erreur!.type}: ${execution.erreur!.message}`;
        valider();
      } else {
        echec = { numero: 1, test: null, resultat };
        chuter();
      }
      return;
    }

    let premiereSortie = '';
    for (const [i, test] of fiche.tests.entries()) {
      const execution = await executeur.executer(code, test.entrees);
      if (i === 0) premiereSortie = execution.sortie;
      const resultat = jugerTest(test.attendu, execution);
      if (!resultat.reussi) {
        echec = { numero: i + 1, test, resultat };
        chuter();
        return;
      }
    }
    sortieValidee = premiereSortie;
    valider();
  }

  function valider() {
    etat.statut = 'validee';
    memoriserTemps();
    enregistrerPartie();
    phase = 'valide';
  }

  function chuter() {
    etat.chutes += 1;
    enregistrerPartie();
    phase = 'chute';
  }

  function demanderIndice() {
    if (etat.palierIndice >= 3) return;
    if (etat.palierIndice === 2 && !confirmationSolution) {
      confirmationSolution = true;
      return;
    }
    etat.palierIndice = (etat.palierIndice + 1) as 1 | 2 | 3;
    confirmationSolution = false;
    enregistrerPartie();
  }

  function continuer() {
    etat.code = code;
    if (suivante) {
      partie.slot!.positionSalle = suivante.id;
      enregistrerPartie();
      partie.salleId = suivante.id;
    } else {
      enregistrerPartie();
      aller('carte');
    }
  }

  function sortir() {
    etat.code = code;
    memoriserTemps();
    enregistrerPartie();
    aller('carte');
  }

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'Enter' && e.ctrlKey) {
      lancer();
      e.preventDefault();
    } else if (e.key.toLowerCase() === 'h' && e.ctrlKey) {
      demanderIndice();
      e.preventDefault();
    } else if (e.key === 'Escape') {
      sortir();
    } else if (
      e.key === 'Enter' &&
      phase === 'valide' &&
      !(e.target instanceof HTMLElement && e.target.closest('.cm-editor'))
    ) {
      continuer();
    }
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="salle">
  <header class="bandeau">
    ⚑ {chapitre.num}. {chapitre.nom} · {positionSalle}/{sallesChapitre.length}
    <span class="chutes">☠ {etat.chutes}</span>
  </header>

  <aside class="panneau consigne">
    <h2>
      {fiche.titre}
      <span class="etoiles">{'★'.repeat(fiche.difficulte)}{'☆'.repeat(3 - fiche.difficulte)}</span>
    </h2>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- consigne écrite par nous -->
    <div class="texte">{@html consigneHtml}</div>

    {#if etat.palierIndice > 0}
      <div class="indices">
        {#each fiche.indices.slice(0, etat.palierIndice) as indice, i (i)}
          <div class="indice">
            <strong>{t('salle.indice')} {i + 1}</strong>
            <!-- eslint-disable-next-line svelte/no-at-html-tags -- indice écrit par nous -->
            <div>{@html marked.parse(indice)}</div>
          </div>
        {/each}
      </div>
    {/if}
    {#if confirmationSolution}
      <p class="confirmation">{t('salle.confirmerSolution')}</p>
    {/if}
  </aside>

  <section class="atelier">
    <Editeur bind:code onlancer={lancer} />

    <div class="panneau console" class:verte={phase === 'valide'} class:rouge={phase === 'chute'}>
      {#if phase === 'preparation'}
        <p class="discret">{t('salle.preparation')}</p>
      {:else if phase === 'repos'}
        <p class="discret">{t('salle.consoleInvite')}</p>
      {:else if phase === 'execution'}
        <p class="discret">{t('salle.execution')}</p>
      {:else if phase === 'valide'}
        <p class="verdict">✔ {t('salle.validee')}</p>
        {#if fiche.attendreErreur}
          <p>{t('salle.erreurObtenue')}</p>
        {/if}
        <pre>{sortieValidee}</pre>
        <p class="action">{suivante ? t('salle.suivante') : t('salle.finChapitre')}</p>
      {:else if phase === 'chute' && echec}
        <p class="verdict">✘ {t('salle.chute')}</p>
        {#if echec.resultat.interrompu}
          <p>{t('salle.timeout')}</p>
        {:else if fiche.attendreErreur}
          <p>{t('salle.erreurAttendue')}</p>
          <pre>{echec.resultat.obtenu}</pre>
        {:else if echec.resultat.erreur}
          <p>
            {echec.resultat.erreur.type}: {echec.resultat.erreur.message}
            {#if echec.resultat.erreur.ligne !== null}
              ({t('salle.erreurLigne')}
              {echec.resultat.erreur.ligne})
            {/if}
          </p>
        {:else}
          <p class="discret">
            {t('salle.test')}
            {echec.numero}/{fiche.tests.length}
            {#if echec.test && echec.test.entrees.length > 0}
              — {t('salle.entrees')} : {echec.test.entrees.join(' · ')}
            {/if}
          </p>
          <div class="comparaison">
            <div>
              <strong>{t('salle.attendu')}</strong>
              <pre>{echec.resultat.attendu}</pre>
            </div>
            <div>
              <strong>{t('salle.obtenu')}</strong>
              <pre>{echec.resultat.obtenu}</pre>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </section>

  <footer class="aide">{t('salle.aide')}</footer>
</main>

<style>
  .salle {
    height: 100%;
    display: grid;
    grid-template-columns: minmax(18rem, 2fr) 3fr;
    grid-template-rows: auto 1fr;
    gap: 1rem;
    padding: 1rem 1rem 3rem;
  }

  .bandeau {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    gap: 1.5rem;
    opacity: 0.8;
    font-size: 0.9em;
  }

  .chutes {
    color: var(--rose);
  }

  .consigne {
    overflow: auto;
    min-height: 0;
  }

  .consigne h2 {
    margin-top: 0;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .etoiles {
    color: var(--jaune);
    font-size: 0.8em;
  }

  .texte :global(pre),
  .indice :global(pre) {
    background: rgba(0, 0, 0, 0.35);
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    overflow-x: auto;
  }

  .texte :global(code),
  .indice :global(code) {
    color: var(--cyan);
  }

  .indices {
    border-top: 1px solid rgba(244, 236, 216, 0.15);
    margin-top: 1rem;
    padding-top: 0.5rem;
  }

  .indice strong {
    color: var(--jaune);
  }

  .confirmation {
    color: var(--jaune);
  }

  .atelier {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 0;
  }

  .console {
    min-height: 9rem;
    max-height: 45%;
    overflow: auto;
  }

  .console pre {
    margin: 0.4rem 0;
    white-space: pre-wrap;
  }

  .console.verte {
    border-color: rgba(89, 211, 232, 0.5);
  }

  .console.rouge {
    border-color: rgba(224, 76, 106, 0.5);
  }

  .verdict {
    margin-top: 0;
    font-weight: bold;
  }

  .verte .verdict {
    color: var(--cyan);
  }

  .rouge .verdict {
    color: var(--rose);
  }

  .action {
    color: var(--jaune);
  }

  .discret {
    opacity: 0.55;
  }

  .comparaison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .comparaison strong {
    opacity: 0.7;
    font-size: 0.85em;
  }
</style>
