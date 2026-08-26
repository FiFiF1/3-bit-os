/**
 * Procedural furniture builders for the floor-plan replica.
 * Units: feet. Local +Y is up; pieces are placed into `parent`.
 */
import * as THREE from "three";

const mats = {
  wood: (hex = "#7a624c") => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.72 }),
  fabric: (hex = "#4f6b5e") => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.92 }),
  metal: (hex = "#8a9399") =>
    new THREE.MeshStandardMaterial({ color: hex, roughness: 0.35, metalness: 0.65 }),
  chrome: (hex = "#c5ccd1") =>
    new THREE.MeshStandardMaterial({ color: hex, roughness: 0.2, metalness: 0.85 }),
  ceramic: (hex = "#f2f0ea") => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.45 }),
  matte: (hex = "#2f3438") => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.88 }),
  glass: (hex = "#a9c8d8") =>
    new THREE.MeshStandardMaterial({
      color: hex,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.05,
    }),
};

function shadow(obj) {
  obj.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return obj;
}

function place(parent, obj, x, y, z, rotY = 0) {
  obj.position.set(x, y, z);
  obj.rotation.y = rotY;
  parent.add(shadow(obj));
  return obj;
}

export function makeBed({ king = false, linen = "#ece7df", frame = "#8b7355" } = {}) {
  const g = new THREE.Group();
  const w = king ? 6.4 : 5.2;
  const d = king ? 7.2 : 6.6;
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, 1.05, d), mats.wood(frame));
  base.position.y = 0.55;
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(w - 0.25, 0.45, d - 0.3), mats.fabric(linen));
  mattress.position.y = 1.28;
  const head = new THREE.Mesh(new THREE.BoxGeometry(w + 0.15, 2.4, 0.35), mats.wood(frame));
  head.position.set(0, 1.5, -d / 2 + 0.1);
  const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.38, 0.35, 1.1), mats.fabric("#f7f4ef"));
  pillow1.position.set(-w * 0.2, 1.65, -d / 2 + 1.1);
  const pillow2 = pillow1.clone();
  pillow2.position.x = w * 0.2;
  const blanket = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.35, 0.18, d * 0.55),
    mats.fabric(king ? "#6d7f72" : "#7d6b58")
  );
  blanket.position.set(0, 1.55, d * 0.12);
  g.add(base, mattress, head, pillow1, pillow2, blanket);
  return g;
}

export function makeNightstand() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.4), mats.wood("#6b5344"));
  body.position.y = 0.9;
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 1.5), mats.wood("#8a6f58"));
  top.position.y = 1.85;
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.9, 12), mats.metal("#b0a090"));
  lamp.position.y = 2.35;
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.7, 16, 1, true), mats.fabric("#f0e6d2"));
  shade.position.y = 2.95;
  g.add(body, top, lamp, shade);
  return g;
}

export function makeDresser(width = 5.5) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, 2.8, 1.7), mats.wood("#6e5848"));
  body.position.y = 1.4;
  for (let i = 0; i < 3; i++) {
    const drawer = new THREE.Mesh(
      new THREE.BoxGeometry(width - 0.35, 0.7, 0.08),
      mats.wood("#826853")
    );
    drawer.position.set(0, 0.7 + i * 0.85, 0.88);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), mats.chrome());
    knob.position.set(0, 0.7 + i * 0.85, 0.98);
    g.add(drawer, knob);
  }
  g.add(body);
  return g;
}

export function makeSofa({ width = 8, color = "#4f6b5e", chaise = false } = {}) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(width, 1.35, 3.2), mats.fabric(color));
  seat.position.y = 1.0;
  const back = new THREE.Mesh(new THREE.BoxGeometry(width, 2.2, 0.7), mats.fabric(color));
  back.position.set(0, 2.0, -1.35);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.7, 3.2), mats.fabric(color));
  armL.position.set(-width / 2 + 0.2, 1.4, 0);
  const armR = armL.clone();
  armR.position.x = width / 2 - 0.2;
  g.add(seat, back, armL, armR);
  if (chaise) {
    const chaiseSeat = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.35, 5.2), mats.fabric(color));
    chaiseSeat.position.set(width / 2 + 1.2, 1.0, -0.9);
    g.add(chaiseSeat);
  }
  // cushions
  for (let i = 0; i < Math.min(3, Math.floor(width / 2.4)); i++) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.35, 2.4), mats.fabric("#d7c4a8"));
    c.position.set(-width / 2 + 1.8 + i * 2.4, 1.85, 0.1);
    g.add(c);
  }
  return g;
}

