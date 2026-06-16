/* =========================================================================
   data.js — Road trip Écosse
   Modèle "base + menu" : on dort dans quelques BASES (gros blocs, 3-4 nuits),
   et chaque base propose un MENU d'activités dans un rayon raisonnable
   (~temps de voiture indiqué). On pioche selon l'énergie du moment.

   intensity : 1 = 🟢 tranquille · 2 = 🟡 actif · 3 = 🔴 grosse journée
   drive     : minutes de voiture depuis la base (0 = sur place / à pied)
   must      : true = on veut vraiment le faire ; false = option du menu
   img       : chemin local (offline-safe) OU URL Wikimedia (chargée en ligne)
   ========================================================================= */

// --- images Wikimedia vérifiées (chargées quand il y a du réseau) ---
// On passe par l'endpoint Special:FilePath (redirection) plutôt que les URL
// directes upload.wikimedia.org : FilePath ramène vers une taille valide
// (les largeurs arbitraires sur le CDN renvoient 400) et ne limite pas le débit
// pour un vrai navigateur. On dérive le nom de fichier depuis l'URL harvestée.
function commons(u){
  const m=u.match(/\/thumb\/[^/]+\/[^/]+\/([^/]+)\//);
  return m? 'https://commons.wikimedia.org/wiki/Special:FilePath/'+m[1]+'?width=1024' : u;
}
const W = {
  royalMile:  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/High_Street%2C_Edinburgh.JPG/1024px-High_Street%2C_Edinburgh.JPG",
  edCastle:   "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/City_of_Edinburgh_-_Edinburgh_Castle_-_20140421004403.jpg/1024px-City_of_Edinburgh_-_Edinburgh_Castle_-_20140421004403.jpg",
  arthurSeat: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Arthur%27s_Seat%2C_Edinburgh.JPG/1024px-Arthur%27s_Seat%2C_Edinburgh.JPG",
  caltonHill: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Edinburgh_Calton_Hill.jpg/1024px-Edinburgh_Calton_Hill.jpg",
  deanVillage:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Dean_Village%2C_Edinburgh_%2837952869852%29.jpg/1024px-Dean_Village%2C_Edinburgh_%2837952869852%29.jpg",
  stockbridge:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Stockbridge%2C_Edinburgh_-_geograph.org.uk_-_4473495.jpg/1024px-Stockbridge%2C_Edinburgh_-_geograph.org.uk_-_4473495.jpg",
  grassmarket:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Grassmarket_Edinburgh_in_the_fog.JPG/1024px-Grassmarket_Edinburgh_in_the_fog.JPG",
  holyrood:   "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Holyrood_Palace_-_aerial_-_2025-04-19_01_%28cropped%29.jpg/1024px-Holyrood_Palace_-_aerial_-_2025-04-19_01_%28cropped%29.jpg",
  forthBridge:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Forth_Bridge_2022.jpg/1024px-Forth_Bridge_2022.jpg",
  northBerwick:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/North_Berwick_West_Bay.JPG/1024px-North_Berwick_West_Bay.JPG",
  rosslyn:    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rosslyn_Chapel_%28Mentioned_in_Dan_Brown%27s_DaVinci_Code%29.jpg/1024px-Rosslyn_Chapel_%28Mentioned_in_Dan_Brown%27s_DaVinci_Code%29.jpg",
  benAan:     "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Ben_A%27an_from_the_SE.jpg/1024px-Ben_A%27an_from_the_SE.jpg",
  luss:       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Luss_church_%28front_view%29.JPG/1024px-Luss_church_%28front_view%29.JPG",
  lochKatrine:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Loch_Katrine.jpg/1024px-Loch_Katrine.jpg",
  conicHill:  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Conic_Hill_4.JPG/1024px-Conic_Hill_4.JPG",
  inchcailloch:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Innisnacailleach.jpg/1024px-Innisnacailleach.jpg",
  trossachs:  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Wooded_area_of_the_Trossachs_and_Loch_Katrine.jpg/1024px-Wooded_area_of_the_Trossachs_and_Loch_Katrine.jpg",
  lochLomond: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Loch_Lomond_2013_2.JPG/1024px-Loch_Lomond_2013_2.JPG",
  rannoch:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Rannoch_Moor.jpg/1024px-Rannoch_Moor.jpg",
  steall:     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Scotland_SteallWaterfall.jpg/1024px-Scotland_SteallWaterfall.jpg",
  benNevis:   "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/BenNevis2005.jpg/1024px-BenNevis2005.jpg",
  nevisRange: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Aonachs_from_Banavie.jpg/1024px-Aonachs_from_Banavie.jpg",
  glenEtive:  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Stag_in_Glen_Etive.jpg/1024px-Stag_in_Glen_Etive.jpg",
  oban:       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Oban_Harbour_Promenade_-_geograph.org.uk_-_7609707.jpg/1024px-Oban_Harbour_Promenade_-_geograph.org.uk_-_7609707.jpg",
  castleStalker:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Castle_Stalker_-_geograph.org.uk_-_204092.jpg/1024px-Castle_Stalker_-_geograph.org.uk_-_204092.jpg",
  ardnamurchan:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Ardnamurchan_Lighthouse3.jpg/1024px-Ardnamurchan_Lighthouse3.jpg",
  portree:    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Portree_Isle_of_Skye_-_September_2023.jpg/1024px-Portree_Isle_of_Skye_-_September_2023.jpg",
  fairyPools: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Fairy_Pools%2C_Skye%2C_Scotland_17_%28highest_pool%29.jpg/1024px-Fairy_Pools%2C_Skye%2C_Scotland_17_%28highest_pool%29.jpg",
  talisker:   "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Talisker_distillery.jpg/1024px-Talisker_distillery.jpg",
  sligachan:  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/%2BAls_Aussichtspunkt_auf_die_Cuillin_Hills_perfekt%2C_Sligachan._05.jpg/1024px-%2BAls_Aussichtspunkt_auf_die_Cuillin_Hills_perfekt%2C_Sligachan._05.jpg",
  plockton:   "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Plockton_-_geograph.org.uk_-_7345545.jpg/1024px-Plockton_-_geograph.org.uk_-_7345545.jpg",
  cairngorms: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Cairn_Gorm_-_geograph.org.uk_-_366811.jpg/1024px-Cairn_Gorm_-_geograph.org.uk_-_366811.jpg",
  edradour:   "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/EdradourDistillery-pjt1.jpg/1024px-EdradourDistillery-pjt1.jpg",
  killiecrankie:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Killiecrankie.jpg/1024px-Killiecrankie.jpg",
  lochFaskally:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Loch_Faskally.jpg/1024px-Loch_Faskally.jpg"
};
Object.keys(W).forEach(k=>{W[k]=commons(W[k]);});

// --- grandes régions (teintes + labels sur la carte) ---
const REGIONS = [
  {id:'lothians',   name:'Édimbourg & Lothians',     color:'#c9a227', lat:55.95, lng:-2.95, r:120},
  {id:'trossachs',  name:'Loch Lomond & Trossachs',  color:'#5b8a72', lat:56.22, lng:-4.55, r:130},
  {id:'highlands',  name:'Highlands · Glencoe & Lochaber', color:'#7c5a86', lat:56.85, lng:-5.10, r:175},
  {id:'skye',       name:'Isle of Skye',             color:'#3f7d8c', lat:57.45, lng:-6.35, r:135},
  {id:'cairngorms', name:'Cairngorms',               color:'#a8632e', lat:57.10, lng:-3.75, r:150}
];

/* =========================================================================
   BASES — bibliothèque partagée par les deux voyages.
   Chaque base = un "gros bloc" où on pose les valises, + son menu d'activités.
   ========================================================================= */
const BASES = {

  edinburgh: {
    name:'Édimbourg', region:'lothians', lat:55.9533, lng:-3.1883,
    hero:'img/stage-dimbourg.jpg',
    tag:'Ville à pied · aucune voiture',
    blurb:"Le point d'entrée. Vieille ville médiévale, collines en pleine ville, sessions de musique trad le soir. On cale Édimbourg <b>avant le 7 août</b> : ville calme et prix normaux, le Fringe ne démarre que le 7.",
    lodging:"Dormir côté Old Town / Stockbridge / Bruntsfield, à pied du centre. Pas de voiture : on la récupère seulement en partant vers les Highlands.",
    radius:"À pied + quelques échappées à ≤ 45 min en train/voiture.",
    activities:[
      {name:'Château + Royal Mile (tôt)', type:'château', lat:55.9486, lng:-3.1999, drive:0, intensity:1, time:'2-3 h', must:true, img:W.edCastle,
       desc:"Le château dès l'ouverture (9h30) pour éviter la foule, puis descente du Royal Mile vers Holyrood, ruelles et closes en chemin.", tip:"Billet château à réserver en ligne, créneau du matin."},
      {name:'Arthur’s Seat', type:'rando', lat:55.9444, lng:-3.1617, drive:0, intensity:2, time:'1h30-2h', must:false, img:W.arthurSeat,
       desc:"Petit volcan éteint en plein cœur de la ville : 251 m, vue à 360° sur Édimbourg et le Firth of Forth. Montée raide mais courte.", tip:"Le matin ou en fin de journée pour la lumière."},
      {name:'Calton Hill', type:'vue', lat:55.9549, lng:-3.1829, drive:0, intensity:1, time:'30-45 min', must:false, img:W.caltonHill,
       desc:"La carte postale d'Édimbourg : monuments néoclassiques et panorama sur la ville. 10 min de montée."},
      {name:'Dean Village & Stockbridge', type:'village', lat:55.9522, lng:-3.2160, drive:0, intensity:1, time:'2 h', must:false, img:W.deanVillage,
       desc:"Hameau de meuniers le long de la Water of Leith, puis Stockbridge : cafés, brocantes, librairies. Balade plate et photogénique."},
      {name:'Session trad (Sandy Bell’s)', type:'pub', lat:55.9462, lng:-3.1905, drive:0, intensity:1, time:'soirée', must:true, img:'',
       desc:"Le pub de référence pour la musique trad live, tous les soirs. Alternative : The Royal Oak. On vise UN bon soir, pas tous les soirs.", tip:"Arriver tôt pour avoir une place, ça se remplit vite."},
      {name:'Grassmarket & Old Town', type:'ville', lat:55.9476, lng:-3.1953, drive:0, intensity:1, time:'demi-journée', must:false, img:W.grassmarket,
       desc:"Place animée sous le château, pubs et terrasses, Victoria Street colorée juste au-dessus.", tip:"Bon plan déjeuner/apéro entre deux visites."},
      {name:'Palais de Holyrood', type:'château', lat:55.9526, lng:-3.1722, drive:0, intensity:1, time:'1h30', must:false, img:W.holyrood,
       desc:"Résidence royale au bas du Royal Mile, au pied d'Arthur's Seat. Appartements et abbaye en ruine."},
      {name:'Forth Bridges (South Queensferry)', type:'vue', lat:55.9905, lng:-3.3880, drive:25, intensity:1, time:'demi-journée', must:false, img:W.forthBridge,
       desc:"Le pont ferroviaire victorien (UNESCO) vu du joli village de South Queensferry. Fish & chips au bord de l'eau."},
      {name:'North Berwick (côte)', type:'plage', lat:56.0578, lng:-2.7160, drive:40, intensity:1, time:'journée', must:false, img:W.northBerwick,
       desc:"Petite ville balnéaire, plages, fous de Bassan sur Bass Rock. Accessible en train direct depuis Édimbourg.", tip:"Journée 'off' si la ville fatigue."},
      {name:'Chapelle de Rosslyn', type:'château', lat:55.8556, lng:-3.1583, drive:30, intensity:1, time:'2 h', must:false, img:W.rosslyn,
       desc:"Chapelle du XVe aux sculptures foisonnantes (Da Vinci Code). Petite mais bluffante."}
    ]
  },

  lomond: {
    name:'Loch Lomond & Trossachs', region:'trossachs', lat:56.1006, lng:-4.6386,
    hero:'img/stage-loch-lomond-glasgow.jpg',
    tag:'Premier parc national · lochs et collines douces',
    blurb:"La transition entre ville et Highlands : grand loch, villages au bord de l'eau, collines faciles avec vues énormes. Parfait pour une première (ou dernière) respiration.",
    lodging:"Base à Balmaha ou Luss, au bord du loch. Oak Tree Inn (Balmaha) = pub-auberge convivial.",
    radius:"Tout à ≤ 45 min : rive du loch, Trossachs, Loch Katrine.",
    activities:[
      {name:'Rando Ben A’an', type:'rando', lat:56.2417, lng:-4.4050, drive:35, intensity:2, time:'2-3 h', must:true, img:W.benAan,
       desc:"La 'petite montagne à grande vue' des Trossachs : 1h de montée pour un panorama spectaculaire sur le Loch Katrine. Le meilleur ratio effort/vue du coin."},
      {name:'Luss & rive du loch', type:'village', lat:56.1006, lng:-4.6386, drive:0, intensity:1, time:'2 h', must:false, img:W.luss,
       desc:"Village de carte postale en pierre, plage de galets sur le Loch Lomond, balade plate au bord de l'eau."},
      {name:'Loch Katrine (vapeur)', type:'bateau', lat:56.2550, lng:-4.5800, drive:40, intensity:1, time:'demi-journée', must:false, img:W.lochKatrine,
       desc:"Croisière sur le SS Sir Walter Scott, vieux bateau à vapeur, au cœur des Trossachs. Possible à pied/vélo le long de la rive."},
      {name:'Conic Hill', type:'rando', lat:56.0760, lng:-4.5650, drive:5, intensity:2, time:'2 h', must:false, img:W.conicHill,
       desc:"Depuis Balmaha, montée courte mais soutenue jusqu'à la ligne de faille des Highlands : vue plongeante sur les îles du loch."},
      {name:'Île d’Inchcailloch', type:'nature', lat:56.0890, lng:-4.5840, drive:5, intensity:1, time:'demi-journée', must:false, img:W.inchcailloch,
       desc:"Petit ferry depuis Balmaha vers une île boisée : sentier nature, chênaie, plage. Très calme."},
      {name:'Oak Tree Inn (Balmaha)', type:'pub', lat:56.0758, lng:-4.5660, drive:5, intensity:1, time:'soirée', must:false, img:'',
       desc:"Pub-auberge chaleureux, bières locales, plats du coin. Bonne adresse pour le soir au bord du loch."}
    ]
  },

  glencoe: {
    name:'Glencoe & Lochaber', region:'highlands', lat:56.6839, lng:-5.1050,
    hero:'img/stage-glencoe-highlands.jpg',
    tag:'Le cœur sauvage des Highlands · base Fort William',
    blurb:"La vallée la plus dramatique d'Écosse : parois sombres, cascades, cerfs. Base idéale pour rayonner (Glenfinnan, Glen Nevis, Oban) sans bouger les valises. Pubs trad et auberges de montagne.",
    lodging:"Base autour de Glencoe village / Ballachulish / Fort William. Clachaig Inn = institution rando + bières.",
    radius:"Rayon riche à ≤ 1h15 : Glenfinnan, Glen Nevis, jusqu'à Oban (1h30).",
    activities:[
      {name:'Rando Lost Valley (Coire Gabhail)', type:'rando', lat:56.6700, lng:-4.9800, drive:15, intensity:3, time:'2h30-3h', must:true, img:W.steall,
       desc:"La 'vallée cachée' où le clan MacDonald planquait son bétail : passage de rivière, gorge, amphithéâtre de montagnes. Sentier rocailleux, chaussures sérieuses.", tip:"Pas après de fortes pluies (gué de rivière)."},
      {name:'Three Sisters (Glen Coe)', type:'vue', lat:56.6680, lng:-4.9690, drive:15, intensity:1, time:'30 min', must:true, img:'img/site-three-sisters-glencoe.jpg',
       desc:"Les trois éperons mythiques de la vallée depuis le belvédère de la route A82. Arrêt photo incontournable."},
      {name:'Glen Etive (route Skyfall)', type:'vue', lat:56.6200, lng:-4.9900, drive:20, intensity:1, time:'1-2 h', must:false, img:'img/site-glen-etive.jpg',
       desc:"Petite route en cul-de-sac le long d'une rivière (le décor final de Skyfall). Cerfs, cascades, solitude. Aller-retour tranquille en voiture.", tip:"Route étroite à voie unique : patience aux 'passing places'."},
      {name:'Viaduc de Glenfinnan + train à vapeur', type:'train', lat:56.8716, lng:-5.4331, drive:55, intensity:2, time:'demi-journée', must:true, img:'img/site-viaduc-de-glenfinnan.jpg',
       desc:"Le viaduc d'Harry Potter ; le Jacobite (train à vapeur) le franchit vers 11h et 15h. Court sentier jusqu'au point de vue.", tip:"Arriver tôt, le parking sature ; viser l'horaire de passage du train."},
      {name:'Steall Falls (Glen Nevis)', type:'rando', lat:56.7700, lng:-4.9700, drive:35, intensity:2, time:'2h', must:false, img:W.steall,
       desc:"Sentier de gorge le long de la rivière jusqu'à une grande cascade de 120 m et sa prairie suspendue. Très Tolkien."},
      {name:'Nevis Range (télécabine)', type:'vue', lat:56.8200, lng:-5.0080, drive:40, intensity:1, time:'demi-journée', must:false, img:W.nevisRange,
       desc:"Télécabine au-dessus de Fort William : altitude facile, vue sur le Ben Nevis et les Aonachs sans suer.", tip:"Plan B parfait par météo moyenne."},
      {name:'Oban (fruits de mer)', type:'village', lat:56.4150, lng:-5.4720, drive:75, intensity:1, time:'journée', must:false, img:W.oban,
       desc:"Port animé de la côte ouest, capitale des fruits de mer. Stalls sur le quai, distillerie en ville, vue sur les îles."},
      {name:'Castle Stalker', type:'château', lat:56.5640, lng:-5.3920, drive:45, intensity:1, time:'30-45 min', must:false, img:W.castleStalker,
       desc:"Petit château sur un îlot (Monty Python !) ; arrêt photo depuis le View Café sur la route d'Oban."},
      {name:'Rannoch Moor', type:'vue', lat:56.6107, lng:-4.7796, drive:30, intensity:1, time:'arrêt', must:false, img:W.rannoch,
       desc:"Immense tourbière sauvage avant d'entrer dans Glencoe : un des paysages les plus vides et beaux d'Écosse. Arrêt sur la route."},
      {name:'Ardnamurchan (péninsule)', type:'nature', lat:56.7270, lng:-6.2290, drive:90, intensity:2, time:'journée', must:false, img:W.ardnamurchan,
       desc:"Le point le plus à l'ouest de l'île de Grande-Bretagne : phare, plages désertes, route sauvage. Journée entière, peu de monde."},
      {name:'Ben Nevis (sommet)', type:'rando', lat:56.7969, lng:-5.0036, drive:35, intensity:3, time:'7-9 h', must:false, img:W.benNevis,
       desc:"Le plus haut sommet de Grande-Bretagne (1345 m). Longue journée exigeante — <b>hors de notre style</b> (pas de mode hardcore), mentionné pour info.", tip:"On préfère Steall Falls ou la télécabine pour les vues."},
      {name:'Clachaig Inn', type:'pub', lat:56.6770, lng:-5.0830, drive:15, intensity:1, time:'soirée', must:false, img:'',
       desc:"Pub-auberge mythique des grimpeurs au fond de la vallée : real ales, feu de cheminée, ambiance Highlands. Ben Nevis Inn aussi côté Fort William."}
    ]
  },

  skye: {
    name:'Isle of Skye', region:'skye', lat:57.4125, lng:-6.1956,
    hero:'img/stage-isle-of-skye.jpg',
    tag:"L'île-vedette · à savourer lentement",
    blurb:"L'île aux paysages les plus spectaculaires : pinacles du Storr, plateau du Quiraing, piscines turquoise, falaises et phares. Mérite plusieurs jours — on la <b>réserve très tôt</b>, elle se remplit.",
    lodging:"Base à Portree (capitale de l'île) ou autour : Carbost, Dunvegan, Sligachan. Pubs : The Old Inn (Carbost), Sligachan, Stein Inn.",
    radius:"L'île entière à ≤ 1h de Portree, mais routes étroites = on prévoit large.",
    activities:[
      {name:'Old Man of Storr', type:'rando', lat:57.5072, lng:-6.1844, drive:20, intensity:2, time:'1h30-2h', must:true, img:'img/site-old-man-of-storr.jpg',
       desc:"Le pinacle le plus célèbre d'Écosse : montée régulière jusqu'au pied des aiguilles de roche, vue sur la mer et les Cuillin. Tôt le matin ou en soirée.", tip:"Parking payant qui sature de 10h à 16h."},
      {name:'Quiraing (circuit)', type:'rando', lat:57.6433, lng:-6.2706, drive:35, intensity:2, time:'2-3 h', must:true, img:'img/site-quiraing.jpg',
       desc:"Plateau d'effondrement irréel : tours, plateaux suspendus, table verte. Sentier en balcon, parfois étroit et boueux. Le clou de Skye.", tip:"Vent fort fréquent ; semelles qui accrochent."},
      {name:'Fairy Pools', type:'rando', lat:57.2498, lng:-6.2616, drive:45, intensity:2, time:'1h30-2h', must:false, img:W.fairyPools,
       desc:"Enfilade de bassins turquoise et cascades au pied des Cuillin Noires. Sentier plat mais quelques gués. Baignade glaciale possible.", tip:"Tôt le matin : parking et sentier vite bondés."},
      {name:'Neist Point (phare)', type:'vue', lat:57.4236, lng:-6.7886, drive:55, intensity:2, time:'1h30', must:false, img:'img/site-neist-point.jpg',
       desc:"Le point le plus à l'ouest de Skye : falaises, phare, couchers de soleil légendaires. Descente raide puis sentier le long de la falaise."},
      {name:'Distillerie Talisker (Carbost)', type:'distillerie', lat:57.3030, lng:-6.3540, drive:35, intensity:1, time:'1h30', must:false, img:W.talisker,
       desc:"Le single malt tourbé emblématique de Skye, au bord du Loch Harport. Visite + dégustation. Oyster Shed juste à côté.", tip:"Réserver la visite en haute saison."},
      {name:'Portree (port)', type:'village', lat:57.4125, lng:-6.1956, drive:0, intensity:1, time:'2 h', must:false, img:W.portree,
       desc:"Le port aux maisons colorées, cœur de l'île : cafés, restos de poisson, départ de balades. Base pratique pour le soir."},
      {name:'Sligachan & Cuillin', type:'vue', lat:57.2890, lng:-6.1700, drive:25, intensity:1, time:'1 h', must:false, img:W.sligachan,
       desc:"Vieux pont de pierre devant les Cuillin déchiquetées : l'un des panoramas les plus photographiés d'Écosse. Pub-hôtel sur place."},
      {name:'Elgol (bateau vers les Cuillin)', type:'bateau', lat:57.1450, lng:-6.1100, drive:50, intensity:2, time:'demi-journée', must:false, img:'',
       desc:"Petit port au sud ; bateau vers Loch Coruisk, au pied des Cuillin (phoques en chemin). Vue spectaculaire sur les montagnes depuis la mer."},
      {name:'Plockton (sur la route)', type:'village', lat:57.3340, lng:-5.6560, drive:60, intensity:1, time:'1-2 h', must:false, img:W.plockton,
       desc:"Hameau de palmiers (!) et de bateaux côté terre ferme, avant/après le pont de Skye. Idéal sur le trajet d'arrivée ou de départ."}
    ]
  },

  cairngorms: {
    name:'Cairngorms & Pitlochry', region:'cairngorms', lat:57.1000, lng:-3.7500,
    hero:W.cairngorms,
    tag:'Forêts, faune et whisky · sur le chemin du retour',
    blurb:"Le plus grand parc national du Royaume-Uni : pins anciens, lochs, rennes et funiculaire d'altitude, puis la jolie ville de Pitlochry et ses distilleries. Une fin de voyage plus douce, sur la route de l'aéroport.",
    lodging:"Base autour d'Aviemore (parc) ou Pitlochry (plus mignon, plus au sud). 2 nuits suffisent.",
    radius:"Aviemore ↔ Pitlochry ~50 min ; le reste à ≤ 30 min.",
    activities:[
      {name:'Funiculaire Cairngorm', type:'vue', lat:57.1167, lng:-3.6700, drive:15, intensity:1, time:'demi-journée', must:false, img:W.cairngorms,
       desc:"Montée mécanique à 1100 m sur le plateau arctique des Cairngorms : vues immenses, station de ski l'hiver.", tip:"Souvent dans les nuages : vérifier la météo du sommet."},
      {name:'Loch an Eilein', type:'rando', lat:57.1450, lng:-3.8200, drive:15, intensity:1, time:'1h30', must:false, img:W.lochFaskally,
       desc:"Boucle plate et magique autour d'un loch avec un château en ruine sur une île, au cœur de la forêt de Rothiemurchus (vieux pins calédoniens)."},
      {name:'Distillerie Edradour (Pitlochry)', type:'distillerie', lat:56.7000, lng:-3.7300, drive:45, intensity:1, time:'1h30', must:false, img:W.edradour,
       desc:"L'une des plus petites distilleries d'Écosse, à taille humaine, dans un vallon près de Pitlochry. Visite intime."},
      {name:'Pitlochry & Loch Faskally', type:'village', lat:56.7030, lng:-3.7300, drive:45, intensity:1, time:'demi-journée', must:false, img:W.lochFaskally,
       desc:"Petite ville victorienne agréable : échelle à saumons, barrage, balade autour du Loch Faskally. Bonnes adresses de bouche."},
      {name:'Pass of Killiecrankie', type:'rando', lat:56.7400, lng:-3.7800, drive:50, intensity:1, time:'1-2 h', must:false, img:W.killiecrankie,
       desc:"Gorge boisée et site de bataille jacobite ('Soldier's Leap'), sentiers le long de la rivière Garry. Très beau aux premières couleurs d'automne."}
    ]
  }
};

/* =========================================================================
   TRIPS — chaque voyage = une suite de bases (id + nuits) + les legs routiers.
   ========================================================================= */
const TRIPS = {
  short: {
    id:'short', label:'Court', nights:7, days:8, dates:'1 → 8 août',
    title:'7 nuits · l’essentiel',
    tagline:"Le best-of en une semaine : Édimbourg, Glencoe, Skye, Loch Lomond. Rythme soutenu — on coche les incontournables.",
    intensity:'🔴 soutenu',
    hero:'img/stage-isle-of-skye.jpg',
    note:"Idéal si les congés sont comptés. Skye est un peu compressé (~1,5 j) et il y a 4 journées avec de la route. Peu de place pour l'imprévu.",
    bases:[
      {base:'edinburgh', nights:2},
      {base:'glencoe',   nights:2},
      {base:'skye',      nights:2},
      {base:'lomond',    nights:1}
    ],
    legs:[
      {from:'edinburgh', to:'glencoe', via:'Stirling', drive:'~2h45 de conduite',
       stops:[
         {at:'Château de Stirling', seg:'1h', why:'château + déjeuner sur le départ'},
         {at:'Tyndrum (Green Welly)', seg:'1h', why:'pause café / essence'},
         {at:'Rannoch Moor', seg:'45 min', why:'arrêt photo, entrée dans Glencoe'}
       ]},
      {from:'glencoe', to:'skye', via:'Eilean Donan', drive:'~2h45 de conduite',
       stops:[
         {at:'Eilean Donan', seg:'1h45', why:'le château sur son îlot — arrêt culte'},
         {at:'Sligachan', seg:'1h', why:'vue sur les Cuillin avant Portree'}
       ]},
      {from:'skye', to:'lomond', via:'Eilean Donan · Fort William · Glencoe', drive:'~4h de conduite', warn:true,
       note:"Le seul vrai long trajet du court séjour, et tu es seul au volant. Découpé en segments courts (jamais plus d'~1h30), ça devient l'une des plus belles routes d'Écosse — mais c'est une journée entière, pas un sprint : pars tôt. Le lendemain, Loch Lomond → aéroport de Glasgow ne fait que ~45 min. Option plus douce si ça pèse : ajouter une nuit à Fort William/Glencoe (→ 8 nuits).",
       stops:[
         {at:'Eilean Donan', seg:'1h', why:'café, château sur l’eau'},
         {at:'Fort William', seg:'1h15', why:'déjeuner, plein d’essence'},
         {at:'Glencoe (Three Sisters)', seg:'30 min', why:'belvédère, se dégourdir'},
         {at:'Rannoch Moor → Loch Lomond', seg:'1h30', why:'paysages, arrivée tranquille'}
       ]}
    ]
  },
  long: {
    id:'long', label:'Long', nights:14, days:15, dates:'1 → 15 août',
    title:'14 nuits · on respire',
    tagline:"Le vrai équilibre : on en fait beaucoup (randos, Cairngorms, Skye en profondeur) ET on a des journées légères. Jamais plus de ~3h de route.",
    intensity:'🟡 équilibré',
    hero:'img/stage-glencoe-highlands.jpg',
    note:"5 bases, 4 transferts seulement (Audrey ne défait les valises que 5 fois). 4-5 vraies randos possibles, Skye savouré sur 4 nuits, Cairngorms en bonus, 2-3 journées 'off'.",
    bases:[
      {base:'edinburgh', nights:3},
      {base:'lomond',    nights:1},
      {base:'glencoe',   nights:4},
      {base:'skye',      nights:4},
      {base:'cairngorms',nights:2}
    ],
    legs:[
      {from:'edinburgh', to:'lomond', via:'Trossachs', drive:'~1h15 de conduite',
       stops:[
         {at:'Les Kelpies (Falkirk)', seg:'40 min', why:'sculptures géantes, si envie'},
         {at:'Aberfoyle / Trossachs', seg:'35 min', why:'entrée dans le parc'}
       ]},
      {from:'lomond', to:'glencoe', via:'Rannoch Moor', drive:'~1h30 de conduite',
       stops:[
         {at:'Tyndrum (Green Welly)', seg:'45 min', why:'pause café / essence'},
         {at:'Rannoch Moor', seg:'45 min', why:'le grand vide, arrêt photo'}
       ]},
      {from:'glencoe', to:'skye', via:'Eilean Donan', drive:'~2h45 de conduite',
       stops:[
         {at:'Fort William', seg:'30 min', why:'ravitaillement'},
         {at:'Eilean Donan', seg:'1h15', why:'le château incontournable'},
         {at:'Sligachan', seg:'1h', why:'les Cuillin avant Portree'}
       ]},
      {from:'skye', to:'cairngorms', via:'Loch Ness · Inverness', drive:'~2h45 de conduite',
       stops:[
         {at:'Eilean Donan', seg:'1h', why:'dernier regard sur l’ouest'},
         {at:'Loch Ness / Inverness', seg:'1h15', why:'déjeuner, le grand loch'},
         {at:'Aviemore', seg:'45 min', why:'entrée dans les Cairngorms'}
       ]}
    ]
  }
};

window.REGIONS = REGIONS;
window.BASES = BASES;
window.TRIPS = TRIPS;
