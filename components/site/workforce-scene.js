// Ported verbatim from "foxmen new/workforce-scene.js"; only the three.js import changed (esm.sh -> npm).
import * as THREE from 'three';

export function mount(container, getP) {
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(1.75, window.devicePixelRatio || 1));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
container.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const DAY = new THREE.Color('#EAE3D6'), NIGHT = new THREE.Color('#221A15');
scene.background = DAY.clone(); scene.fog = new THREE.Fog(DAY.clone(), 38, 95);
const hemi = new THREE.HemisphereLight('#ffffff', '#b8ad9c', 1.15);
const sun = new THREE.DirectionalLight('#fff3df', 2.4); sun.position.set(14, 26, 12); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -24, right: 24, top: 24, bottom: -24, near: 1, far: 80 }); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
const moon = new THREE.DirectionalLight('#9fb3ff', 0); moon.position.set(-12, 18, -8);
const deskGlow = new THREE.PointLight('#B86CF9', 0, 16, 1.6); deskGlow.position.set(0, 3.6, 1.2);
scene.add(hemi, sun, moon, deskGlow);
const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 220);

const D2R = Math.PI / 180, INK = '#1c1b19';

const std = (name, c, r = .85, m = 0, o = {}) => Object.assign(new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m, ...o }), { name });
const basic = (name, o) => Object.assign(new THREE.MeshBasicMaterial({ toneMapped: false, ...o }), { name });
const MAT = {
  white: std('wall_white', '#f5f2ec'), stone: std('roof_stone', '#e2ddd4'), gray: std('door_gray', '#a8a399', .8),
  char: std('charcoal', '#34322e', .7), ink: std('ink_black', '#1f1e1b', .6), rubber: std('tire_rubber', '#242321', .9),
  metal: std('brushed_metal', '#a6a29a', .45, .35), yellow: std('robot_yellow', '#e6ae1c', .45, .2), yellowD: std('robot_yellow_dark', '#b98410', .55, .2),
  platform: std('platform', '#ebe7df', .95), win: std('window_lit', '#fbf7ee', .35, .05, { emissive: '#fff1cf', emissiveIntensity: .5 }),
  skin: std('skin', '#d7d0c4', .8), cloth: std('hoodie', '#4a4843', .85), mask: std('mask_black', '#141312', .4, .15),
};
const tex = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return { c, x: c.getContext('2d'), t }; };
const mesh = (name, geo, mat, x = 0, y = 0, z = 0, parent) => { const m = new THREE.Mesh(geo, mat); m.name = name; m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
const grp = (name, parent, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.name = name; g.position.set(x, y, z); parent.add(g); return g; };
const Box = (w, h, d) => new THREE.BoxGeometry(w, h, d), Cyl = (a, b, h, s = 32) => new THREE.CylinderGeometry(a, b, h, s);

const world = new THREE.Group(); world.name = 'autonomous_workforce';
mesh('platform', Box(40, .24, 31), MAT.platform, 0, .12, 0, world);
const Y0 = .24; // top of platform
const W = grp('world', world, 0, Y0, 0);

// ---------- stations ----------
const ST = ['physical_shop', 'online_storefront', 'marketing', 'sales', 'crm_data', 'customer_support', 'analytics', 'delivery_ops'];
const HUB = { x: 2.4, z: 2.4 };
const stations = ST.map((name, k) => { const th = (135 + k * 270 / 7) * D2R; const x = 16 * Math.cos(th), z = 12 * Math.sin(th); const d = Math.hypot(x, z); return { name, x, z, ry: Math.atan2(-x, -z), dx: -x / d, dz: -z / d, fx: x - x / d * 3.2, fz: z - z / d * 3.2 }; });

const storeTex = tex(512, 384); { const x = storeTex.x; x.fillStyle = '#f7f4ee'; x.fillRect(0, 0, 512, 384); x.fillStyle = INK; x.fillRect(0, 0, 512, 46); x.fillStyle = '#f3f0e9'; x.font = '600 20px monospace'; x.fillText('STORE', 20, 30); x.fillStyle = '#d9d3c8'; for (let i = 0; i < 3; i++) x.fillRect(24 + i * 160, 70, 144, 150); x.fillStyle = INK; for (let i = 0; i < 3; i++) { x.fillRect(24 + i * 160, 232, 90, 12); x.fillRect(24 + i * 160, 254, 50, 12); } x.fillRect(24, 300, 200, 52); x.fillStyle = '#f3f0e9'; x.fillText('BUY NOW', 66, 332); }

stations.forEach((s, k) => {
  const G = grp(s.name, W, s.x, 0, s.z); G.rotation.y = s.ry;
  const win = (w, h, x, y, z) => mesh('window', Box(w, h, .05), MAT.win, x, y, z, G);
  if (k === 0) { mesh('shop_body', Box(3.4, 2.4, 2.6), MAT.white, 0, 1.2, 0, G); mesh('shop_roof', Box(3.7, .18, 2.9), MAT.stone, 0, 2.49, 0, G); const aw = mesh('awning', Box(3.6, .08, .9), MAT.char, 0, 2.08, 1.62, G); aw.rotation.x = .28; mesh('door', Box(.9, 1.7, .05), MAT.char, -.9, .85, 1.31, G); win(1.5, 1, .7, 1.25, 1.31); }
  if (k === 1) { mesh('store_body', Box(3, 3.2, 2.4), MAT.white, 0, 1.6, 0, G); mesh('store_roof', Box(3.2, .16, 2.6), MAT.stone, 0, 3.28, 0, G); mesh('store_screen', new THREE.PlaneGeometry(2.4, 1.8), basic('storefront_ui', { map: storeTex.t }), 0, 1.85, 1.205, G); }
  if (k === 2) { mesh('mkt_body', Box(2.6, 1.4, 2.4), MAT.white, 0, .7, 0, G); mesh('mkt_roof', Box(2.8, .12, 2.6), MAT.stone, 0, 1.46, 0, G); mesh('mast', Cyl(.1, .14, 3), MAT.char, 0, 2.95, 0, G);
    const d = mesh('dish', new THREE.CylinderGeometry(.75, .12, .32, 40, 1, true), std('dish', '#d6d0c6', .7, 0, { side: THREE.DoubleSide }), 0, 4.35, .15, G); d.rotation.x = Math.PI / 2 + .35;
    mesh('dish_feed', Cyl(.05, .05, .5), MAT.char, 0, 4.4, .35, G).rotation.x = Math.PI / 2; win(1.6, .5, 0, .8, 1.21);
    [1.4, 2.4, 3.4].forEach((r, i) => { const t = mesh('signal_ring_' + i, new THREE.TorusGeometry(r, .02, 8, 64), std('signal', '#6f6a61', .6), 0, 4.4, .3, G); t.rotation.x = Math.PI / 2; }); }
  if (k === 3) { mesh('sales_body', Box(3.2, 2, 2.4), MAT.white, 0, 1, 0, G); mesh('sales_roof', Box(3.4, .14, 2.6), MAT.stone, 0, 2.07, 0, G); win(2.2, .7, 0, 1.2, 1.21);
    mesh('pipeline_board', Box(.1, 3.2, 1.5), MAT.char, 2.2, 1.6, .6, G); for (let i = 0; i < 4; i++) mesh('pipeline_stage_' + ['lead', 'qualify', 'call', 'sale'][i], Box(.04, .5, 1.2), i === 3 ? MAT.win : std('stage', '#bdb7ad', .6), 2.27, 2.85 - i * .72, .6, G); }
  if (k === 4) { for (let r = 0; r < 3; r++) { mesh('server_' + r, Box(2.2, 1, 1.8), r % 2 ? MAT.stone : MAT.white, 0, .52 + r * 1.12, 0, G); for (let l = 0; l < 5; l++) mesh('server_led', Box(.14, .08, .03), MAT.win, -.7 + l * .35, .52 + r * 1.12, .92, G); } }
  if (k === 5) { mesh('support_body', Box(2.8, 2.2, 2.8), MAT.white, 0, 1.1, 0, G); mesh('support_dome', new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), MAT.stone, 0, 2.2, 0, G); win(1.8, .8, 0, 1.3, 1.41); }
  if (k === 6) { mesh('analytics_body', Box(3.2, 1.2, 2.4), MAT.white, 0, .6, 0, G); for (let b = 0; b < 5; b++) { const h = .3 + b * .38; mesh('chart_bar_' + b, Box(.36, h, .36), MAT.char, -1.2 + b * .6, 1.2 + h / 2, 0, G); } win(2.4, .4, 0, .6, 1.21); }
  if (k === 7) { mesh('warehouse', Box(4.4, 2.2, 3), MAT.white, 0, 1.1, 0, G); mesh('warehouse_roof', Box(4.6, .28, 3.2), MAT.stone, 0, 2.34, 0, G); mesh('rollup_door', Box(1.8, 1.5, .05), MAT.gray, -.8, .75, 1.51, G); win(1, .5, 1.3, 1.4, 1.51);
    for (let c = 0; c < 8; c++) mesh('crate_' + c, Box(.55, .55, .55), MAT.stone, 2.8 + (c % 2) * .62, .28 + Math.floor(c / 4) * .56, -.9 + (Math.floor(c / 2) % 2) * .62, G); }
});

