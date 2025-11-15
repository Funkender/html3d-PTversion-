//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 👉 Neu: Pathtracing-Renderer importieren
import { PathTracingRenderer, PhysicalPathTracingMaterial } 
  from "https://unpkg.com/three@0.160.0/examples/jsm/pathtracing/PathTracingRenderer.js";

// Szene & Kamera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let object;
let controls;
let objToRender = 'eye';

// Loader
const loader = new GLTFLoader();
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;

    // 👉 Materialien auf Pathtracing umstellen
    object.traverse((child) => {
      if (child.isMesh) {
        child.material = new PhysicalPathTracingMaterial();
        child.material.color.set(0xffffff);
      }
    });

    scene.add(object);
  }
);

// 👉 Renderer austauschen
const renderer = new PathTracingRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Kamera-Position
camera.position.z = objToRender === "dino" ? 25 : 500;

// Controls
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', () => renderer.reset());
}

// Renderloop
function animate() {
  requestAnimationFrame(animate);

  if (object && objToRender === "eye") {
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  renderer.update(); // 👉 Pathtracing statt render()
}

// Resize
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.reset(); // 👉 wichtig für PT
});

// Mausbewegung
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

animate();
