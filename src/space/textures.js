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