// roads + pipes
const ROADS = grp('data_lines', W);
stations.forEach(s => { const a = new THREE.Vector3(HUB.x, .03, HUB.z), b = new THREE.Vector3(s.fx, .03, s.fz); const d = b.clone().sub(a), len = d.length(); const m = mesh('road_' + s.name, Box(.12, .02, len), MAT.char, (a.x + b.x) / 2, .03, (a.z + b.z) / 2, ROADS); m.rotation.y = Math.atan2(d.x, d.z); });
[[3, 4], [4, 5], [1, 0], [6, 7]].forEach(([i, j]) => { const A = new THREE.Vector3(stations[i].fx, .35, stations[i].fz), B = new THREE.Vector3(stations[j].fx, .35, stations[j].fz); const dir = B.clone().sub(A), len = dir.length(); dir.normalize(); const m = mesh('pipe_' + ST[i] + '_to_' + ST[j], Cyl(.07, .07, len, 16), MAT.char, (A.x + B.x) / 2, .35, (A.z + B.z) / 2, ROADS); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); });

// ---------- builder desk ----------
const B = grp('builder_desk', W); const DY = 1.24;
mesh('desk_top', Box(4.4, .08, 1.8), MAT.white, 0, 1.2, -1.15, B);
[[-2.1, -1.95], [2.1, -1.95], [-2.1, -.35], [2.1, -.35]].forEach(([x, z]) => mesh('desk_leg', Cyl(.04, .04, 1.16, 12), MAT.char, x, .58, z, B));
// curved monitor IDE
const ide = tex(1024, 420); ide.t.wrapS = THREE.RepeatWrapping; ide.t.repeat.x = -1; ide.t.offset.x = 1;
{ const x = ide.x; x.fillStyle = '#1e1f29'; x.fillRect(0, 0, 1024, 420); x.fillStyle = '#16171f'; x.fillRect(0, 0, 170, 420); x.fillStyle = '#252633'; x.fillRect(170, 0, 854, 34); x.fillStyle = '#1e1f29'; x.fillRect(178, 4, 150, 30);
  x.font = '500 15px monospace'; x.fillStyle = '#d6deeb'; x.fillText('system.ts', 200, 24); x.fillStyle = '#676e95'; x.fillText('agents.ts', 350, 24);
  ['▾ src', '  core', '  agents', '  system.ts', '  crm.ts', '▾ deploy', '  prod.yml'].forEach((s, i) => { if (i === 3) { x.fillStyle = '#2b2d3d'; x.fillRect(0, 48 + i * 24, 170, 24); } x.fillStyle = i === 3 ? '#fff' : '#8b90a8'; x.fillText(s, 14, 65 + i * 24); });
  const K = '#c792ea', S = '#c3e88d', F = '#82aaff', N = '#f78c6c', C = '#676e95', P = '#d6deeb', Yl = '#ffcb6b';
  const L = [[['import ', K], ['{ Agent, System }', P], [' from ', K], ["'./core'", S]], [], [['const ', K], ['system', P], [' = ', P], ['new ', K], ['System', Yl], ["({ mode: ", P], ["'autonomous'", S], [' })', P]], [], [['// six agents, one job each', C]], [['const ', K], ['roles', P], [' = [', P], ["'web'", S], [', ', P], ["'sales'", S], [', ', P], ["'support'", S], [']', P]], [['roles', P], ['.', P], ['forEach', F], ['(r => system.', P], ['spawn', F], ['(', P], ['new ', K], ['Agent', Yl], ['(r))', P]], [], [['system', P], ['.', P], ['connect', F], ['(', P], ["'crm'", S], [', ', P], ["'pipeline'", S], [')', P]], [['await ', K], ['system', P], ['.', P], ['deploy', F], ['({ retries: ', P], ['3', N], [' })', P]]];
  x.font = '500 17px monospace'; L.forEach((ln, i) => { const y = 62 + i * 22; x.fillStyle = '#4b5068'; x.textAlign = 'right'; x.fillText(String(i + 1), 222, y); x.textAlign = 'left'; let cx = 240; for (const [s, c] of ln) { x.fillStyle = c; x.fillText(s, cx, y); cx += x.measureText(s).width; } });
  x.fillStyle = '#11121a'; x.fillRect(170, 292, 854, 128); x.font = '500 13px monospace'; x.fillStyle = '#676e95'; x.fillText('TERMINAL', 188, 312); x.font = '500 15px monospace';
  ['$ npm run build', '✓ compiled 42 modules', '$ agent deploy --all', '✓ 6 agents online'].forEach((s, i) => { x.fillStyle = s[0] === '$' ? '#5af78e' : '#d6deeb'; x.fillText(s, 188, 336 + i * 20); }); }
