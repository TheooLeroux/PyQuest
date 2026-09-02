<script lang="ts">
  import { enregistrerReglages, etat, retour, t } from '../jeu/etat.svelte';
  import { reglerVolumeMusique } from '../jeu/musique';
  import { jouerSon } from '../jeu/sons';
  import type { CleTexte } from '../jeu/textes';

  const LANGUES = ['fr', 'en'] as const;
  const TAILLES = ['petite', 'normale', 'grande'] as const;

  let index = $state(0);
  let pleinEcran = $state(Boolean(document.fullscreenElement));

  function decaler<T>(valeurs: readonly T[], courante: T, sens: number): T {
    const i = valeurs.indexOf(courante);
    return valeurs[(i + sens + valeurs.length) % valeurs.length];
  }

  function borner(valeur: number): number {
    return Math.max(0, Math.min(100, valeur));
  }

  function basculerPleinEcran() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  interface Ligne {
    cle: CleTexte;
    valeur: () => string;
    changer: (sens: 1 | -1) => void;
  }

  const lignes: Ligne[] = [
    {
      cle: 'options.langue',
      valeur: () => (etat.reglages.langue === 'fr' ? 'Français' : 'English'),
      changer: (sens) => {
        etat.reglages.langue = decaler(LANGUES, etat.reglages.langue, sens);
      },
    },
    {
      cle: 'options.volumeMusique',
      valeur: () => String(etat.reglages.volumeMusique),
      changer: (sens) => {
        etat.reglages.volumeMusique = borner(etat.reglages.volumeMusique + sens * 5);
        reglerVolumeMusique(etat.reglages.volumeMusique);
      },
    },
    {
      cle: 'options.volumeEffets',
      valeur: () => String(etat.reglages.volumeEffets),
      changer: (sens) => {
        etat.reglages.volumeEffets = borner(etat.reglages.volumeEffets + sens * 5);
      },
    },
    {
      cle: 'options.taillePolice',
      valeur: () => t(`options.taille.${etat.reglages.taillePolice}` as CleTexte),
      changer: (sens) => {
        etat.reglages.taillePolice = decaler(TAILLES, etat.reglages.taillePolice, sens);
      },
    },
    {
      cle: 'options.pleinEcran',
      valeur: () => (pleinEcran ? t('options.active') : t('options.desactive')),
      changer: () => basculerPleinEcran(),
    },
  ];

  function modifier(sens: 1 | -1) {
    lignes[index].changer(sens);
    enregistrerReglages();
    // Le blip joue au nouveau volume d'effets : le réglage s'entend en direct.
    jouerSon('menuBas');
  }

  function surTouche(e: KeyboardEvent) {
    if (e.key === 'ArrowUp') {
      jouerSon('menuHaut');
      index = (index + lignes.length - 1) % lignes.length;
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      jouerSon('menuBas');
      index = (index + 1) % lignes.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      modifier(-1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      modifier(1);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      jouerSon('retour');
      retour();
    }
  }
</script>

<svelte:window onkeydown={surTouche} />
<svelte:document onfullscreenchange={() => (pleinEcran = Boolean(document.fullscreenElement))} />

<main class="ecran">
  <h1>{t('options.titre')}</h1>
  <ul class="menu panneau reglages">
    {#each lignes as ligne, i (ligne.cle)}
      <li class={i === index ? 'actif' : ''}>
        <button
          onclick={() => {
            index = i;
            modifier(1);
          }}
        >
          <span class="etiquette">{t(ligne.cle)}</span>
          <span class="valeur">
            <span class="fleche">◂</span>
            {ligne.valeur()}
            <span class="fleche">▸</span>
          </span>
        </button>
      </li>
    {/each}
  </ul>
  <p class="aide">{t('options.aide')}</p>
</main>

<style>
  .reglages button {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 2.5rem;
    width: 100%;
  }

  .valeur {
    color: var(--cyan);
    min-width: 9rem;
    text-align: center;
  }

  .fleche {
    opacity: 0;
    color: var(--rose);
  }

  .actif .fleche {
    opacity: 1;
  }
</style>
