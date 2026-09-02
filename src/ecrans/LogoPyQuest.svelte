<!-- Le logo : montagne low-poly et lettrage glacé, dans l'esprit de Celeste. -->
<div class="logo">
  <svg viewBox="0 0 220 130" role="img" aria-label="Le mont PyQuest">
    <!-- silhouette (donne le liseré sombre) -->
    <polygon
      class="silhouette"
      points="108,6 130,46 139,38 172,98 186,122 30,122 48,86 55,94 68,72 78,90"
    />
    <!-- faces éclairées (lavande/rose) -->
    <polygon fill="#d9c2f0" points="108,6 96,54 60,122 30,122 48,86 55,94 68,72 78,90" />
    <polygon fill="#c4a8e6" points="96,54 60,122 108,122" />
    <polygon fill="#b493dd" points="108,6 96,54 108,122 128,90 120,58" />
    <!-- versant ombré -->
    <polygon fill="#9d7bcd" points="120,58 128,90 152,122 186,122 172,98 139,38 130,46" />
    <polygon fill="#8d6cc0" points="108,122 128,90 152,122" />
    <!-- glace (cyan) -->
    <polygon fill="#b9f1fa" points="108,6 100,38 114,44" />
    <polygon fill="#7cdff0" points="108,6 114,44 124,35 130,46" />
    <polygon fill="#a5ebf7" points="96,54 90,78 106,86 100,64" />
    <polygon fill="#6fd8ec" points="130,46 139,38 150,60 138,64" />
    <polygon fill="#8fe6f4" points="55,94 62,82 68,90 68,72 62,80" />
    <!-- petites arêtes de neige -->
    <polygon fill="#f2ecff" points="48,86 55,94 51,97 45,91" />
    <polygon fill="#f2ecff" points="68,72 78,90 72,92 64,80" />
  </svg>
  <div class="mot">PYQUEST</div>
</div>
<div class="reflet" aria-hidden="true">
  <div class="mot">PYQUEST</div>
</div>

<style>
  .logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: min(34rem, 80vw);
  }

  svg {
    width: 78%;
    margin-bottom: -1.2rem;
    filter: drop-shadow(0 0 30px rgba(150, 110, 220, 0.35));
  }

  .silhouette {
    fill: #241a3d;
    stroke: #241a3d;
    stroke-width: 9;
    stroke-linejoin: round;
  }

  .mot {
    font-family: 'Arial Black', 'Segoe UI Black', sans-serif;
    font-size: clamp(2.6rem, 9vw, 5rem);
    font-weight: 900;
    letter-spacing: 0.04em;
    background: linear-gradient(
      180deg,
      #eafcff 0%,
      #8fe6f4 34%,
      #45c8e6 55%,
      #9d86d6 78%,
      #8d6cc0 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-stroke: 2px #241a3d;
    text-shadow: 0 3px 0 rgba(36, 26, 61, 0.6);
  }

  .reflet {
    transform: scaleY(-1);
    margin-top: -0.6rem;
    opacity: 0.4;
    mask-image: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.8) 100%);
    -webkit-mask-image: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.8) 100%);
    filter: blur(1px);
  }

  .reflet .mot {
    text-shadow: none;
  }
</style>
