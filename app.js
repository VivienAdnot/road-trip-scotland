/* app.js — rend une page de voyage (hero + carte + blocs-bases + menus d'activités). */
(function(){
const ICON={rando:'🥾',vue:'🏔️',village:'🏘️','château':'🏰',pub:'🍺',plage:'🏖️',distillerie:'🥃',train:'🚂',bateau:'⛵',ville:'🏙️',nature:'🌲'};
const INTENS={1:{lab:'tranquille',cls:'i1',dot:'🟢'},2:{lab:'actif',cls:'i2',dot:'🟡'},3:{lab:'grosse journée',cls:'i3',dot:'🔴'}};
const esc=s=>(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function fmtDrive(m){if(!m)return'sur place / à pied';if(m<60)return m+' min de route';const h=Math.floor(m/60),mm=m%60;return mm?`${h}h${String(mm).padStart(2,'0')} de route`:`${h}h de route`;}
function regionColor(id){const r=(window.REGIONS||[]).find(x=>x.id===id);return r?r.color:'#7c5a86';}
function illus(seedColor){return `<div class="illus" style="background:linear-gradient(150deg,${seedColor} 0%, #2c474b 100%)"></div>`;}

const trip=window.TRIPS[window.TRIP_ID];
const bases=trip.bases.map(b=>Object.assign({},window.BASES[b.base],{id:b.base,nights:b.nights}));

/* ---------- nav ---------- */
function nav(){
  return `<nav class="nav"><div class="wrap">
    <a class="brand" href="index.html"><span class="flag">🏴󠁧󠁢󠁳󠁣󠁴󠁿</span>Road trip Écosse</a>
    <a class="tab ${trip.id==='short'?'active':''}" href="short.html">Court · 7 n</a>
    <a class="tab ${trip.id==='long'?'active':''}" href="long.html">Long · 14 n</a>
  </div></nav>`;
}
/* ---------- hero ---------- */
function hero(){
  return `<header class="hero"><img class="bg" src="${trip.hero}" alt="" referrerpolicy="no-referrer"><div class="scrim"></div>
    <div class="inner"><div class="wrap">
      <div class="kicker">${esc(trip.dates)} · ${trip.nights} nuits</div>
      <h1>${esc(trip.title)}</h1>
      <p>${esc(trip.tagline)}</p>
      <div class="meta">
        <span class="pill">🗓️ ${trip.days} jours</span>
        <span class="pill">🛏️ ${bases.length} bases</span>
        <span class="pill">🚗 ${trip.legs.length} transferts</span>
        <span class="pill">${trip.intensity}</span>
      </div>
    </div></div></header>`;
}
/* ---------- map section ---------- */
function mapSection(){
  return `<section class="section"><div class="wrap">
    <div class="eyebrow">L'itinéraire</div>
    <h2>La carte par régions</h2>
    <p class="lead">${bases.length} bases reliées par la route. Les zones colorées sont les grandes régions ; les points dorés sont les incontournables. Tape une base ou une activité.</p>
    <div class="mapwrap" id="mapwrap">
      <div class="maplegend" id="legend"></div>
      <div class="zoombtns"><button id="zin">+</button><button id="zout">−</button></div>
    </div>
  </div></section>`;
}
/* ---------- activity card ---------- */
function actCard(a,bi,ai,col){
  const it=INTENS[a.intensity]||INTENS[1];
  const ph=a.img?`<img loading="lazy" referrerpolicy="no-referrer" src="${a.img}" alt="" onerror="this.style.display='none';this.parentNode.classList.add('noimg')">`:illus(col);
  return `<article class="act ${a.must?'must':''}" data-bi="${bi}" data-ai="${ai}">
    <div class="ph">${ph}
      ${a.must?'<span class="musttag">★ On veut le faire</span>':''}
      <span class="typetag">${ICON[a.type]||'📍'} ${esc(a.type)}</span>
    </div>
    <div class="ac">
      <h5>${esc(a.name)}</h5>
      <p class="desc">${esc(a.desc).slice(0,115)}${a.desc.length>115?'…':''}</p>
      <div class="stats">
        <span class="chip ${it.cls}">${it.dot} ${it.lab}</span>
        <span class="chip">⏱️ ${esc(a.time)}</span>
        <span class="chip">🚗 ${a.drive?(a.drive<60?a.drive+' min':Math.floor(a.drive/60)+'h'+(a.drive%60?String(a.drive%60).padStart(2,'0'):'')):'sur place'}</span>
      </div>
    </div>
  </article>`;
}
/* ---------- transfer (leg between two bases) ---------- */
function legBlock(leg){
  const stops=(leg.stops||[]).map(s=>
    `<span class="arr">→</span><span class="stop"><span class="seg">${esc(s.seg)}</span>${esc(s.at)}<small>${esc(s.why)}</small></span>`).join('');
  return `<div class="transfer ${leg.warn?'warn':''}">
    <div class="t-head">🚗 Journée de transfert · <b>${esc(leg.drive||leg.time||'')}</b>${leg.warn?' · ⚠️ la plus grosse route du séjour':''}</div>
    <div class="chain">
      <span class="stop start">${esc(window.BASES[leg.from].name)}</span>
      ${stops}
      <span class="arr">→</span><span class="stop end">${esc(window.BASES[leg.to].name)}</span>
    </div>
    ${leg.note?`<div class="t-note">💡 ${esc(leg.note)}</div>`:''}
  </div>`;
}
/* ---------- base block ---------- */
function baseBlock(b,bi){
  const col=regionColor(b.region);
  const must=b.activities.filter(a=>a.must), opt=b.activities.filter(a=>!a.must);
  const cards=arr=>arr.map((a)=>actCard(a,bi,b.activities.indexOf(a),col)).join('');
  const leg=trip.legs[bi-1];
  return `${leg?legBlock(leg):''}
  <section class="base" id="base-${bi}">
    <div class="bhead"><img src="${b.hero}" alt="" referrerpolicy="no-referrer"><div class="scrim"></div>
      <div class="bh-in"><span class="nights">Base ${bi+1} · ${b.nights} nuit${b.nights>1?'s':''}</span>
        <h3>${esc(b.name)}</h3><div class="tag">${esc(b.tag)}</div></div>
    </div>
    <div class="bbody">
      <p class="blurb">${b.blurb}</p>
      <div class="infos">
        <div>🛏️ <b>Où dormir :</b> ${esc(b.lodging)}</div>
        <div>📍 <b>Rayon :</b> ${esc(b.radius)}</div>
      </div>
      <div class="menuhead"><h4>★ On veut vraiment</h4><span>les ancres de la base</span></div>
      <div class="acts">${cards(must)}</div>
      <div class="menuhead"><h4>Au menu</h4><span>on pioche selon l'énergie du jour</span></div>
      <div class="acts">${cards(opt)}</div>
    </div>
  </section>`;
}
/* ---------- assemble ---------- */
function basesSection(){
  return `<section class="section" style="padding-top:6px"><div class="wrap">
    <div class="eyebrow">Le séjour</div>
    <h2>Nos bases & leur menu</h2>
    <p class="lead">${esc(trip.note)}</p>
    ${bases.map((b,i)=>baseBlock(b,i)).join('')}
  </div></section>`;
}
function footer(){
  return `<footer><div class="wrap">
    <div>🏴󠁧󠁢󠁳󠁣󠁴󠁿 Road trip Écosse — planning perso. Conduite à gauche, midges en août, paie sans contact partout, météo changeante : prévois des couches.</div>
    <div>Photos : fonds locaux + Wikimedia Commons (CC/CC0). <a href="long.html">Voir le voyage long</a> · <a href="short.html">le court</a></div>
  </div></footer>`;
}

document.body.insertAdjacentHTML('beforeend',
  nav()+hero()+mapSection()+basesSection()+footer()+
  `<div id="scrim"></div>
   <div id="sheet"><div class="sh-hero"><button id="sheetClose">×</button><img id="shImg" alt=""><span class="cap" id="shCap"></span></div>
     <div class="sh-body" id="shBody"></div></div>`);

/* ---------- detail sheet ---------- */
const scrim=document.getElementById('scrim'),sheet=document.getElementById('sheet');
function openActivity(bi,ai){
  const b=bases[bi],a=b.activities[ai],it=INTENS[a.intensity]||INTENS[1],col=regionColor(b.region);
  const shImg=document.getElementById('shImg'),hero=shImg.parentNode;
  hero.style.background='linear-gradient(150deg,'+col+',#2c474b)';
  if(a.img){shImg.style.display='';shImg.src=a.img;shImg.onerror=()=>{shImg.style.display='none';};}else{shImg.style.display='none';}
  document.getElementById('shCap').textContent=(ICON[a.type]||'')+' '+a.type;
  document.getElementById('shBody').innerHTML=
    `<div class="eyebrow">${esc(b.name)} ${a.must?'· ★ incontournable':''}</div>
     <h3>${esc(a.name)}</h3>
     <div class="stats">
       <span class="chip ${it.cls}">${it.dot} ${it.lab}</span>
       <span class="chip">⏱️ ${esc(a.time)}</span>
       <span class="chip">🚗 ${fmtDrive(a.drive)}</span>
     </div>
     <p>${a.desc}</p>
     ${a.tip?`<div class="tip">💡 ${esc(a.tip)}</div>`:''}`;
  scrim.classList.add('show');sheet.classList.add('show');
}
function closeSheet(){scrim.classList.remove('show');sheet.classList.remove('show');}
document.getElementById('sheetClose').onclick=closeSheet;scrim.onclick=closeSheet;
document.querySelectorAll('.act').forEach(el=>el.addEventListener('click',()=>openActivity(+el.dataset.bi,+el.dataset.ai)));

/* ---------- map ---------- */
const api=window.initMap(document.getElementById('mapwrap'),trip,{
  onBase:bi=>{document.getElementById('base-'+bi).scrollIntoView({behavior:'smooth',block:'start'});},
  onActivity:(bi,ai)=>openActivity(bi,ai)
});
document.getElementById('zin').onclick=()=>api.zoomIn();
document.getElementById('zout').onclick=()=>api.zoomOut();
// légende régions
document.getElementById('legend').innerHTML=
  '<div class="row" style="font-weight:700;margin-bottom:4px">Régions</div>'+
  window.REGIONS.map(r=>`<div class="row"><i style="background:${r.color}"></i>${esc(r.name)}</div>`).join('')+
  '<div class="row" style="margin-top:5px"><i style="background:var(--gold)"></i>incontournable</div>';
})();