const R0 = 2.1, TH = .8, MC = new THREE.Vector3(0, DY + .74, .35);
const scr = mesh('curved_monitor_screen', new THREE.CylinderGeometry(R0, R0, .62, 64, 1, true, Math.PI - TH / 2, TH), basic('ide_screen', { map: ide.t, side: THREE.BackSide }), MC.x, MC.y, MC.z, B); scr.castShadow = false;
mesh('curved_monitor_shell', new THREE.CylinderGeometry(R0 + .03, R0 + .03, .68, 64, 1, true, Math.PI - TH / 2 - .015, TH + .03), std('monitor_shell', '#1c1b19', .5, .2, { side: THREE.DoubleSide }), MC.x, MC.y, MC.z, B);
mesh('monitor_stand', Box(.08, .44, .06), MAT.metal, 0, DY + .22, -1.8, B); mesh('monitor_base', Box(.5, .025, .3), MAT.metal, 0, DY + .013, -1.72, B);
// keyboard + mouse
const kb = tex(512, 160); { const x = kb.x; x.fillStyle = '#2a2926'; x.fillRect(0, 0, 512, 160); x.fillStyle = '#4a4843'; for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) { if (r === 4 && c === 4) { x.fillRect(8 + c * 33.5, 8 + r * 30, 33.5 * 6 - 4, 26); continue; } if (r === 4 && c > 4 && c <= 9) continue; x.fillRect(8 + c * 33.5, 8 + r * 30, 29, 26); } }
mesh('keyboard', Box(1.05, .03, .34), MAT.char, 0, DY + .015, -.62, B); mesh('keycaps', new THREE.PlaneGeometry(1.02, .32), std('keycaps', '#ffffff', .7, 0, { map: kb.t }), 0, DY + .031, -.62, B).rotation.x = -Math.PI / 2;
mesh('mouse_pad', Box(.5, .006, .42), std('mouse_pad', '#3a3834', .95), .82, DY + .003, -.62, B); mesh('mouse', new THREE.SphereGeometry(.07, 24, 16), MAT.char, .82, DY + .03, -.62, B).scale.set(1, .45, 1.45);
// laptop with terminal
const LT = grp('laptop', B, 1.45, DY, -1.0); LT.rotation.y = -.5;
mesh('laptop_base', Box(.8, .03, .55), MAT.metal, 0, .015, 0, LT); mesh('laptop_keys', new THREE.PlaneGeometry(.7, .26), std('laptop_keys', '#2a2926', .8), 0, .031, -.07, LT).rotation.x = -Math.PI / 2;
const lid = grp('laptop_lid', LT, 0, .03, -.275); lid.rotation.x = -.28; mesh('laptop_lid_shell', Box(.8, .52, .02), MAT.metal, 0, .26, 0, lid);
const term = tex(512, 320); { const x = term.x; x.fillStyle = '#0d0f14'; x.fillRect(0, 0, 512, 320); x.fillStyle = '#1b1e27'; x.fillRect(0, 0, 512, 30); ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(18 + i * 18, 15, 6, 0, 7); x.fill(); });
  x.font = '500 17px monospace'; [['❯ ', 'agent deploy --all', '#d6deeb'], ['', '✓ web         online', '#5af78e'], ['', '✓ sales       online', '#5af78e'], ['', '✓ marketing   online', '#5af78e'], ['', '✓ automation  online', '#5af78e'], ['', '✓ support     online', '#5af78e'], ['', '✓ analytics   online', '#5af78e'], ['❯ ', 'tail -f leads.log', '#d6deeb'], ['', '+ lead #1042 qualified', '#ffcb6b']].forEach(([p, s, c], i) => { const y = 56 + i * 28; if (p) { x.fillStyle = '#5af78e'; x.fillText('❯', 16, y); } x.fillStyle = c; x.fillText(s, 38, y); }); }