export function makeArmchair(color = "#6d5a4c") {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.2, 2.8), mats.fabric(color));
  seat.position.y = 1.0;
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 0.55), mats.fabric(color));
  back.position.set(0, 2.0, -1.15);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.4, 2.6), mats.fabric(color));
  armL.position.set(-1.2, 1.4, 0);
  const armR = armL.clone();
  armR.position.x = 1.2;
  g.add(seat, back, armL, armR);
  return g;
}

export function makeCoffeeTable() {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2.4), mats.wood("#5c4638"));
  top.position.y = 1.35;
  for (const [x, z] of [
    [-1.6, -0.8],
    [1.6, -0.8],
    [-1.6, 0.8],
    [1.6, 0.8],
  ]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.3, 0.18), mats.metal("#3a3a3a"));
    leg.position.set(x, 0.65, z);
    g.add(leg);
  }
  const book = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.8), mats.matte("#2f5d50"));
  book.position.set(0.5, 1.52, 0.2);
  g.add(top, book);
  return g;
}

export function makeTVStand() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1.8, 1.6), mats.wood("#4a3f36"));
  body.position.y = 0.9;
  const screen = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.3, 0.18), mats.matte("#121417"));
  screen.position.set(0, 3.5, 0);
  const bezel = new THREE.Mesh(new THREE.BoxGeometry(6.1, 3.55, 0.12), mats.matte("#1c1f22"));
  bezel.position.set(0, 3.5, -0.05);
  g.add(body, bezel, screen);
  return g;
}

export function makeDiningSet({ seats = 6 } = {}) {
  const g = new THREE.Group();
  const table = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.2, 3.4), mats.wood("#7a624c"));
  table.position.y = 2.45;
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 2.3, 16), mats.wood("#6b5344"));
  pedestal.position.y = 1.2;
  g.add(table, pedestal);
  const chairPositions = [];
  if (seats >= 6) {
    chairPositions.push([-2.2, -2.3, 0], [0, -2.3, 0], [2.2, -2.3, 0], [-2.2, 2.3, Math.PI], [0, 2.3, Math.PI], [2.2, 2.3, Math.PI]);
  } else {
    chairPositions.push([-1.6, -2.2, 0], [1.6, -2.2, 0], [-1.6, 2.2, Math.PI], [1.6, 2.2, Math.PI]);
  }
  for (const [x, z, rot] of chairPositions) {
    const chair = makeDiningChair();
    chair.position.set(x, 0, z);
    chair.rotation.y = rot;
    g.add(chair);
  }
  return g;
}

export function makeDiningChair() {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.15, 1.5), mats.wood("#6e5848"));
  seat.position.y = 1.55;
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.6, 0.12), mats.wood("#6e5848"));
  back.position.set(0, 2.4, -0.7);
  for (const [x, z] of [
    [-0.55, -0.55],
    [0.55, -0.55],
    [-0.55, 0.55],
    [0.55, 0.55],
  ]) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.5, 8), mats.wood("#5a4638"));
    leg.position.set(x, 0.75, z);
    g.add(leg);
  }
  g.add(seat, back);
  return g;
}

export function makeBarStool() {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 20), mats.matte("#3f3a36"));
  seat.position.y = 2.35;
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 2.3, 10), mats.chrome("#2a2724"));
  leg.position.y = 1.15;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.05, 8, 24), mats.chrome());
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.85;
  g.add(seat, leg, ring);
  return g;
}

export function makeKitchenIsland() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(8.4, 3.0, 3.3), mats.wood("#6e5a49"));
  body.position.y = 1.5;
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(8.7, 0.2, 3.6),
    new THREE.MeshStandardMaterial({ color: "#d8d2c8", roughness: 0.4, metalness: 0.08 })
  );
  top.position.y = 3.1;
  const sink = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 1.4), mats.chrome("#9aa3a8"));
  sink.position.set(2.2, 3.18, 0);
  g.add(body, top, sink);
  return g;
}

export function makeKitchenRun(length = 10) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.0, length), mats.wood("#5f6f5a"));
  base.position.y = 1.5;
  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.18, length + 0.15),
    new THREE.MeshStandardMaterial({ color: "#cfc8bc", roughness: 0.4 })
  );
  counter.position.y = 3.1;
  const upper = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, length * 0.7), mats.wood("#6a7a65"));
  upper.position.set(-0.2, 6.5, 0);
  // stove
  const stove = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.05, 2.4), mats.matte("#2b2e32"));
  stove.position.set(0.05, 1.52, -length * 0.15);
  const burner = (x, z) => {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 16), mats.matte("#111"));
    b.position.set(x, 3.18, z);
    return b;
  };
  g.add(
    base,
    counter,
    upper,
    stove,
    burner(0.4, -length * 0.15 - 0.5),
    burner(-0.3, -length * 0.15 - 0.5),
    burner(0.4, -length * 0.15 + 0.5),
    burner(-0.3, -length * 0.15 + 0.5)
  );
  // fridge
  const fridge = new THREE.Mesh(new THREE.BoxGeometry(2.4, 6.2, 2.4), mats.metal("#d5d9dc"));
  fridge.position.set(0.2, 3.1, length / 2 - 1.3);
  g.add(fridge);
  return g;
}

