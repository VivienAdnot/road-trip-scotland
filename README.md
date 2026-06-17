# 🏴 Road Trip Écosse — Planning & Carte interactive

Projet de voyage d'un couple (toi + Audrey), départ Paris, **~1er août 2026**, en **voiture + B&B**.
Philosophie : **peu de bases** (Audrey ne défait sa valise que 3-5 fois) mais **journées bien remplies** (toi tu ne t'ennuies pas). Édimbourg calée **avant le 7 août** → ville calme + prix normaux (le Fringe 2026 court du 7 au 31), et la quinzaine du festival se vit dans les Highlands.

## 🗺️ Voir le site

Site interactif publié via GitHub Pages : **https://vivienadnot.github.io/road-trip-scotland/**

Page d'accueil → on choisit **le voyage court (8 nuits)** ou **le long (14 nuits)**. Chaque voyage a sa **carte par régions** (zones teintées + route + bases + activités) et ses **blocs-bases** : on dort dans quelques gros blocs, et chaque base propose un **menu d'activités dans un rayon de voiture**, marquées ★ « on veut le faire » ou simples options, avec **intensité** (🟢🟡🔴), durée et temps de route. On pioche selon l'énergie du jour.

## 📦 Contenu du dépôt
- `index.html` — accueil (choix court / long).
- `short.html` · `long.html` — les deux voyages (mêmes briques, nuits et régions différentes).
- `data.js` — le contenu : régions, bibliothèque de bases, menus d'activités, photos.
- `map.js` — carte SVG dessinée (contour Écosse + teintes régions + bases + activités, pan/zoom).
- `geo.js` — géométrie du contour (projection + chemins), extraite de la carte d'origine.
- `app.js` · `styles.css` — rendu des pages et style (éditorial, type VisitScotland).
- `img/` — photos « héros » locales (offline-safe). Les photos d'appoint viennent de Wikimedia Commons (chargées en ligne via `Special:FilePath`).
- `pictures/` — les photos sources pleine résolution (Wikimedia Commons, CC/CC0 — créditer les auteurs si publication).
- `HANDOFF.md` — brief technique d'origine (archi de la carte, contraintes, recettes de build).
- `README.md` — ce fichier : le planning et la décision 7 vs 14 nuits.

## 🧭 Itinéraire de base (Écosse)
Édimbourg → Glencoe/Highlands → Isle of Skye → Loch Lomond, en option étendu aux Trossachs et aux **Cairngorms** (le grand parc national).

Légende intensité : 🟢 tranquille · 🟡 actif · 🔴 grosse journée (route + sites)

---

## ⚖️ Comparaison en un coup d'œil

| Critère | **8 nuits** (1–9 août) | **14 nuits** (1–15 août) |
|---|---|---|
| Bases (changements d'hôtel) | 5 bases · 4 transferts | 5 bases · 4 transferts |
| Régions couvertes | Lothians · Highlands (Glencoe, Skye) · Loch Lomond | + Trossachs · + **Cairngorms** |
| Plus longue route d'affilée | **~2h45** (retour cassé par une nuit à Fort William) | ~2h45 |
| Belles randos possibles | ~2 | ~4–5 |
| Journées « off » / légères | ~1 | 2–3 intégrées |
| Skye | compressé (~2 jours) | savouré (~3,5 jours) |
| Rythme global | 🟡 actif — « l'essentiel, mais serein au volant » | 🟡 équilibré — « tu en fais plus ET tu respires » |
| Exposition Fringe (prix) | quasi nulle (tout en pré-Fringe) | nulle si Édimbourg = 1–3 août |
| Budget total (couple) | **≈ €4 700–5 300** | **≈ €6 300–7 200** (~+35 %, pas ×2) |
| Pour qui | congés comptés, mais un seul conducteur | le vrai équilibre toi/Audrey |

---

## 🅰️ Scénario A — 8 nuits (1 → 9 août) · « L'essentiel, serein au volant »

**Bases :** Édimbourg 2 → Glencoe 2 → Skye 2 → **Fort William 1** → Loch Lomond 1

| Jour | Matin | Après-midi | Soir | Route | Intensité |
|---|---|---|---|---|---|
| **J1 · 1/8** | Vol Paris → Édimbourg | Installation, Old Town à pied | Dîner, 1er pub | — | 🟢 |
| **J2 · 2/8** | Château + Royal Mile tôt | Dean Village → Calton Hill, librairies | **Session trad** (Sandy Bell's) | à pied | 🟡 |
| **J3 · 3/8** | Récup voiture → route via **Stirling** (déj + château) | Arrivée Glencoe, points de vue Three Sisters | Clachaig Inn | ~2h45 | 🟡 |
| **J4 · 4/8** | **Rando Lost Valley** (Glencoe) | Glen Etive (route Skyfall) | B&B / resto local | court | 🟡 |
| **J5 · 5/8** | Route → Skye (**Eilean Donan** en chemin) | Port de Portree, **Old Man of Storr** en soirée | Portree | ~2h45 | 🟡 |
| **J6 · 6/8** | **Quiraing** (matin) | Fairy Pools **ou** Neist Point + Talisker | The Old Inn (Carbost) | local | 🟡 |
| **J7 · 7/8** | Route Skye → **Fort William** (Eilean Donan, Glen Shiel) | Steall Falls (Glen Nevis) | Ben Nevis Inn | ~2h45 | 🟡 |
| **J8 · 8/8** | Route Fort William → Loch Lomond (Glencoe, Rannoch Moor) | Luss, bord du loch | Oak Tree Inn (Balmaha) | ~1h30 | 🟢 |
| **J9 · 9/8** | Luss / Ben A'an | Route aéroport (**Glasgow ~45 min**) → vol | — | ~45 min | 🟢 |

**Ressenti :** tu vois les plus beaux morceaux et tu restes serein au volant — aucun trajet ne dépasse ~2h45, grâce à la nuit-étape à Fort William qui casse le retour de Skye. Skye reste un peu compressé (~2 j) ; pour le savourer, c'est le voyage long.

---

## 🅱️ Scénario B — 14 nuits (1 → 15 août) · « On en fait beaucoup, on respire »

**Bases :** Édimbourg 3 → Loch Lomond/Trossachs 1 → Glencoe/Fort William 4 → Skye 4 → Cairngorms/Pitlochry 2

| Jour | Matin | Après-midi | Soir | Route | Intensité |
|---|---|---|---|---|---|
| **J1 · 1/8** | Vol → Édimbourg | Old Town, Grassmarket | Dîner, pub | — | 🟢 |
| **J2 · 2/8** | Château + Holyrood | Dean Village, Stockbridge, librairies | **Session trad** | à pied | 🟡 |
| **J3 · 3/8** | Excursion côte (North Berwick / Rosslyn) | Plage, fish & chips | Soirée calme | train/jour | 🟢 |
| **J4 · 4/8** | Récup voiture → **Trossachs** | **Rando Ben A'an** (vue énorme) | Loch Lomond | ~1h15 | 🟡 |
| **J5 · 5/8** | Luss + balade bord de loch | Route → Glencoe/Fort William | Clachaig Inn | ~1h30 | 🟢 |
| **J6 · 6/8** | **Rando Lost Valley** | Glen Etive | B&B | court | 🟡 |
| **J7 · 7/8** | **Glenfinnan** + train à vapeur | Steall Falls (Glen Nevis) | Fort William | local | 🟡 |
| **J8 · 8/8** | Gondole Nevis Range **ou** journée Oban (fruits de mer) | Détente | Resto poisson | ½ journée | 🟢 |
| **J9 · 9/8** | Ardnamurchan **ou** repos / kayak loch | Lecture, café | Pub | libre | 🟢 |
| **J10 · 10/8** | Route → Skye (**Eilean Donan**, **Plockton**) | Portree | Storr en soirée | ~2h45 | 🟡 |
| **J11 · 11/8** | **Quiraing** circuit | Fairy Glen, Uig | Stein Inn | local | 🟡 |
| **J12 · 12/8** | **Fairy Pools** | Talisker + Oyster Shed | The Old Inn | local | 🟡 |
| **J13 · 13/8** | **Neist Point** / Coral Beach | Sleat / Elgol (bateau) | Portree | local | 🟢 |
| **J14 · 14/8** | Route → **Cairngorms** (via Inverness) | Aviemore : faune, funiculaire | Pitlochry | ~2h45 | 🟡 |
| **J15 · 15/8** | Distillerie (Edradour) / Killiecrankie | Route aéroport → vol | — | ~2h | 🟢 |

**Ressenti :** 4–5 vraies randos possibles, Skye vécu en profondeur, les **Cairngorms** en bonus, et 2-3 journées légères pour souffler. Jamais plus de ~3h de route, et Audrey ne change de base que 4 fois.

---

## ✅ Verdict

- **8 nuits** = excellent « best of » sans stress au volant (la nuit-étape à Fort William casse le retour de Skye, aucun trajet > ~2h45). Skye reste un peu compressé et il y a moins de place pour l'imprévu.
- **14 nuits** = le vrai point d'équilibre : **densité d'activités élevée pour toi** (randos, sites, Cairngorms) **et peu de changements d'hôtel pour Audrey**, avec des respirations.

**Reco :** si les deux semaines sont possibles, le scénario B est nettement supérieur. Le 8 nuits ne se justifie que si congés/budget coincent — mais il reste confortable pour un conducteur unique.

---

## 💷 Budget estimatif (couple, EUR)

**Prix réels relevés le 17 juin 2026**, pour un départ début août — donc à **~7 semaines**, quasi fermes (pas des projections lointaines). Sources : **Kiwi + Expedia** (vols), **Booking + Tripadvisor** (hébergement, moyenne de plusieurs établissements réellement dispo aux dates exactes), agrégateurs voiture (KAYAK, Arnold Clark, Enterprise…). Tout pour **2 personnes**, livre→euro ≈ 1,17.

### Vols Paris ↔ Écosse — 2 personnes
- **Court (1→9 août), open-jaw EDI in / GLA out** : **~€692 tout en direct** (Air France CDG→EDI ~€280/pers + easyJet GLA→Paris ~€66/pers), moyenne réaliste **~€740**. L'open-jaw bat l'aller-retour grâce au vol GLA→Paris du 9/8 très bon marché.
- **Long (1→15 août), aller-retour direct EDI** : **dès €538** (Air France direct A/R), moyenne ~€640 pour des horaires de retour corrects (le tarif plancher est un retour à 05h40).
- Direct CDG–EDI ≈ 1h45–2h. ⚠️ **bagage en soute en option** : AF basic n'inclut pas le bagage cabine, soute €69–138/trajet ; easyJet inclut le cabine, soute ~€64. Compter **+€130–260 pour 2** si bagages en soute A/R.

### Hébergement — €/nuit RÉEL pour 2 (moyenne Booking aux dates exactes)
| Zone | Dates | €/nuit moyen | Dispo |
|---|---|---|---|
| Édimbourg centre | 1–3/8 | **€259** | abondante (3★ dès ~€224) |
| Glencoe / Ballachulish | 3–5/8 | **€287** | 🟠 **rare** — milieu de gamme presque épuisé, surtout des lodges de luxe |
| **Isle of Skye (Portree)** | **5–7/8** | **€612** | 🔴 **quasi sold-out** — un seul milieu de gamme (Redwood House) ; sinon hôtels 4★ à ~€1 000+ |
| Fort William | 7–8/8 | **€236** | bonne |
| Loch Lomond (Balloch) | 8–9/8 | **€201** | bonne (B&B dès ~€110) |
| *Skye (fenêtre du long)* | *9–13/8* | *€278* | *très rare mais nettement moins cher qu'au 5–7/8* |
| Cairngorms / Aviemore | 13–15/8 | **€266** | correcte |

→ **Total hébergement réel** : **Court ≈ €2 753** (Édim 2×259 + Glencoe 2×287 + Skye 2×612 + FW 236 + Lomond 201) · **Long ≈ €3 670** (Édim 3×259 + Lomond 201 + Glencoe/FW 4×262 + Skye 4×278 + Cairngorms 2×266).

### Voiture de location + carburant
Intermédiaire **manuelle**, prise EDI → rendue GLA. **Frais d'open-jaw EDI→GLA = €0** chez les grands loueurs (Enterprise/Avis/Europcar/Hertz — les 2 aéroports sont dans leur réseau) ; Arnold Clark facture ~€50–60 malgré un tarif/jour plus bas → **prendre un grand loueur**. Boîte auto rare : +~€110 court / +~€200 long. Carburant ~£1,45/L, ~7 L/100 km.
- **Court (8 j, ~1 100 km)** : voiture ~€485 (≈£48/j) + carburant ~€131 ≈ **~€615**
- **Long (14 j, ~1 800 km)** : voiture ~€770 (≈£45/j) + carburant ~€214 ≈ **~€986**

### Repas + activités (par couple)
B&B = petit-déj souvent inclus. Dîner pub à 2 ~€44 · déj café ~€27 · entrées (château Édimbourg ~€23/pers, distillerie ~€15–25/pers, sites National Trust ~€15/pers ; **Historic Scotland Explorer Pass** £45/pers rentable dès 3 sites).
- **Sobre ~€75/j** · **Confortable ~€120/j**
- Court : **~€600** (sobre) → **~€960** (confort) · Long : **~€1 050** → **~€1 680**

### 🧮 Total estimé (couple) — prix réels au 17/6
| Poste | **Court · 8 nuits** | **Long · 14 nuits** |
|---|---|---|
| Vols (2 pers., direct) | €692–740 | €538–640 |
| Voiture + carburant | ~€615 | ~€986 |
| Hébergement (réel) | ~€2 753 | ~€3 670 |
| Repas + activités | €600–960 | €1 050–1 680 |
| Bagages soute (si A/R) | +€130–260 | +€130–260 |
| **TOTAL couple** | **≈ €4 700 – 5 300** | **≈ €6 300 – 7 200** |
| **Par personne** | **≈ €2 350 – 2 650** | **≈ €3 150 – 3 600** |

**À retenir (chiffres réels) :**
- Le **long ne coûte que ~+35 %**, pas le double ni +70 % : aux vraies dates, Skye 9–13/8 (€278/nuit) est **deux fois moins cher** que Skye 5–7/8 du court (€612/nuit), ce qui resserre l'écart.
- 🔴 **Skye 5–7/8 est le point noir** : quasi sold-out en milieu de gamme, un seul établissement à €612/nuit. À elle seule, cette étape pèse ~€1 224 sur le court. **Levier n°1 : réserver Skye immédiatement**, ou décaler d'1–2 jours, ou loger hors île.
- 🟠 **Glencoe 3–5/8** est le 2ᵉ point de tension (milieu de gamme presque épuisé) — bloquer Loch Leven / Inn at Ardgour / Onich maintenant.
- **Édimbourg, Fort William, Loch Lomond, Aviemore** restent dispo et raisonnables — réservables plus tard.
- **Vols** : open-jaw direct ~€692 sur le court ; A/R direct dès €538 sur le long. Prendre les bagages soute en option si besoin.

---

## 📌 Décider sur du concret
Au 17 juin, les chiffres ci-dessus sont **des prix réellement réservables**, pas des ordres de grandeur. Deux actions urgentes, dans l'ordre : **(1) verrouiller Skye** (5–7/8 quasi parti — c'est le poste qui peut faire dérailler le court), **(2) verrouiller Glencoe** (3–5/8 milieu de gamme presque épuisé). Les vols et les autres bases peuvent attendre un peu.

## 🔜 À régler ensuite
- Si l'Écosse démarre le 1er août → **rebat les cartes côté Irlande** et le vol Dublin→Édimbourg. À caler une fois la durée Écosse fixée.
- Côté pubs : en Écosse c'est whisky/ales (pas Guinness — ça c'est l'Irlande) → viser **le bon pub au bon soir**, pas tous les soirs.
- Randos : ~1 belle rando tous les 2-3 jours, jamais en mode hardcore/tente.

---

## 🛠️ Technique
Voir `HANDOFF.md` pour l'architecture interne (SVG dessiné, projection, modèle de données `DATA`, contraintes apprises) et la roadmap (carte Irlande, itinéraire jour/jour intégré, budget 3 niveaux).
