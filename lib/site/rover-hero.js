// rover-hero.js — 2D tank-track rover + 3D drone searchlight animation for a hero section.
// Requires three.js:  npm i three   (or import from a CDN, see PROMPT.md)
import * as THREE from 'three';

/**
 * mountRoverHero({ wrapper, highlight, scanLine, target, size, speed, drone })
 *  wrapper   – hero container (gets position:relative if static). Canvas overlays it.
 *  highlight – the purple "online stores" box. Rover drives on its TOP edge.
 *  scanLine  – element the drone sweeps its searchlight over (e.g. "that grow your" line).
 *  target    – element the drone "finds" (e.g. the "Start a project" button).
 *  scaleEl  – optional element whose width sets the rover's scale (defaults to highlight).
 *  size 0.6–1.5, speed 0.4–2, drone true/false.
 * Sets CSS var --rh on wrapper = clear space the rover needs above the highlight.
 * Returns destroy().
 */
export function mountRoverHero({ wrapper, highlight, scanLine, target, scaleEl, size = 1, speed = 1, drone = true }) {
  const opts = { size, speed, drone };
  const S = { t: 0 };
  let dead = false, raf = 0;
  if (getComputedStyle(wrapper).position === 'static') wrapper.style.position = 'relative';
  const stage = document.createElement('div');
  stage.style.cssText = 'position:absolute;inset:0;z-index:5;pointer-events:none;overflow:hidden';
  const ringEl = document.createElement('div');
  ringEl.style.cssText = 'position:absolute;z-index:6;pointer-events:none;opacity:0;border:2px solid #b06be8;border-radius:999px;box-sizing:border-box';
  ringEl.innerHTML = '<div style="position:absolute;left:50%;bottom:calc(100% + 8px);transform:translateX(-50%);background:#1f1814;color:#e8e0d6;font:500 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.08em;padding:5px 9px;border-radius:999px;white-space:nowrap">TARGET FOUND</div>';
  wrapper.appendChild(stage); wrapper.appendChild(ringEl);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) opts.speed = 0;

  const PI = Math.PI;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
  stage.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(0, 100, 0, -100, -3000, 3000);
  cam.position.z = 1000;
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x5a4a40, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-0.5, 0.9, 0.8); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc58cff, 1.4); rim.position.set(0.8, 0.3, -0.6); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffe2c4, 0.6); fill.position.set(0.6, -0.2, 1); scene.add(fill);

  const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: o.r ?? 0.55, metalness: o.m ?? 0.2, emissive: o.e ?? 0, emissiveIntensity: o.ei ?? 1, transparent: o.op != null, opacity: o.op ?? 1, depthWrite: o.op == null });
  const white = M(0xece7df, { r: 0.42, m: 0.2 }), dark = M(0x2b2522, { r: 0.6, m: 0.35 }), black = M(0x0f0d0c, { r: 0.9 });
  const gold = M(0xd3a43f, { r: 0.28, m: 0.9 }), purple = M(0xb06be8, { r: 0.4, m: 0.15 }), steel = M(0x9d9893, { r: 0.3, m: 0.85 });
  const rubber = M(0x1c1917, { r: 0.92 }), lens = M(0x08080c, { r: 0.1, m: 0.6, e: 0xb06be8, ei: 0.9 });
  const red = M(0xff3b4a, { e: 0xff2030, ei: 2 }), lamp = M(0xfff0c8, { e: 0xffe6a0, ei: 2.2 });
  const glow = M(0x332c28, { e: 0xffd56a, ei: 0 });
  const box = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  const cyl = (a, b, h, m, s = 20) => new THREE.Mesh(new THREE.CylinderGeometry(a, b, h, s), m);
  const put = (p, o, x = 0, y = 0, z = 0) => { o.position.set(x, y, z); p.add(o); return o; };
  const bar = (p, ax, ay, bx, by, z, t, m) => { const L = Math.hypot(bx - ax, by - ay); const b = put(p, box(L, t, t, m), (ax + bx) / 2, (ay + by) / 2, z); b.rotation.z = Math.atan2(by - ay, bx - ax); return b; };
  const radialTex = (stops) => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(s => gr.addColorStop(s[0], s[1])); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };

  // ROVER (flat 2D side view, tank tracks)
  const F = c => new THREE.MeshBasicMaterial({ color: c });
  const fw = F(0xf4efe8), fd = F(0x241e1b), fg = F(0xd6a440), fp = F(0xb06be8), fs = F(0x8f8984), fm = F(0x4a403a), fl = F(0xfff1c2), fr = F(0xff3b4a), fe = F(0x0f0d0c);
  const roverPos = new THREE.Group(); scene.add(roverPos);
  const pitch = put(roverPos, new THREE.Group(), 0, 50, 0);
  const yawG = put(pitch, new THREE.Group(), 0, -50, 0);
  const dustTex = radialTex([[0, 'rgba(150,128,110,0.7)'], [1, 'rgba(150,128,110,0)']]);
  const dust = Array.from({ length: 14 }, () => { const d = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: dustTex, transparent: true, depthWrite: false, opacity: 0 })); d.visible = false; scene.add(d); return { m: d, life: 0, vx: 0, vy: 0, sz: 0 }; });
  const burst = (x, y, s) => dust.forEach((d, i) => { const dir = i % 2 ? 1 : -1; d.life = 0.9 + Math.random() * 0.4; d.vx = dir * (40 + Math.random() * 110) * s; d.vy = (10 + Math.random() * 40) * s; d.sz = (14 + Math.random() * 18) * s; d.m.position.set(x + dir * Math.random() * 40 * s, y + 4 * s, 200); d.m.visible = true; });
  const shadow = put(yawG, new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: radialTex([[0, 'rgba(31,24,20,0.45)'], [1, 'rgba(31,24,20,0)']]), transparent: true, depthWrite: false })), 0, 0, -60);
  shadow.scale.set(150, 8, 1);
  const circ = (r, m, seg = 32) => new THREE.Mesh(new THREE.CircleGeometry(r, seg), m);
  const TA = 44, TR = 12.5, TY = 12.5;
  const stadium = (r) => { const s = new THREE.Shape(); s.absarc(TA, TY, r, PI / 2, -PI / 2, true); s.absarc(-TA, TY, r, -PI / 2, PI / 2, true); return new THREE.Mesh(new THREE.ShapeGeometry(s, 24), null); };
  const track = put(yawG, new THREE.Group(), 0, 0, 40);
  const tOut = put(track, stadium(TR)); tOut.material = fd;
  const tIn = put(track, stadium(TR - 3.2), 0, 0, 0.2); tIn.material = fm;
  const roadWheels = [];
  [[-TA, TY, 8.2], [TA, TY, 8.2], [-22, 8.6, 6], [0, 8.6, 6], [22, 8.6, 6]].forEach(([x, y, r]) => {
    const g = put(track, new THREE.Group(), x, y, 0.4); roadWheels.push([g, r]);
    put(g, circ(r, fs)); put(g, circ(r * 0.62, fd), 0, 0, 0.1); put(g, circ(r * 0.3, fp), 0, 0, 0.3);
    for (let i = 0; i < 3; i++) put(g, box(r * 1.15, 1.3, 0.1, fs), 0, 0, 0.2).rotation.z = i * PI / 3;
  });
  [-34, -11, 11, 34].forEach(x => put(track, circ(2.4, fs), x, TY + 7.6, 0.4));
  const P = 4 * TA + 2 * PI * TR, NC = 34, cleats = [];
  for (let i = 0; i < NC; i++) cleats.push(put(track, box(3.2, 2.6, 0.1, fd), 0, 0, -0.1));
  const posAt = (u) => {
    u = ((u % P) + P) % P;
    if (u < 2 * TA) return [-TA + u, TY + TR, PI / 2];
    u -= 2 * TA; if (u < PI * TR) { const th = PI / 2 - u / TR; return [TA + TR * Math.cos(th), TY + TR * Math.sin(th), th]; }
    u -= PI * TR; if (u < 2 * TA) return [TA - u, TY - TR, -PI / 2];
    u -= 2 * TA; const th = -PI / 2 - u / TR; return [-TA + TR * Math.cos(th), TY + TR * Math.sin(th), th];
  };
  const setTrack = (dist) => {
    cleats.forEach((c, i) => { const [x, y, n] = posAt(i * P / NC + dist); c.position.set(x + Math.cos(n) * 0.9, y + Math.sin(n) * 0.9, -0.1); c.rotation.z = n - PI / 2; });
    roadWheels.forEach(([g, r]) => g.rotation.z = -dist / r);
  };
  const body = put(yawG, new THREE.Group());
  put(body, box(98, 6, 1, fd), 0, 27, 20);
  put(body, box(108, 24, 1, fd), 0, 42, -30);
  put(body, box(104, 20, 54, fw), 0, 42, 0);
  put(body, box(100, 4, 1, fg), 0, 30.5, 28);
  put(body, box(112, 3.4, 60, fd), 0, 53.5, 0);
  put(body, box(84, 2.8, 1, fp), -4, 45, 28);
  put(body, box(36, 6, 1, fd), -20, 38.5, 28);
  [8, 16, 24].forEach(x => put(body, box(4, 6, 1, fd), x, 38.5, 28));
  put(body, box(2.4, 6, 1, fl), 51.6, 46, 28);
  put(body, box(26, 0.8, 26, fe), -8, 55.2, 0);
  const lidPivot = put(body, new THREE.Group(), -21, 55.4, 31);
  put(lidPivot, box(28, 4, 1, fd), 13, 1, -1);
  put(lidPivot, box(26, 2, 1, fw), 13, 1, 0);
  put(lidPivot, box(14, 1, 1, fp), 13, 1, 0.5);
  const hatchM = put(body, new THREE.Object3D(), -8, 54, 0);
  const rtg = put(body, new THREE.Group(), -60, 52, 10); rtg.rotation.z = 0.85;
  put(rtg, box(18, 32, 1, fd), 0, 0, -1);
  put(rtg, box(14, 30, 1, fm));
  for (let i = -2; i <= 2; i++) put(rtg, box(18, 1.4, 1, fs), 0, i * 5.5, 0.5);
  put(rtg, box(16, 2.4, 1, fs), 0, 15.5, 0.5);
  put(body, box(4.6, 44, 1, fd), 38, 76, 13);
  put(body, box(2.6, 42, 1, fs), 38, 76, 14);
  const head = put(body, new THREE.Group(), 38, 98, 14);
  put(head, box(26, 13, 1, fd), 0, 0, -1);
  put(head, box(24, 11, 1, fw));
  put(head, box(9, 7, 1, fd), 6.5, 0.2, 0.5);
  put(head, circ(2.6, fe), 4.6, 0.2, 1); put(head, circ(1.3, fp), 4.6, 0.2, 1.2);
  put(head, circ(1.8, fe), 9, 0.2, 1);
  const headLed = put(head, circ(1.2, fr), -8, 3, 1);
  put(body, box(7, 3, 1, fd), 8, 56.5, 12);
  put(body, box(4.4, 12, 1, fd), 8, 62, 12); put(body, box(2.4, 11, 1, fs), 8, 62, 12.2);
  const yoke = put(body, new THREE.Group(), 8, 68, 12);
  put(yoke, box(10, 3, 1, fd), 0, 0, 0); put(yoke, box(2.6, 7, 1, fd), -3.8, 2.5, 0); put(yoke, box(2.6, 7, 1, fd), 3.8, 2.5, 0);
  const dish = put(yoke, new THREE.Group(), 0, 5, 0.5);
  put(dish, circ(3, fd), 0, 0, 0); put(dish, circ(1.4, fs), 0, 0, 0.1);
  const cup = (w, d, t) => { const s = new THREE.Shape(); s.moveTo(-w, 0); s.quadraticCurveTo(0, -2 * d, w, 0); s.lineTo(w - t, t * 0.5); s.quadraticCurveTo(0, -2 * d + t * 1.6, -(w - t), t * 0.5); s.closePath(); return new THREE.ShapeGeometry(s, 20); };
  put(dish, new THREE.Mesh(cup(17.5, 7.5, 4.2), fd), 0, 6, 0.2);
  put(dish, new THREE.Mesh(cup(16, 6.2, 2.4), fw), 0, 6.3, 0.3);
  put(dish, box(6, 2.4, 1, fd), 0, 1.6, 0.25);
  for (let i = -2; i <= 2; i++) if (i) put(dish, box(0.6, 2.6, 0.1, fs), i * 5.5, 4.6 + Math.abs(i) * 1.6, 0.4);
  bar(dish, -14.5, 6.6, 0, 19, 0.5, 0.9, fd); bar(dish, 14.5, 6.6, 0, 19, 0.5, 0.9, fd); bar(dish, 0, 1, 0, 19, 0.5, 1, fs);
  put(dish, box(4.6, 3.6, 1, fd), 0, 19.5, 0.6); put(dish, box(2.4, 1.6, 1, fp), 0, 19.1, 0.7);
  const dishLed = put(dish, circ(1, fr), 0, 22, 0.8);
  put(body, box(1, 22, 1, fd), -36, 66, 12); put(body, circ(1.6, fd), -36, 77.5, 12.1);
  put(body, box(3, 4, 1, fd), -36, 56, 12);
  const shoulder = put(body, new THREE.Group(), 54, 38, 32);
  put(shoulder, circ(4.6, fd), 0, 0, 0.3); put(shoulder, circ(2, fs), 0, 0, 0.4);
  put(shoulder, box(31, 5.6, 0.2, fd), 15, 0, 0); put(shoulder, box(30, 3.6, 0.2, fw), 15, 0, 0.1);
  const elbow = put(shoulder, new THREE.Group(), 30, 0, 0.5);
  put(elbow, circ(3.8, fd), 0, 0, 0.3); put(elbow, circ(1.6, fp), 0, 0, 0.4);
  put(elbow, box(27, 5, 0.2, fd), 13, 0, 0); put(elbow, box(26, 3, 0.2, fw), 13, 0, 0.1);
  const wrist = put(elbow, new THREE.Group(), 26, 0, 0.5);
  put(wrist, box(9, 9, 0.2, fd), 3.5, 0, 0); put(wrist, box(7, 7, 0.2, fm), 3.5, 0, 0.1);
  const drill = put(wrist, new THREE.Group(), 11, 0, 0);
  put(drill, box(9, 2.6, 0.2, fs)); 
  for (let i = 0; i < 3; i++) put(drill, box(1, 3.2, 0.2, fd), -3 + i * 3, 0, 0.1);
  // DRONE
  const dronePos = new THREE.Group(); scene.add(dronePos);
  const dTilt = put(dronePos, new THREE.Group()); dTilt.rotation.x = 0.42;
  const dModel = put(dTilt, new THREE.Group()); dModel.rotation.y = -0.6;
  const dBody = put(dModel, new THREE.Mesh(new THREE.SphereGeometry(9, 24, 16), dark)); dBody.scale.set(1.3, 0.45, 1);
  const canopy = put(dModel, new THREE.Mesh(new THREE.SphereGeometry(6, 20, 12), purple), 0, 2.4, 0); canopy.scale.set(1.1, 0.5, 0.9);
  [PI / 4, -PI / 4].forEach(a => { put(dModel, box(36, 1.6, 2.4, white), 0, 1, 0).rotation.y = a; });
  const rotors = [];
  [[12.7, 12.7], [-12.7, 12.7], [12.7, -12.7], [-12.7, -12.7]].forEach(([x, z]) => {
    put(dModel, cyl(2.4, 2.4, 3.4, steel, 12), x, 1.6, z);
    const r = put(dModel, new THREE.Group(), x, 3.6, z); rotors.push(r);
    put(r, box(19, 0.4, 2, dark)); put(r, box(2, 0.4, 19, dark));
    put(dModel, cyl(10, 10, 0.2, M(0xffffff, { op: 0.13 }), 24), x, 3.8, z);
  });
  put(dModel, new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), lamp), 11.5, 0, 0);
  const dRed = put(dModel, new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), red), -11.5, 0, 0);
  [-6, 6].forEach(z => { put(dModel, box(18, 1, 1.2, white), 0, -6.5, z); bar(dModel, -4, -6, -2, -2, z, 1, white); bar(dModel, 4, -6, 2, -2, z, 1, white); });
  put(dModel, cyl(3, 2.4, 3.5, glow, 14), 0, -4.6, 0);
  const gimbal = put(dModel, new THREE.Object3D(), 0, -6.5, 0);

  // SEARCHLIGHT
  const beamGeo = new THREE.ConeGeometry(1, 1, 48, 1, true); beamGeo.translate(0, -0.5, 0);
  const beamMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide, uniforms: { uO: { value: 0 } },
    vertexShader: 'varying float vY; void main(){ vY = position.y; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'uniform float uO; varying float vY; void main(){ float a = uO*(1.0+vY*0.8); gl_FragColor = vec4(1.0,0.84,0.38,a); }' });
  const beam = new THREE.Mesh(beamGeo, beamMat); scene.add(beam);
  const spotMat = new THREE.MeshBasicMaterial({ map: radialTex([[0, 'rgba(255,226,120,0.85)'], [0.45, 'rgba(255,214,90,0.45)'], [1, 'rgba(255,210,80,0)']]), transparent: true, depthWrite: false, opacity: 0 });
  const spot = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), spotMat); scene.add(spot);

  const ease = x => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  const seg = (m, a, b) => Math.min(1, Math.max(0, (m - a) / (b - a)));
  const lerp = (a, b, k) => a + (b - a) * k;
  const lp = (A, B, k) => [lerp(A[0], B[0], k), lerp(A[1], B[1], k)];
  const v = new THREE.Vector3(), v2 = new THREE.Vector3();
  let W = 0, H = 0, odo = 0, dist = 0, turnOdo = 0, prevRx = null, prevYaw = null, prevD = null, bank = 0, lastRh = '';
  const R = 1, L = -1;

  const update = (dt) => {
    const wrap = wrapper, hlE = highlight, lnE = scanLine || highlight, ctaE = target || highlight;
    if (!wrap || !hlE) return;
    const wr = wrap.getBoundingClientRect();
    if (wr.width !== W || wr.height !== H) { W = wr.width; H = wr.height; renderer.setSize(W, H, false); cam.right = W; cam.bottom = -H; cam.updateProjectionMatrix(); }
    const rel = e => { const r = e.getBoundingClientRect(); return { l: r.left - wr.left, t: r.top - wr.top, w: r.width, h: r.height }; };
    const hl = rel(hlE), ln = rel(lnE), cta = rel(ctaE);
    const s = opts.size * Math.min(1, Math.max(0.5, (scaleEl ? rel(scaleEl).w : hl.w) / 1100));
    const rh = Math.round(118 * s) + 'px';
    if (rh !== lastRh) { wrap.style.setProperty('--rh', rh); lastRh = rh; }
    const mission = opts.drone;
    const D = [7.5, mission ? 17 : 0, 0, 2.8, 7.5, 2.8]; // drive right, drone mission at the right end, flip, drive back, flip
    const cycle = D.reduce((a, b) => a + b, 0);
    let tc = S.t % cycle, p = 0, yaw = R, m = -1, moving = false, turnU = -1, from = R;
    const st = []; D.reduce((a, d, i) => (st[i] = a, a + d), 0);
    if (tc < st[1]) { p = ease(tc / D[0]); moving = true; }
    else if (tc < st[2]) { p = 1; m = tc - st[1]; }
    else if (tc < st[3]) { p = lerp(0.45, 1, ease((tc - st[2]) / D[2])); moving = true; }
    else if (tc < st[4]) { p = 1; turnU = (tc - st[3]) / D[3]; from = R; }
    else if (tc < st[5]) { p = 1 - ease((tc - st[4]) / D[4]); yaw = L; moving = true; }
    else { p = 0; turnU = (tc - st[5]) / D[5]; from = L; }
    let facing = yaw, sx = 1, sy = 1, rotZ = 0, jumpY = 0, upK = 0;
    if (turnU >= 0) {
      const k = seg(turnU, 0.32, 0.74);
      jumpY = Math.sin(PI * k) * 85 * s;
      facing = k < 0.5 ? from : -from;
      const c1 = Math.sin(PI * seg(turnU, 0.1, 0.32)) * 0.14, c2 = Math.sin(PI * seg(turnU, 0.74, 0.92)) * 0.2, c3 = Math.sin(PI * seg(turnU, 0.92, 1)) * -0.05;
      sy = 1 - c1 - c2 - c3; sx = 1 + (c1 + c2 + c3) * 0.7;
      rotZ = facing * (-0.12 * Math.sin(PI * seg(turnU, 0, 0.12))) + from * ease(k) * 2 * PI;
      upK = Math.sin(PI * seg(turnU, 0.04, 0.96));
      if (S.lastTurnU !== undefined && S.lastTurnU < 0.74 && turnU >= 0.74) S.pendingBurst = true;
    }
    S.lastTurnU = turnU;
    const x0 = hl.l + 72 * s, x1 = Math.max(x0, hl.l + hl.w - 72 * s);
    const rx = lerp(x0, x1, p);
    roverPos.position.set(rx, -hl.t + jumpY, 0); roverPos.scale.setScalar(s);
    if (prevRx !== null) dist += Math.abs(rx - prevRx) / s;
    prevRx = rx; prevYaw = yaw;
    setTrack(dist);
    yawG.scale.set(facing * sx, sy, 1); pitch.rotation.z = rotZ;
    shadow.scale.set(150 * (1 - jumpY / (200 * s)), 8, 1); shadow.position.y = -jumpY / s;
    if (S.pendingBurst) { S.pendingBurst = false; burst(rx, -hl.t, s); }
    dust.forEach(d => { if (d.life <= 0) { d.m.visible = false; return; } d.life -= dt; d.m.position.x += d.vx * dt; d.m.position.y += d.vy * dt; d.vx *= 0.95; d.vy *= 0.93; const g = d.sz * (1.8 - d.life); d.m.scale.set(g, g * 0.7, 1); d.m.material.opacity = Math.max(0, d.life); });
    body.position.y = moving ? Math.sin(S.t * 22) * 0.45 : 0;
    head.rotation.z = Math.sin(S.t * 0.8) * 0.06;
    dish.rotation.z = 0.35 + Math.sin(S.t * 0.55) * 0.4 + (m >= 0 ? 0.25 : 0); dishLed.visible = (S.t % 1.1) < 0.25;
    headLed.visible = (S.t % 1.4) < 1.1;
    const armK = m >= 0 ? ease(seg(m, 0, 1.5)) * (1 - ease(seg(m, 15.5, 17))) : 0;
    const ph = S.t * 2.4;
    const dA1 = 0.75 + 0.35 * Math.sin(ph), dA2 = -1.35 + 0.5 * Math.sin(ph + 1.3);
    const uA1 = 1.55, uA2 = 0.2 + 0.45 * Math.sin(S.t * 14);
    const a1 = lerp(lerp(dA1, uA1, upK), -0.2, armK), a2 = lerp(lerp(dA2, uA2, upK), -0.6, armK);
    shoulder.rotation.z = a1; elbow.rotation.z = a2; wrist.rotation.z = -PI / 2 - (a1 + a2);
    drill.position.x = 11 + (armK > 0.95 || moving ? Math.abs(Math.sin(S.t * 14)) * 2 : 0);
    lidPivot.rotation.z = (m >= 0 ? ease(seg(m, 0.5, 1.3)) * (1 - ease(seg(m, 15.6, 16.4))) : 0) * 1.9;
    scene.updateMatrixWorld();

    let bo = 0, ringO = 0;
    if (m >= 1.3 && m <= 15.7) {
      dronePos.visible = true;
      hatchM.getWorldPosition(v);
      const Hh = [v.x, v.y], Ab = [v.x, v.y + 150 * s];
      const yScan = -ln.t + 80 * s;
      const P1 = [ln.l + ln.w * 0.12, yScan], P2 = [ln.l + ln.w * 0.82, yScan];
      const P3 = [cta.l + cta.w / 2, -cta.t + 105 * s];
      let pos;
      if (m < 3) pos = lp(Hh, Ab, ease(seg(m, 1.3, 3)));
      else if (m < 5) pos = lp(Ab, P1, ease(seg(m, 3, 5)));
      else if (m < 8) pos = lp(P1, P2, ease(seg(m, 5, 8)));
      else if (m < 10) pos = lp(P2, P3, ease(seg(m, 8, 10)));
      else if (m < 12.6) pos = P3.slice();
      else if (m < 14.6) pos = lp(P3, Ab, ease(seg(m, 12.6, 14.6)));
      else pos = lp(Ab, Hh, ease(seg(m, 14.6, 15.7)));
      const air = Math.min(seg(m, 1.6, 3), 1 - seg(m, 14.6, 15.4));
      pos[0] += Math.sin(S.t * 1.7) * 3 * s * air; pos[1] += Math.sin(S.t * 3.1) * 3.5 * s * air;
      const z = lerp(v.z + 2, 140, ease(Math.min(seg(m, 1.3, 2.6), 1 - seg(m, 14.6, 15.7))));
      dronePos.position.set(pos[0], pos[1], z);
      dronePos.scale.setScalar(s * (0.3 + 0.7 * ease(Math.min(seg(m, 1.3, 2.5), 1 - seg(m, 14.7, 15.7)))));
      if (prevD) { const vx = (pos[0] - prevD[0]) / Math.max(dt, 1e-3); bank = lerp(bank, Math.max(-0.4, Math.min(0.4, -vx * 0.0025)), 0.12); }
      prevD = pos; dTilt.rotation.z = bank;
      dModel.rotation.y = -0.6 + Math.sin(S.t * 0.9) * 0.15;
      rotors.forEach((r, i) => r.rotation.y += dt * (i % 2 ? -1 : 1) * 60 * (0.3 + 0.7 * air));
      dRed.visible = (S.t % 0.8) < 0.4;
      bo = 0.42 * ease(seg(m, 3.4, 3.9)) * (1 - ease(seg(m, 12.6, 13)));
      const scanT = [pos[0] + Math.sin(m * 2.6) * 55 * s, -(ln.t + ln.h * 0.55)];
      const ctaC = [cta.l + cta.w / 2, -(cta.t + cta.h / 2)];
      const tgt = m < 8 ? scanT : lp(scanT, ctaC, ease(seg(m, 8, 10)));
      if (m > 10 && m < 12.6) { bo *= 1.25 + 0.2 * Math.sin(m * 12); ringO = Math.min(1, seg(m, 10.1, 10.5)) * (1 - seg(m, 12.3, 12.6)); }
      gimbal.getWorldPosition(v2);
      const dx = tgt[0] - v2.x, dy = tgt[1] - v2.y, Lb = Math.hypot(dx, dy);
      beam.position.copy(v2); beam.scale.set(Lb * 0.2, Lb, Lb * 0.2); beam.rotation.z = Math.atan2(dx, -dy);
      spot.position.set(tgt[0], tgt[1], v2.z - 2); spot.scale.setScalar(Math.max(60 * s, Lb * 0.5));
      if (m > 10 && m < 12.6) spot.scale.set(cta.w * 1.25, cta.h * 2.4, 1);
    } else { dronePos.visible = false; prevD = null; }
    beamMat.uniforms.uO.value = bo; beam.visible = bo > 0.002;
    spotMat.opacity = Math.min(1, bo * 2); spot.visible = bo > 0.002;
    glow.emissiveIntensity = bo * 6;
    const ring = ringEl;
    if (ring) {
      const k = 1 + 0.05 * Math.sin(S.t * 9);
      ring.style.left = (cta.l - 8) + 'px'; ring.style.top = (cta.t - 8) + 'px';
      ring.style.width = (cta.w + 16) + 'px'; ring.style.height = (cta.h + 16) + 'px';
      ring.style.opacity = ringO; ring.style.transform = 'scale(' + k + ')';
    }
  };
  let last = performance.now();
  const tick = (now) => {
    if (dead) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    S.t += dt * opts.speed;
    update(dt);
    renderer.render(scene, cam);
  };
  raf = requestAnimationFrame(tick);
  
  return function destroy() { dead = true; cancelAnimationFrame(raf); renderer.dispose(); stage.remove(); ringEl.remove(); };
}
