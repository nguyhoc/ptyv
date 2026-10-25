import * as THREE from "three";

// ---------- Chấm hồng bay ----------
const dots = document.getElementById("dots");
// Màn hình nhỏ: giảm số hạt cho mượt.
const lite = matchMedia("(max-width: 600px)").matches;
for (let i = 0; i < (lite ? 28 : 45); i++) {
  const d = document.createElement("div");
  d.className = "dot";
  const s = 2 + Math.random() * 6;
  d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;top:${Math.random() * 110}%;opacity:${0.3 + Math.random() * 0.6};animation-duration:${20 + Math.random() * 30}s;animation-delay:-${Math.random() * 30}s`;
  if (Math.random() < 0.4) d.classList.add("light");
  dots.appendChild(d);
}

// Hạt li ti bay nhẹ, mờ dần và xuất hiện lại ở phía dưới.
for (let i = 0; i < (lite ? 60 : 100); i++) {
  const particle = document.createElement("div");
  particle.className = i % 3 === 0 ? "particle pink" : "particle";
  const size = 1 + Math.random() * 2;
  particle.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;top:${35 + Math.random() * 65}%;--sway:${Math.random() * 140 - 70}px;--alpha:${0.35 + Math.random() * 0.45};animation-duration:${12 + Math.random() * 16}s;animation-delay:-${Math.random() * 28}s`;
  dots.appendChild(particle);
}

// ---------- Sticker mèo ----------
// Vị trí [trái %, trên %, số ảnh mèo] — tránh khu vực tiêu đề, nút nhạc và dòng gợi ý.
const spots = [[10, 24, 1], [72, 20, 2], [26, 76, 1], [80, 56, 2], [5, 52, 2], [62, 70, 1]];
const hearts = ["💗", "🌸", "✨", "💖"];
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
  s.innerHTML = `<img src="/wed3/cat${n}.png" alt="mèo dễ thương">`;
  s.onclick = (e) => {
    for (let k = 0; k < 5; k++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      h.style.left = e.clientX + Math.random() * 60 - 30 + "px";
      h.style.top = e.clientY + "px";
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1400);
    }
  };
  cats.appendChild(s);
});

// ---------- Nhạc nền ----------
const musicBtn = document.getElementById("music");
const musicLabel = musicBtn.querySelector(".music-label");
const audio = new Audio("/public/music/bd2.mp3");
audio.loop = true;
let playing = false;
function setMusicUI() {
  musicBtn.setAttribute("aria-pressed", String(playing));
  musicBtn.setAttribute("aria-label", playing ? "Tắt nhạc" : "Bật nhạc");
  musicLabel.textContent = playing ? "Tắt nhạc" : "Bật nhạc";
}
// Tạm dừng nhạc khi chuyển tab, tiếp tục khi quay lại.
document.addEventListener("visibilitychange", () => {
  if (document.hidden && playing) audio.pause();
  else if (playing) audio.play().catch((error) => console.error("Không thể tiếp tục phát nhạc nền.", error));
});
musicBtn.onclick = async () => {
  if (audio.paused) {
    try {
      await audio.play();
      playing = true;
    } catch (error) {
      playing = false;
      console.error("Không thể phát nhạc nền.", error);
    }
  } else {
    audio.pause();
    playing = false;
  }
  setMusicUI();
};