export function makeToilet() {
  const g = new THREE.Group();
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 1.2, 18), mats.ceramic());
  bowl.position.y = 0.7;
  const tank = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.6, 0.7), mats.ceramic());
  tank.position.set(0, 1.7, -0.7);
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.1, 18), mats.ceramic("#e8e4dc"));
  seat.position.y = 1.35;
  g.add(bowl, tank, seat);
  return g;
}

export function makeVanity(width = 4.5) {
  const g = new THREE.Group();
  const cab = new THREE.Mesh(new THREE.BoxGeometry(width, 2.6, 1.7), mats.wood("#5a6a72"));
  cab.position.y = 1.3;
  const top = new THREE.Mesh(new THREE.BoxGeometry(width + 0.15, 0.15, 1.85), mats.ceramic("#eef1f3"));
  top.position.y = 2.68;
  const sink = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.2, 16), mats.ceramic("#dfe5e8"));
  sink.position.set(0, 2.7, 0.1);
  const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), mats.chrome());
  faucet.position.set(0, 3.15, -0.35);
  const mirror = new THREE.Mesh(new THREE.BoxGeometry(width * 0.7, 2.4, 0.08), mats.glass("#c5d8e4"));
  mirror.position.set(0, 5.0, -0.75);
  g.add(cab, top, sink, faucet, mirror);
  return g;
}

export function makeTub() {
  const g = new THREE.Group();
  const tub = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.8, 2.8), mats.ceramic("#eef1f3"));
  tub.position.y = 0.9;
  const water = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 0.1, 2.2),
    new THREE.MeshStandardMaterial({ color: "#8eb8c9", transparent: true, opacity: 0.55 })
  );
  water.position.y = 1.55;
  g.add(tub, water);
  return g;
}

export function makeShower() {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.25, 3.4), mats.ceramic("#d9dee2"));
  base.position.y = 0.12;
  const glass1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 6.5, 0.08), mats.glass());
  glass1.position.set(0, 3.4, 1.6);
  const glass2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 6.5, 3.2), mats.glass());
  glass2.position.set(1.6, 3.4, 0);
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.15, 16), mats.chrome());
  head.position.set(0, 6.5, 0);
  g.add(base, glass1, glass2, head);
  return g;
}

export function makeWasherDryer() {
  const g = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const unit = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.4, 2.6), mats.metal(i ? "#d0d4d8" : "#c8ced3"));
    unit.position.set(i * 2.7 - 1.35, 1.7, 0);
    const door = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.12, 24), mats.glass("#9aaeb8"));
    door.rotation.x = Math.PI / 2;
    door.position.set(i * 2.7 - 1.35, 1.7, 1.35);
    g.add(unit, door);
  }
  return g;
}

export function makeDesk() {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.15, 2.2), mats.wood("#6b5344"));
  top.position.y = 2.5;
  for (const x of [-2.0, 2.0]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.45, 1.9), mats.wood("#5a4638"));
    leg.position.set(x, 1.2, 0);
    g.add(leg);
  }
  const monitor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 0.12), mats.matte("#1a1d20"));
  monitor.position.set(0, 3.5, -0.5);
  const chair = makeDiningChair();
  chair.position.set(0, 0, 1.8);
  chair.rotation.y = Math.PI;
  g.add(top, monitor, chair);
  return g;
}

export function makeCar() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(6.2, 2.2, 14), mats.matte("#3d5a6c"));
  body.position.y = 2.0;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.6, 7), mats.matte("#2f4552"));
  cabin.position.set(0, 3.5, -0.5);
  const window = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.1, 6.2), mats.glass("#7fa0b0"));
  window.position.set(0, 3.6, -0.5);
  for (const [x, z] of [
    [-2.5, 4.2],
    [2.5, 4.2],
    [-2.5, -4.2],
    [2.5, -4.2],
  ]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.55, 16), mats.matte("#1a1a1a"));
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 1.05, z);
    g.add(wheel);
  }
  g.add(body, cabin, window);
  return g;
}

