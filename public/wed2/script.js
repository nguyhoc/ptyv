import * as THREE from "three";

// ---------- Chấm hồng bay ----------
const dots = document.getElementById("dots");
for (let i = 0; i < 45; i++) {
  const d = document.createElement("div");
  d.className = "dot";
  const s = 2 + Math.random() * 6;
  d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;top:${Math.random() * 110}%;opacity:${0.3 + Math.random() * 0.6};animation-duration:${20 + Math.random() * 30}s;animation-delay:-${Math.random() * 30}s`;
  if (Math.random() < 0.4) d.classList.add("light");
  dots.appendChild(d);
}

// Hạt li ti bay nhẹ, mờ dần và xuất hiện lại ở phía dưới.
for (let i = 0; i < 100; i++) {
  const particle = document.createElement("div");
  particle.className = i % 3 === 0 ? "particle pink" : "particle";
  const size = 1 + Math.random() * 2;
  particle.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${35 + Math.random() * 65}%;--sway:${Math.random() * 140 - 70}px;--alpha:${0.35 + Math.random() * 0.45};animation-duration:${12 + Math.random() * 16}s;animation-delay:-${Math.random() * 28}s`;
  dots.appendChild(particle);
}

// ---------- Sticker mèo ----------
const spots = [[18, 15, 1], [70, 4, 2], [35, 88, 1], [85, 60, 2], [6, 60, 2], [60, 82, 1]];
const cats = document.getElementById("cats");
spots.forEach(([x, y, n], i) => {
  const s = document.createElement("div");
  s.className = "sticker";
  s.style.left = x + "%";
  s.style.top = y + "%";
  s.style.setProperty("--r", (i % 2 ? 6 : -6) + "deg");
  const duration = 11 + i * 1.2;
  s.style.setProperty("--duration", duration + "s");
  s.style.setProperty("--travel-x", (i % 2 ? -32 : 32) + "px");
  s.style.animationDelay = -(i / spots.length) * duration + "s";
  s.innerHTML = `<img src="/wed2/cat${n}.png" alt="mèo dễ thương">`;
  s.onclick = (e) => {
    for (let k = 0; k < 5; k++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = "💗";
      h.style.left = e.clientX + Math.random() * 60 - 30 + "px";
      h.style.top = e.clientY + "px";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1400);
    }
  };
  cats.appendChild(s);
});

// ---------- Nhạc nền ----------
const musicButton = document.getElementById("music");
const musicIcon = musicButton.querySelector(".music-icon");
const audioTrack = new Audio("/public/music/bd2.mp3");
audioTrack.loop = true;
let playing = false;

function updateMusicButton() {
  musicIcon.textContent = playing ? "🔊" : "🔇";
  musicButton.setAttribute("aria-pressed", String(playing));
}

musicButton.addEventListener("click", async () => {
  if (audioTrack.paused) {
    try {
      await audioTrack.play();
      playing = true;
    } catch (error) {
      console.error("Không thể phát nhạc nền.", error);
      playing = false;
    }
  } else {
    audioTrack.pause();
    playing = false;
  }
  updateMusicButton();
});

// ---------- Cảnh 3D ----------
const container = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0.6, 11);
camera.lookAt(0, 0.2, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0xffc6d6, 1.6));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(3, 5, 6);
scene.add(key);

const bouquet = new THREE.Group();
scene.add(bouquet);

