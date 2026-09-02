#!/usr/bin/env python3
"""Extrait les sons d'une banque FMOD (.bank) de la copie locale de Celeste
vers public/sons/brut/<nom-banque>/, au format .ogg.

Usage :
  python3 scripts/extraire_sons.py "<chemin>/Content/FMOD/Desktop/ui.bank"

Prérequis (une fois) :
  sudo apt install -y python3-pip python3-venv libvorbis0a libogg0
  python3 -m venv .venv-sons && .venv-sons/bin/pip install git+https://github.com/HearthSim/python-fsb5

Les fichiers extraits restent locaux (public/sons/ est gitignoré).
"""

import pathlib
import sys

import fsb5


def taille_segment(segment: "fsb5.FSB5") -> int | None:
    entete = segment.header
    try:
        return 60 + entete.sampleHeadersSize + entete.nameTableSize + entete.dataSize
    except AttributeError:
        return None


def extraire(chemin_banque: str) -> None:
    banque = pathlib.Path(chemin_banque)
    donnees = banque.read_bytes()
    sortie = pathlib.Path(__file__).parent.parent / 'assets-bruts' / 'sons' / banque.stem
    sortie.mkdir(parents=True, exist_ok=True)

    total, anonymes = 0, 0
    position = donnees.find(b'FSB5')
    while position != -1:
        try:
            segment = fsb5.FSB5(donnees[position:])
        except Exception:
            position = donnees.find(b'FSB5', position + 4)
            continue
        extension = segment.get_sample_extension()
        for echantillon in segment.samples:
            try:
                contenu = segment.rebuild_sample(echantillon)
            except Exception as probleme:
                print(f'  ignoré ({probleme}) : {echantillon.name}')
                continue
            if echantillon.name:
                nom = echantillon.name
            else:
                nom = f'sans_nom_{anonymes:03d}'
                anonymes += 1
            (sortie / f'{nom}.{extension}').write_bytes(contenu)
            total += 1
        saut = taille_segment(segment)
        suivant = position + saut if saut else position + 4
        position = donnees.find(b'FSB5', suivant)

    print(f'{total} sons extraits vers {sortie}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    extraire(sys.argv[1])