mesh('laptop_screen', new THREE.PlaneGeometry(.74, .46), basic('terminal_screen', { map: term.t }), 0, .265, .011, lid).castShadow = false;
// aquarium
const AQ = grp('aquarium', B, -1.45, DY, -1.5); AQ.scale.setScalar(1.28); AQ.rotation.y = .25;
mesh('tank_base', Box(1.06, .05, .56), MAT.char, 0, .025, 0, AQ); mesh('sand', Box(.98, .08, .48), std('sand', '#e3cc93', .95), 0, .09, 0, AQ);
const sea = tex(512, 320); { const x = sea.x; const g = x.createLinearGradient(0, 0, 0, 320); g.addColorStop(0, '#5fd0f5'); g.addColorStop(.55, '#1b7fc4'); g.addColorStop(1, '#0a3563'); x.fillStyle = g; x.fillRect(0, 0, 512, 320);
  x.globalAlpha = .16; x.fillStyle = '#fff'; for (let i = 0; i < 6; i++) { const a = 40 + i * 85; x.beginPath(); x.moveTo(a, 0); x.lineTo(a + 30, 0); x.lineTo(a + 70, 320); x.lineTo(a + 10, 320); x.fill(); }
  x.globalAlpha = 1; x.fillStyle = '#0e4f78'; for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(i * 60 + 10, 320, 40, 60 + ((i * 37) % 70), 0, Math.PI, 0); x.fill(); }
  x.strokeStyle = '#1f8a6a'; x.lineWidth = 6; for (let i = 0; i < 7; i++) { const k = 30 + i * 72; x.beginPath(); x.moveTo(k, 320); x.bezierCurveTo(k - 20, 240, k + 25, 180, k + 5, 90 + ((i * 23) % 60)); x.stroke(); }
  x.fillStyle = '#ff8a70'; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(60 + i * 100, 300, 14 + i % 3 * 5, 0, 7); x.fill(); }
  x.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 30; i++) { x.beginPath(); x.arc((i * 97) % 512, (i * 53) % 300, 1.5 + (i % 3), 0, 7); x.fill(); } }
