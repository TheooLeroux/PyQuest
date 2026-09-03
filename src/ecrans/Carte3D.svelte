<script lang="ts">
  import { untrack } from 'svelte';
  import * as THREE from 'three';
  import { creerAlea } from '../scenes/lowpoly';
  import {
    calculerAncres,
    creerSapin,
    genererMontagne3D,
    HAUTEUR_MONT,
    rayonProfil,
  } from '../scenes/montagne3d';

  export type EtatChapitre = 'verrouille' | 'ouvert' | 'valide';

  const {
    selection,
    courant,
    etats,
    onchoisir,
  }: {
    selection: number;
    courant: number;
    etats: Record<number, EtatChapitre>;
    onchoisir?: (num: number) => void;
  } = $props();

  const COULEURS: Record<EtatChapitre, number> = {
    ouvert: 0xefe8d6,
    valide: 0xf7d774,
    verrouille: 0x3e5165,
  };
  const COULEUR_SELECTION = 0xe04c6a;

  let conteneur: HTMLDivElement;

  // Ponts entre l'effet de mise en place (une fois) et l'effet réactif.
  let cibleSelection = 0;
  let recolorer: (() => void) | null = null;

  $effect(() => {
    cibleSelection = selection;
    void etats;
    recolorer?.();
  });

  $effect(() => {
    const largeur = () => conteneur.clientWidth;
    const hauteur = () => conteneur.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0c1122, 0.011);

    const camera = new THREE.PerspectiveCamera(50, largeur() / hauteur(), 0.1, 400);
    let rendu: THREE.WebGLRenderer;
    try {
      rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // Pas de WebGL : la carte reste pleinement utilisable (UI + clavier),
      // simplement sans le décor 3D.
      console.warn('WebGL indisponible — carte affichée sans décor 3D.');
      return;
    }
    rendu.setPixelRatio(Math.min(2, window.devicePixelRatio));
    rendu.setSize(largeur(), hauteur());
    conteneur.appendChild(rendu.domElement);

    // Lumières : nuit froide, lune haut-gauche.
    scene.add(new THREE.HemisphereLight(0x5d7ab0, 0x151d30, 0.75));
    const lune = new THREE.DirectionalLight(0xdce8ff, 1.15);
    lune.position.set(-35, 60, 25);
    scene.add(lune);

    const matiereMont = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 1,
    });

    // Le mont PyQuest et ses compagnons.
    scene.add(new THREE.Mesh(genererMontagne3D(20180125), matiereMont));
    const compagnons: [number, number, number, number, number][] = [
      // [graine, échelle, x, z, ligneNeige]
      [7, 0.55, -46, -26, 0.5],
      [13, 0.42, 34, -40, 0.55],
      [29, 0.5, -28, 38, 0.5],
      [41, 0.35, 46, 24, 0.55],
    ];
    for (const [graine, echelle, x, z, neige] of compagnons) {
      const mont = new THREE.Mesh(genererMontagne3D(graine, neige, 0.02), matiereMont);
      mont.scale.setScalar(echelle);
      mont.position.set(x, 0, z);
      scene.add(mont);
    }

    // Le sol, mangé par la brume.
    const sol = new THREE.Mesh(
      new THREE.CircleGeometry(220, 40),
      new THREE.MeshStandardMaterial({ color: 0x101a2e, roughness: 1 }),
    );
    sol.rotation.x = -Math.PI / 2;
    sol.position.y = -2.4;
    scene.add(sol);

    // Sapins : sur les pentes basses du mont et autour de sa base.
    const aleaDecor = creerAlea(424242);
    for (let i = 0; i < 34; i += 1) {
      const sapin = creerSapin(aleaDecor);
      const t = 0.03 + aleaDecor() * 0.15;
      const angle = aleaDecor() * Math.PI * 2;
      const rayon = rayonProfil(t) * (1.0 + aleaDecor() * 0.06);
      sapin.position.set(Math.cos(angle) * rayon, t * HAUTEUR_MONT - 0.15, Math.sin(angle) * rayon);
      scene.add(sapin);
    }
    for (let i = 0; i < 12; i += 1) {
      const sapin = creerSapin(aleaDecor);
      const angle = aleaDecor() * Math.PI * 2;
      const rayon = RAYON_SOL_SAPINS + aleaDecor() * 14;
      sapin.position.set(Math.cos(angle) * rayon, -2.2, Math.sin(angle) * rayon);
      scene.add(sapin);
    }

    // Étoiles (dôme lointain) et neige qui tombe.
    const etoiles = creerPoints(
      500,
      () => {
        const u = aleaDecor() * Math.PI * 2;
        const v = aleaDecor() * 0.9 + 0.08;
        const r = 180 + aleaDecor() * 80;
        return [Math.cos(u) * Math.cos(v) * r, Math.sin(v) * r, Math.sin(u) * Math.cos(v) * r];
      },
      1.6,
      0.9,
    );
    etoiles.material.fog = false;
    scene.add(etoiles);

    const RAYON_NEIGE = 55;
    const neige = creerPoints(
      650,
      () => [
        (aleaDecor() * 2 - 1) * RAYON_NEIGE,
        aleaDecor() * 50 - 4,
        (aleaDecor() * 2 - 1) * RAYON_NEIGE,
      ],
      0.45,
      0.8,
    );
    scene.add(neige);
    const vitessesNeige = Array.from({ length: 650 }, () => 1.6 + aleaDecor() * 2.6);

    // Nuages : sprites flous qui dérivent au loin.
    const textureNuage = creerTextureNuage();
    const nuages: THREE.Sprite[] = [];
    for (let i = 0; i < 7; i += 1) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: textureNuage, transparent: true, opacity: 0.4 }),
      );
      const angle = aleaDecor() * Math.PI * 2;
      const rayon = 55 + aleaDecor() * 45;
      sprite.position.set(Math.cos(angle) * rayon, 5 + aleaDecor() * 20, Math.sin(angle) * rayon);
      sprite.scale.set(38 + aleaDecor() * 26, 13 + aleaDecor() * 8, 1);
      scene.add(sprite);
      nuages.push(sprite);
    }

    // Drapeaux aux ancres + zones cliquables.
    const ancres = calculerAncres();
    const fanions: THREE.Mesh[] = [];
    const zones: THREE.Mesh[] = [];
    for (const [num, ancre] of ancres.entries()) {
      const groupe = new THREE.Group();
      groupe.position.copy(ancre.position);

      const mat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 2.4, 6),
        new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 1 }),
      );
      mat.position.y = 1.2;
      groupe.add(mat);

      const geoFanion = new THREE.BufferGeometry();
      geoFanion.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([0, 2.4, 0, 1.35, 2.05, 0, 0, 1.7, 0], 3),
      );
      geoFanion.computeVertexNormals();
      const fanion = new THREE.Mesh(
        geoFanion,
        new THREE.MeshStandardMaterial({
          color: COULEURS.ouvert,
          roughness: 1,
          side: THREE.DoubleSide,
        }),
      );
      fanion.userData.num = num;
      groupe.add(fanion);
      fanions.push(fanion);

      const zone = new THREE.Mesh(
        new THREE.SphereGeometry(2.2),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      zone.position.y = 1.4;
      zone.userData.num = num;
      groupe.add(zone);
      zones.push(zone);

      // Le fanion regarde vers l'extérieur du mont.
      groupe.rotation.y = -ancre.angle + Math.PI;
      scene.add(groupe);
    }

    // Le pin de Madeline au palier courant (billboard doré, cœur rose).
    const pin = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: creerTexturePin(), transparent: true }),
    );
    pin.scale.set(2.6, 3.2, 1);
    scene.add(pin);

    recolorer = () => {
      for (const fanion of fanions) {
        const num = fanion.userData.num as number;
        const materiau = fanion.material as THREE.MeshStandardMaterial;
        materiau.color.set(
          num === cibleSelection ? COULEUR_SELECTION : COULEURS[etats[num] ?? 'verrouille'],
        );
        fanion.visible = etats[num] !== 'verrouille' || num <= cibleSelection + 2;
        (fanion.parent as THREE.Group).visible = true;
      }
      const ancre = ancres[untrack(() => courant)] ?? ancres[0];
      pin.position.set(ancre.position.x, ancre.position.y + 3.4, ancre.position.z);
    };
    recolorer();

    // ——— La caméra sur rails ———
    // Pose de rails d'un chapitre : en orbite face à son ancre.
    const poseRails = (ancre: (typeof ancres)[number]) => ({
      angle: ancre.angle + 0.55,
      y: ancre.t * HAUTEUR_MONT + 6.5,
      dist: rayonProfil(ancre.t) + 16,
      viseY: ancre.t * HAUTEUR_MONT + 1.2,
    });

    // L'arrivée : la caméra démarre haut au-dessus du massif, derrière les
    // nuages, puis plonge en glissant vers le palier courant (~3 s).
    const DUREE_ARRIVEE_MS = 3000;
    const debutArrivee = performance.now();
    const initiale = ancres[untrack(() => cibleSelection)] ?? ancres[0];
    const cibleInitiale = poseRails(initiale);
    const poseDepart = {
      angle: cibleInitiale.angle - 1.6,
      y: HAUTEUR_MONT + 26,
      dist: cibleInitiale.dist + 55,
      viseY: HAUTEUR_MONT * 0.6,
    };
    const vol = { ...poseDepart };

    // Des nuages posés sur le couloir d'approche : on les traverse en piquant.
    const camDepart = new THREE.Vector3(
      Math.cos(poseDepart.angle) * poseDepart.dist,
      poseDepart.y,
      Math.sin(poseDepart.angle) * poseDepart.dist,
    );
    const sommetVise = new THREE.Vector3(0, HAUTEUR_MONT * 0.8, 0);
    for (let i = 0; i < 5; i += 1) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: textureNuage, transparent: true, opacity: 0.55 }),
      );
      const fraction = 0.16 + aleaDecor() * 0.38;
      sprite.position.lerpVectors(camDepart, sommetVise, fraction);
      sprite.position.x += (aleaDecor() * 2 - 1) * 9;
      sprite.position.y += (aleaDecor() * 2 - 1) * 4;
      sprite.position.z += (aleaDecor() * 2 - 1) * 9;
      sprite.scale.set(30 + aleaDecor() * 18, 11 + aleaDecor() * 7, 1);
      scene.add(sprite);
      nuages.push(sprite);
    }

    const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

    const raycaster = new THREE.Raycaster();
    const pointeur = new THREE.Vector2();
    const surClic = (evenement: PointerEvent) => {
      pointeur.set(
        (evenement.offsetX / largeur()) * 2 - 1,
        -(evenement.offsetY / hauteur()) * 2 + 1,
      );
      raycaster.setFromCamera(pointeur, camera);
      const touche = raycaster.intersectObjects(zones)[0];
      if (touche) onchoisir?.(touche.object.userData.num as number);
    };
    rendu.domElement.addEventListener('pointerdown', surClic);

    const surRedimension = () => {
      camera.aspect = largeur() / hauteur();
      camera.updateProjectionMatrix();
      rendu.setSize(largeur(), hauteur());
    };
    window.addEventListener('resize', surRedimension);

    let anime = 0;
    let precedent = performance.now();
    const boucle = (instant: number) => {
      const dt = Math.min(0.05, (instant - precedent) / 1000);
      precedent = instant;
      const temps = instant / 1000;

      // Cible de la caméra pour le chapitre sélectionné.
      const ancre = ancres[cibleSelection] ?? ancres[0];
      const rails = poseRails(ancre);
      // Chemin le plus court autour du mont.
      while (rails.angle - vol.angle > Math.PI) rails.angle -= Math.PI * 2;
      while (vol.angle - rails.angle > Math.PI) rails.angle += Math.PI * 2;

      const depuisArrivee = instant - debutArrivee;
      let regard = 1; // 0 = le sommet, 1 = le palier visé
      if (depuisArrivee < DUREE_ARRIVEE_MS) {
        // Le piqué d'arrivée : trajectoire maîtrisée, du ciel vers le palier.
        const p = easeInOutCubic(depuisArrivee / DUREE_ARRIVEE_MS);
        vol.angle = poseDepart.angle + (rails.angle - poseDepart.angle) * p;
        vol.y = poseDepart.y + (rails.y - poseDepart.y) * p;
        vol.dist = poseDepart.dist + (rails.dist - poseDepart.dist) * p;
        vol.viseY = poseDepart.viseY + (rails.viseY - poseDepart.viseY) * p;
        regard = p;
      } else {
        // Les rails : glisse amortie + dérive lente en idle.
        const cible = {
          angle: rails.angle + Math.sin(temps * 0.22) * 0.025,
          y: rails.y + Math.sin(temps * 0.3) * 0.25,
          dist: rails.dist,
          viseY: rails.viseY,
        };
        const lissage = 1 - Math.exp(-dt * 2.6);
        vol.angle += (cible.angle - vol.angle) * lissage;
        vol.y += (cible.y - vol.y) * lissage;
        vol.dist += (cible.dist - vol.dist) * lissage;
        vol.viseY += (cible.viseY - vol.viseY) * lissage;
      }

      camera.position.set(Math.cos(vol.angle) * vol.dist, vol.y, Math.sin(vol.angle) * vol.dist);
      camera.lookAt(
        Math.cos(ancre.angle) * rayonProfil(ancre.t) * 0.5 * regard,
        vol.viseY,
        Math.sin(ancre.angle) * rayonProfil(ancre.t) * 0.5 * regard,
      );

      // Neige qui tombe, pin qui flotte, nuages qui dérivent.
      const positionsNeige = neige.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < positionsNeige.count; i += 1) {
        let y = positionsNeige.getY(i) - vitessesNeige[i] * dt;
        if (y < -4) y = 46;
        positionsNeige.setY(i, y);
      }
      positionsNeige.needsUpdate = true;
      pin.position.y += Math.sin(temps * 2.1) * 0.004;
      for (const [i, nuage] of nuages.entries()) {
        nuage.position.x += Math.sin(temps * 0.05 + i) * 0.004;
      }

      rendu.render(scene, camera);
      anime = requestAnimationFrame(boucle);
    };
    anime = requestAnimationFrame(boucle);

    return () => {
      cancelAnimationFrame(anime);
      window.removeEventListener('resize', surRedimension);
      rendu.domElement.removeEventListener('pointerdown', surClic);
      scene.traverse((objet) => {
        if (objet instanceof THREE.Mesh || objet instanceof THREE.Points) {
          objet.geometry.dispose();
          const materiaux = Array.isArray(objet.material) ? objet.material : [objet.material];
          for (const materiau of materiaux) materiau.dispose();
        }
      });
      textureNuage.dispose();
      rendu.dispose();
      rendu.domElement.remove();
      recolorer = null;
    };
  });

  const RAYON_SOL_SAPINS = 30;

  function creerPoints(
    nombre: number,
    position: () => [number, number, number],
    taille: number,
    opacite: number,
  ): THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> {
    const donnees = new Float32Array(nombre * 3);
    for (let i = 0; i < nombre; i += 1) donnees.set(position(), i * 3);
    const geometrie = new THREE.BufferGeometry();
    geometrie.setAttribute('position', new THREE.BufferAttribute(donnees, 3));
    return new THREE.Points(
      geometrie,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: taille,
        transparent: true,
        opacity: opacite,
        depthWrite: false,
      }),
    );
  }

  function creerTextureNuage(): THREE.CanvasTexture {
    const toile = document.createElement('canvas');
    toile.width = toile.height = 128;
    const contexte = toile.getContext('2d')!;
    const degrade = contexte.createRadialGradient(64, 64, 8, 64, 64, 62);
    degrade.addColorStop(0, 'rgba(200, 214, 236, 0.9)');
    degrade.addColorStop(0.6, 'rgba(160, 180, 210, 0.35)');
    degrade.addColorStop(1, 'rgba(160, 180, 210, 0)');
    contexte.fillStyle = degrade;
    contexte.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(toile);
  }

  function creerTexturePin(): THREE.CanvasTexture {
    const toile = document.createElement('canvas');
    toile.width = 104;
    toile.height = 128;
    const c = toile.getContext('2d')!;
    // La goutte du pin (or), le disque intérieur (crème), le cœur (rose).
    c.fillStyle = '#f7d774';
    c.strokeStyle = '#8a6a1f';
    c.lineWidth = 5;
    c.beginPath();
    c.arc(52, 46, 38, Math.PI * 0.82, Math.PI * 0.18);
    c.lineTo(52, 118);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = '#f4ecd8';
    c.beginPath();
    c.arc(52, 46, 26, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#e04c6a';
    c.beginPath();
    c.arc(52, 46, 12, 0, Math.PI * 2);
    c.fill();
    return new THREE.CanvasTexture(toile);
  }
</script>

<div class="scene3d" bind:this={conteneur}></div>

<style>
  .scene3d {
    position: absolute;
    inset: 0;
  }

  .scene3d :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
