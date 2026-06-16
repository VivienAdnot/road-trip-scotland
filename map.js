/* map.js — carte SVG dessinée : contour Écosse + teintes par région + bases + activités.
   Réutilise la projection et les chemins extraits de la carte d'origine (window.GEO). */
(function(){
const SVG='http://www.w3.org/2000/svg';
const P=window.GEO.proj, PATHS=window.GEO.paths;
function proj(lat,lng){return [(lng-P.LON0)*P.cos*P.k,(P.LAT1-lat)*P.k];}

window.initMap=function(container, trip, opts){
  opts=opts||{};
  const regionById={}; window.REGIONS.forEach(r=>regionById[r.id]=r);
  container.innerHTML='';
  const svg=document.createElementNS(SVG,'svg');svg.id='map';container.appendChild(svg);

  // defs: clip = terre, dégradés radiaux par région
  const defs=document.createElementNS(SVG,'defs');
  const clip=document.createElementNS(SVG,'clipPath');clip.setAttribute('id','landClip');
  PATHS.forEach(d=>{const p=document.createElementNS(SVG,'path');p.setAttribute('d',d);clip.appendChild(p);});
  defs.appendChild(clip);
  window.REGIONS.forEach(r=>{
    const rg=document.createElementNS(SVG,'radialGradient');rg.setAttribute('id','rg-'+r.id);
    const s0=document.createElementNS(SVG,'stop');s0.setAttribute('offset','0');s0.setAttribute('stop-color',r.color);s0.setAttribute('stop-opacity','.55');
    const s1=document.createElementNS(SVG,'stop');s1.setAttribute('offset','1');s1.setAttribute('stop-color',r.color);s1.setAttribute('stop-opacity','0');
    rg.appendChild(s0);rg.appendChild(s1);defs.appendChild(rg);
  });
  svg.appendChild(defs);

  // terre
  const gLand=document.createElementNS(SVG,'g');gLand.id='land';
  PATHS.forEach(d=>{const p=document.createElementNS(SVG,'path');p.setAttribute('d',d);gLand.appendChild(p);});
  svg.appendChild(gLand);

  // teintes régions (clippées à la terre)
  const gReg=document.createElementNS(SVG,'g');gReg.setAttribute('clip-path','url(#landClip)');
  window.REGIONS.forEach(r=>{const[x,y]=proj(r.lat,r.lng);
    const c=document.createElementNS(SVG,'circle');c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',r.r);
    c.setAttribute('fill','url(#rg-'+r.id+')');gReg.appendChild(c);});
  svg.appendChild(gReg);

  // labels régions
  const gRegLab=document.createElementNS(SVG,'g');
  window.REGIONS.forEach(r=>{const[x,y]=proj(r.lat,r.lng);
    const t=document.createElementNS(SVG,'text');t.setAttribute('x',x);t.setAttribute('y',y);
    t.setAttribute('text-anchor','middle');t.setAttribute('class','regionLabel');t.setAttribute('font-size',15);
    t.textContent=r.name;gRegLab.appendChild(t);});
  svg.appendChild(gRegLab);

  // route entre bases (ordre du voyage)
  const gRoute=document.createElementNS(SVG,'g');svg.appendChild(gRoute);
  const baseObjs=trip.bases.map(b=>Object.assign({},window.BASES[b.base],{id:b.base,nights:b.nights}));
  const pts=baseObjs.map(b=>{const[x,y]=proj(b.lat,b.lng);return x+','+y;}).join(' ');
  const pl=document.createElementNS(SVG,'polyline');pl.setAttribute('points',pts);pl.setAttribute('class','route');gRoute.appendChild(pl);

  // marqueurs (échelle pixel-constante)
  const gMk=document.createElementNS(SVG,'g');svg.appendChild(gMk);
  const markerEls=[];
  function addMarker(x,y,builder,onclick){
    const g=document.createElementNS(SVG,'g');g.setAttribute('class','mk');builder(g);
    g.addEventListener('click',()=>{if(!dragged)onclick();});
    gMk.appendChild(g);markerEls.push({el:g,x,y});
  }
  // activités (petits points colorés par région)
  baseObjs.forEach((b,bi)=>{
    (b.activities||[]).forEach((a,ai)=>{
      if(a.drive===0&&a.lat===b.lat&&a.lng===b.lng)return; // évite de masquer la base
      const[x,y]=proj(a.lat,a.lng);const col=(regionById[b.region]||{}).color||'#7c5a86';
      addMarker(x,y,g=>{const c=document.createElementNS(SVG,'circle');c.setAttribute('r',a.must?6.5:5);
        c.setAttribute('fill',a.must?'var(--gold)':col);c.setAttribute('stroke','#fff');c.setAttribute('stroke-width',1.6);g.appendChild(c);},
        ()=>opts.onActivity&&opts.onActivity(bi,ai));
    });
  });
  // bases (gros cercles numérotés)
  baseObjs.forEach((b,bi)=>{const[x,y]=proj(b.lat,b.lng);const col=(regionById[b.region]||{}).color||'#7c5a86';
    addMarker(x,y,g=>{
      const c=document.createElementNS(SVG,'circle');c.setAttribute('r',17);c.setAttribute('fill',col);
      c.setAttribute('stroke','#fff');c.setAttribute('stroke-width',3);g.appendChild(c);
      const t=document.createElementNS(SVG,'text');t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');
      t.setAttribute('font-size',18);t.textContent=(bi+1);g.appendChild(t);
    },()=>opts.onBase&&opts.onBase(bi));
  });

  /* ---- vue / pan-zoom ---- */
  function rect(){return svg.getBoundingClientRect();}
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
  baseObjs.forEach(b=>{(b.activities||[]).concat([b]).forEach(o=>{const[x,y]=proj(o.lat,o.lng);
    minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);});});
  let vb={x:0,y:0,w:0,h:0},VB0W=0,MINW,MAXW;
  function setAspect(){const r=rect();const ar=(r.width||1)/(r.height||1);let cx=(minx+maxx)/2,cy=(miny+maxy)/2;
    let w=(maxx-minx)*1.35,h=(maxy-miny)*1.22;if(w/h<ar){w=h*ar;}else{h=w/ar;}
    vb={x:cx-w/2,y:cy-h/2,w,h};VB0W=w;MINW=w*0.25;MAXW=w*1.8;}
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
  return {zoomIn:()=>zoom(0.7),zoomOut:()=>zoom(1.43),
    flyTo:(lat,lng)=>{const[x,y]=proj(lat,lng);const nw=Math.max(MINW,VB0W*0.5);vb.h=nw*(vb.h/vb.w);vb.w=nw;vb.x=x-vb.w/2;vb.y=y-vb.h/2;applyView();}};
};
})();
