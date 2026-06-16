# HANDOFF — Carte interactive Road Trip Écosse (→ extension Irlande, itinéraire, budget)

> À coller en début de thread Claude Code. Le user transmet aussi `road-trip-ecosse.html` et les **10 photos** (voir inventaire plus bas). Langue de travail : **français**.

---

## 0. Prompt de démarrage (à adapter)

> Tu reprends un projet de carte de voyage interactive en HTML autonome. Je te fournis `road-trip-ecosse.html` (déjà fonctionnel) et 10 photos `.jpg`. Lis ce HANDOFF, puis **ne casse pas l'existant**. Objectifs, par priorité :
> 1. Construire la **carte Irlande** dans le même style et la même architecture (Dublin 3n, Killarney 4n, Galway 3n), avec photos incrustées.
> 2. Générer l'**itinéraire jour par jour** (21 jours) et le **budget 3 niveaux** comme livrables séparés (Markdown + éventuellement intégrés dans une fiche de la carte).
> 3. Refactorer le pipeline de build en repo propre (scripts séparés, pas de gros fichiers générés à la main).
>
> Contrainte absolue : **tout doit être auto-contenu** (aucune ressource externe au runtime — voir §4). Garde la discipline anti-complexité : pas de framework, vanilla JS + SVG.

---

## 1. Le projet

Voyage d'un couple FR (36 & 45 ans), départ Paris, **3 premières semaines d'août (~21 j)**, confortable mais pas luxe. Style : authenticité, nature, pubs trad, musique live, paysages, balades faciles, cafés, librairies, villages, routes panoramiques, voyage **lent**, peu de changements d'hôtel.

Découpage : **10 j Irlande** (voiture) → vol **Dublin→Édimbourg** → **10 j Écosse** (voiture) → 1 j tampon. Pas de voiture dans Dublin/Édimbourg. **Éviter les journées > 3h30 de route.**

Itinéraire de base :
- **Irlande** : Dublin 3n · Killarney 4n · Galway 3n  *(carte à créer)*
- **Écosse** : Édimbourg 4n · Glencoe/Highlands 3n · Isle of Skye 3n · dernière nuit Loch Lomond ou Glasgow  *(carte FAITE)*

Livrables demandés au départ (8) : itinéraire jour/jour ; hébergements (3 options/étape : qualité-prix / charme / coup de cœur) ; restos & pubs trad ; carte road-trip (distances, temps, sites) ; budget 3 niveaux ; réservations à faire (priorités) ; pièges à éviter ; conseils pratiques (conduite à gauche, midges, paiement, téléphone, météo, pourboires, ferries, apps). **Seule la carte Écosse est faite** — le reste est du contenu déjà partiellement rédigé dans les fiches de la carte (voir `DATA.stages[].html`).

---

## 2. État actuel — `road-trip-ecosse.html` (~874 Ko, autonome)

Carte SVG **dessinée** de l'Écosse (pas de tuiles), 4 étapes + 11 sites + 3 trajets, fiches détaillées en bottom-sheet avec **photo incrustée (base64)** + illustration d'ambiance dessinée en SVG en repli. Pan/zoom tactile, menu Étapes, légende.

Tout le contenu (géométrie, données, photos) est **inline** dans le fichier. Aucun CDN, aucune image externe.

---

## 3. Architecture interne du HTML

Un seul fichier : `<style>` + markup + `<script>` vanilla. Pas de dépendance.

### 3.1 Données — objet `DATA` injecté en tête de script
```js
const DATA = {
  proj:    {LON0:-7.9, LAT1:58.9, cos:0.5439069495872503, k:291.83329768191567},
  paths:   [ "M x,y …Z", … ],          // contour Écosse, DÉJÀ projeté (voir §3.2)
  stages:  [ {n, name, nights, k, lat, lng, scene:{m,p}, photo:"data:image/jpeg;base64,…", html} ],
  sites:   [ {name, lat, lng, scene:{m,p}, photo:"data:…"|"", t} ],   // t = courte description
  segments:[ [[lat,lng],…], … ],       // 3 legs routiers
  badges:  [ {lat, lng, label, warn:bool, title, sub, scene:{m,p}, html} ]  // pastilles temps de route
};
```
- `scene` : `{m:motif, p:palette}` pour l'illustration d'ambiance (voir §3.3).
- `photo` : data-URI base64 (820 px, JPEG q72) ou `""` (→ illustration seule).
- `html` : contenu riche de la fiche (esprit du lieu, balades, pubs/musique, 3 hébergements, encadrés `.tip`/`.warn`).

### 3.2 Projection (équirectangulaire centrée)
```js
function proj(lat,lng){ return [ (lng-LON0)*cos*k , (LAT1-lat)*k ]; }
```
Espace SVG de référence pour le contour complet : **W≈1000, H≈1079.8** (bbox Écosse `lon -7.9..-1.6`, `lat 55.2..58.9`). `DATA.paths` est déjà dans cet espace ; en JS on reprojette seulement les marqueurs/segments avec la **même** formule. Source géométrie : Natural Earth 10m (`datasets/geo-countries` → feature *United Kingdom*), clip `box(-7.9,55.2,-1.6,58.9)`, `simplify(0.006°)`.

