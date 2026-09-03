<script lang="ts">
  import { fiches } from '../contenu/catalogue';
  import { CHAPITRES, sallesDuChapitre } from '../contenu/chapitres';
  import { camera } from '../jeu/camera.svelte';
  import { aller, retour, t } from '../jeu/etat.svelte';
  import { enregistrerPartie, lancerSalle, partie } from '../jeu/partie.svelte';
  import {
    chapitreDebloque,
    pourcentageAscension,
    prochaineSalle,
    salleValidee,
    statsChapitre,
  } from '../jeu/progression';
  import { jouerSon } from '../jeu/sons';
  import { ANCRES, HAUTEUR_SCENE, LARGEUR_SCENE } from '../scenes/chaine';
  import VignetteChapitre, { type ChoixVignette } from './VignetteChapitre.svelte';

  const slot = $derived(partie.slot!);

  function accessible(num: number): boolean {
    return sallesDuChapitre(fiches, num).length > 0 && chapitreDebloque(slot, fiches, num);
  }

  // Le palier « courant » : celui de la position de reprise (Madeline y campe).
  const chapitreCourant = $derived.by(() => {
    const fiche = fiches.find((f) => f.id === partie.slot?.positionSalle);
    return fiche?.chapitre ?? 0;
  });

  // svelte-ignore state_referenced_locally
  let selection = $state(chapitreCourant);
  let vignetteOuverte = $state(false);
  let indexVignette = $state(0);

  const statsSelection = $derived(statsChapitre(slot, fiches, selection));
  const chapitreSelection = $derived(CHAPITRES.find((c) => c.num === selection)!);

  const coeurSelection = $derived.by(() => {
    const coeur = sallesDuChapitre(fiches, selection).find((s) => s.coeur);
    if (!coeur) return null;
    return salleValidee(slot, coeur.id) ? ('valide' as const) : ('verrouille' as const);
  });

  const choixVignette: ChoixVignette[] = $derived.by(() => {
    const salles = sallesDuChapitre(fiches, selection);
    const validees = salles.filter((s) => salleValidee(slot, s.id));
    const reprise = prochaineSalle(slot, fiches, selection);
    const choix: ChoixVignette[] = [];
    if (reprise && validees.length > 0 && validees.length < salles.length) {
      choix.push({
        libelle: `${t('vignette.reprendre')} — ${reprise.ordre}. ${reprise.titre}`,
        salleId: reprise.id,
      });
    }
    choix.push({ libelle: t('vignette.gravir'), salleId: salles[0].id });
    for (const salle of validees) {
      choix.push({
        libelle: `${t('vignette.rejouer')} ${salle.ordre}. ${salle.titre}`,
        salleId: salle.id,
      });
    }
    return choix;
  });

  function deplacer(sens: 1 | -1) {
    let candidat = selection + sens;
    while (candidat >= 0 && candidat < CHAPITRES.length) {
      if (accessible(candidat)) {
        jouerSon(sens === 1 ? 'carteDroite' : 'carteGauche');
        selection = candidat;
        return;
      }
      candidat += sens;
    }
    jouerSon('invalide');
  }

  function ouvrirVignette() {
    if (!accessible(selection)) {
      jouerSon('invalide');
      return;
    }
    jouerSon('vignetteOuvrir');
    indexVignette = 0;
    vignetteOuverte = true;
  }

  function fermerVignette() {
    jouerSon('vignetteFermer');
    vignetteOuverte = false;
  }

  function grimper(salleId: string) {
    jouerSon('gravir');
    lancerSalle(salleId);
    aller('salle');
  }

  function surTouche(e: KeyboardEvent) {
    if (vignetteOuverte) {
      if (e.key === 'ArrowUp') {
        jouerSon('menuHaut');
        indexVignette = (indexVignette + choixVignette.length - 1) % choixVignette.length;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        jouerSon('menuBas');
        indexVignette = (indexVignette + 1) % choixVignette.length;
        e.preventDefault();
      } else if (e.key === 'Enter') {
        grimper(choixVignette[indexVignette].salleId);
      } else if (e.key === 'Escape') {
        fermerVignette();
      }
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      deplacer(-1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      deplacer(1);
      e.preventDefault();
    } else if (e.key === 'Enter') {
      ouvrirVignette();
    } else if (e.key === 'Escape') {
      enregistrerPartie();
      jouerSon('carteRetour');
      retour();
    }
  }

  function cliquerPalier(num: number) {
    if (!accessible(num)) {
      jouerSon('invalide');
      return;
    }
    if (selection !== num) {
      jouerSon('carteDroite');
      selection = num;
      vignetteOuverte = false;
      return;
    }
    if (!vignetteOuverte) ouvrirVignette();
  }
</script>

<svelte:window onkeydown={surTouche} />

<main class="carte">
  <!-- Les repères vivent DANS la scène : même repère de coordonnées et même
       caméra que la montagne — ils restent collés à son versant. -->
  <div class="calque" style="--zoom: {camera.zoom}">
    <svg viewBox="0 0 {LARGEUR_SCENE} {HAUTEUR_SCENE}" preserveAspectRatio="xMidYMax slice">
      {#each CHAPITRES as chapitre (chapitre.num)}
        {@const ancre = ANCRES[chapitre.num]}
        {@const ouvert = accessible(chapitre.num)}
        {@const stats = statsChapitre(slot, fiches, chapitre.num)}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
        <g
          class="palier"
          class:verrouille={!ouvert}
          class:selectionne={ouvert && selection === chapitre.num}
          class:valide={stats.total > 0 && stats.validees === stats.total}
          transform="translate({ancre.x}, {ancre.y})"
          onclick={() => cliquerPalier(chapitre.num)}
          role="button"
          tabindex="-1"
        >
          <circle class="zone" cy="-20" r="42" />
          <g class="corps">
            <rect class="mat" x="-2" y="-46" width="4" height="46" rx="1.5" />
            <path class="fanion" d="M2,-46 L36,-36 L2,-26 Z" />
            {#if chapitreCourant === chapitre.num && ouvert}
              <g class="madeline">
                <circle cy="-60" r="10" />
                <circle class="coeur-pion" cy="-60" r="3.5" />
              </g>
            {/if}
          </g>
          {#if ouvert && selection === chapitre.num && !vignetteOuverte}
            <text class="etiquette" y="34">{chapitre.num}. {chapitre.nom}</text>
          {/if}
        </g>
      {/each}
    </svg>
  </div>

  <p class="grimpeur">
    🧗 {slot.nom} — {pourcentageAscension(slot, fiches)} % {t('carte.ascension')}
  </p>

  {#if vignetteOuverte}
    <VignetteChapitre
      numero={selection}
      nom={chapitreSelection.nom}
      stats={statsSelection}
      coeur={coeurSelection}
      choix={choixVignette}
      index={indexVignette}
      onchoisir={grimper}
    />
  {/if}

  <p class="aide">{t('carte.aide')}</p>
</main>

<style>
  .carte {
    position: relative;
    z-index: 1;
    height: 100%;
  }

  /* Réplique exacte de la géométrie d'un plan de facteur 1 du fond :
     mêmes débords, même transformation — les repères zooment avec le mont. */
  .calque {
    position: absolute;
    inset: -10% -22% -3% -22%;
    transform: scale(var(--zoom)) translateY(calc((var(--zoom) - 1) * 4%));
    transform-origin: 50% 80%;
    pointer-events: none;
  }

  .calque svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .grimpeur,
  .calque,
  .aide {
    animation: arrivee 0.6s ease-out 0.55s both;
  }

  @keyframes arrivee {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .grimpeur {
    position: absolute;
    top: 1.4rem;
    left: 1.6rem;
    margin: 0;
    color: var(--cyan);
    font-size: 0.9em;
  }

  .palier {
    pointer-events: auto;
    cursor: pointer;
  }

  .zone {
    fill: transparent;
  }

  /* L'échelle de sélection s'applique au corps SEULEMENT : la position du
     repère (attribut translate du groupe parent) reste intacte. */
  .corps {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    transition: transform 0.15s;
  }

  .selectionne .corps {
    transform: scale(1.35);
  }

  .mat {
    fill: #efe8d6;
    stroke: #1c1830;
    stroke-width: 1.2;
  }

  .fanion {
    fill: #efe8d6;
    stroke: #1c1830;
    stroke-width: 2;
    stroke-linejoin: round;
    transition: fill 0.15s;
  }

  .valide .fanion {
    fill: var(--jaune);
  }

  .selectionne .fanion {
    fill: var(--rose);
  }

  /* Les chapitres verrouillés existent, dans la brume — on devine la suite. */
  .verrouille {
    opacity: 0.2;
    filter: blur(1px);
    cursor: default;
    pointer-events: none;
  }

  .madeline circle {
    fill: var(--rose);
    stroke: #f4ecd8;
    stroke-width: 2.5;
    animation: flotte 2.2s ease-in-out infinite alternate;
  }

  .madeline .coeur-pion {
    fill: #f4ecd8;
    stroke: none;
  }

  @keyframes flotte {
    from {
      translate: 0 0;
    }
    to {
      translate: 0 -4px;
    }
  }

  .etiquette {
    font-size: 26px;
    text-anchor: middle;
    fill: #f4ecd8;
    stroke: #14122a;
    stroke-width: 7;
    paint-order: stroke;
    letter-spacing: 0.05em;
  }
</style>
