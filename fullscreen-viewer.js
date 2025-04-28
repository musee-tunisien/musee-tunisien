import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1. Scene Setup
const scene = new THREE.Scene();
// Change from black to white background
scene.background = new THREE.Color(0xffffff); // Changed from 0x000000

// 2. High Camera Position
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 25, 35); // High starting view

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 20, 10);
scene.add(directionalLight);

// 5. OrbitControls Configuration for Full Movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Movement Settings
controls.screenSpacePanning = false; // Natural movement relative to camera
controls.minDistance = 5;
controls.maxDistance = 150;
controls.maxPolarAngle = Math.PI; // Can look straight up/down

// 6. Model Loading
const loader = new GLTFLoader();
let model;

loader.load('./assets/museum.glb', (gltf) => {
  model = gltf.scene;
  scene.add(model);
  
  // Center model at ground level
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y, -center.z);

  // Set camera to overlook model
  camera.position.set(0, Math.max(25, size.y * 2), size.z * 1.5);
  controls.target.set(0, size.y * 0.5, 0);
  controls.update();
}, undefined, console.error);

// 7. Movement Guide:
// - Left-click + drag: Rotate view
// - Right-click + drag: 
//   → Move in the direction you drag (up/down, left/right, forward/back)
//   → Movement is relative to current camera view
// - Scroll wheel: Zoom in/out

// 8. Fullscreen Handling
renderer.domElement.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    renderer.domElement.requestFullscreen();
  }
});

// 9. Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.update();
});

// 10. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();