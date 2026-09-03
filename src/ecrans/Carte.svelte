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
  import Carte3D, { type EtatChapitre } from './Carte3D.svelte';
  import Nuages from './Nuages.svelte';
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

  // L'arrivée : la nappe de nuages couvre la bascule vers la scène 3D,
  // pendant que la caméra fait son approche.
  let arrivee = $state(true);
  $effect(() => {
    const minuterie = setTimeout(() => (arrivee = false), 3400);
    return () => clearTimeout(minuterie);
  });

  const etatsChapitres: Record<number, EtatChapitre> = $derived(
    Object.fromEntries(
      CHAPITRES.map((chapitre) => {
        if (!accessible(chapitre.num)) return [chapitre.num, 'verrouille'];
        const stats = statsChapitre(slot, fiches, chapitre.num);
        return [chapitre.num, stats.validees === stats.total ? 'valide' : 'ouvert'];
      }),
    ),
  );

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
  <Carte3D {selection} courant={chapitreCourant} etats={etatsChapitres} onchoisir={cliquerPalier} />

  <p class="grimpeur">
    🧗 {slot.nom} — {pourcentageAscension(slot, fiches)} % {t('carte.ascension')}
  </p>

  {#if !vignetteOuverte}
    <p class="titre-chapitre">{selection}. {chapitreSelection.nom}</p>
  {/if}

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

  {#if arrivee}
    <Nuages mode="arrivee" />
  {/if}

  <p class="aide">{t('carte.aide')}</p>
</main>

<style>
  .carte {
    position: relative;
    z-index: 1;
    height: 100%;
    overflow: hidden;
  }

  .grimpeur {
    position: absolute;
    top: 1.4rem;
    left: 1.6rem;
    margin: 0;
    color: var(--cyan);
    font-size: 0.9em;
  }

  /* La carte-titre flottante du chapitre sélectionné (ECRAN_CARTE.md). */
  .titre-chapitre {
    position: absolute;
    top: 2.6rem;
    left: 50%;
    translate: -50% 0;
    margin: 0;
    padding: 0.5rem 1.6rem;
    background: rgba(20, 18, 42, 0.78);
    border: 1px solid rgba(244, 236, 216, 0.18);
    border-radius: 8px;
    letter-spacing: 0.08em;
    font-size: 1.1em;
    animation: descente 0.35s ease-out both;
  }

  @keyframes descente {
    from {
      opacity: 0;
      translate: -50% -10px;
    }
    to {
      opacity: 1;
      translate: -50% 0;
    }
  }

  .aide {
    position: absolute;
    bottom: 1.1rem;
    left: 0;
    right: 0;
    text-align: center;
    margin: 0;
  }
</style>
