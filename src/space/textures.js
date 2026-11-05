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
  if (type === 'radar') return createOrbitalRadar();
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

function createOrbitalRadar() {
  return canvasTexture(1536, 576, (ctx, w, h) => {
    const cyan = '#83cbd9', amber = '#ffbc72';
    ctx.fillStyle = '#081723'; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = '#173742'; ctx.lineWidth = 1;
    for (let x=24;x<w;x+=48) {ctx.beginPath();ctx.moveTo(x,58);ctx.lineTo(x,h-42);ctx.stroke();}
    for (let y=68;y<h-36;y+=48) {ctx.beginPath();ctx.moveTo(20,y);ctx.lineTo(w-20,y);ctx.stroke();}
    ctx.strokeStyle = '#3e879a'; ctx.lineWidth = 2; ctx.strokeRect(16,16,w-32,h-32);
    ctx.fillStyle = cyan; ctx.font = '24px monospace'; ctx.fillText('ORBITAL NAVIGATION',36,49);
    ctx.fillStyle = amber; ctx.font = '18px monospace'; ctx.fillText('EARTH / MOON',1220,48);
    const cx=740, cy=305;
    for (const radius of [135,178,224]) {ctx.strokeStyle='#327383';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();}
    for (let i=0;i<48;i++) {
      const a=i/48*Math.PI*2, outer=i%4?228:236;
      ctx.strokeStyle=i%4?'#367a89':cyan;ctx.lineWidth=i%4?2:3;
      ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*220,cy+Math.sin(a)*220);ctx.lineTo(cx+Math.cos(a)*outer,cy+Math.sin(a)*outer);ctx.stroke();
    }
    ctx.save();ctx.translate(cx,cy);ctx.rotate(-.31);ctx.strokeStyle=cyan;ctx.setLineDash([9,8]);ctx.beginPath();ctx.ellipse(0,0,294,118,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();
    ctx.strokeStyle='#3e8292';ctx.beginPath();ctx.moveTo(cx-250,cy);ctx.lineTo(cx+250,cy);ctx.moveTo(cx,cy-240);ctx.lineTo(cx,cy+240);ctx.stroke();
    // The Moon is drawn behind the larger filled Earth; this is a schematic, not telemetry.
    const mx=898,my=193;
    ctx.fillStyle='#b6c4cd';ctx.beginPath();ctx.arc(mx,my,32,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#788e9e';for(const [x,y,r] of [[-10,-7,6],[10,11,8],[9,-12,4]]){ctx.beginPath();ctx.arc(mx+x,my+y,r,0,Math.PI*2);ctx.fill();}
    const earth=ctx.createRadialGradient(cx-35,cy-35,8,cx,cy,103);earth.addColorStop(0,'#4d9cb5');earth.addColorStop(1,'#174365');
    ctx.fillStyle=earth;ctx.beginPath();ctx.arc(cx,cy,103,0,Math.PI*2);ctx.fill();
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,101,0,Math.PI*2);ctx.clip();ctx.translate(cx,cy);
    ctx.fillStyle='#73b2b4';ctx.globalAlpha=.65;
    for(const points of [[[-68,-43],[-32,-70],[0,-45],[-6,-15],[-36,4],[-46,-13]],[[-28,10],[4,8],[21,37],[-4,80],[-26,58]],[[20,-68],[75,-41],[90,-6],[54,11],[26,-8],[5,-32]]]){
      ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();
    }ctx.restore();
    ctx.strokeStyle='#a5deed';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,104,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle=cyan;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(mx+30,my-6);ctx.lineTo(1040,126);ctx.lineTo(1198,126);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-70,cy+70);ctx.lineTo(485,455);ctx.lineTo(334,455);ctx.stroke();
    ctx.font='22px monospace';ctx.fillStyle='#d6e7ec';ctx.fillText('MOON',1048,113);ctx.fillText('EARTH',338,443);
    for (const [x,y,title] of [[36,91,'LOCAL VIEW'],[1165,200,'ORBITAL FRAME']]) {
      ctx.strokeStyle='#357184';ctx.strokeRect(x,y,310,284);ctx.fillStyle=cyan;ctx.font='18px monospace';ctx.fillText(title,x+18,y+30);
      const centerX=x+155,centerY=y+149;
      for(const r of [47,74,100]){ctx.beginPath();ctx.arc(centerX,centerY,r,0,Math.PI*2);ctx.stroke();}
      ctx.beginPath();ctx.moveTo(centerX-106,centerY);ctx.lineTo(centerX+106,centerY);ctx.moveTo(centerX,centerY-106);ctx.lineTo(centerX,centerY+106);ctx.stroke();
      ctx.strokeStyle=amber;ctx.beginPath();ctx.arc(centerX,centerY,89,-.8,.6);ctx.stroke();
      ctx.fillStyle=cyan;ctx.beginPath();ctx.arc(centerX+47,centerY-21,5,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#8ab6c2';ctx.font='17px monospace';ctx.fillText('SCHEMATIC / NOT TO SCALE',36,h-31);
    ctx.fillStyle=amber;ctx.fillRect(w-150,h-44,108,4);
  });
}