### 3.3 Illustrations d'ambiance — `sceneSVG(motif, palette)`
Générateur SVG 400×200 (ciel dégradé + soleil + brume + silhouettes + oiseaux).
- **Motifs** : `peaks`, `pinnacles`, `lighthouse`, `castleCrag`, `castleIslet`, `viaduct`, `calmLoch`.
- **Palettes** : `dusk`, `misty`, `blue`, `gold`, `rose` (chacune `{sky:[3], sun, sil, water}`).
Sert de fond toujours visible ; la photo base64 se superpose par-dessus quand elle charge.

### 3.4 Rendu carte & interactions
- Marqueurs **taille pixel constante** : groupes SVG avec `transform=translate(x,y) scale(vb.w/VB0W)` recalculé à chaque changement de vue.
- Traits de route : `vector-effect:non-scaling-stroke` (épaisseur constante).
- **Pan/zoom** : manipulation du `viewBox` via Pointer Events — 1 doigt = pan, 2 doigts = pinch, molette = zoom, boutons `+/−`. Aspect du viewBox aligné sur le conteneur (pas de letterbox).
- **Fiches** : bottom-sheet (`#sheet` + `#scrim`), hero = `sceneSVG()` + `<img>` base64, corps = `rec.html`. Discrimination tap/drag via flag `dragged`.

---

## 4. ⚠️ Contraintes APPRISES (ne pas réapprendre à la dure)

1. **Le webview d'artifact de l'app Claude bloque toute ressource externe au runtime** (tuiles de carte ET images distantes). → Première version Leaflet = carte grise. C'est pourquoi : (a) la carte est **dessinée** depuis un contour GeoJSON projeté et embarqué en SVG ; (b) les photos sont **base64**. **Toute nouvelle carte (Irlande) doit suivre ce principe.**
2. **L'egress du conteneur Claude est sur allowlist** : seuls GitHub (`github.com`, `raw.githubusercontent.com`, `codeload`, `api.github.com`), PyPI, npm, mirrors Ubuntu. **Wikimedia, Unsplash, VisitScotland = `host_not_allowed`.** → Claude **ne peut pas télécharger d'images** lui-même ; c'est le user qui les fournit (fait pour l'Écosse). `web_fetch` ne permet pas d'écrire les octets sur disque → inutilisable pour l'incrustation.
3. **Pas de `localStorage`/`sessionStorage`** dans les artifacts (échouent). État en mémoire JS uniquement.
4. **Photos** : Wikimedia Commons, licences **CC/CC0** → OK usage privé ; **créditer les auteurs si publication**. Pour récupérer auteur/licence : remplacer `Special:FilePath/` par `File:` dans l'URL Commons.

---

## 5. Inventaire des fichiers transmis

`road-trip-ecosse.html` + ces 10 images (nom de fichier → lieu → item DATA) :

| Fichier | Lieu | Utilisé pour |
|---|---|---|
| `Edimbourg__La_vieille_ville_vue_de_Calton_Hill.jpg` | Édimbourg | stage 1 |
| `Scotland_Glencoe.jpg` | Glen Coe (vallée) | stage 2 |
| `Old_Man_of_Storr__Isle_of_Skye__Scotland_-_Diliff.jpg` | Old Man of Storr | stage 3 (Skye) + site « Old Man of Storr » |
| `Loch_Lomond_Looking_North.jpg` | Loch Lomond | stage 4 |
| `Stirling_Castle__9816024725_.jpg` | Château de Stirling | site |
| `Glencoe__Scotland__15_Sept__2010_-_Flickr_-_PhillipC.jpg` | Buachaille Etive (Glencoe/Etive) | sites « Three Sisters » + « Glen Etive » |
| `Glenfinnan_Viaduct_-_geograph_org_uk_-_4704474.jpg` | Viaduc de Glenfinnan | site |
| `Eilean_Donan_Castle__Scotland_-_Jan_2011.jpg` | Eilean Donan | site |
| `Quiraing__Isle_of_Skye__Scotland_-_Diliff.jpg` | Quiraing | site |
| `Neist_Point_Lighthouse_Skye.jpg` | Neist Point | site |

Sans photo (illustration seule) : **Rannoch Moor, Fairy Pools, Distillerie Talisker**.

---

## 6. Recettes de build / extraction

### 6.1 Extraire `DATA` depuis le HTML (point de départ pour itérer)
```python
import re, json
h = open("road-trip-ecosse.html").read()
DATA = json.loads(re.search(r"const DATA = (\{.*?\});\nconst PJ", h, re.S).group(1))
```

