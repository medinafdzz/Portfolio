import * as THREE from 'three';

function canvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createDisplay(type) {
  return canvasTexture(768, 512, (ctx, w, h) => {
    ctx.fillStyle = '#091823'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#1c3c4b'; ctx.lineWidth = 1;
    for (let x = 24; x < w; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 30; y < h; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.fillStyle = '#8dc2dc'; ctx.font = '20px monospace'; ctx.fillText(type === 'roadmap' ? 'CAREER / FLIGHT LOG' : type === 'gear' ? 'SYSTEMS / TECH STACK' : 'SPACEFOLIO / EXPLORER', 30, 42);
    ctx.fillStyle = '#ffb969'; ctx.fillRect(30, 63, 45, 3);
    if (type === 'roadmap') {
      const nodes = [[65, 410], [160, 320], [270, 330], [380, 195], [500, 210], [650, 100]];
      ctx.strokeStyle = '#ffb35c'; ctx.lineWidth = 5; ctx.beginPath(); nodes.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      for (const [x, y] of nodes) { ctx.fillStyle = '#091823'; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#849b9f'; ctx.fillRect(x - 10, y + 26, 42, 4); }
    } else if (type === 'gear') {
      ctx.save(); ctx.translate(w / 2, h / 2 + 15); ctx.strokeStyle = '#9ddcf4'; ctx.lineWidth = 18;
      ctx.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * Math.PI * 2; const r = i % 8 < 4 ? 115 : 91; const x = Math.cos(a) * r; const y = Math.sin(a) * r; if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 43, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    } else {
      for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 3 ? '#66adce' : '#dcb37d'; ctx.fillRect(30, 100 + i * 27, 80 + (i * 137 % 310), 5); }
      for (let i = 0; i < 9; i++) { ctx.fillStyle = '#4582a5'; ctx.fillRect(490 + i * 24, 400 - (i * 43 % 270), 13, 50 + (i * 43 % 270)); }
    }
    ctx.fillStyle = '#78a4b3'; ctx.font = '15px monospace'; ctx.fillText('AM — EXPLORATION SYSTEMS', 30, h - 22);
  });
}

export function createEarth() {
  // Original stylised equirectangular map; no network assets or third-party imagery.
  return canvasTexture(2048, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#0b3159'; ctx.fillRect(0, 0, w, h);
    const continents = [
      [[-168,72],[-130,70],[-120,60],[-100,52],[-80,52],[-56,46],[-66,30],[-80,26],[-87,14],[-100,20],[-112,30],[-124,49],[-150,60]],
      [[-80,10],[-60,7],[-48,-2],[-35,-8],[-43,-22],[-53,-32],[-66,-55],[-74,-40],[-78,-13]],
      [[-17,36],[5,37],[21,33],[33,30],[43,12],[51,10],[40,-8],[33,-28],[18,-35],[10,-20],[-3,4],[-17,15]],
      [[-10,36],[-8,58],[10,71],[30,70],[45,57],[65,70],[100,77],[140,65],[179,65],[160,50],[142,35],[125,40],[120,20],[103,1],[80,8],[69,25],[48,30],[32,42],[22,38],[10,45],[0,42]],
      [[112,-12],[135,-10],[154,-25],[146,-39],[120,-35],[113,-24]],
      [[-52,59],[-42,60],[-20,80],[-45,84],[-62,77]],
      [[47,-13],[50,-17],[49,-26],[44,-24]],
      [[128,31],[141,43],[145,40],[138,32]],
      [[-180,-72],[-120,-69],[-60,-75],[0,-70],[60,-68],[120,-73],[180,-72],[180,-90],[-180,-90]],
    ];
    const project = ([lon, lat]) => [(lon + 180) / 360 * w, (90 - lat) / 180 * h];
    for (const polygon of continents) {
      ctx.beginPath(); polygon.map(project).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      ctx.fillStyle = '#597674'; ctx.fill(); ctx.strokeStyle = '#7f9b90'; ctx.lineWidth = 2; ctx.stroke();
      ctx.save(); ctx.clip();
      for (let i = 0; i < 800; i++) { const x = (i * 83.319 % w); const y = (i * 137.51 % h); ctx.fillStyle = i % 4 === 0 ? '#d7b375' : '#779887'; ctx.globalAlpha = .3; ctx.fillRect(x, y, 4 + i % 13, 3 + i % 9); }
      ctx.globalAlpha = .8; ctx.fillStyle = '#ffd19b';
      for (let i = 0; i < 1700; i++) { const x = i * 141.72 % w; const y = i * 47.439 % h; ctx.beginPath(); ctx.arc(x, y, i % 3 ? .6 : 1.3, 0, 7); ctx.fill(); }
      ctx.restore();
    }
    for (let i = 0; i < 180; i++) {
      const x = i * 183.751 % w; const y = 60 + i * 67.378 % (h - 120);
      ctx.fillStyle = '#c9dfec'; ctx.globalAlpha = .09;
      ctx.beginPath(); ctx.ellipse(x, y, 25 + i % 60, 3 + i % 9, Math.sin(i) * .4, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}
