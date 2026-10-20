import * as THREE from "three";

// ---------- Chấm hồng bay ----------
const dots = document.getElementById("dots");
for (let i = 0; i < 45; i++) {
  const d = document.createElement("div");
  d.className = "dot";
  const s = 2 + Math.random() * 6;
  d.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;top:${Math.random() * 110}%;opacity:${0.3 + Math.random() * 0.6};animation-duration:${20 + Math.random() * 30}s;animation-delay:-${Math.random() * 30}s`;
  if (Math.random() < 0.4) d.style.background = "#fff";
  dots.appendChild(d);
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
  s.style.animationDelay = -i + "s";
  s.innerHTML = `<img src="/wed1/cat${n}.png" alt="mèo dễ thương">`;
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

// ---------- Nhạc (tiếng chuông nhẹ) ----------
const MUSIC_URL = "/public/music/bd2.mp3"; // Dán link trực tiếp tới file .mp3, .ogg hoặc .wav vào đây.
const musicButton = document.getElementById("music");
const musicIcon = musicButton.querySelector(".music-icon");
let audio, audioTrack, playing = false, timer;
function updateMusicButton() {
  musicIcon.textContent = playing ? "🔊" : "🔇";
  musicButton.setAttribute("aria-pressed", String(playing));
}

musicButton.onclick = async () => {
  if (MUSIC_URL.trim()) {
    audioTrack ??= new Audio(MUSIC_URL.trim());
    audioTrack.loop = true;
    if (audioTrack.paused) {
      try {
        await audioTrack.play();
        playing = true;
      } catch (error) {
        console.error("Không thể phát link nhạc.", error);
        playing = false;
      }
    } else {
      audioTrack.pause();
      playing = false;
    }
    updateMusicButton();
    return;
  }

  audio ??= new AudioContext();
  playing = !playing;
  updateMusicButton();
  if (!playing) return clearInterval(timer);
  const notes = [523, 659, 784, 659, 587, 698, 880, 698];
  let i = 0;
  timer = setInterval(() => {
    const o = audio.createOscillator(), g = audio.createGain();
    o.type = "sine"; o.frequency.value = notes[i++ % notes.length];
    g.gain.setValueAtTime(0.15, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 1.2);
    o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + 1.2);
  }, 500);
};

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

// Một cánh tulip: mặt cong, đầu nhọn
function petalGeometry() {
  const g = new THREE.PlaneGeometry(0.5, 1, 12, 16);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    let x = p.getX(i), y = p.getY(i) + 0.5; // y: 0..1
    // Búp tulip thon cao: thân đầy, đỉnh thu nhọn dần
    const width = Math.pow(Math.sin(Math.min(y, 0.99) * Math.PI * 0.88 + 0.1), 0.5) * 1.2;
    const tip = y > 0.72 ? Math.max(0.04, 1 - Math.pow((y - 0.72) / 0.28, 1.4)) : 1;
    x *= width * tip;
    const z = -Math.pow(x * 2.4, 2) * 0.34 + Math.sin(y * Math.PI) * 0.16 - y * y * 0.1;
    p.setXYZ(i, x, y * 1.05, z);
  }
  g.computeVertexNormals();
  return g;
}
const petalGeo = petalGeometry();
const stemMat = new THREE.MeshStandardMaterial({ color: 0x5f9e56, roughness: 0.6 });
const leafMat = new THREE.MeshStandardMaterial({ color: 0x6fae6a, roughness: 0.5, side: THREE.DoubleSide });
const UP = new THREE.Vector3(0, 1, 0);
const BIND = new THREE.Vector3(0, 0.12, 0);

// Tulip từ điểm buộc đến vị trí đầu hoa
function tulip(color, head) {
  const g = new THREE.Group();
  const dir = head.clone().sub(BIND);
  const len = dir.length();
  g.position.copy(BIND);
  g.quaternion.setFromUnitVectors(UP, dir.normalize());
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.022, len, 6), stemMat);
  stem.position.y = len / 2;
  g.add(stem);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, side: THREE.DoubleSide, emissive: color, emissiveIntensity: 0.12 });
  const h = new THREE.Group();
  h.position.y = len - 0.15;
  h.scale.setScalar(1.0);
  h.rotation.y = Math.random() * 6.28;
  for (let i = 0; i < 6; i++) {
    const inner = i >= 3;
    const p = new THREE.Mesh(petalGeo, mat);
    const a = (i % 3) * (Math.PI * 2 / 3) + (inner ? Math.PI / 3 : 0);
    p.rotation.y = a;
    const r = inner ? 0.05 : 0.11;
    p.position.set(Math.sin(a) * r, inner ? 0.02 : 0, Math.cos(a) * r);
    p.scale.setScalar(inner ? 0.92 : 1);
    h.add(p);
  }
  // Hai nhánh lá nhỏ
  g.add(h);
  return g;
}

function blossom() {
  const g = new THREE.Group();
  const pm = new THREE.MeshStandardMaterial({ color: Math.random() < 0.5 ? 0xffffff : 0xffc8d8, roughness: 0.5 });
  const cm = new THREE.MeshStandardMaterial({ color: 0xffd84d });
  for (let i = 0; i < 5; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), pm);
    p.scale.set(1, 0.4, 1);
    p.position.set(Math.cos(i * 1.256) * 0.06, 0, Math.sin(i * 1.256) * 0.06);
    g.add(p);
  }
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), cm));
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
heads.forEach((pos, i) => bouquet.add(tulip(i % 3 === 1 || i === 0 ? white : pink[i % pink.length], pos)));

// Chùm hoa nhỏ chen giữa
for (let i = 0; i < 90; i++) {
  const a = Math.random() * 6.28, r = 0.75 + Math.random() * 0.75;
  const b = blossom();
  b.position.set(Math.cos(a) * r, 1.35 + Math.random() * 0.45 - r * 0.45, Math.sin(a) * r);
  b.rotation.set(Math.random(), Math.random(), Math.random());
  bouquet.add(b);
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
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 0.4, 6), tipMat);
  tip.position.set(Math.cos(a) * 0.1, -1.95, Math.sin(a) * 0.1);
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

// Kéo để xoay
let dragging = false, lastX = 0, spin = 0;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
renderer.domElement.addEventListener("click", (event) => {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.intersectObject(bouquet, true).length) location.assign("/birthday");
});
addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; });
addEventListener("pointerup", () => (dragging = false));
addEventListener("pointermove", (e) => { if (dragging) { spin += (e.clientX - lastX) * 0.004; lastX = e.clientX; } });

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