mesh('ocean_backdrop', new THREE.PlaneGeometry(.98, .52), basic('ocean_view', { map: sea.t }), 0, .39, -.238, AQ).castShadow = false;
const water = mesh('water', Box(.98, .48, .48), std('water', '#3aa6e8', .1, 0, { transparent: true, opacity: .32, depthWrite: false }), 0, .37, 0, AQ); water.castShadow = false; water.renderOrder = 2;
const glass = mesh('glass', Box(1, .62, .5), std('glass', '#e8f6ff', .05, .1, { transparent: true, opacity: .12, depthWrite: false }), 0, .36, 0, AQ); glass.castShadow = false; glass.renderOrder = 3;
mesh('tank_lid', Box(1.02, .03, .52), MAT.char, 0, .68, 0, AQ);
const plantM = [std('aqua_plant', '#2f9e5a', .7), std('aqua_plant_light', '#5cc27a', .7), std('aqua_plant_dark', '#1f7a48', .7)];
for (let i = 0; i < 7; i++) { const h = .18 + (i * .07) % .22; const p = mesh('seaweed', new THREE.ConeGeometry(.035, h, 8), plantM[i % 3], -.42 + i * .14, .13 + h / 2, -.12 + ((i * .11) % .2), AQ); p.rotation.z = i % 2 ? .12 : -.1; }
for (let i = 0; i < 3; i++) mesh('rock', new THREE.DodecahedronGeometry(.05 + i * .015), std('rock', '#8d8a85', .9), -.25 + i * .28, .15, .1 - i * .06, AQ);
for (let i = 0; i < 3; i++) mesh('coral', new THREE.ConeGeometry(.03, .09, 6), std('coral', '#ff7a6b', .6), .3 + i * .05, .17, .08 - i * .07, AQ);
['#ff8a2a', '#ffd23f', '#3fb6ff', '#ff5d7a', '#ffffff'].forEach((c, i) => { const F = grp('fishgrp_' + i, AQ, Math.sin(i * 1.9) * .36, .22 + i * .07, -.14 + i * .07); F.rotation.y = i % 2 ? Math.PI : 0; const m = std('fish_' + i, c, .4, 0, { emissive: c, emissiveIntensity: .15 }); mesh('fish_body', new THREE.SphereGeometry(.035, 16, 10), m, 0, 0, 0, F).scale.set(1.5, .9, .5); mesh('fish_tail', new THREE.ConeGeometry(.025, .04, 8), m, -.06, 0, 0, F).rotation.z = Math.PI / 2; });
// potted tree
const PT = grp('potted_tree', B, 1.95, DY, -1.72);
mesh('pot', Cyl(.12, .09, .22, 24), std('terracotta', '#c4703f', .85), 0, .11, 0, PT); mesh('soil', Cyl(.11, .11, .02, 24), std('soil', '#3b2a1e', .95), 0, .215, 0, PT); mesh('trunk', Cyl(.018, .026, .36, 10), std('bark', '#6b4a2e', .9), 0, .4, 0, PT);
const leaf = [std('leaves', '#3f9b4c', .75, 0, { flatShading: true }), std('leaves_light', '#5cb85f', .75, 0, { flatShading: true })];
[[0, .66, 0, .17], [-.1, .58, .05, .12], [.1, .6, -.04, .13], [.02, .78, .02, .11]].forEach(([x, y, z, r], i) => mesh('foliage', new THREE.IcosahedronGeometry(r, 1), leaf[i % 2], x, y, z, PT));
// chair + builder
const CH = grp('chair', B); mesh('seat', Box(1, .1, 1), MAT.char, 0, .75, .25, CH); mesh('post', Cyl(.05, .05, .65, 12), MAT.metal, 0, .38, .25, CH); mesh('base', Cyl(.45, .45, .05, 32), MAT.char, 0, .04, .25, CH); mesh('backrest', Box(.95, .85, .08), MAT.char, 0, 1.3, .76, CH);
const P = grp('builder', B);
const cap = (n, r, l, m, x, y, z, rx = 0, rz = 0) => { const c = mesh(n, new THREE.CapsuleGeometry(r, l, 6, 16), m, x, y, z, P); c.rotation.set(rx, 0, rz); return c; };
cap('torso', .3, .45, MAT.cloth, 0, 1.52, .35); mesh('head', new THREE.SphereGeometry(.23, 32, 20), MAT.skin, 0, 2.16, .28, P);
mesh('hood_mask', new THREE.SphereGeometry(.245, 32, 20, 0, Math.PI * 2, 0, Math.PI * .62), MAT.mask, 0, 2.17, .29, P);
mesh('mask_band', new THREE.CylinderGeometry(.238, .238, .1, 32, 1, true), MAT.mask, 0, 2.15, .28, P);
[-1, 1].forEach(s => { const e = mesh('mask_eye', Box(.07, .022, .02), basic('mask_eye_white', { color: '#f3f0e9' }), s * .075, 2.16, .058, P); e.rotation.z = s * .18;
  cap('thigh', .13, .5, MAT.cloth, s * .18, .92, .02, Math.PI / 2); cap('shin', .11, .45, MAT.cloth, s * .18, .5, -.3); mesh('shoe', Box(.2, .1, .32), MAT.ink, s * .18, .08, -.4, P); cap('upper_arm', .09, .32, MAT.cloth, s * .38, 1.55, .28, .35); cap('forearm_' + (s < 0 ? 'l' : 'r'), .08, .42, MAT.skin, s * .3, 1.33, -.2, Math.PI / 2 + .1); });

