/**
 * 3D replica of the CubiCasa floor plan.
 * Units: 1 Three.js unit = 1 foot.
 * Axes: +X east (right), +Y up, +Z north (toward family-room sliding door).
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { furnishHouse } from "./furniture.js";
import { buildRooms } from "./layout.js";

const WALL_H = 9;
const WALL_T = 0.45;
const FLOOR_Y = 0.05;

const rooms = buildRooms();
const primary = rooms.find((r) => r.id === "primary");
const hall = rooms.find((r) => r.id === "hall");
const bedNW = rooms.find((r) => r.id === "bed-nw");
const bedSmall = rooms.find((r) => r.id === "bed-small");
const family = rooms.find((r) => r.id === "family");
const living = rooms.find((r) => r.id === "living");
const dining = rooms.find((r) => r.id === "dining");
const kitchen = rooms.find((r) => r.id === "kitchen");
const laundry = rooms.find((r) => r.id === "laundry");
const bathRight = rooms.find((r) => r.id === "bath-right");
const garage = rooms.find((r) => r.id === "garage");
const roomSE = rooms.find((r) => r.id === "room-se");

const houseBounds = (() => {
  let minX = Infinity,
    minZ = Infinity,
    maxX = -Infinity,
    maxZ = -Infinity;
  for (const r of rooms) {
    minX = Math.min(minX, r.x);
    minZ = Math.min(minZ, r.z);
    maxX = Math.max(maxX, r.x + r.w);
    maxZ = Math.max(maxZ, r.z + r.d);
  }
  return { minX, minZ, maxX, maxZ, cx: (minX + maxX) / 2, cz: (minZ + maxZ) / 2, w: maxX - minX, d: maxZ - minZ };
})();

const scene = new THREE.Scene();
scene.background = new THREE.Color("#d7e0d8");
scene.fog = new THREE.Fog("#d7e0d8", 80, 160);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(houseBounds.cx + 28, 42, houseBounds.cz - 38);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById("app").appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.inset = "0";
labelRenderer.domElement.style.pointerEvents = "none";
document.getElementById("app").appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(houseBounds.cx, 2, houseBounds.cz);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 12;
controls.maxDistance = 120;

// Lights
const hemi = new THREE.HemisphereLight(0xf5f0e6, 0x6f7f6a, 1.05);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff2dd, 1.35);
sun.position.set(40, 55, -25);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60;
sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60;
sun.shadow.camera.bottom = -60;
sun.shadow.camera.near = 1;
sun.shadow.camera.far = 160;
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.25));

// Ground
const groundGeo = new THREE.CircleGeometry(90, 64);
const groundMat = new THREE.MeshStandardMaterial({ color: "#8fa88a", roughness: 1 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.set(houseBounds.cx, -0.02, houseBounds.cz);
ground.receiveShadow = true;
scene.add(ground);

// Soft patio / driveway discs
function addPad(x, z, rx, rz, color) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(rx, rz),
    new THREE.MeshStandardMaterial({ color, roughness: 0.95 })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.01, z);
  mesh.receiveShadow = true;
  scene.add(mesh);
}
addPad(living.x + living.w * 0.45, living.z - 4, 14, 7, "#9aa39a");
addPad(garage.x + garage.w * 0.5, garage.z - 5, garage.w * 0.85, 9, "#7d8388");
addPad(family.x + family.w * 0.45, family.z + family.d + 4, 22, 7, "#95a892");
addPad(primary.x + primary.w * 0.5, primary.z - 3.5, primary.w * 0.9, 6, "#8fa88a");

const house = new THREE.Group();
scene.add(house);

const wallMat = new THREE.MeshStandardMaterial({ color: "#f4efe6", roughness: 0.85 });
const extWallMat = new THREE.MeshStandardMaterial({ color: "#e7e0d4", roughness: 0.8 });
const glassMat = new THREE.MeshStandardMaterial({
  color: "#a9c8d8",
  transparent: true,
  opacity: 0.35,
  roughness: 0.1,
  metalness: 0.1,
});
const doorMat = new THREE.MeshStandardMaterial({ color: "#5c4033", roughness: 0.7 });
const slidingMat = new THREE.MeshStandardMaterial({
  color: "#7fa9bc",
  transparent: true,
  opacity: 0.45,
  roughness: 0.15,
});

const labelGroup = new THREE.Group();
house.add(labelGroup);

function roomFloor(room) {
  const geo = new THREE.PlaneGeometry(room.w - 0.15, room.d - 0.15);
  const mat = new THREE.MeshStandardMaterial({ color: room.color, roughness: 0.9 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(room.x + room.w / 2, FLOOR_Y, room.z + room.d / 2);
  mesh.receiveShadow = true;
  house.add(mesh);

  const el = document.createElement("div");
  el.className = "room-label";
  el.innerHTML = `<strong>${room.name}</strong><span>${room.dim}</span>`;
  Object.assign(el.style, {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "11px",
    lineHeight: "1.25",
    color: "#1c1917",
    background: "rgba(247,243,236,0.88)",
    padding: "4px 7px",
    border: "1px solid rgba(28,25,23,0.1)",
    textAlign: "center",
    whiteSpace: "nowrap",
    transform: "translate(-50%, -50%)",
    userSelect: "none",
  });
  el.querySelector("strong").style.display = "block";
  el.querySelector("span").style.cssText = "opacity:0.7;font-size:10px";
  const label = new CSS2DObject(el);
  label.position.set(room.x + room.w / 2, 3.2, room.z + room.d / 2);
  labelGroup.add(label);
}

for (const room of rooms) roomFloor(room);

/** Wall segment along X (east-west) at fixed z */
function wallX(x0, x1, z, height = WALL_H, mat = wallMat, y0 = 0) {
  const len = Math.abs(x1 - x0);
  if (len < 0.05) return null;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, height, WALL_T), mat);
  mesh.position.set((x0 + x1) / 2, y0 + height / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  house.add(mesh);
  return mesh;
}

