/* budget-map.js — carte des MEILLEURS PLANS d'hébergement.
   Réutilise la projection (window.GEO) et les teintes de régions (window.REGIONS) de la carte du voyage.
   Chaque point = une base maline : prix/nuit visible sur la pastille, distances voiture aux sites au clic. */
(function(){
const SVG='http://www.w3.org/2000/svg';

/* ---------- Les meilleurs plans trouvés (prix réels, 2 pers., aux dates) ---------- */
const STAYS=[
  {
    region:'lothians', lat:55.945, lng:-3.218, star:false,
    area:'Édimbourg — Newington', best:'Bala House',
    price:173, window:'1–3/8', rating:'8.7/10', hero:'img/stage-dimbourg.jpg',
    pois:[['Château + Royal Mile','~20 min à pied'],['Arthur’s Seat','12 min'],['Calton Hill','10 min'],['Dean Village','12 min']],
    alts:'Dispo aussi : Arrandale €191 (8.0, parking) · central 4★ Moxy €228. Leg le plus cher (Fringe) — réserver en premier.',
    note:'Dispo réelle vérifiée le 21/6 aux dates. Guesthouse 3★, parking gratuit.',
    url:'https://www.booking.com/hotel/gb/bala-house.html?checkin=2026-08-01&checkout=2026-08-03&no_rooms=1&group_adults=2&selected_currency=EUR'
  },
  {
    region:'trossachs', lat:56.00, lng:-4.58, star:true,
    area:'Loch Lomond — Balloch', best:'Glenfern Guest House',
    price:98, window:'8–9/8', rating:'8.1/10', hero:'img/stage-loch-lomond-glasgow.jpg',
    pois:[['Luss & rive du loch','12 min'],['Conic Hill / Balmaha','15 min'],['Ben A’an','35 min'],['Loch Katrine (vapeur)','40 min']],
    alts:'Le meilleur prix du séjour. Dispo aussi : Norwood €127 (8.6) · Loch Lomond Hotel €203.',
    note:'Dispo réelle vérifiée le 21/6. 3★, parking gratuit, adultes uniquement.',
    url:'https://www.booking.com/hotel/gb/glenfern-guest-house.html?checkin=2026-08-08&checkout=2026-08-09&no_rooms=1&group_adults=2&selected_currency=EUR'
  },
  {
    region:'highlands', lat:56.82, lng:-5.105, star:false,
    area:'Glencoe & Lochaber — base à Fort William', best:'Ossians',
    price:159, window:'3–5/8 (Glencoe) · 7–8/8 retour €202', rating:'n/a', hero:'img/stage-glencoe-highlands.jpg',
    pois:[['Three Sisters (Glen Coe)','30 min'],['Steall Falls (Glen Nevis)','15 min'],['Viaduc de Glenfinnan','25 min'],['Lost Valley','30 min']],
    alts:'Bien noté : Ravenswood Pod €236 (9.2) · Clan Macduff €271 (8.9). Nuit retour 7–8/8 : The Imperial €202.',
    note:'Dispo réelle vérifiée le 21/6. Glencoe village complet — Fort William concentre l’offre, à 30 min des sites.',
    url:'https://www.booking.com/hotel/gb/ossians.html?checkin=2026-08-03&checkout=2026-08-05&no_rooms=1&group_adults=2&selected_currency=EUR'
  },
  {
    region:'skye', lat:57.281, lng:-5.714, star:false,
    area:'Isle of Skye — Kyle of Lochalsh', best:'The Lochalsh Hotel',
    price:583, window:'5–7/8 (court)', rating:'8.5/10', hero:'img/stage-isle-of-skye.jpg',
    pois:[['Château d’Eilean Donan','15 min'],['Sligachan / Cuillin','45 min'],['Old Man of Storr','~55 min'],['Quiraing','~1h10']],
    alts:'⚠️ L’option pas chère (Skye Bridge ~€216) est COMPLÈTE au 5–7/8 — il ne reste que Lochalsh Hotel €583. Pistes : Broadford/Dunollie (sur l’île, à vérifier), décaler d’1–2 jours, ou dormir dans le van cette nuit-là.',
    note:'Le point noir du court aux dates exactes (dispo vérifiée 21/6). C’est LA nuit où le van se justifie — voir la page Mix.',
    url:'https://www.booking.com/hotel/gb/lochalsh.html?checkin=2026-08-05&checkout=2026-08-07&no_rooms=1&group_adults=2&selected_currency=EUR'
  },
  {
    region:'cairngorms', lat:57.19, lng:-3.83, star:false,
    area:'Cairngorms — Aviemore (voyage long)', best:'Coylumbridge Resort Hotel',
    price:120, window:'13–15/8', rating:'7.2/10', hero:'',
    pois:[['Funiculaire Cairngorm','20 min'],['Loch an Eilein','12 min'],['Rothiemurchus','8 min'],['Loch Morlich (plage)','15 min']],
    alts:'Dispo aussi : Macdonald Highlands €150 · mieux noté Cairngorm Hotel €264 (8.4).',
    note:'Dispo réelle vérifiée le 21/6. Grand resort avec piscine. Étape du voyage long uniquement.',
    url:'https://www.booking.com/hotel/gb/coylumbridge-hotel.html?checkin=2026-08-13&checkout=2026-08-15&no_rooms=1&group_adults=2&selected_currency=EUR'
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
