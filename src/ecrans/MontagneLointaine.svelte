<script lang="ts">
  import { genererMontagne, type Facette, type PaletteMontagne } from '../scenes/lowpoly';

  const LARGEUR = 1600;
  const HAUTEUR = 420;

  const PALETTE_LOINTAINE: PaletteMontagne = {
    ombre: '#0b1526',
    lumiere: '#182c44',
    neigeOmbre: '#33475e',
    neigeLumiere: '#4c637c',
    glace: '#1d3a52',
  };
  const PALETTE_MOYENNE: PaletteMontagne = {
    ombre: '#0f1c30',
    lumiere: '#24405c',
    neigeOmbre: '#5d7891',
    neigeLumiere: '#8fa9bf',
    glace: '#2e5670',
  };
  const PALETTE_COMPAGNE: PaletteMontagne = {
    ombre: '#16293f',
    lumiere: '#40607a',
    neigeOmbre: '#8fb0c2',
    neigeLumiere: '#c5dde8',
    glace: '#3f92ab',
  };
  const PALETTE_PRINCIPALE: PaletteMontagne = {
    ombre: '#1c3450',
    lumiere: '#5a87a6',
    neigeOmbre: '#b7d9e4',
    neigeLumiere: '#eef7fa',
    glace: '#56cfe1',
  };

  interface Sommet {
    x: number;
    facettes: Facette[];
    hauteur: number;
  }

  function chaine(
    entrees: { graine: number; x: number; largeur: number; hauteur: number }[],
    palette: PaletteMontagne,
    ligneNeige: number,
    probaGlace = 0,
    lignes = 6,
  ): Sommet[] {
    return entrees.map((entree) => ({
      x: entree.x,
      hauteur: entree.hauteur,
      facettes: genererMontagne({ ...entree, lignes, ligneNeige, probaGlace, palette }),
    }));
  }

  // Plan lointain : des crêtes basses sur toute la largeur.
  const lointaines = chaine(
    [
      { graine: 3, x: 110, largeur: 420, hauteur: 150 },
      { graine: 9, x: 420, largeur: 380, hauteur: 175 },
      { graine: 17, x: 760, largeur: 460, hauteur: 140 },
      { graine: 23, x: 1120, largeur: 400, hauteur: 185 },
      { graine: 31, x: 1440, largeur: 440, hauteur: 155 },
    ],
    PALETTE_LOINTAINE,
    0.1,
    0,
    5,
  );

  // Plan moyen.
  const moyennes = chaine(
    [
      { graine: 7, x: 230, largeur: 480, hauteur: 235 },
      { graine: 13, x: 620, largeur: 430, hauteur: 205 },
      { graine: 19, x: 1035, largeur: 500, hauteur: 250 },
      { graine: 29, x: 1420, largeur: 460, hauteur: 215 },
    ],
    PALETTE_MOYENNE,
    0.14,
  );

  // Premier plan : les compagnons et les pics qui mordent les bords…
  const compagnes = chaine(
    [
      { graine: 41, x: -30, largeur: 420, hauteur: 225 },
      { graine: 43, x: 335, largeur: 440, hauteur: 260 },
      { graine: 47, x: 1250, largeur: 470, hauteur: 285 },
      { graine: 53, x: 1630, largeur: 430, hauteur: 235 },
    ],
    PALETTE_COMPAGNE,
    0.2,
    0.03,
    8,
  );

  // …et le mont PyQuest, le plus haut, au centre.
  const principale = genererMontagne({
    graine: 20180125,
    largeur: 500,
    hauteur: 355,
    lignes: 11,
    ligneNeige: 0.26,
    probaGlace: 0.06,
    palette: PALETTE_PRINCIPALE,
  });
</script>

<svg viewBox="0 0 {LARGEUR} {HAUTEUR}" aria-hidden="true" preserveAspectRatio="xMidYMax slice">
  <defs>
    <linearGradient id="brume-pied" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0f22" stop-opacity="0" />
      <stop offset="1" stop-color="#0b0f22" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="voile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0f22" stop-opacity="0" />
      <stop offset="1" stop-color="#0e1730" stop-opacity="0.55" />
    </linearGradient>
  </defs>

  <!-- plan lointain, noyé d'atmosphère -->
  <g opacity="0.6">
    {#each lointaines as sommet (sommet.x)}
      <g transform="translate({sommet.x}, {HAUTEUR - sommet.hauteur})">
        {#each sommet.facettes as facette (facette.points)}
          <polygon points={facette.points} fill={facette.couleur} />
        {/each}
      </g>
    {/each}
  </g>
  <rect x="0" y={HAUTEUR - 200} width={LARGEUR} height="200" fill="url(#voile)" />

  <!-- plan moyen -->
  <g opacity="0.85">
    {#each moyennes as sommet (sommet.x)}
      <g transform="translate({sommet.x}, {HAUTEUR - sommet.hauteur})">
        {#each sommet.facettes as facette (facette.points)}
          <polygon points={facette.points} fill={facette.couleur} />
        {/each}
      </g>
    {/each}
  </g>
  <rect x="0" y={HAUTEUR - 150} width={LARGEUR} height="150" fill="url(#voile)" />

  <!-- premier plan -->
  {#each compagnes as sommet (sommet.x)}
    <g transform="translate({sommet.x}, {HAUTEUR - sommet.hauteur})">
      {#each sommet.facettes as facette (facette.points)}
        <polygon points={facette.points} fill={facette.couleur} />
      {/each}
    </g>
  {/each}

  <g transform="translate(800, {HAUTEUR - 355})">
    {#each principale as facette (facette.points)}
      <polygon points={facette.points} fill={facette.couleur} />
    {/each}
  </g>

  <rect x="0" y={HAUTEUR - 80} width={LARGEUR} height="80" fill="url(#brume-pied)" />
</svg>

<style>
  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 46px rgba(86, 207, 225, 0.08));
  }
</style>
