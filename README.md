# Drone 3D - Manipulation par gestes

Une application web interactive qui permet de piloter un modèle 3D de drone avec les mouvements de la main, en temps réel via la webcam.

## Aperçu

Le drone réagit à la position et à l'orientation de la main détectée par la caméra :

- **Position X/Y** : le drone suit les déplacements latéraux et verticaux de la paume
- **Position Z** : la taille apparente de la main contrôle la profondeur (main proche = drone qui recule)
- **Rotation (Yaw)** : l'inclinaison de la main fait pivoter le drone sur l'axe vertical
- **Hélices** : tournent en continu dès qu'une main est détectée
- **Retour au centre** : quand aucune main n'est visible, le drone revient doucement à sa position initiale

## Technologies utilisées

| Librairie | Rôle |
|---|---|
| [Three.js](https://threejs.org/) v0.162 | Rendu 3D (scène, caméra, lumières, chargement GLTF) |
| [MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) | Détection et suivi des points de repère de la main |
| OrbitControls (Three.js addon) | Navigation manuelle dans la scène à la souris |

Toutes les dépendances sont chargées via CDN — aucune installation requise.

## Structure du projet

```
Drone_manipulation/
├── index.html          # Point d'entrée (importmap CDN)
├── main.js             # Logique principale (Three.js + MediaPipe)
├── background.jpeg     # Image de fond de la scène 3D
└── models/
    ├── helicoptere.gltf    # Modèle 3D (descripteur)
    ├── helicoptere.bin     # Données géométriques du modèle
    ├── helicoptere.glb     # Version binaire autonome du modèle
    └── text/               # Textures PBR du modèle
        ├── DefaultMaterial_Alpha.1001000.png
        ├── DefaultMaterial_Emission.1001000.jpg
        ├── DefaultMaterial_Metallic.1001000.png
        └── DefaultMaterial_Normal.1001000.jpg
```

## Lancement

Ce projet ne nécessite aucun serveur Node.js ni installation de paquets. Il faut cependant le servir via un **serveur HTTP local** (les navigateurs bloquent le chargement de fichiers locaux via `file://` pour des raisons de sécurité).

**Option 1 — Extension VS Code :**
Installer [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), faire un clic droit sur `index.html` → *Open with Live Server*.

**Option 2 — Python :**
```bash
python -m http.server 8000
```
Puis ouvrir `http://localhost:8000` dans le navigateur.

**Option 3 — Node.js :**
```bash
npx serve .
```

> **Permissions requises :** le navigateur demandera l'accès à la webcam au premier lancement. Accepter pour activer la détection de main.

## Licence

[MIT](LICENSE) — Kelly CLOVIS, 2026
