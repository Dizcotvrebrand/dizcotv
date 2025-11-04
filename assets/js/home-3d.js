import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('hero-3d');
if (!canvas) return;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
camera.position.set(1.0, 1.0, 2.8);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 1.6;
controls.maxDistance = 4;
controls.enableZoom = false;

// Lights with warm golden tone
const key = new THREE.SpotLight(0xf5c842, 1.4, 0, Math.PI / 6, 0.35, 1);
key.position.set(2.5, 3.2, 2.5);
scene.add(key);
scene.add(key.target);

const rim = new THREE.DirectionalLight(0xd4af37, 0.85);
rim.position.set(-3, 2.5, -2);
scene.add(rim);

const ambient = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambient);

// Golden material
const gold = new THREE.MeshPhysicalMaterial({
	color: 0xd4af37,
	metalness: 0.95,
	roughness: 0.25,
	clearcoat: 0.6,
	clearcoatRoughness: 0.2,
});

// Simple TV shape: rounded screen frame + play triangle
const group = new THREE.Group();

// Frame
const frameGeom = new THREE.BoxGeometry(2.0, 1.3, 0.12);
const frame = new THREE.Mesh(frameGeom, gold);
frame.castShadow = true;
frame.receiveShadow = true;
group.add(frame);

// Screen (dark)
const screenGeom = new THREE.BoxGeometry(1.7, 1.0, 0.02);
const screenMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, metalness: 0.4, roughness: 0.6 });
const screen = new THREE.Mesh(screenGeom, screenMat);
screen.position.z = 0.07;
group.add(screen);

// Play icon
const playShape = new THREE.Shape();
playShape.moveTo(-0.3, -0.25);
playShape.lineTo(0.35, 0);
playShape.lineTo(-0.3, 0.25);
playShape.lineTo(-0.3, -0.25);
const playGeom = new THREE.ExtrudeGeometry(playShape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 });
const play = new THREE.Mesh(playGeom, gold);
play.position.set(0, 0, 0.09);
group.add(play);

// Antennas
const antennaGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.7, 16);
const a1 = new THREE.Mesh(antennaGeom, gold);
const a2 = a1.clone();
a1.position.set(-0.5, 1.0, 0);
a2.position.set(0.5, 1.0, 0);
a1.rotation.z = Math.PI * -0.28;
a2.rotation.z = Math.PI * 0.28;
group.add(a1, a2);

// Base platform
const base = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.1, 64), new THREE.MeshStandardMaterial({ color: 0x101015, metalness: 0.2, roughness: 0.9 }));
base.position.y = -0.95;
base.receiveShadow = true;
group.add(base);

group.rotation.y = 0.6;
scene.add(group);

// Subtle gold particle field
const particles = (() => {
	const count = 500;
	const geom = new THREE.BufferGeometry();
	const positions = new Float32Array(count * 3);
	for (let i = 0; i < count; i++) {
		const r = 3 + Math.random() * 3.5;
		const theta = Math.random() * Math.PI * 2;
		const y = (Math.random() - 0.5) * 1.6;
		positions[i * 3 + 0] = Math.cos(theta) * r;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = Math.sin(theta) * r;
	}
	geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const mat = new THREE.PointsMaterial({ color: 0xf5c842, size: 0.015, transparent: true, opacity: 0.7 });
	const pts = new THREE.Points(geom, mat);
	scene.add(pts);
	return pts;
})();

// Resize
function resize() {
	const rect = canvas.getBoundingClientRect();
	const w = rect.width || window.innerWidth;
	const h = rect.height || Math.max(260, window.innerHeight * 0.42);
	renderer.setSize(w, h, false);
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

// Animate
let t = 0;
function tick() {
	t += 0.004;
	group.rotation.y += 0.0022;
	group.position.y = Math.sin(t) * 0.02;
	particles.rotation.y -= 0.0008;
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(tick);
}

requestAnimationFrame(tick);