// ---------- Cảnh 3D ----------
const container = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100);
// Camera quay quanh bó hoa: pitch = góc nhìn lên/xuống (0 = ngang tầm, ~1.5 = nhìn thẳng từ trên xuống).
// Màn hình dọc (điện thoại): lùi camera để cả bó hoa lọt khung.
let lookY = 0, bouquetHeight = 0, bouquetRadius = 0;
const PITCH_MIN = -0.25, PITCH_MAX = 1.5;
let camDist = 11.5, pitch = 0.05, pitchTarget = 0.05;
function placeCamera() {
  camera.position.set(0, lookY + Math.sin(pitch) * camDist, Math.cos(pitch) * camDist);
  camera.lookAt(0, lookY, 0);
}
function fitCamera() {
  const aspect = innerWidth / innerHeight;
  camera.aspect = aspect;
  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
  const verticalExtent = bouquetHeight * Math.cos(pitch) + bouquetRadius * 2 * Math.abs(Math.sin(pitch));
  const horizontalExtent = bouquetRadius * 2;
  camDist = Math.max(
    11.5,
    (horizontalExtent / (2 * aspect) + 0.8) / Math.tan(halfFov),
    (verticalExtent / 2 + 0.8) / Math.tan(halfFov)
  );
  placeCamera();
  camera.updateProjectionMatrix();
}

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
function tulip(color, head, openness = 0, size = 1, tiltX = 0, tiltZ = 0) {
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
  h.scale.setScalar(size);
  h.rotation.y = Math.random() * 6.28;
  h.rotation.x = tiltX;
  h.rotation.z = tiltZ;
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

// ---------- Bố cục tự nhiên ----------
// Số ngẫu nhiên có hạt giống: mỗi lần mở trang bó hoa đều giống nhau. Đổi số 2026 để ra một bố cục khác.
function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(2026);
const GOLDEN = 2.399963; // góc vàng: rải đều mà không thành vòng tròn đều tăm tắp

// ---------- Hoa nhỏ: dựng bằng InstancedMesh (hàng trăm bông nhưng chỉ vài lần vẽ) ----------
const smallPetalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65, side: THREE.DoubleSide });
const smallCenterMat = new THREE.MeshStandardMaterial({ color: 0xf2cf68, roughness: 0.7 });
const smallPetalGeo = new THREE.SphereGeometry(0.055, 10, 8);
const smallCenterGeo = new THREE.SphereGeometry(0.023, 8, 6);
const budGeo = new THREE.SphereGeometry(0.025, 8, 6);
const smallTones = [0xffffff, 0xffffff, 0xfff0f5, 0xffe3ec, 0xffc8d8, 0xffb3c9].map((c) => new THREE.Color(c));
const MAX_BLOSSOMS = 1200, MAX_BUDS = 400;
const petalMesh = new THREE.InstancedMesh(smallPetalGeo, smallPetalMat, MAX_BLOSSOMS * 5);
const centerMesh = new THREE.InstancedMesh(smallCenterGeo, smallCenterMat, MAX_BLOSSOMS);
const budMesh = new THREE.InstancedMesh(budGeo, smallPetalMat, MAX_BUDS);
let blossomCount = 0, budCount = 0;
const _obj = new THREE.Object3D(), _part = new THREE.Object3D();
const _group = new THREE.Matrix4(), _m = new THREE.Matrix4(), _spin = new THREE.Quaternion();

// Hoa 5 cánh, quay mặt về hướng dir, kích thước scale.
function addBlossom(pos, dir, scale) {
  if (blossomCount >= MAX_BLOSSOMS) return;
  _obj.position.copy(pos);
  _obj.quaternion.setFromUnitVectors(UP, dir).multiply(_spin.setFromAxisAngle(UP, rnd() * 6.28));
  _obj.scale.setScalar(scale);
  _obj.updateMatrix();
  _group.copy(_obj.matrix);
  const tone = smallTones[Math.floor(rnd() * smallTones.length)];
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    _part.position.set(Math.cos(a) * 0.047, 0, Math.sin(a) * 0.047);
    _part.rotation.set(0, -a, 0);
    _part.scale.set(0.72, 0.3, 1);
    _part.updateMatrix();
    const idx = blossomCount * 5 + k;
    petalMesh.setMatrixAt(idx, _m.multiplyMatrices(_group, _part.matrix));
    petalMesh.setColorAt(idx, tone);
  }
  _part.position.set(0, 0.016, 0);
  _part.rotation.set(0, 0, 0);
  _part.scale.setScalar(1);
  _part.updateMatrix();
  centerMesh.setMatrixAt(blossomCount, _m.multiplyMatrices(_group, _part.matrix));
  blossomCount++;
}
function addBud(pos, scale) {
  if (budCount >= MAX_BUDS) return;
  _obj.position.copy(pos);
  _obj.quaternion.identity();
  _obj.scale.setScalar(scale);
  _obj.updateMatrix();
  budMesh.setMatrixAt(budCount, _obj.matrix);
  budMesh.setColorAt(budCount, smallTones[Math.floor(rnd() * smallTones.length)]);
  budCount++;
}

// ---------- Tulip: rải theo xoắn ốc rồi xô lệch nhẹ (khác nhau về cao thấp, to nhỏ, nghiêng, độ nở) ----------
const pinkTones = [0xffa6c1, 0xf78fb3, 0xffb8cc, 0xf5a3c0, 0xff97b5, 0xffc9d8];
const white = 0xfdfafb;
const TULIPS = 34;
for (let i = 0; i < TULIPS; i++) {
  const u = (i + 0.5) / TULIPS;
  const r = 1.5 * Math.sqrt(u) * (0.94 + rnd() * 0.12);
  const a = i * GOLDEN + (rnd() - 0.5) * 0.35;
  const lift = rnd() < 0.18 ? 0.18 + rnd() * 0.12 : 0; // vài bông nhô cao hơn hẳn
  const y = 2.0 - 1.15 * Math.pow(r / 1.5, 1.7) + (rnd() - 0.5) * 0.22 + lift;
  const head = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
  const color = rnd() < 0.24 ? white : pinkTones[Math.floor(rnd() * pinkTones.length)];
  const open = u > 0.3 && rnd() < 0.3 ? 1 : 0; // bông nở xòe nằm ở vòng ngoài
  bouquet.add(tulip(color, head, open, 0.92 + rnd() * 0.2, (rnd() - 0.5) * 0.36, (rnd() - 0.5) * 0.36));
}

