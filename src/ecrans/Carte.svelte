<script lang="ts">
  import { fiches } from '../contenu/catalogue';
  import { CHAPITRES, sallesDuChapitre } from '../contenu/chapitres';
  import { aller, retour, t } from '../jeu/etat.svelte';
  import { enregistrerPartie, entrerDansChapitre, partie } from '../jeu/partie.svelte';
  import { chapitreDebloque, pourcentageAscension, statsChapitre } from '../jeu/progression';
  import { jouerSon } from '../jeu/sons';

  const slot = $derived(partie.slot!);
  let index = $state(0);

  const lignes = $derived(
    CHAPITRES.map((chapitre) => {
      const salles = sallesDuChapitre(fiches, chapitre.num);
      return {
        chapitre,
        aVenir: salles.length === 0,
        debloque: salles.length > 0 && chapitreDebloque(slot, fiches, chapitre.num),
        stats: statsChapitre(slot, fiches, chapitre.num),
      };
    }),
  );

  function gravir() {
    const ligne = lignes[index];
    if (!ligne.debloque) {
      jouerSon('invalide');
      return;
    }
    jouerSon('carteChoisir');
    entrerDansChapitre(ligne.chapitre.num);
    if (partie.salleId) aller('salle');
  }

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      jouerSon('carteGauche');
      index = (index + lignes.length - 1) % lignes.length;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      jouerSon('carteDroite');
      index = (index + 1) % lignes.length;
      e.preventDefault();
    } else if (e.key === 'Enter') {
      gravir();
    } else if (e.key === 'Escape') {
      jouerSon('carteRetour');
      enregistrerPartie();
      retour();
    }
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="ecran">
  <h1>{t('carte.titre')}</h1>
  <p class="grimpeur">
    🧗 {slot.nom} — {pourcentageAscension(slot, fiches)} % {t('carte.ascension')}
  </p>

  <ul class="menu panneau chapitres">
    {#each lignes as ligne, i (ligne.chapitre.num)}
      <li class={i === index ? 'actif' : ''}>
        <button
          class:verrouille={!ligne.debloque}
          onclick={() => {
            index = i;
            gravir();
          }}
        >
          <span class="numero">{ligne.chapitre.num}.</span>
          <span class="nom">{ligne.chapitre.nom}</span>
          <span class="detail">
            {#if ligne.aVenir}
              {t('carte.aVenir')}
            {:else if !ligne.debloque}
              🔒 {t('carte.verrouille')}
            {:else}
              ⚑ {ligne.stats.validees}/{ligne.stats.total}
              {t('carte.salles')}
              {#if ligne.stats.chutes > 0}
                · ☠ {ligne.stats.chutes}
              {/if}
            {/if}
          </span>
        </button>
      </li>
    {/each}
  </ul>

  <p class="aide">{t('carte.aide')}</p>
</main>

<style>
  /* Le contenu attend la fin du voyage (zoom du fond) avant d'apparaître. */
  h1,
  .grimpeur,
  .chapitres,
  .aide {
    animation: arrivee 0.7s ease-out 0.55s both;
  }

  @keyframes arrivee {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .grimpeur {
    margin: 0;
    color: var(--cyan);
  }

  .chapitres button {
    display: flex;
    gap: 0.8rem;
    align-items: baseline;
    width: 100%;
    text-align: left;
  }

  .numero {
    opacity: 0.6;
    min-width: 1.6rem;
  }

  .nom {
    flex: 1;
  }

  .detail {
    font-size: 0.85em;
    opacity: 0.8;
  }

  .verrouille {
    opacity: 0.45;
  }
</style>