/** Wall segment along Z (north-south) at fixed x */
function wallZ(z0, z1, x, height = WALL_H, mat = wallMat, y0 = 0) {
  const len = Math.abs(z1 - z0);
  if (len < 0.05) return null;
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(WALL_T, height, len), mat);
  mesh.position.set(x, y0 + height / 2, (z0 + z1) / 2);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  house.add(mesh);
  return mesh;
}

function openingGlassX(x0, x1, z, y, h, mat = glassMat) {
  const len = Math.abs(x1 - x0);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, h, 0.12), mat);
  mesh.position.set((x0 + x1) / 2, y + h / 2, z);
  house.add(mesh);
}

function openingGlassZ(z0, z1, x, y, h, mat = glassMat) {
  const len = Math.abs(z1 - z0);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, len), mat);
  mesh.position.set(x, y + h / 2, (z0 + z1) / 2);
  house.add(mesh);
}

// Exterior outline walls — staggered south facade matches the plan
const minX = houseBounds.minX;
const maxX = houseBounds.maxX;
const minZ = houseBounds.minZ;
const maxZ = houseBounds.maxZ;

// Primary south wall (southernmost)
wallX(primary.x, primary.x + primary.w, primary.z, WALL_H, extWallMat);
openingGlassX(primary.x + 3, primary.x + 10, primary.z - 0.05, 2.2, 4.2);

// Recessed living south wall with front door
const frontDoorX = living.x + living.w * 0.45;
wallX(living.x, frontDoorX - 1.75, living.z, WALL_H, extWallMat);
wallX(frontDoorX + 1.75, living.x + living.w, living.z, WALL_H, extWallMat);
{
  const door = new THREE.Mesh(new THREE.BoxGeometry(3.2, 7.2, 0.18), doorMat);
  door.position.set(frontDoorX, 3.6, living.z);
  door.castShadow = true;
  house.add(door);
  const knob = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 12, 12),
    new THREE.MeshStandardMaterial({ color: "#c9a227", metalness: 0.8, roughness: 0.3 })
  );
  knob.position.set(frontDoorX + 1.2, 3.4, living.z - 0.15);
  house.add(knob);
}

// Connecting walls of the front-door recess
wallZ(primary.z, living.z, primary.x + primary.w, WALL_H, extWallMat);
wallZ(primary.z, kitchen.z, kitchen.x, WALL_H, extWallMat);

// Kitchen / bath / SE room south walls
wallX(kitchen.x, kitchen.x + kitchen.w, kitchen.z, WALL_H, extWallMat);
wallX(bathRight.x, bathRight.x + bathRight.w, bathRight.z, WALL_H, extWallMat);
wallX(roomSE.x, roomSE.x + roomSE.w, roomSE.z, WALL_H, extWallMat);
openingGlassX(kitchen.x + 2, kitchen.x + kitchen.w - 2, kitchen.z - 0.05, 2.2, 4.2);
openingGlassX(roomSE.x + 2, roomSE.x + roomSE.w - 2, roomSE.z - 0.05, 2.2, 4.2);

