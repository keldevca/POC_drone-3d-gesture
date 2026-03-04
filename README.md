# Drone 3D - Manipulation par gestes / Hand Gesture Control

---

## 🇫🇷 Français

Une application web interactive qui permet de piloter un modèle 3D de drone avec les mouvements de la main, en temps réel via la webcam.

### Aperçu

Le drone réagit à la position et à l'orientation de la main détectée par la caméra :

- **Position X/Y** : le drone suit les déplacements latéraux et verticaux de la paume
- **Position Z** : la taille apparente de la main contrôle la profondeur (main proche = drone qui recule)
- **Rotation (Yaw)** : l'inclinaison de la main fait pivoter le drone sur l'axe vertical
- **Hélices** : tournent en continu dès qu'une main est détectée
- **Retour au centre** : quand aucune main n'est visible, le drone revient doucement à sa position initiale

### Technologies utilisées

| Librairie | Rôle |
|---|---|
| [Three.js](https://threejs.org/) v0.162 | Rendu 3D (scène, caméra, lumières, chargement GLTF) |
| [MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) | Détection et suivi des points de repère de la main |
| OrbitControls (Three.js addon) | Navigation manuelle dans la scène à la souris |

Toutes les dépendances sont chargées via CDN — aucune installation requise.

### Lancement

Ce projet doit être servi via un **serveur HTTP local** (les navigateurs bloquent le chargement via `file://`).

**Option 1 — Extension VS Code :**
Installer [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), faire un clic droit sur `index.html` → *Open with Live Server*.

**Option 2 — Python :**
```bash
python -m http.server 8000
```
Puis ouvrir `http://localhost:8000`.

**Option 3 — Node.js :**
```bash
npx serve .
```

> **Permissions requises :** le navigateur demandera l'accès à la webcam au premier lancement.

---

## 🇬🇧 English

An interactive web application that lets you pilot a 3D drone model using hand gestures, in real time through your webcam.

### Overview

The drone reacts to the position and orientation of the hand detected by the camera:

- **X/Y Position** : the drone follows the lateral and vertical movements of the palm
- **Z Position** : the apparent size of the hand controls depth (closer hand = drone moves back)
- **Rotation (Yaw)** : the tilt of the hand rotates the drone on the vertical axis
- **Propellers** : spin continuously as soon as a hand is detected
- **Return to center** : when no hand is visible, the drone smoothly returns to its initial position

### Technologies

| Library | Role |
|---|---|
| [Three.js](https://threejs.org/) v0.162 | 3D rendering (scene, camera, lights, GLTF loading) |
| [MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) | Hand detection and landmark tracking |
| OrbitControls (Three.js addon) | Manual scene navigation with the mouse |

All dependencies are loaded via CDN — no installation required.

### Getting started

This project must be served through a **local HTTP server** (browsers block loading via `file://`).

**Option 1 — VS Code extension:**
Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right-click `index.html` → *Open with Live Server*.

**Option 2 — Python:**
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

**Option 3 — Node.js:**
```bash
npx serve .
```

> **Required permissions:** the browser will ask for webcam access on first launch.

---

## Structure

```
Drone_manipulation/
├── index.html          # Entry point (CDN importmap)
├── main.js             # Main logic (Three.js + MediaPipe)
├── background.jpeg     # 3D scene background image
└── models/
    ├── helicoptere.gltf    # 3D model descriptor
    ├── helicoptere.bin     # Model geometry data
    ├── helicoptere.glb     # Self-contained binary model
    └── text/               # PBR textures
        ├── DefaultMaterial_Alpha.1001000.png
        ├── DefaultMaterial_Emission.1001000.jpg
        ├── DefaultMaterial_Metallic.1001000.png
        └── DefaultMaterial_Normal.1001000.jpg
```

## Licence / License

[MIT](LICENSE) — Kelly CLOVIS, 2026