// ---------- robots (original design) ----------
const ROLES = ['web', 'marketing', 'sales', 'automation', 'support', 'analytics'];
const eyeTex = tex(160, 64); { const x = eyeTex.x; x.fillStyle = '#121110'; x.fillRect(0, 0, 160, 64); x.fillStyle = '#ffe08a'; x.shadowColor = '#ffcf4a'; x.shadowBlur = 12; for (const cx of [52, 108]) { x.beginPath(); x.roundRect(cx - 13, 18, 26, 28, 11); x.fill(); } }
const eyeM = basic('robot_eyes', { map: eyeTex.t });
const botPos = [[HUB.x + 1, HUB.z + .5, -2.2], [stations[2].fx, stations[2].fz, 0], [stations[3].fx - stations[3].dz * 1.6, stations[3].fz + stations[3].dx * 1.6, .6], [(stations[4].fx + stations[3].fx) / 2, (stations[4].fz + stations[3].fz) / 2 + .8, 3.14], [stations[5].fx, stations[5].fz, 2.3], [stations[6].fx, stations[6].fz, -.3]];
ROLES.forEach((role, i) => {
  const R = grp('robot_' + role, W, botPos[i][0], 0, botPos[i][1]); R.rotation.y = botPos[i][2]; R.scale.setScalar(1.15);
  mesh('chassis', Box(.95, .14, .72), MAT.char, 0, .3, 0, R); mesh('body', Box(.88, .55, .78), MAT.yellow, 0, .64, 0, R); mesh('body_trim', Box(.8, .07, .7), MAT.yellowD, 0, .95, 0, R);
  mesh('front_grille', Box(.02, .3, .5), MAT.char, .45, .62, 0, R); for (let k = 0; k < 3; k++) mesh('grille_slat', Box(.03, .03, .4), MAT.metal, .465, .52 + k * .09, 0, R);
  [-1, 1].forEach(s => { mesh('side_panel', Box(.32, .14, .01), MAT.yellowD, -.15, .72, s * .395, R); mesh('bolt', Box(.06, .06, .012), MAT.char, .25, .8, s * .396, R); });
  [-.3, .3].forEach(x => [-1, 1].forEach(s => { const w = grp('wheel_' + role + '_' + (x < 0 ? 'r' : 'f') + (s < 0 ? 'l' : 'r'), R, x, .17, s * .42); mesh('tire', Cyl(.17, .17, .12, 28), MAT.rubber, 0, 0, 0, w).rotation.x = Math.PI / 2; mesh('hub', Cyl(.07, .07, .13, 16), MAT.metal, 0, 0, 0, w).rotation.x = Math.PI / 2; }));
  mesh('neck_joint', new THREE.SphereGeometry(.08, 16, 12), MAT.char, -.05, 1.02, 0, R); mesh('neck', Cyl(.045, .045, .28, 12), MAT.metal, -.05, 1.14, 0, R);
  const H = grp('head_' + role, R, -.02, 1.34, 0); H.rotation.y = Math.sin(i * 1.7) * .35;
  mesh('head_shell', Box(.46, .36, .66), MAT.yellow, 0, 0, 0, H); mesh('visor', Box(.02, .3, .6), MAT.ink, .232, 0, 0, H);
  mesh('eye_screen', new THREE.PlaneGeometry(.54, .22), eyeM, .245, 0, 0, H).rotation.y = Math.PI / 2;
  [-1, 1].forEach(s => mesh('ear', Cyl(.07, .07, .06, 20), MAT.char, -.02, 0, s * .35, H).rotation.x = Math.PI / 2);
  mesh('antenna', Cyl(.012, .012, .3, 8), MAT.char, -.12, .32, .2, H); mesh('antenna_tip', new THREE.SphereGeometry(.035, 12, 8), std('beacon', '#e6ae1c', .4, 0, { emissive: '#e6ae1c', emissiveIntensity: .8 }), -.12, .48, .2, H);
  const A = grp('arms_' + role, R, .2, .74, 0);
  [-1, 1].forEach(s => { mesh('shoulder', new THREE.SphereGeometry(.07, 14, 10), MAT.char, 0, 0, s * .45, A); mesh('arm', Box(.42, .07, .07), MAT.metal, .21, 0, s * .45, A); mesh('gripper', Box(.07, .14, .1), MAT.yellowD, .44, 0, s * .45, A); });
  mesh('cargo_' + role, Box(.38, .32, .38), MAT.white, .44, .2, 0, A).scale.setScalar(.001);
});

// ---------- animation (20 s seamless loop, baked into GLB) ----------
const LOOP = 20, FPS = 15, NS = LOOP * FPS;
const tracks = [], V = THREE.VectorKeyframeTrack, Q = THREE.QuaternionKeyframeTrack;
const times = Array.from({ length: NS + 1 }, (_, k) => k / FPS);
const qy = a => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a);
const qz = a => new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), a);
const sampleV = (name, prop, fn) => { const v = []; times.forEach(t => v.push(...fn(t))); tracks.push(new V(name + '.' + prop, times, v)); };
const sampleQ = (name, fn) => { const v = []; times.forEach(t => { const q = fn(t); v.push(q.x, q.y, q.z, q.w); }); tracks.push(new Q(name + '.quaternion', times, v)); };
const saw = (name, prop, P, ph, fn) => { const T = [0], Vv = [...fn((ph) % 1)]; const bs = []; for (let k = 0; k < 100; k++) { const tb = (k + 1 - ph) * P; if (tb > 0 && tb < LOOP) bs.push(tb); }
  bs.forEach(tb => { T.push(tb - .001, tb); Vv.push(...fn(1), ...fn(0)); }); T.push(LOOP); Vv.push(...fn((LOOP / P + ph) % 1 || 1)); tracks.push(new V(name + '.' + prop, T, Vv)); };

