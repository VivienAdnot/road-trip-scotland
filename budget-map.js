/* budget-map.js — carte des MEILLEURS PLANS d'hébergement.
   Réutilise la projection (window.GEO) et les teintes de régions (window.REGIONS) de la carte du voyage.
   Chaque point = une base maline : prix/nuit visible sur la pastille, distances voiture aux sites au clic. */
(function(){
const SVG='http://www.w3.org/2000/svg';

/* ---------- Les meilleurs plans trouvés (prix réels, 2 pers., aux dates) ---------- */
const STAYS=[
  {
    region:'lothians', lat:55.945, lng:-3.218, star:false,
    area:'Étape 1 · Édimbourg — Newington', best:'Bala House',
    price:174, window:'4–6/8 · 2 nuits', rating:'8.7/10', hero:'img/stage-dimbourg.jpg',
    pois:[['Château + Royal Mile','~20 min à pied'],['Arthur’s Seat','12 min'],['Calton Hill','10 min'],['Dean Village','12 min']],
    alts:'Dispo aussi (Newington) : Gladstone House €242 (9.1) · The Scholar €263 (9.0). 2 nuits suffisent pour la ville (calée avant le Fringe du 7) — mais réserver tôt.',
    note:'Re-vérifié le 28/6 aux dates 4–6/8. Guesthouse 3★, parking gratuit, 289 avis. €348 les 2 nuits.',
    url:'https://www.booking.com/hotel/gb/bala-house.html?checkin=2026-08-04&checkout=2026-08-06&no_rooms=1&group_adults=2&selected_currency=EUR'
  },
  {
    region:'highlands', lat:56.876, lng:-5.130, star:false,
    area:'Étape 2 · Glencoe & Lochaber — Muirshearlich (Fort William)', best:'Acorn Cottage & Little Oaks',
    price:220, window:'6–9/8 · 3 nuits', rating:'9.5/10', hero:'img/stage-glencoe-highlands.jpg',
    pois:[['Nevis Range / Ben Nevis','~15 min'],['Steall Falls (Glen Nevis)','~15 min'],['Viaduc de Glenfinnan','~30 min'],['Three Sisters (Glen Coe)','~40 min']],
    alts:'Springburn (lockée) est tombée le 28/6 → Acorn Cottage (9.5, cottage de caractère avec jardin, le moins cher du créneau). Sinon Bunroy Park €1028 (9.9, lodges riverside) · RiverBeds €1998 (splurge jacuzzi privé).',
    note:'Re-vérifié le 28/6. Cottage de campagne 9.5 à Muirshearlich, NW de Fort William : idéal Glen Nevis + Glenfinnan + Ben Nevis, Glen Coe à ~40 min. €660 les 3 nuits.',
    url:'https://www.booking.com/hotel/gb/acorn-cottage-fort-william.html?checkin=2026-08-06&checkout=2026-08-09&no_rooms=1&group_adults=2&selected_currency=EUR'
  },
  {
    region:'skye', lat:57.2756, lng:-5.7385, star:true,
    area:'Étape 3 · Isle of Skye — Kyleakin (pont de Skye)', best:'Ardvreck Chalet',
    price:275, window:'9–12/8 · 3 nuits', rating:'9.5/10', hero:'img/stage-isle-of-skye.jpg',
    pois:[['Sligachan & Cuillin','~30 min'],['Fairy Pools / Elgol','~45-50 min'],['Old Man of Storr','~50 min'],['Quiraing','~1h10']],
    alts:'3e Skye perdu en un jour (Harlosh puis Beinn Edra) → Ardvreck Chalet RÉSERVÉ (self-catering 9.5, privé, au pont de Skye). Survivants si besoin : Skye-Fall €980 (9.0) · Cottage by the Sea €1473 (front de mer, Trotternish).',
    note:'★ RÉSERVÉ. Chalet self-catering 9.5 (118 avis) à Kyleakin, au pied du pont de Skye : un « chez nous » privé. SE de l’île — sud proche (Sligachan ~30 min), icônes du Trotternish en journée (Storr ~50 min, Quiraing ~1h10). €826 les 3 nuits.',
    url:'https://www.booking.com/hotel/gb/ardvreck-chalet-self-catering.html?checkin=2026-08-09&checkout=2026-08-12&no_rooms=1&group_adults=2&selected_currency=EUR'
  },
  {
    region:'trossachs', lat:56.00, lng:-4.58, star:false,
    area:'Étape 4 · Loch Lomond — Balloch', best:'Glenfern Guest House',
    price:151, window:'12–14/8 · 2 nuits', rating:'8.1/10', hero:'img/stage-loch-lomond-glasgow.jpg',
    pois:[['Luss & rive du loch','12 min'],['Conic Hill / Balmaha','15 min'],['Ben A’an','35 min'],['Loch Katrine (vapeur)','40 min']],
    alts:'Dispo aussi : Tullie Inn €182 (8.5, centre Balloch) · Abbotsford €103 (8.6, le moins cher, à Dumbarton 6 km sud).',
    note:'Re-vérifié le 28/6 aux dates 12–14/8. 3★, parking gratuit, adultes. Dernière étape avant le vol à Glasgow. €301 les 2 nuits.',
    url:'https://www.booking.com/hotel/gb/glenfern-guest-house.html?checkin=2026-08-12&checkout=2026-08-14&no_rooms=1&group_adults=2&selected_currency=EUR'
  }
];
window.BUDGET_STAYS=STAYS;

window.initBudgetMap=function(container, opts){
  opts=opts||{};
  const P=window.GEO.proj, PATHS=window.GEO.paths;
  function proj(lat,lng){return [(lng-P.LON0)*P.cos*P.k,(P.LAT1-lat)*P.k];}
  const regionById={}; (window.REGIONS||[]).forEach(r=>regionById[r.id]=r);
  function col(id){return (regionById[id]||{}).color||'#7c5a86';}

  container.innerHTML='';
  const svg=document.createElementNS(SVG,'svg');svg.id='map';container.appendChild(svg);

  // defs : clip terre + dégradés régions
  const defs=document.createElementNS(SVG,'defs');
  const clip=document.createElementNS(SVG,'clipPath');clip.setAttribute('id','bLandClip');
  PATHS.forEach(d=>{const p=document.createElementNS(SVG,'path');p.setAttribute('d',d);clip.appendChild(p);});
  defs.appendChild(clip);
  (window.REGIONS||[]).forEach(r=>{
    const rg=document.createElementNS(SVG,'radialGradient');rg.setAttribute('id','brg-'+r.id);
    const s0=document.createElementNS(SVG,'stop');s0.setAttribute('offset','0');s0.setAttribute('stop-color',r.color);s0.setAttribute('stop-opacity','.5');
    const s1=document.createElementNS(SVG,'stop');s1.setAttribute('offset','1');s1.setAttribute('stop-color',r.color);s1.setAttribute('stop-opacity','0');
    rg.appendChild(s0);rg.appendChild(s1);defs.appendChild(rg);
  });
  svg.appendChild(defs);

  // terre
  const gLand=document.createElementNS(SVG,'g');gLand.id='land';
  PATHS.forEach(d=>{const p=document.createElementNS(SVG,'path');p.setAttribute('d',d);gLand.appendChild(p);});
  svg.appendChild(gLand);

  // teintes régions
  const gReg=document.createElementNS(SVG,'g');gReg.setAttribute('clip-path','url(#bLandClip)');
  (window.REGIONS||[]).forEach(r=>{const[x,y]=proj(r.lat,r.lng);
    const c=document.createElementNS(SVG,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r.r);
    c.setAttribute('fill','url(#brg-'+r.id+')');gReg.appendChild(c);});
  svg.appendChild(gReg);

  // labels régions
  const gRegLab=document.createElementNS(SVG,'g');
  (window.REGIONS||[]).forEach(r=>{const[x,y]=proj(r.lat,r.lng);
    const t=document.createElementNS(SVG,'text');t.setAttribute('x',x);t.setAttribute('y',y);
    t.setAttribute('text-anchor','middle');t.setAttribute('class','regionLabel');t.setAttribute('font-size',15);
    t.textContent=r.name;gRegLab.appendChild(t);});
  svg.appendChild(gRegLab);

  // marqueurs = pastilles de prix
  const gMk=document.createElementNS(SVG,'g');svg.appendChild(gMk);
  const markerEls=[];
  STAYS.forEach((s,i)=>{
    const[x,y]=proj(s.lat,s.lng);const fill=s.star?'var(--gold)':col(s.region);
    const g=document.createElementNS(SVG,'g');g.setAttribute('class','mk pricepin');
    const label=(s.star?'★ ':'')+'€'+s.price;
    const w=label.length*7.6+18, h=25;
    const r=document.createElementNS(SVG,'rect');r.setAttribute('x',-w/2);r.setAttribute('y',-h/2);
    r.setAttribute('width',w);r.setAttribute('height',h);r.setAttribute('rx',12.5);
    r.setAttribute('fill',fill);r.setAttribute('stroke','#fff');r.setAttribute('stroke-width',2.4);g.appendChild(r);
    const t=document.createElementNS(SVG,'text');t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
    t.setAttribute('y',1);t.setAttribute('font-size',13.5);t.textContent=label;g.appendChild(t);
    const dot=document.createElementNS(SVG,'circle');dot.setAttribute('cy',h/2+4.5);dot.setAttribute('r',3.2);
    dot.setAttribute('fill',fill);dot.setAttribute('stroke','#fff');dot.setAttribute('stroke-width',1.6);g.appendChild(dot);
    g.addEventListener('click',()=>{if(!dragged)opts.onStay&&opts.onStay(i);});
    gMk.appendChild(g);markerEls.push({el:g,x,y});
  });

  /* ---- vue / pan-zoom (repris de map.js) ---- */
  function rect(){return svg.getBoundingClientRect();}
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
  STAYS.forEach(s=>{const[x,y]=proj(s.lat,s.lng);minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);});
  let vb={x:0,y:0,w:0,h:0},VB0W=0,MINW,MAXW;
  function setAspect(){const r=rect();const ar=(r.width||1)/(r.height||1);let cx=(minx+maxx)/2,cy=(miny+maxy)/2;
    let w=(maxx-minx)*1.5,h=(maxy-miny)*1.3;if(w/h<ar){w=h*ar;}else{h=w/ar;}
    vb={x:cx-w/2,y:cy-h/2,w,h};VB0W=w;MINW=w*0.3;MAXW=w*1.8;}
  function applyView(){svg.setAttribute('viewBox',vb.x+' '+vb.y+' '+vb.w+' '+vb.h);const s=vb.w/VB0W;
    markerEls.forEach(m=>m.el.setAttribute('transform','translate('+m.x+' '+m.y+') scale('+s+')'));
    gRegLab.querySelectorAll('text').forEach(t=>t.setAttribute('font-size',15*s));}
  function init(){setAspect();applyView();}
  window.addEventListener('resize',()=>{setAspect();applyView();});

  const ptrs=new Map();let dragged=false,startVB=null,startMid=null,startDist=0,startPx=null;
  svg.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});dragged=false;
    if(ptrs.size===1){startVB={...vb};startPx={x:e.clientX,y:e.clientY};}
    if(ptrs.size===2){const a=[...ptrs.values()];startVB={...vb};startDist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
      startMid={x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2};ptrs.forEach((p,id)=>{try{svg.setPointerCapture(id);}catch(_){}});}});
  svg.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});const r=rect();
    if(ptrs.size===2&&startVB){const a=[...ptrs.values()];const dist=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);let f=startDist/dist;
      let nw=Math.min(MAXW,Math.max(MINW,startVB.w*f));f=nw/startVB.w;
      const fx=startVB.x+(startMid.x-r.left)/r.width*startVB.w,fy=startVB.y+(startMid.y-r.top)/r.height*startVB.h;
      vb.w=nw;vb.h=startVB.h*f;vb.x=fx-(startMid.x-r.left)/r.width*vb.w;vb.y=fy-(startMid.y-r.top)/r.height*vb.h;dragged=true;applyView();}
    else if(ptrs.size===1&&startVB){const dx=e.clientX-startPx.x,dy=e.clientY-startPx.y;
      if(Math.abs(dx)+Math.abs(dy)>4){if(!dragged){try{svg.setPointerCapture(e.pointerId);}catch(_){}}dragged=true;}
      if(!dragged)return;const upp=startVB.w/r.width;vb.x=startVB.x-dx*upp;vb.y=startVB.y-dy*upp;applyView();}});
  function up(e){if(ptrs.has(e.pointerId))ptrs.delete(e.pointerId);if(ptrs.size===1){const p=[...ptrs.values()][0];startVB={...vb};startPx={x:p.x,y:p.y};}}
  svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
  svg.addEventListener('wheel',e=>{e.preventDefault();const r=rect();let f=e.deltaY>0?1.12:0.89;let nw=Math.min(MAXW,Math.max(MINW,vb.w*f));f=nw/vb.w;
    const fx=vb.x+(e.clientX-r.left)/r.width*vb.w,fy=vb.y+(e.clientY-r.top)/r.height*vb.h;
    vb.w=nw;vb.h=vb.h*f;vb.x=fx-(e.clientX-r.left)/r.width*vb.w;vb.y=fy-(e.clientY-r.top)/r.height*vb.h;applyView();},{passive:false});
  function zoom(f){const nw=Math.min(MAXW,Math.max(MINW,vb.w*f));const ff=nw/vb.w;const cx=vb.x+vb.w/2,cy=vb.y+vb.h/2;
    vb.w=nw;vb.h=vb.h*ff;vb.x=cx-vb.w/2;vb.y=cy-vb.h/2;applyView();}

  requestAnimationFrame(init);
  return {zoomIn:()=>zoom(0.7),zoomOut:()=>zoom(1.43)};
};
})();