// Hoa nhỏ lấp khoảng trống giữa các tulip
for (let i = 0; i < 90; i++) {
  const a = rnd() * 6.28, r = 0.7 + rnd() * 0.85;
  const y = 2.0 - 1.15 * Math.pow(r / 1.5, 1.7) - 0.1 - rnd() * 0.45;
  const pos = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
  const dir = new THREE.Vector3(Math.cos(a) * 0.7 + rnd() - 0.5, 0.8, Math.sin(a) * 0.7 + rnd() - 0.5).normalize();
  addBlossom(pos, dir, 0.55 + rnd() * 0.45);
}

// ---------- Cành hoa nhỏ: nhiều nhánh cong mảnh, đầu cành nở chùm hoa li ti và nụ ----------
const TWIGS = 110;
const side = new THREE.Vector3(), out = new THREE.Vector3(), dirV = new THREE.Vector3();
for (let i = 0; i < TWIGS; i++) {
  const a = i * GOLDEN + (rnd() - 0.5) * 0.5;
  const airy = rnd() < 0.35; // cành vươn ra ngoài và lên cao như hoa baby, làm đường viền bó hoa mềm hơn
  const r = airy ? 0.9 + rnd() * 1.05 : 0.35 + rnd() * 1.05;
  const dome = 2.0 - 1.15 * Math.pow(r / 1.5, 1.7);
  const endY = airy ? dome + 0.55 + rnd() * 0.75 : dome + 0.1 + rnd() * 0.55;
  const end = new THREE.Vector3(Math.cos(a) * r, endY, Math.sin(a) * r);
  const root = new THREE.Vector3(Math.cos(a) * 0.04, 0.07, Math.sin(a) * 0.04);
  side.set(-Math.sin(a), 0, Math.cos(a)).multiplyScalar((rnd() - 0.5) * 0.3);
  const middle = new THREE.Vector3(end.x * 0.5 + side.x, end.y * 0.52, end.z * 0.5 + side.z);
  const twig = new THREE.CatmullRomCurve3([root, middle, end]);
  bouquet.add(new THREE.Mesh(new THREE.TubeGeometry(twig, 18, 0.004, 4, false), stemMat));
  const n = 4 + Math.floor(rnd() * 4); // 4–7 bông trên mỗi cành
  for (let j = 0; j < n; j++) {
    const t = Math.min(0.58 + 0.42 * (j / (n - 1)) + (rnd() - 0.5) * 0.04, 1);
    const p = twig.getPoint(t);
    p.x += (rnd() - 0.5) * 0.05; p.y += (rnd() - 0.5) * 0.05; p.z += (rnd() - 0.5) * 0.05;
    if (j % 3 === 1) {
      addBud(p, 0.8 + rnd() * 0.7);
    } else {
      out.set(p.x, 0, p.z).normalize().multiplyScalar(0.6);
      dirV.set(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.6).add(out);
      dirV.y += 0.8;
      addBlossom(p, dirV.normalize(), (0.55 + rnd() * 0.5) * (j === n - 1 ? 1.2 : 1));
    }
  }
}
petalMesh.count = blossomCount * 5;
centerMesh.count = blossomCount;
budMesh.count = budCount;
[petalMesh, centerMesh, budMesh].forEach((mesh) => {
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.frustumCulled = false;
  bouquet.add(mesh);
});