const FP = k => ({ x: stations[k].fx, z: stations[k].fz });
const SP = (k, d) => { const s = stations[k]; return { x: s.fx - s.dz * d, z: s.fz + s.dx * d }; };
const ROUTES = [[[HUB, 1], [FP(1), 0], [HUB, 1], [FP(0), 0]], [[HUB, 1], [FP(2), 0, 3.5]], [[SP(3, 1.6), 1], [SP(3, -1.6), 0]], [[FP(4), 0], [FP(3), 0], [FP(4), 0], [FP(5), 0]], [[SP(5, 1.4), 0, 2.5], [SP(5, -1.4), 0, 2.5]], [[FP(6), 0, 2.5], [FP(7), 0, 2]]];
const ease = u => u * u * (3 - 2 * u);
ROUTES.forEach((rt, i) => {
  const role = ROLES[i], n = rt.length;
  const legs = rt.map((w, k) => { const a = w[0], b = rt[(k + 1) % n][0]; return { a, b, d: Math.hypot(b.x - a.x, b.z - a.z), wait: w[2] || 1.4, carry: !!w[1], yaw: Math.atan2(-(b.z - a.z), b.x - a.x) }; });
  const waitT = legs.reduce((s, l) => s + l.wait, 0), D = legs.reduce((s, l) => s + l.d, 0), sp = D / (LOOP - waitT);
  const segs = []; let t0 = 0; legs.forEach((l, k) => { const prev = legs[(k + n - 1) % n].yaw; segs.push({ ...l, prev, t0, tw: t0 + l.wait, t1: t0 + l.wait + l.d / sp, dist0: 0 }); t0 += l.wait + l.d / sp; });
  let acc = 0; segs.forEach(s => { s.dist0 = acc; acc += s.d; });
  const at = t => { const s = segs.find(s => t <= s.t1 + 1e-6) || segs[segs.length - 1];
    if (t < s.tw) { let da = s.yaw - s.prev; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI; const u = ease(Math.min(1, (t - s.t0) / Math.min(.9, s.wait))); return { x: s.a.x, z: s.a.z, yaw: s.prev + da * u, dist: s.dist0, moving: false, carry: s.carry || (t - s.t0 < .4 && segs[(segs.indexOf(s) + n - 1) % n].carry) }; }
    const u = ease((t - s.tw) / (s.t1 - s.tw)); return { x: lerp(s.a.x, s.b.x, u), z: lerp(s.a.z, s.b.z, u), yaw: s.yaw, dist: s.dist0 + s.d * u, moving: true, carry: s.carry }; };
  const nm = 'robot_' + role;
  sampleV(nm, 'position', t => { const p = at(t); return [p.x, p.moving ? Math.abs(Math.sin(t * 14 + i)) * .012 : 0, p.z]; });
  sampleQ(nm, t => qy(at(t).yaw));
  ['rl', 'rr', 'fl', 'fr'].forEach(w => sampleQ('wheel_' + role + '_' + w, t => qz(-at(t).dist / (.17 * 1.15))));
  sampleQ('head_' + role, t => qy(Math.sin(2 * Math.PI * t / 10 + i * 1.7) * .4));
  let ca = 0; const caV = times.map(t => (ca = at(t).carry ? 1 : 0));
  const sm = caV.map((_, k) => { let s2 = 0, c = 0; for (let j = -4; j <= 4; j++) { s2 += caV[(k + j + NS) % NS]; c++; } return s2 / c; });
  tracks.push(new V('cargo_' + role + '.scale', times, sm.flatMap(v => { const s2 = Math.max(.001, v); return [s2, s2, s2]; })));
  sampleQ('arms_' + role, t => qz(sm[Math.round(t * FPS) % NS] * .35));
});
function lerp(a, b, u) { return a + (b - a) * u; }
// fish + bubbles
[0, 1, 2, 3, 4].forEach(i => { const nm = 'fishgrp_' + i, k = 2 + (i % 3), ph = i * 1.9, y = .22 + i * .07, z = -.14 + i * .07, w = 2 * Math.PI * k / LOOP;
  sampleV(nm, 'position', t => [Math.sin(w * t + ph) * .36, y + Math.sin(w * 2 * t + ph) * .03, z]);
  sampleQ(nm, t => qy(Math.cos(w * t + ph) >= 0 ? 0 : Math.PI)); });
