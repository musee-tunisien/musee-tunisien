import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 5);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('model-viewer').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Configure OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Control settings
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = true; // Better for panning
controls.minDistance = 1;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI; // Full 180° vertical rotation
controls.minPolarAngle = 0; // Allow looking straight down

// Explicit control mapping
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.PAN
};

// Model loading with proper centering
const loader = new GLTFLoader();
let model;

loader.load(
  './assets/museum.glb',
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
    
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    // Center model at origin with bottom at y=0
    model.position.x -= center.x;
    model.position.y -= center.y; // Full center (not size.y/2)
    model.position.z -= center.z;
    
    // Set controls target to model center
    controls.target.copy(new THREE.Vector3(0, 0, 0));
    
    // Adjust camera distance based on model size
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const dist = maxDim / Math.tan(fov/2);
    camera.position.z = dist * 0.8; // Adjusted multiplier
    
    // Update controls
    controls.update();
    
    // Debug helper - shows the center point
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
  },
  undefined,
  (error) => console.error('Model error:', error)
);

// Click handler for opening fullscreen
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function handleClick(event) {
  if (controls.isDragging) return;
  
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  
  if (model) {
    const intersects = raycaster.intersectObject(model, true);
    if (intersects.length > 0) {
      window.open('./model-viewer.html?centered=true', '_blank');
    }
  }
}

renderer.domElement.addEventListener('click', handleClick);

// Cursor feedback
renderer.domElement.style.cursor = 'grab';

controls.addEventListener('start', () => {
  renderer.domElement.style.cursor = controls.mouseButtons.LEFT === THREE.MOUSE.ROTATE ? 'grabbing' : 'move';
});

controls.addEventListener('end', () => {
  renderer.domElement.style.cursor = 'grab';
});

// Resize handler
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();