// North wall — sliding door in family room
const slideX0 = family.x + family.w * 0.28;
const slideX1 = family.x + family.w * 0.55;
wallX(bedNW.x, slideX0, maxZ, WALL_H, extWallMat);
wallX(slideX1, maxX, maxZ, WALL_H, extWallMat);
openingGlassX(slideX0, slideX1, maxZ, 0.2, 7.6, slidingMat);
wallX(slideX0, slideX1, maxZ, 0.35, extWallMat);
openingGlassX(bedNW.x + 2, bedNW.x + 8, maxZ + 0.05, 2.2, 4.2);
openingGlassX(bedSmall.x + 2, bedSmall.x + bedSmall.w - 2, maxZ + 0.05, 2.2, 4.0);

// West wall — primary jog, then inset upper wing
wallZ(primary.z, primary.z + primary.d, primary.x, WALL_H, extWallMat);
wallX(primary.x, bedNW.x, primary.z + primary.d, WALL_H, extWallMat); // jog face
wallZ(primary.z + primary.d, maxZ, bedNW.x, WALL_H, extWallMat);
[
  [primary.z + 2, primary.z + 6],
  [rooms.find((r) => r.id === "bed-closet").z + 2, rooms.find((r) => r.id === "bed-closet").z + 6],
  [bedNW.z + 2.5, bedNW.z + 7.5],
].forEach(([a, b]) => {
  const xWall = a < primary.d ? primary.x : bedNW.x;
  openingGlassZ(a, b, xWall - 0.05, 2.2, 4.2);
});

// East wall along garage + SE room
wallZ(roomSE.z, maxZ, maxX, WALL_H, extWallMat);
{
  const gx0 = garage.x + 3;
  const gx1 = garage.x + garage.w - 3;
  const gDoor = new THREE.Mesh(
    new THREE.BoxGeometry(gx1 - gx0, 7.5, 0.2),
    new THREE.MeshStandardMaterial({ color: "#4a5560", roughness: 0.65 })
  );
  gDoor.position.set((gx0 + gx1) / 2, 3.75, garage.z);
  house.add(gDoor);
}

// Interior partitions from room edges
function addInteriorPartitions() {
  const edges = [];
  for (const r of rooms) {
    edges.push({ x0: r.x, x1: r.x + r.w, z: r.z, axis: "x" });
    edges.push({ x0: r.x, x1: r.x + r.w, z: r.z + r.d, axis: "x" });
    edges.push({ z0: r.z, z1: r.z + r.d, x: r.x, axis: "z" });
    edges.push({ z0: r.z, z1: r.z + r.d, x: r.x + r.w, axis: "z" });
  }

  const seen = new Set();
  for (const e of edges) {
    if (e.axis === "x") {
      // skip true exterior south/north spans already built
      if (Math.abs(e.z - maxZ) < 0.1) continue;
      if (Math.abs(e.z - primary.z) < 0.1 && e.x0 < primary.w) continue;
      if (Math.abs(e.z - living.z) < 0.1 && e.x0 >= living.x - 0.1 && e.x1 <= living.x + living.w + 0.1) continue;
      if (Math.abs(e.z - kitchen.z) < 0.1 && e.x0 >= kitchen.x - 0.1) continue;
      const key = `x:${e.x0.toFixed(2)}:${e.x1.toFixed(2)}:${e.z.toFixed(2)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const mid = (e.x0 + e.x1) / 2;
      const isHallDoor =
        Math.abs(e.z - (living.z + living.d)) < 0.25 ||
        Math.abs(e.z - hall.z) < 0.25 ||
        (e.x0 < hall.x + 1 && e.x1 > hall.x);
      // keep living↔family and living↔dining open
      const openPlan =
        (Math.abs(e.z - family.z) < 0.2 && e.x0 >= living.x) ||
        (Math.abs(e.z - dining.z) < 0.2 && e.x0 >= dining.x - 0.2);
      if (openPlan) continue;
      if (isHallDoor && e.x1 - e.x0 > 4) {
        wallX(e.x0, mid - 1.4, e.z, WALL_H, wallMat);
        wallX(mid + 1.4, e.x1, e.z, WALL_H, wallMat);
      } else {
        wallX(e.x0, e.x1, e.z, WALL_H, wallMat);
      }
    } else {
      if (Math.abs(e.x - minX) < 0.1 || Math.abs(e.x - maxX) < 0.1) continue;
      if (Math.abs(e.x - bedNW.x) < 0.1 && e.z0 >= primary.d) continue;
      if (Math.abs(e.x - primary.x) < 0.1) continue;
      const key = `z:${e.z0.toFixed(2)}:${e.z1.toFixed(2)}:${e.x.toFixed(2)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const openLivingKitchen =
        Math.abs(e.x - (living.x + living.w)) < 0.2 && e.z0 < living.z + living.d && e.z1 > living.z;
      if (openLivingKitchen) {
        wallZ(e.z0, e.z0 + 1.0, e.x, 3.0, wallMat);
        continue;
      }
      if (Math.abs(e.x - (hall.x + hall.w)) < 0.15 || Math.abs(e.x - hall.x) < 0.15) {
        const mid = (e.z0 + e.z1) / 2;
        wallZ(e.z0, mid - 1.5, e.x, WALL_H, wallMat);
        wallZ(mid + 1.5, e.z1, e.x, WALL_H, wallMat);
      } else {
        wallZ(e.z0, e.z1, e.x, WALL_H, wallMat);
      }
    }
  }
}
addInteriorPartitions();

// Full furnishings for every room
const roomsById = Object.fromEntries(rooms.map((room) => [room.id, room]));
furnishHouse(house, roomsById);

// Optional roof (toggle)
const roofGroup = new THREE.Group();
roofGroup.visible = false;
house.add(roofGroup);
{
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(houseBounds.w + 2.5, 0.35, houseBounds.d + 2.5),
    new THREE.MeshStandardMaterial({ color: "#6a5550", roughness: 0.9, transparent: true, opacity: 0.85 })
  );
  roof.position.set(houseBounds.cx, WALL_H + 0.4, houseBounds.cz);
  roofGroup.add(roof);
  // gentle gable ridge suggestion
  const ridge = new THREE.Mesh(
    new THREE.ConeGeometry(Math.max(houseBounds.w, houseBounds.d) * 0.55, 3.5, 4),
    new THREE.MeshStandardMaterial({ color: "#5c4843", roughness: 0.9, transparent: true, opacity: 0.7 })
  );
  ridge.rotation.y = Math.PI / 4;
  ridge.position.set(houseBounds.cx, WALL_H + 2.2, houseBounds.cz);
  roofGroup.add(ridge);
}