for (let i = 0; i < 6; i++) { mesh('bubble_' + i, new THREE.SphereGeometry(.012, 8, 6), basic('bubble', { color: '#e6f7ff' }), .36, .15, .05, AQ); saw('bubble_' + i, 'position', 4, i / 6, u => [.36, .14 + u * .46, .05]); }
// typing
['l', 'r'].forEach((s, j) => sampleV('forearm_' + s, 'position', t => [(j ? 1 : -1) * .3, 1.33 + Math.sin(t * 2 * Math.PI * 1.6 + j * 1.7) * .012, -.2]));
// signal rings
[0, 1, 2].forEach(i => saw('signal_ring_' + i, 'scale', 10 / 3, i / 3, u => [lerp(.4, 1.5, u), lerp(.4, 1.5, u), lerp(.4, 1.5, u)]));
// data pulses along roads + pipes
const PM = std('data_pulse', '#1f1e1b', .5);
stations.forEach((s, k) => [0, 1].forEach(q => { const nm = 'pulse_' + s.name + '_' + q; mesh(nm, new THREE.SphereGeometry(.12, 12, 8), PM, 0, 0, 0, ROADS); saw(nm, 'position', 5, q / 2 + k * .13, u => [lerp(HUB.x, s.fx, u), .12, lerp(HUB.z, s.fz, u)]); }));
[[3, 4], [4, 5], [1, 0], [6, 7]].forEach(([a, b], j) => { const A = stations[a], Bs = stations[b], nm = 'pulse_pipe_' + j; mesh(nm, new THREE.SphereGeometry(.13, 12, 8), PM, 0, 0, 0, ROADS); saw(nm, 'position', 4, j * .2, u => [lerp(A.fx, Bs.fx, u), .35, lerp(A.fz, Bs.fz, u)]); });
// data arcs from laptop: pulses travelling up from desk
for (let i = 0; i < 6; i++) { const nm = 'pulse_uplink_' + i; mesh(nm, new THREE.SphereGeometry(.07, 10, 8), std('uplink', '#e6ae1c', .4, 0, { emissive: '#e6ae1c', emissiveIntensity: .6 }), 0, 0, 0, W); saw(nm, 'position', 2.5, i / 6, u => [0, DY + .9 + u * 3, .35 - 1.8]); }


scene.add(world);
const clip = new THREE.AnimationClip('workforce_loop', LOOP, tracks);
const mixer = new THREE.AnimationMixer(world); mixer.clipAction(clip).play();

// ---------- scroll-driven camera ----------
const tmp = new THREE.Vector3();
const byName = n => world.getObjectByName(n);
const robotHome = { web: 1, marketing: 2, sales: 3, automation: 4, support: 5, analytics: 6 };
const shot = k => {
  if (k <= 0) return { pos: new THREE.Vector3(0, 30, 36), tgt: new THREE.Vector3(0, 0, 0), fov: 36 };
  if (k === 1) return { pos: new THREE.Vector3(3.9, Y0 + 3.9, 2.2), tgt: new THREE.Vector3(-.2, Y0 + 1.6, -.8), fov: 40 };
  if (k >= 8) return { pos: new THREE.Vector3(-28, 17, 24), tgt: new THREE.Vector3(1, 0, 0), fov: 36 };
  const role = ROLES[k - 2], o = byName('robot_' + role); o.getWorldPosition(tmp);
  const s = stations[robotHome[role]], d = new THREE.Vector3(-s.dx, 0, -s.dz), side = new THREE.Vector3(-d.z, 0, d.x);
  const tgt = tmp.clone().add(new THREE.Vector3(0, 1.05, 0));
  const pos = tgt.clone().addScaledVector(d, -3.9).addScaledVector(side, 1.6).add(new THREE.Vector3(0, 1.5, 0));
  return { pos, tgt, fov: 38 };
};
const camPos = new THREE.Vector3(), camTgt = new THREE.Vector3(); let camFov = 36, first = true;
const ss = u => u * u * (3 - 2 * u);
const winBase = MAT.win.emissiveIntensity;

const resize = () => { const w = container.clientWidth || 1, h = container.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
const ro = new ResizeObserver(resize); ro.observe(container); resize();

let last = performance.now(), raf = 0, dead = false;
const frame = now => {
  if (dead) return;
  raf = requestAnimationFrame(frame);
  const dt = Math.min(.1, (now - last) / 1000); last = now;
  const r = container.getBoundingClientRect();
  if (r.bottom < 0 || r.top > innerHeight) return;
  mixer.update(dt);
  const p = Math.max(0, Math.min(1, getP() || 0));
  const s = p * 8, i = Math.min(7, Math.floor(s)), f = s - i;
  const u = ss(Math.max(0, Math.min(1, (f - .18) / .64)));
  const A = shot(i), Bs = shot(i + 1);
  const wantPos = A.pos.clone().lerp(Bs.pos, u), wantTgt = A.tgt.clone().lerp(Bs.tgt, u), wantFov = A.fov + (Bs.fov - A.fov) * u;
  if (first) { camPos.copy(wantPos); camTgt.copy(wantTgt); camFov = wantFov; first = false; }
  const k = 1 - Math.pow(.0015, dt);
  camPos.lerp(wantPos, k); camTgt.lerp(wantTgt, k); camFov += (wantFov - camFov) * k;
  camera.position.copy(camPos); camera.lookAt(camTgt); if (Math.abs(camera.fov - camFov) > .01) { camera.fov = camFov; camera.updateProjectionMatrix(); }
  const tod = (9 + p * 24) % 24, night = .5 - .5 * Math.cos(2 * Math.PI * (tod - 13) / 24);
  scene.background.copy(DAY).lerp(NIGHT, night); scene.fog.color.copy(scene.background);
  hemi.intensity = 1.15 - night * .85; sun.intensity = 2.4 * (1 - night) + .05; moon.intensity = night * .9; deskGlow.intensity = night * 14;
  MAT.win.emissiveIntensity = winBase + night * 2.4;
  renderer.render(scene, camera);
};
raf = requestAnimationFrame(frame);
return { destroy() { dead = true; cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); } };
}