// Cành nhỏ & lá dài mảnh
const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0); leafShape.quadraticCurveTo(0.07, 0.75, 0, 1.55); leafShape.quadraticCurveTo(-0.07, 0.75, 0, 0);
const leafGeo = new THREE.ShapeGeometry(leafShape);
for (let i = 0; i < 15; i++) {
  const a = i * GOLDEN + rnd();
  const lean = 0.55 + rnd() * 0.65;
  const l = new THREE.Mesh(leafGeo, leafMat);
  l.position.copy(BIND);
  l.quaternion.setFromUnitVectors(UP, new THREE.Vector3(Math.cos(a) * lean, 1, Math.sin(a) * lean).normalize());
  l.rotateY(rnd() * Math.PI);
  l.scale.setScalar(0.7 + rnd() * 0.4);
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

petalMesh.computeBoundingBox();
centerMesh.computeBoundingBox();
budMesh.computeBoundingBox();
bouquet.updateMatrixWorld(true);
const bouquetBounds = new THREE.Box3().setFromObject(bouquet);
const bouquetSize = bouquetBounds.getSize(new THREE.Vector3());
bouquetHeight = bouquetSize.y;
bouquetRadius = Math.max(
  Math.hypot(bouquetBounds.min.x, bouquetBounds.min.z),
  Math.hypot(bouquetBounds.min.x, bouquetBounds.max.z),
  Math.hypot(bouquetBounds.max.x, bouquetBounds.min.z),
  Math.hypot(bouquetBounds.max.x, bouquetBounds.max.z)
);
lookY = (bouquetBounds.min.y + bouquetBounds.max.y) / 2;
fitCamera();

// Lá bay
const floaters = [];
for (let i = 0; i < 5; i++) {
  const l = new THREE.Mesh(new THREE.CircleGeometry(0.12, 12), new THREE.MeshStandardMaterial({ color: 0x6fbf7f, side: THREE.DoubleSide }));
  l.scale.y = 1.5;
  l.userData = { a: Math.random() * 6.28, r: 1.6 + Math.random() * 0.6, y: 0.8 + Math.random() * 1.6, s: 0.3 + Math.random() * 0.4 };
  scene.add(l); floaters.push(l);
}

// Kéo ngang để xoay bó hoa, kéo dọc để nghiêng góc nhìn; nhấp đúp để về góc ngang.
const AUTO_ROTATE = true; // đặt false nếu không muốn bó hoa tự xoay khi để yên
const IDLE_MS = 0;
let dragging = false, dragged = false, returning = false, startX = 0, startY = 0, lastX = 0, lastY = 0, autoK = 0, lastInput = -Infinity;
let isNavigating = false;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  isNavigating = false;
  document.body.classList.remove("is-transitioning");
  container.classList.remove("dragging");
});
const stopDrag = () => {
  dragging = false;
  container.classList.remove("dragging");
  lastInput = performance.now();
  if (dragged) {
    returning = true;
    pitchTarget = 0.05;
  }
};
container.addEventListener("pointerdown", (e) => {
  dragging = true; lastX = e.clientX; lastY = e.clientY; lastInput = performance.now();
  startX = e.clientX; startY = e.clientY; dragged = false;
  autoK = 0;
  container.setPointerCapture(e.pointerId);
  container.classList.add("dragging");
});
container.addEventListener("pointerup", (e) => {
  stopDrag();
  if (dragged || isNavigating) return;

  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((e.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.intersectObject(bouquet, true).length) {
    isNavigating = true;
    document.body.classList.add("is-transitioning");
    const delay = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 620;
    setTimeout(() => location.assign("/birthday"), delay);
  }
});
container.addEventListener("pointercancel", stopDrag);
container.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  if (Math.hypot(e.clientX - startX, e.clientY - startY) > 5) dragged = true;
  const now = performance.now();
  const turn = (e.clientX - lastX) * 0.009;
  bouquet.rotation.y += turn;
  pitchTarget = Math.min(PITCH_MAX, Math.max(PITCH_MIN, pitchTarget + (e.clientY - lastY) * 0.006));
  lastX = e.clientX; lastY = e.clientY; lastInput = now;
});
container.addEventListener("dblclick", () => { pitchTarget = 0.05; });

const clock = new THREE.Clock();
let shown = false;
(function animate() {
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  // Lúc mở trang: bó hoa nở ra nhẹ nhàng và xoay nhanh dần chậm lại.
  const intro = Math.min(t / 1.6, 1), ease = 1 - Math.pow(1 - intro, 3);
  bouquet.scale.setScalar(0.7 + 0.3 * ease);
  const nowMs = performance.now();
  if (returning) {
    const angle = Math.atan2(Math.sin(bouquet.rotation.y), Math.cos(bouquet.rotation.y));
    bouquet.rotation.y -= angle * (1 - Math.exp(-8 * dt));
    if (Math.abs(angle) < 0.005) {
      bouquet.rotation.y = 0;
      returning = false;
    }
  }
  const idle = AUTO_ROTATE && !dragging && !returning && nowMs - lastInput >= IDLE_MS;
  autoK = idle ? Math.min(autoK + dt * 0.5, 1) : 0; // tự xoay tăng dần, không giật
  bouquet.rotation.y += (autoK * 0.4 + (1 - ease) * 4) * dt;
  bouquet.position.y = Math.sin(t) * 0.08;
  floaters.forEach((l) => {
    const u = l.userData; u.a += dt * u.s;
    l.position.set(Math.cos(u.a) * u.r, u.y + Math.sin(t + u.a) * 0.2, Math.sin(u.a) * u.r);
    l.rotation.set(t * u.s, t, 0);
  });
  pitch += (pitchTarget - pitch) * (1 - Math.exp(-14 * dt));
  placeCamera();
  renderer.render(scene, camera);
  // Khung hình đầu tiên đã vẽ xong: gỡ màn hình chờ.
  if (!shown) { shown = true; document.body.classList.add("ready"); }
  requestAnimationFrame(animate);
})();

addEventListener("resize", () => {
  fitCamera();
  renderer.setSize(innerWidth, innerHeight);
});