// Cánh hình thìa: mép tròn, lòng cong và độ mở thay đổi theo từng bông.
function petalGeometry(openness = 0) {
  const g = new THREE.PlaneGeometry(2, 1, 24, 32);
  const p = g.attributes.position;
  const colors = [];
  for (let i = 0; i < p.count; i++) {
    const u = p.getX(i), v = p.getY(i) + 0.5;
    const arch = Math.pow(Math.max(0, Math.sin(v * Math.PI)), 0.58);
    const x = u * (0.018 + 0.29 * arch);
    const y = v * 1.05 - 0.085 * u * u * Math.pow(v, 4) - openness * 0.15 * v * v;
    const rib = Math.cos(u * Math.PI * 5) * 0.003 * arch;
    const z = (0.2 - 0.13 * u * u) * arch - 0.035 * v + openness * 0.5 * v * v + rib;
    p.setXYZ(i, x, y, z);
    // Nuances douces et nervures discrètes, sans facettes peintes.
    const shade = 0.84 + 0.12 * v + 0.04 * Math.abs(u);
    colors.push(shade, shade, shade);
  }
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
const petalGeo = petalGeometry();
const openPetalGeo = petalGeometry(1);
const halfOpenPetalGeo = petalGeometry(0.65);
const pollenMat = new THREE.MeshStandardMaterial({ color: 0xe5bd58, roughness: 0.8 });
const pistilMat = new THREE.MeshStandardMaterial({ color: 0x9ead62, roughness: 0.7 });
const filamentGeo = new THREE.CylinderGeometry(0.009, 0.012, 0.22, 8);
const pollenGeo = new THREE.SphereGeometry(0.026, 12, 8);
const stemMat = new THREE.MeshStandardMaterial({ color: 0x5f9e56, roughness: 0.6 });
const leafMat = new THREE.MeshStandardMaterial({ color: 0x6fae6a, roughness: 0.5, side: THREE.DoubleSide });
const UP = new THREE.Vector3(0, 1, 0);
const BIND = new THREE.Vector3(0, 0.12, 0);

// Tulip từ điểm buộc đến vị trí đầu hoa
function tulip(color, head, openness = 0) {
  const g = new THREE.Group();
  const dir = head.clone().sub(BIND);
  const len = dir.length();
  g.position.copy(BIND);
  g.quaternion.setFromUnitVectors(UP, dir.normalize());
  // Cuống cong đi từ trong túi, qua miệng túi rồi mới tỏa ra.
  const angle = Math.atan2(head.z, head.x);
  const stemEnd = head.clone().addScaledVector(dir, -0.15);
  const controls = [
    new THREE.Vector3(Math.cos(angle) * 0.065, -1.58, Math.sin(angle) * 0.065),
    new THREE.Vector3(Math.cos(angle) * 0.045, -0.75, Math.sin(angle) * 0.045),
    new THREE.Vector3(Math.cos(angle) * 0.055, 0.06, Math.sin(angle) * 0.055),
    new THREE.Vector3(head.x * 0.36, 0.36 + head.y * 0.16, head.z * 0.36),
    new THREE.Vector3(head.x * 0.82, head.y * 0.76, head.z * 0.82),
    stemEnd,
  ];
  const inverse = g.quaternion.clone().invert();
  controls.forEach((point) => point.sub(BIND).applyQuaternion(inverse));
  const stemCurve = new THREE.CatmullRomCurve3(controls);
  const stem = new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 40, 0.012, 6, false), stemMat);
  g.add(stem);
  const mat = new THREE.MeshPhysicalMaterial({
    color, roughness: 0.43, side: THREE.DoubleSide, vertexColors: true,
    sheen: 0.25, sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.4),
    sheenRoughness: 0.65, clearcoat: 0.08, clearcoatRoughness: 0.6,
  });
  const h = new THREE.Group();
  h.position.y = len - 0.15;
  h.scale.setScalar(1.0);
  h.rotation.y = Math.random() * 6.28;
  for (let i = 0; i < 6; i++) {
    const inner = i >= 3;
    const geometry = openness ? (inner ? halfOpenPetalGeo : openPetalGeo) : petalGeo;
    const p = new THREE.Mesh(geometry, mat);
    const a = (i % 3) * (Math.PI * 2 / 3) + (inner ? Math.PI / 3 : 0);
    p.rotation.y = a + (openness ? Math.sin(i * 2.3) * 0.06 : 0);
    const r = inner ? 0.05 : 0.11;
    p.position.set(Math.sin(a) * r, inner ? 0.02 : 0, Math.cos(a) * r);
    p.scale.setScalar(inner ? 0.92 : 1);
    h.add(p);
  }
  if (openness) {
    const pistil = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.033, 0.33, 10), pistilMat);
    pistil.position.y = 0.28;
    h.add(pistil);
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      const filament = new THREE.Mesh(filamentGeo, pistilMat);
      filament.position.set(Math.sin(a) * 0.075, 0.27, Math.cos(a) * 0.075);
      const pollen = new THREE.Mesh(pollenGeo, pollenMat);
      pollen.scale.set(0.7, 1.5, 0.7);
      pollen.position.set(Math.sin(a) * 0.075, 0.39, Math.cos(a) * 0.075);
      h.add(filament, pollen);
    }
  }
  // Hai nhánh lá nhỏ
  g.add(h);
  return g;
}

const smallFlowerMaterials = [0xffffff, 0xffe3ec, 0xffc8d8].map((color) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.65, side: THREE.DoubleSide })
);
const smallCenterMat = new THREE.MeshStandardMaterial({ color: 0xf2cf68, roughness: 0.7 });
const smallPetalGeo = new THREE.SphereGeometry(0.055, 10, 8);
const smallCenterGeo = new THREE.SphereGeometry(0.023, 8, 6);
const budGeo = new THREE.SphereGeometry(0.025, 8, 6);
function blossom() {
  const g = new THREE.Group();
  const pm = smallFlowerMaterials[Math.floor(Math.random() * smallFlowerMaterials.length)];
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(smallPetalGeo, pm);
    p.scale.set(0.72, 0.3, 1);
    p.rotation.y = -i * Math.PI * 2 / 5;
    p.position.set(Math.cos(i * Math.PI * 2 / 5) * 0.047, 0, Math.sin(i * Math.PI * 2 / 5) * 0.047);
    g.add(p);
  }
  const center = new THREE.Mesh(smallCenterGeo, smallCenterMat);
  center.position.y = 0.016;
  g.add(center);
  return g;
}