// Door labels
function addNote(text, x, y, z) {
  const el = document.createElement("div");
  el.textContent = text;
  Object.assign(el.style, {
    fontFamily: '"DM Sans", sans-serif',
    fontSize: "12px",
    fontWeight: "600",
    color: "#1c1917",
    background: "rgba(255,255,255,0.9)",
    padding: "3px 8px",
    border: "1px solid rgba(28,25,23,0.12)",
  });
  const obj = new CSS2DObject(el);
  obj.position.set(x, y, z);
  labelGroup.add(obj);
}
addNote("Front Door", frontDoorX, 8.2, living.z - 1.2);
addNote("Sliding Door", (slideX0 + slideX1) / 2, 8.2, maxZ + 1.2);

// UI
const btnOrbit = document.getElementById("btn-orbit");
const btnTop = document.getElementById("btn-top");
const btnLabels = document.getElementById("btn-labels");
const btnRoof = document.getElementById("btn-roof");

function setActive(btn, on) {
  btn.classList.toggle("active", on);
}

btnOrbit.addEventListener("click", () => {
  camera.position.set(houseBounds.cx + 28, 42, houseBounds.cz - 38);
  controls.target.set(houseBounds.cx, 2, houseBounds.cz);
  setActive(btnOrbit, true);
  setActive(btnTop, false);
});

btnTop.addEventListener("click", () => {
  camera.position.set(houseBounds.cx, 70, houseBounds.cz + 0.01);
  controls.target.set(houseBounds.cx, 0, houseBounds.cz);
  setActive(btnOrbit, false);
  setActive(btnTop, true);
});

btnLabels.addEventListener("click", () => {
  labelGroup.visible = !labelGroup.visible;
  setActive(btnLabels, labelGroup.visible);
});

btnRoof.addEventListener("click", () => {
  roofGroup.visible = !roofGroup.visible;
  setActive(btnRoof, roofGroup.visible);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Gentle intro camera drift
let t0 = performance.now();
function animate(now) {
  requestAnimationFrame(animate);
  const t = (now - t0) / 1000;
  if (t < 2.8) {
    const k = 1 - Math.pow(1 - Math.min(t / 2.8, 1), 3);
    camera.position.lerpVectors(
      new THREE.Vector3(houseBounds.cx + 8, 55, houseBounds.cz - 8),
      new THREE.Vector3(houseBounds.cx + 28, 42, houseBounds.cz - 38),
      k
    );
  }
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
animate(performance.now());
