<script lang="ts">
  import { genererMontagne } from '../scenes/lowpoly';

  const LARGEUR = 640;
  const HAUTEUR = 420;

  // Le mont PyQuest — graine fixe : la même montagne à chaque lancement.
  const principale = genererMontagne({
    graine: 20180125,
    largeur: 470,
    hauteur: 350,
    lignes: 11,
    ligneNeige: 0.26,
    probaGlace: 0.06,
    palette: {
      ombre: '#1c3450',
      lumiere: '#5a87a6',
      neigeOmbre: '#b7d9e4',
      neigeLumiere: '#eef7fa',
      glace: '#56cfe1',
    },
  });

  // Les crêtes voisines, plus sombres, mangées par la brume.
  const paletteCrete = {
    ombre: '#0f1c30',
    lumiere: '#24405c',
    neigeOmbre: '#5d7891',
    neigeLumiere: '#8fa9bf',
    glace: '#2e5670',
  };
  const creteGauche = genererMontagne({
    graine: 7,
    largeur: 360,
    hauteur: 190,
    lignes: 6,
    ligneNeige: 0.14,
    probaGlace: 0,
    palette: paletteCrete,
  });
  const creteDroite = genererMontagne({
    graine: 13,
    largeur: 410,
    hauteur: 225,
    lignes: 6,
    ligneNeige: 0.14,
    probaGlace: 0,
    palette: paletteCrete,
  });
</script>

<svg viewBox="0 0 {LARGEUR} {HAUTEUR}" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
  <defs>
    <linearGradient id="brume-pied" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0f22" stop-opacity="0" />
      <stop offset="1" stop-color="#0b0f22" stop-opacity="0.9" />
    </linearGradient>
  </defs>

  <g transform="translate(140, {HAUTEUR - 190})" opacity="0.55">
    {#each creteGauche as facette (facette.points)}
      <polygon points={facette.points} fill={facette.couleur} />
    {/each}
  </g>
  <g transform="translate(505, {HAUTEUR - 225})" opacity="0.5">
    {#each creteDroite as facette (facette.points)}
      <polygon points={facette.points} fill={facette.couleur} />
    {/each}
  </g>

  <g transform="translate(320, {HAUTEUR - 350})">
    {#each principale as facette (facette.points)}
      <polygon points={facette.points} fill={facette.couleur} />
    {/each}
  </g>

  <rect x="0" y={HAUTEUR - 80} width={LARGEUR} height="80" fill="url(#brume-pied)" />
</svg>

<style>
  svg {
    position: absolute;
    bottom: -3vh;
    left: 50%;
    translate: -50% 0;
    width: min(120vmin, 90vw);
    filter: drop-shadow(0 0 46px rgba(86, 207, 225, 0.1));
  }
</style>