// Đầu hoa xếp thành vòm tròn
const pink = [0xffa6c1, 0xf78fb3, 0xffb8cc, 0xf5a3c0];
const white = 0xfdfafb;
const heads = [new THREE.Vector3(0, 1.85, 0)];
for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.28; heads.push(new THREE.Vector3(Math.cos(a) * 0.5, 1.6, Math.sin(a) * 0.5)); }
for (let i = 0; i < 9; i++) { const a = (i / 9) * 6.28 + 0.35; heads.push(new THREE.Vector3(Math.cos(a) * 0.95, 1.15, Math.sin(a) * 0.95)); }
for (let i = 0; i < 5; i++) { const a = (i / 5) * 6.28 + 0.6; heads.push(new THREE.Vector3(Math.cos(a) * 0.3, 1.95, Math.sin(a) * 0.3)); }
for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.28 + 0.1; heads.push(new THREE.Vector3(Math.cos(a) * 1.3, 0.75, Math.sin(a) * 1.3)); }
const openedTulips = new Set([3, 9, 17, 25, 30]);
heads.forEach((pos, i) => bouquet.add(tulip(i % 3 === 1 || i === 0 ? white : pink[i % pink.length], pos, openedTulips.has(i) ? 1 : 0)));

// Chùm hoa nhỏ chen giữa
for (let i = 0; i < 90; i++) {
  const a = Math.random() * 6.28, r = 0.75 + Math.random() * 0.75;
  const b = blossom();
  b.position.set(Math.cos(a) * r, 1.35 + Math.random() * 0.45 - r * 0.45, Math.sin(a) * r);
  b.rotation.set(Math.random(), Math.random(), Math.random());
  bouquet.add(b);
}
// Nhánh hoa li ti có cuống cong, nụ và hoa nở xen giữa đầu tulip.
for (let i = 0; i < 36; i++) {
  const a = i * Math.PI * 2 / 36;
  const r = 0.5 + Math.random() * 0.85;
  const end = new THREE.Vector3(Math.cos(a) * r, 1.05 + Math.random() * 0.85, Math.sin(a) * r);
  const root = new THREE.Vector3(Math.cos(a) * 0.04, 0.07, Math.sin(a) * 0.04);
  const middle = new THREE.Vector3(end.x * 0.55, end.y * 0.6, end.z * 0.55);
  const twig = new THREE.CatmullRomCurve3([root, middle, end]);
  bouquet.add(new THREE.Mesh(new THREE.TubeGeometry(twig, 18, 0.004, 4, false), stemMat));
  for (let j = 0; j < 4; j++) {
    const point = twig.getPoint(0.76 + j * 0.075);
    const flower = j === 1
      ? new THREE.Mesh(budGeo, smallFlowerMaterials[i % smallFlowerMaterials.length])
      : blossom();
    flower.position.copy(point);
    flower.rotation.set(0.7 + Math.random(), a, Math.random() * 0.6);
    if (j !== 1) flower.scale.setScalar(0.45 + Math.random() * 0.25);
    bouquet.add(flower);
  }
}
// Cành nhỏ & lá dài mảnh
const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(0.07, 0.75, 0, 1.55); leafShape.quadraticCurveTo(-0.07, 0.75, 0, 0);
const leafGeo = new THREE.ShapeGeometry(leafShape);
for (let i = 0; i < 9; i++) {
  const a = (i / 9) * 6.28;
  const l = new THREE.Mesh(leafGeo, leafMat);
  l.position.copy(BIND);
  l.quaternion.setFromUnitVectors(UP, new THREE.Vector3(Math.cos(a) * 0.75, 1, Math.sin(a) * 0.75).normalize());
  bouquet.add(l);
}
// Lá tròn nhỏ quanh hoa
const roundLeaf = new THREE.CircleGeometry(0.1, 10);
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * 6.28, r = 1.05 + Math.random() * 0.2;
  const l = new THREE.Mesh(roundLeaf, leafMat);
  l.scale.y = 1.6;
  l.position.set(Math.cos(a) * r, 0.9 + Math.random() * 0.5, Math.sin(a) * r);
  l.rotation.set(Math.random() * 3, Math.random() * 3, 0);
  bouquet.add(l);
}