### 6.2 (Re)compresser + encoder une image en data-URI
```python
from PIL import Image; import io, base64
def datauri(path, w=820, q=72):
    im = Image.open(path).convert("RGB")
    if im.width > w: im = im.resize((w, round(im.height*w/im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, "JPEG", quality=q, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()
```

### 6.3 Régénérer le contour d'un pays (ex. Irlande) → chemins SVG projetés
```python
import json, math
from shapely.geometry import shape, box
# countries.geojson : raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson
uk_or_ie = next(shape(f["geometry"]) for f in json.load(open("countries.geojson"))["features"]
                if (f["properties"].get("ADMIN") or f["properties"].get("name")) == "Ireland")
LON0,LAT0,LON1,LAT1 = -10.8,51.3,-5.3,55.5          # bbox Irlande (à ajuster)
geo = uk_or_ie.intersection(box(LON0,LAT0,LON1,LAT1)).simplify(0.006, preserve_topology=True)
W=1000.0; latc=(LAT0+LAT1)/2; cos=math.cos(math.radians(latc)); k=W/((LON1-LON0)*cos)
def proj(lon,lat): return [round((lon-LON0)*cos*k,1), round((LAT1-lat)*k,1)]
# parcourir geoms → polygones → "M x,y …Z"
```
⚠ Note : l'Irlande politique inclut **Éire + Irlande du Nord** (UK). Pour la carte du voyage (Dublin/Killarney/Galway, tous en République), un contour de **l'île entière** est plus joli — récupérer `Ireland` **et** la partie NI du `United Kingdom`, ou utiliser un contour « île d'Irlande ». Recalculer `proj` et `VB0W` pour la nouvelle bbox.

### 6.4 Réassembler le HTML
Le HTML actuel a été produit par `template.html` (markup/CSS/JS avec placeholder `__DATA__`) :
```python
open("out.html","w").write(open("template.html").read().replace("__DATA__", json.dumps(DATA, ensure_ascii=False)))
```
`template.html` n'est **pas** transmis → soit le reconstituer en extrayant tout sauf le blob `DATA` du HTML, soit éditer le HTML directement (le blob `DATA` est sur une seule ligne `const DATA = {...};`).

### 6.5 Vérifs
```bash
node --check <(python3 -c "import re;print(re.search(r'<script>(.*)</script>',open('out.html').read(),re.S).group(1))")
```
Taille cible : garder < ~2–3 Mo. Photos 820 px / q72 ≈ 40–80 Ko chacune.

---

## 7. TODO / roadmap

**P1 — Carte Irlande** (même style/archi) : Dublin 3n, Killarney 4n (base Ring of Kerry/Dingle), Galway 3n (base Connemara/Burren/Cliffs of Moher). Contour île d'Irlande (§6.3), data.stages/sites/segments/badges, photos fournies par le user. Pièges connus à intégrer : Cliffs of Moher & Ring of Kerry bondés en août (tôt le matin / sens anti-horaire pour les cars), conduite à gauche, péages M50 Dublin (eFlow, payer sous 8j), Temple Bar = attrape-touristes.

**P2 — Itinéraire jour par jour (21 j)** : matin/aprem/soir + temps de route + météo, journées légères. Format Markdown, et/ou une fiche « Jour N » par étape dans la carte. Faits déjà établis Écosse : Édi→Glencoe ~2h45 ; Glencoe→Skye ~2h45 ; **Skye→Loch Lomond ~4h = seul leg > 3h30** (couper à Fort William/Glencoe). **Édimbourg en août = Fringe** (réserver tôt, foule). **Skye se réserve très tôt.**

**P3 — Budget 3 niveaux** (min / confort / premium) pour 2 pers. : vols (Paris→Dublin, Dublin→Édimbourg), 2 locations voiture, essence, hébergements, restos, pubs, activités. Tableau comparatif.

**P4 — Idées** : fusionner les 2 cartes (sélecteur Irlande/Écosse) ; data hébergements/restos en couches cliquables ; export PDF/print ; PWA hors-ligne ; bouton « réservations à faire » avec priorités ; i18n.

**Garde-fous** : vanilla JS + SVG, zéro dépendance runtime, tout auto-contenu, mobile-first (le user bosse au mobile), français.

---

## 8. Détails utiles (rappel contenu Écosse déjà rédigé)

Coordonnées étapes : Édimbourg `55.9533,-3.1883` · Glencoe `56.6839,-5.1050` · Portree/Skye `57.4125,-6.1956` · Loch Lomond/Luss `56.1006,-4.6386`.
Pubs/musique trad cités : Sandy Bell's & The Royal Oak (Édimbourg) ; Clachaig Inn & Ben Nevis Inn (Glencoe) ; The Old Inn Carbost, Sligachan, Stein Inn (Skye) ; Oak Tree Inn Balmaha / Òran Mór Glasgow.
Hébergements (qualité-prix / charme / coup de cœur) déjà proposés par étape dans `DATA.stages[].html`.

Bon courage — l'existant marche, étends-le proprement.
