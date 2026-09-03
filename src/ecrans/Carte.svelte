<script lang="ts">
  import { fiches } from '../contenu/catalogue';
  import { CHAPITRES, sallesDuChapitre } from '../contenu/chapitres';
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
  import VignetteChapitre, { type ChoixVignette } from './VignetteChapitre.svelte';

  const slot = $derived(partie.slot!);

  // Les paliers des chapitres sur la montagne (% de l'écran), en zigzag
  // de la base au sommet — remplacés par les ancres 3D à l'étape habillage.
  const ANCRES: Record<number, { x: number; y: number }> = {
    0: { x: 30, y: 80 },
    1: { x: 47, y: 73 },
    2: { x: 38, y: 64 },
    3: { x: 55, y: 57 },
    4: { x: 42, y: 48 },
    5: { x: 56, y: 40 },
    6: { x: 46, y: 31 },
    7: { x: 51, y: 19 },
  };

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
  <p class="grimpeur">
    🧗 {slot.nom} — {pourcentageAscension(slot, fiches)} % {t('carte.ascension')}
  </p>

  {#each CHAPITRES as chapitre (chapitre.num)}
    {@const ancre = ANCRES[chapitre.num]}
    {@const ouvert = accessible(chapitre.num)}
    {@const stats = statsChapitre(slot, fiches, chapitre.num)}
    <button
      class="palier"
      class:verrouille={!ouvert}
      class:selectionne={ouvert && selection === chapitre.num}
      style="left: {ancre.x}%; top: {ancre.y}%; animation-delay: {0.5 + chapitre.num * 0.06}s"
      onclick={() => cliquerPalier(chapitre.num)}
      tabindex="-1"
    >
      <span class="drapeau" class:valide={stats.total > 0 && stats.validees === stats.total}>⚑</span
      >
      {#if chapitreCourant === chapitre.num && ouvert}
        <span class="madeline">🧗</span>
      {/if}
      {#if ouvert && selection === chapitre.num && !vignetteOuverte}
        <span class="etiquette">{chapitre.num}. {chapitre.nom}</span>
      {/if}
    </button>
  {/each}

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

  .grimpeur,
  .palier,
  .aide {
    animation: arrivee 0.6s ease-out 0.55s both;
  }

  @keyframes arrivee {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
    position: absolute;
    translate: -50% -50%;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .drapeau {
    font-size: 1.5em;
    color: var(--creme);
    opacity: 0.75;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
    transition: transform 0.15s;
  }

  .drapeau.valide {
    color: var(--jaune);
    opacity: 1;
  }

  .selectionne .drapeau {
    transform: scale(1.35);
    color: var(--rose);
    opacity: 1;
  }

  /* Les chapitres verrouillés existent, dans la brume — on devine la suite. */
  .verrouille {
    cursor: default;
  }

  .verrouille .drapeau {
    opacity: 0.18;
    filter: blur(1px);
  }

  .madeline {
    position: absolute;
    top: -1.3rem;
    font-size: 1.1em;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
  }

  .etiquette {
    position: absolute;
    top: 1.9rem;
    white-space: nowrap;
    background: rgba(26, 26, 46, 0.85);
    border: 1px solid rgba(244, 236, 216, 0.18);
    border-radius: 6px;
    padding: 0.25rem 0.8rem;
    font-size: 0.85em;
  }
</style>