// Giấy gói trắng: ống dài thẳng, loe nhẹ, tà dưới xẻ nhọn như ảnh
const wrapGeo = new THREE.CylinderGeometry(0.23, 0.3, 1.7, 48, 6, true);
const wp = wrapGeo.attributes.position;
for (let i = 0; i < wp.count; i++) {
  const ang = Math.atan2(wp.getZ(i), wp.getX(i));
  const y = wp.getY(i); // -0.85..0.85
  // Gân giấy dọc nhẹ
  const f = 1 + Math.abs(Math.sin(ang * 8)) * 0.05;
  wp.setX(i, wp.getX(i) * f); wp.setZ(i, wp.getZ(i) * f);
  // Tà dưới xẻ thành mảnh nhọn chồng lên nhau
  if (y < -0.2) {
    const k = (-0.2 - y) / 0.65; // 0..1 xuống đáy
    wp.setY(i, y + Math.abs(Math.sin(ang * 5 + 0.4)) * 0.22 * k);
    const s = 1 - Math.abs(Math.sin(ang * 5 + 0.4)) * 0.1 * k;
    wp.setX(i, wp.getX(i) * s); wp.setZ(i, wp.getZ(i) * s);
  }
}
wrapGeo.computeVertexNormals();
const wrap = new THREE.Mesh(wrapGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75, side: THREE.DoubleSide }));
wrap.position.y = -0.8;
bouquet.add(wrap);
// Chùm cuống xanh ngắn lòi ra dưới đáy giấy như ảnh
const tipMat = new THREE.MeshStandardMaterial({ color: 0x3e6b35, roughness: 0.7 });
for (let i = 0; i < 8; i++) {
  const a = (i / 8) * 6.28;
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.28, 6), tipMat);
  tip.position.set(Math.cos(a) * 0.065, -1.64, Math.sin(a) * 0.065);
  tip.rotation.set(Math.sin(a) * 0.12, 0, Math.cos(a) * 0.12);
  bouquet.add(tip);
}
// Nơ hồng
const bowMat = new THREE.MeshStandardMaterial({ color: 0xf06f9a, roughness: 0.35, side: THREE.DoubleSide });
const bow = new THREE.Group();
bow.position.set(0, -0.05, 0);
const band = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 10, 40), bowMat);
band.rotation.x = Math.PI / 2;
bow.add(band);
const knot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), bowMat);
knot.position.z = 0.27;
bow.add(knot);
[-1, 1].forEach((d) => {
  const loop = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.045, 10, 24), bowMat);
  loop.scale.set(1.3, 0.75, 0.6);
  loop.position.set(d * 0.18, 0.03, 0.28);
  loop.rotation.z = d * 0.25;
  bow.add(loop);
  const tail = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.45), bowMat);
  tail.position.set(d * 0.07, -0.22, 0.28);
  tail.rotation.z = d * 0.3;
  bow.add(tail);
});
bouquet.add(bow);

// Lá bay
const floaters = [];
for (let i = 0; i < 5; i++) {
  const l = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), new THREE.MeshStandardMaterial({ color: 0x6fbf7f, side: THREE.DoubleSide }));
  l.scale.y = 1.5;
  l.userData = { a: Math.random() * 6.28, r: 1.6 + Math.random() * 0.6, y: 0.8 + Math.random() * 1.6, s: 0.3 + Math.random() * 0.4 };
  scene.add(l); floaters.push(l);
}

// Kéo để xoay, nhấn bó hoa để mở trang birthday
let dragging = false, dragged = false, lastX = 0, startX = 0, startY = 0, spin = 0;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.domElement.addEventListener("click", (event) => {
  if (dragged) return;

  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.intersectObject(bouquet, true).length) location.assign("/birthday");
});
addEventListener("pointerdown", (e) => {
  dragging = true;
  dragged = false;
  lastX = startX = e.clientX;
  startY = e.clientY;
});
addEventListener("pointerup", () => (dragging = false));
addEventListener("pointermove", (e) => {
  if (!dragging) return;
  if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) dragged = true;
  spin += (e.clientX - lastX) * 0.004;
  lastX = e.clientX;
});

const clock = new THREE.Clock();
(function animate() {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  bouquet.rotation.y += dt * 0.5 + spin;
  spin *= Math.exp(-5 * dt);
  bouquet.position.y = Math.sin(t) * 0.08;
  floaters.forEach((l) => {
    const u = l.userData; u.a += dt * u.s;
    l.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(t + u.a) * 0.2, Math.sin(u.a) * u.r);
    l.rotation.set(t * u.s, t, 0);
  });
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