export function makeShelving(width = 4, shelves = 4) {
  const g = new THREE.Group();
  const h = shelves * 1.5 + 0.5;
  for (const x of [-width / 2, width / 2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, h, 1.4), mats.metal("#6a7075"));
    post.position.set(x, h / 2, 0);
    g.add(post);
  }
  for (let i = 0; i < shelves; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, 1.5), mats.wood("#9a856c"));
    shelf.position.y = 0.8 + i * 1.5;
    g.add(shelf);
  }
  return g;
}

export function makeRug(w = 8, d = 6, color = "#8b5e4b") {
  const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshStandardMaterial({ color, roughness: 1 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = 0.08;
  return rug;
}

export function makePlant() {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.9, 12), mats.ceramic("#a0674b"));
  pot.position.y = 0.45;
  const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 12), mats.fabric("#3f6b4f"));
  leaves.position.y = 2.0;
  g.add(pot, leaves);
  return g;
}

export function makeBench() {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.2, 1.4), mats.wood("#6e5848"));
  top.position.y = 1.5;
  for (const x of [-1.8, 1.8]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.45, 1.2), mats.wood("#5a4638"));
    leg.position.set(x, 0.72, 0);
    g.add(leg);
  }
  g.add(top);
  return g;
}

export function furnishHouse(house, roomsById) {
  const r = roomsById;
  const cx = (room) => room.x + room.w / 2;
  const cz = (room) => room.z + room.d / 2;

  // —— Primary bedroom ——
  place(house, makeBed({ king: true, linen: "#efe8dc", frame: "#6a5344" }), cx(r.primary) - 1, 0, cz(r.primary) + 0.5, Math.PI / 2);
  place(house, makeNightstand(), r.primary.x + 2.2, 0, r.primary.z + r.primary.d - 2.2);
  place(house, makeNightstand(), r.primary.x + r.primary.w - 2.2, 0, r.primary.z + r.primary.d - 2.2);
  place(house, makeDresser(6), r.primary.x + r.primary.w - 1.2, 0, cz(r.primary), -Math.PI / 2);
  place(house, makeRug(8, 6, "#9a6b52"), cx(r.primary), 0.08, cz(r.primary) - 1);
  place(house, makePlant(), r.primary.x + 1.5, 0, r.primary.z + 1.5);

  // —— NW bedroom ——
  place(house, makeBed({ linen: "#e8efe8" }), cx(r["bed-nw"]), 0, cz(r["bed-nw"]), Math.PI / 2);
  place(house, makeNightstand(), r["bed-nw"].x + 2, 0, r["bed-nw"].z + 2);
  place(house, makeDresser(4.5), r["bed-nw"].x + r["bed-nw"].w - 1.1, 0, cz(r["bed-nw"]) + 1, -Math.PI / 2);
  place(house, makeRug(6, 4.5, "#7d8f6a"), cx(r["bed-nw"]), 0.08, cz(r["bed-nw"]));

  // —— Closet bedroom (annotated closet) ——
  place(house, makeBed({ linen: "#ebe4d8" }), r["bed-closet"].x + 4, 0, cz(r["bed-closet"]), Math.PI / 2);
  place(house, makeShelving(3.5, 5), r["bed-closet"].x + r["bed-closet"].w - 1.2, 0, cz(r["bed-closet"]), -Math.PI / 2);
  place(house, makeDresser(3.8), r["bed-closet"].x + 1.1, 0, r["bed-closet"].z + 2.2, Math.PI / 2);

  // —— Small bedroom ——
  place(house, makeBed({ linen: "#e6ebe8" }), cx(r["bed-small"]), 0, cz(r["bed-small"]) + 0.3, 0);
  place(house, makeNightstand(), r["bed-small"].x + 1.5, 0, r["bed-small"].z + 1.4);
  place(house, makeDesk(), r["bed-small"].x + r["bed-small"].w - 2.2, 0, r["bed-small"].z + 2.2, -Math.PI / 2);

  // —— Bathrooms ——
  place(house, makeVanity(3.8), cx(r["bath-primary"]), 0, r["bath-primary"].z + 0.9);
  place(house, makeToilet(), r["bath-primary"].x + r["bath-primary"].w - 1.3, 0, cz(r["bath-primary"]), Math.PI / 2);

  place(house, makeVanity(5.5), r["bath-left"].x + 3.2, 0, r["bath-left"].z + 0.95);
  place(house, makeTub(), r["bath-left"].x + r["bath-left"].w - 3.2, 0, cz(r["bath-left"]), Math.PI / 2);
  place(house, makeToilet(), r["bath-left"].x + 1.2, 0, cz(r["bath-left"]));

  place(house, makeVanity(3.2), cx(r["bath-right"]), 0, r["bath-right"].z + 0.9);
  place(house, makeShower(), r["bath-right"].x + r["bath-right"].w - 2.0, 0, cz(r["bath-right"]));
  place(house, makeToilet(), r["bath-right"].x + 1.2, 0, cz(r["bath-right"]));

  // —— Living room ——
  place(house, makeRug(12, 9, "#8f6a52"), cx(r.living) - 1, 0.08, cz(r.living));
  place(house, makeSofa({ width: 9, color: "#3f5d52", chaise: true }), r.living.x + 7, 0, cz(r.living) + 1, Math.PI / 2);
  place(house, makeArmchair("#6d5a4c"), r.living.x + 14, 0, r.living.z + 4.5, -Math.PI / 5);
  place(house, makeArmchair("#5c6d60"), r.living.x + 14.5, 0, r.living.z + 12, (-2 * Math.PI) / 5);
  place(house, makeCoffeeTable(), r.living.x + 10.5, 0, cz(r.living) + 0.5);
  place(house, makeTVStand(), r.living.x + 2.2, 0, cz(r.living), Math.PI / 2);
  place(house, makePlant(), r.living.x + r.living.w - 2, 0, r.living.z + 2.5);
  place(house, makePlant(), r.living.x + 3, 0, r.living.z + r.living.d - 2);

  // —— Family room ——
  place(house, makeRug(14, 8, "#7a654e"), cx(r.family), 0.08, cz(r.family));
  place(house, makeSofa({ width: 10, color: "#4a5c68" }), cx(r.family) - 2, 0, r.family.z + 2.4, 0);
  place(house, makeSofa({ width: 7, color: "#5a6a58" }), r.family.x + 4, 0, cz(r.family) + 1.5, Math.PI / 2);
  place(house, makeCoffeeTable(), cx(r.family) - 1, 0, cz(r.family));
  place(house, makeTVStand(), r.family.x + r.family.w - 2, 0, cz(r.family), -Math.PI / 2);
  place(house, makePlant(), r.family.x + 2, 0, r.family.z + r.family.d - 1.8);
  place(house, makePlant(), r.family.x + r.family.w - 8, 0, r.family.z + r.family.d - 1.5);

  // —— Kitchen + dining (island drawn on plan between living and dining) ——
  place(house, makeDiningSet({ seats: 6 }), cx(r.dining) + 1.5, 0, cz(r.dining));
  place(house, makePlant(), r.dining.x + 1.3, 0, r.dining.z + r.dining.d - 1.3);
  place(house, makeKitchenIsland(), r.living.x + r.living.w - 2.2, 0, cz(r.dining) - 1);
  for (let i = 0; i < 5; i++) {
    place(
      house,
      makeBarStool(),
      r.living.x + r.living.w - 5.2,
      0,
      cz(r.dining) - 3.2 + i * 1.15
    );
  }
  place(
    house,
    makeKitchenRun(Math.max(6, r.kitchen.d * 0.75)),
    r.kitchen.x + r.kitchen.w - 1.2,
    0,
    r.kitchen.z + r.kitchen.d * 0.5,
    0
  );

  // —— Laundry ——
  place(house, makeWasherDryer(), cx(r.laundry), 0, r.laundry.z + 3.5, Math.PI / 2);
  place(house, makeShelving(3.2, 4), cx(r.laundry), 0, r.laundry.z + r.laundry.d - 3);

  // —— Hall ——
  place(house, makeBench(), cx(r.hall), 0, r.hall.z + 4, Math.PI / 2);
  place(house, makePlant(), cx(r.hall), 0, r.hall.z + r.hall.d - 2);

  // —— Garage ——
  place(house, makeCar(), r.garage.x + 6, 0, cz(r.garage), Math.PI / 2);
  place(house, makeCar(), r.garage.x + 14, 0, cz(r.garage), Math.PI / 2);
  place(house, makeShelving(6, 4), r.garage.x + r.garage.w - 1.2, 0, r.garage.z + 6, -Math.PI / 2);
  place(house, makeShelving(5, 3), r.garage.x + r.garage.w - 1.2, 0, r.garage.z + r.garage.d - 5, -Math.PI / 2);

  // —— SE room (office / flex) ——
  place(house, makeDesk(), cx(r["room-se"]), 0, cz(r["room-se"]));
  place(house, makeShelving(3.5, 4), r["room-se"].x + 1.1, 0, cz(r["room-se"]), Math.PI / 2);
  place(house, makeArmchair("#5a6b60"), r["room-se"].x + r["room-se"].w - 2, 0, r["room-se"].z + 2);
}
