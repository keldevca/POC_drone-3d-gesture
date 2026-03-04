import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HandLandmarker, FilesetResolver } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/vision_bundle.mjs';

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
textureLoader.load('background.jpeg', (texture) => {
    scene.background = texture;
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
light1.position.set(5, 10, 7.5);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 1.0);
light2.position.set(-5, 5, -5);
scene.add(light2);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture;

let handLandmarker;
let webcamRunning = false;
const video = document.getElementById("webcam");

async function initHandTracking() {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
    });
    startWebcam();
}

function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
            webcamRunning = true;
        });
    });
}

initHandTracking();

let drone;
let dronePivot = new THREE.Group(); 
scene.add(dronePivot);

let propellers = [];
const clock = new THREE.Clock();

const loader = new GLTFLoader();
loader.load('models/helicoptere.gltf', (gltf) => {
    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -center.y, -center.z);

    dronePivot.add(model);
    drone = dronePivot;

    const scaleFactor = 1.0;
    drone.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const aerialBox = new THREE.Box3().setFromObject(model);
    const maxY = aerialBox.max.y;
    const minY = aerialBox.min.y;
    const height = maxY - minY;

    model.traverse((child) => {
        if (child.isMesh) {
            const childPos = new THREE.Vector3();
            child.getWorldPosition(childPos);
            if (childPos.y > maxY - (height * 0.15)) {
                propellers.push(child);
            }
        }
    });

    console.log("Modèle GLTF chargé avec ses textures !");
}, undefined, (error) => {
    console.error("Erreur de chargement du modèle :", error);
});

// Variables pour le lissage (Lerp)
let targetRotationX = 0;
let targetRotationY = 0;
let targetRotationZ = 0;
let targetPositionX = 0;
let targetPositionY = 0;
let targetPositionZ = 0;

// 8. Boucle d'animation
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (webcamRunning && handLandmarker && drone) {
        const startTimeMs = performance.now();
        const results = handLandmarker.detectForVideo(video, startTimeMs);

        if (results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];

            targetPositionX = (0.5 - landmarks[9].x) * 12;
            targetPositionY = (0.5 - landmarks[9].y) * 10;

            const dx = landmarks[0].x - landmarks[12].x;
            const dy = landmarks[0].y - landmarks[12].y;
            const palmSize = Math.sqrt(dx * dx + dy * dy);

            let zValue = (palmSize - 0.25) * 6;
            targetPositionZ = Math.max(-5, Math.min(2, zValue));

            const yawDiff = (landmarks[5].z - landmarks[17].z) * 20;
            targetRotationY = Math.abs(yawDiff) < 0.6 ? 0 : yawDiff;

            drone.position.x += (targetPositionX - drone.position.x) * 0.1;
            drone.position.y += (targetPositionY - drone.position.y) * 0.1;
            drone.position.z += (targetPositionZ - drone.position.z) * 0.1;
            drone.rotation.y += (targetRotationY - drone.rotation.y) * 0.1;

            drone.rotation.x = 0;
            drone.rotation.z = 0;
        } else {
            targetPositionX = 0;
            targetPositionY = 0;
            targetPositionZ = 0;
            targetRotationY = 0;

            drone.position.x += (0 - drone.position.x) * 0.05;
            drone.position.y += (0 - drone.position.y) * 0.05;
            drone.position.z += (0 - drone.position.z) * 0.05;
            drone.rotation.x += (0 - drone.rotation.x) * 0.05;
            drone.rotation.y += (0 - drone.rotation.y) * 0.05;
            drone.rotation.z += (0 - drone.rotation.z) * 0.05;
        }

        propellers.forEach(prop => {
            prop.rotation.y += 0.4;
        });
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

