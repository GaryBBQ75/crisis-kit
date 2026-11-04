import { useState, useEffect, useRef } from "react";
import { get, set } from "idb-keyval";
import {
  LocateFixed,
  Download,
  MapPin,
  Search,
  ArrowUpRight,
  Check,
  Layers,
  RefreshCw,
  Navigation,
  X,
  Phone,
  ExternalLink,
  Compass,
  Map as MapIcon,
  WifiOff,
} from "lucide-react";
import WorldMap from "../components/WorldMap";
import { localBounds, parseLocalMap, type POI, type Road } from "../localMap";
import { dateLabel, distance, type Incident, type Position } from "../feeds";
import { usePersisted } from "../store";
import { fetchNearby } from "../nearby";
import { searchPlaces } from "../placeSearch";
import {
  poiCategories,
  poiCategory,
  Pictogram,
  type POICategory,
} from "../components/Pictogram";
export type LocalPack = {
  position: Position;
  received: number;
  pois: POI[];
  roads?: Road[];
  radiusKm?: number;
  nearbyRadiusKm?: number;
  sourceDate?: string;
};
export default function MapScreen({
  events,
  position,
  setPosition,
  focus,
  onSelect,
  online,
  initialCategory = "all",
}: {
  events: Incident[];
  position: Position | null;
  setPosition: (p: Position | null) => void;
  focus: Position | null;
  onSelect: (e: Incident) => void;
  online: boolean;
  initialCategory?: POICategory | "all";
}) {
  const [saved, savePack, ready] = usePersisted<LocalPack | null>(
    "local-pois-v1",
    null,
  );
  const [current, setCurrent] = useState<LocalPack | null>(null),
    [choosing, choose] = useState(false),
    [loading, busy] = useState(false),
    [message, msg] = useState(""),
    [query, setQuery] = useState(""),
    [results, setResults] = useState<Position[]>([]),
    [searching, setSearching] = useState(false),
    [category, setCategory] = useState<POICategory | "all">(initialCategory),
    [selected, setSelected] = useState<POI | null>(null),
    [showEvents, setShowEvents] = useState(!!focus),
    [lookAt, setLookAt] = useState<Position | null>(focus),
    [saving, setSaving] = useState(false),
    [locating, setLocating] = useState(false);
  const request = useRef<AbortController | null>(null);
  const version = useRef(0);
  const lastSearch = useRef(0);
  const local =
    current ||
    (saved && (!position || distance(position, saved.position) < 0.1)
      ? saved
      : null);
  const visible = (local?.pois || [])
    .filter((p) => category === "all" || poiCategory(p) === category)
    .sort((a, b) =>
      position
        ? distance(position, a) - distance(position, b)
        : a.name.localeCompare(b.name),
    );
  async function loadArea(p: Position, force = false, requestedRadius = 0) {
    const id = ++version.current;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    busy(true);
    msg("Chargement des lieux utiles…");
    setSelected(null);
    try {
      const key = `area-preview-v2-${p.lat.toFixed(4)}-${p.lon.toFixed(4)}-${requestedRadius || "auto"}`;
      if (!force) {
        const cache = await get<LocalPack>(key).catch(() => null);
        if (cache && Date.now() - cache.received < 86400000) {
          if (id === version.current) {
            setCurrent(cache);
            msg("");
          }
          return;
        }
      }
      let next: LocalPack;
      if (requestedRadius && current && distance(current.position, p) < 0.1)
        next = current;
      else {
        let radiusKm = 1;
        let r: Response;
        do {
          r = await fetch(
            `https://api.openstreetmap.org/api/0.6/map?bbox=${localBounds(p, radiusKm)}`,
            {
              headers: { Accept: "application/json" },
              signal: AbortSignal.any([
                controller.signal,
                AbortSignal.timeout(25000),
              ]),
            },
          );
          if (r.ok) break;
          if (r.status !== 400 || radiusKm <= 0.25) throw Error();
          radiusKm /= 2;
        } while (true);
        next = {
          position: p,
          received: Date.now(),
          radiusKm,
          ...parseLocalMap(await r.json()),
        };
      }
      if (id !== version.current || controller.signal.aborted) return;
      setCurrent(next);
      const wider = requestedRadius || (next.pois.length < 3 ? 10 : 0);
      if (wider) {
        msg(`Recherche des lieux dans un rayon de ${wider} km…`);
        try {
          const data = await fetchNearby(p, wider, controller.signal);
          if (id !== version.current || controller.signal.aborted) return;
          const pois = parseLocalMap(data).pois.filter(
            (poi) => distance(p, poi) <= wider,
          );
          next = {
            ...next,
            pois,
            nearbyRadiusKm: wider,
            sourceDate: data.osm3s?.timestamp_osm_base,
            received: Date.now(),
          };
          setCurrent(next);
        } catch {
          if (!controller.signal.aborted && id === version.current)
            msg(
              "La recherche élargie est indisponible. Seuls les lieux de la dernière zone chargée sont affichés ; vous pouvez réessayer.",
            );
          return;
        }
      }
      msg(
        next.pois.length
          ? wider
            ? `Recherche élargie : ${next.pois.length} lieux dans un rayon de ${wider} km.`
            : ""
          : "Aucun lieu renseigné dans cette zone. Essayez un rayon plus grand ; cela ne signifie pas qu’aucun service n’existe.",
      );
      await set(key, next).catch(() => {});
    } catch {
      if (!controller.signal.aborted && id === version.current)
        msg(
          "Les lieux ne peuvent pas être chargés pour le moment. Réessayez ou choisissez une zone moins dense. Votre pack hors ligne est conservé.",
        );
    } finally {
      if (id === version.current) busy(false);
    }
  }
  useEffect(() => {
    setCurrent(null);
    setSelected(null);
    if (position && online) void loadArea(position);
    else {
      request.current?.abort();
      version.current++;
      busy(false);
      msg("");
    }
    return () => {
      request.current?.abort();
      version.current++;
    };
  }, [position?.lat, position?.lon, online]);
  function selectArea(p: Position) {
    setPosition(p);
    setLookAt(null);
    choose(false);
    setResults([]);
    setQuery(p.label || "");
  }
  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (
      !online ||
      searching ||
      Date.now() - lastSearch.current < 1200 ||
      query.trim().length < 2
    )
      return;
    lastSearch.current = Date.now();
    setSearching(true);
    msg("");
    try {
      const places = await searchPlaces(query);
      setResults(places);
      if (!places.length)
        msg(
          "Aucun lieu trouvé. Essayez le nom d’une ville ou choisissez un point sur la carte.",
        );
    } catch {
      msg(
        "Recherche momentanément indisponible. Vous pouvez choisir votre zone sur la carte.",
      );
    } finally {
      setSearching(false);
    }
  }
  function locate() {
    if (!navigator.geolocation) {
      msg("Localisation indisponible. Utilisez la recherche ou la carte.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        selectArea({
          lat: p.coords.latitude,
          lon: p.coords.longitude,
          label: "Autour de ma position",
        });
        setLocating(false);
      },
      () => {
        msg(
          "Position inaccessible. Choisissez une ville ou un point sur la carte.",
        );
        setLocating(false);
      },
      { timeout: 12000, maximumAge: 60000 },
    );
  }
  async function save() {
    if (!local) return;
    setSaving(true);
    try {
      await set("local-pois-v1", local);
      savePack(local);
      msg(
        "Pack enregistré : les lieux et les rues de la zone locale restent accessibles sans réseau.",
      );
    } catch {
      msg(
        "Enregistrement impossible. Vérifiez l’espace disponible sur cet appareil.",
      );
    } finally {
      setSaving(false);
    }
  }
  const savedHere =
    !!local &&
    saved?.received === local.received &&
    distance(saved.position, local.position) < 0.1;
  function selectPOI(p: POI) {
    setSelected(p);
    setLookAt({ ...p });
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            <Compass size={14} /> SE REPÉRER · TROUVER DES RESSOURCES
          </p>
          <h2>
            Les bons repères,
            <br className="mobile-only" /> autour de vous.
          </h2>
          <p className="muted">
            Soins, eau, pharmacie : des lieux concrets à retrouver facilement.
          </p>
        </div>
        <span className="page-stamp">
          <MapIcon />
          <small>
            CARTE
            <br />
            DE PROXIMITÉ
          </small>
        </span>
      </div>
      <div className="map-search-bar">
        <form onSubmit={search}>
          <Search size={20} />
          <input
            aria-label="Rechercher une ville ou un lieu"
            placeholder="Rechercher une ville ou un lieu…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={!online}
          />
          <button
            type="submit"
            disabled={!online || searching || query.trim().length < 2}
          >
            {searching ? "Recherche…" : "Chercher"}
          </button>
        </form>
        <button
          className="location-button"
          onClick={locate}
          disabled={locating}
        >
          <LocateFixed size={19} />
          <span>{locating ? "Localisation…" : "Autour de moi"}</span>
        </button>
      </div>
      {results.length > 0 && (
        <div className="place-results" aria-label="Résultats de recherche">
          {results.map((p, i) => (
            <button key={i} onClick={() => selectArea(p)}>
              <MapPin size={18} />
              <span>{p.label}</span>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      )}
      <p className="privacy-caption">
        Recherche : Photon / OpenStreetMap. Choisir un lieu charge sa zone
        auprès d’OpenStreetMap et des services Overpass (Dresel en Europe) ;
        aucun suivi continu de position.
      </p>
      {position && (
        <div className="search-radius">
          <div>
            <strong>
              {local?.nearbyRadiusKm
                ? `Lieux dans un rayon de ${local.nearbyRadiusKm} km`
                : `Zone locale : environ ${2 * (local?.radiusKm ?? 1)} × ${2 * (local?.radiusKm ?? 1)} km`}
            </strong>
            <small>
              Élargissez pour trouver les services des communes voisines.
            </small>
          </div>
          <div className="radius-options" aria-label="Rayon de recherche">
            {[5, 10, 25].map((km) => (
              <button
                key={km}
                disabled={!online || loading}
                aria-pressed={local?.nearbyRadiusKm === km}
                onClick={() => {
                  setLookAt(null);
                  void loadArea(position, false, km);
                }}
              >
                {km} km
              </button>
            ))}
            <button
              className="icon-button"
              aria-label="Actualiser les lieux"
              disabled={!online || loading}
              onClick={() =>
                void loadArea(position, true, local?.nearbyRadiusKm || 0)
              }
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      )}
      <div className="poi-filter-bar">
        <button
          className={category === "all" ? "active" : ""}
          onClick={() => setCategory("all")}
        >
          <Layers size={17} /> Tous <span>{local?.pois.length ?? "—"}</span>
        </button>
        {Object.entries(poiCategories).map(([k, c]) => (
          <button
            key={k}
            style={
              {
                "--poi-color": c.color,
                "--poi-tint": c.tint,
              } as React.CSSProperties
            }
            className={category === k ? "active" : ""}
            onClick={() => setCategory(k as POICategory)}
          >
            <c.icon size={18} />
            {c.label}
            <span>
              {local?.pois.filter((p) => poiCategory(p) === k).length ?? "—"}
            </span>
          </button>
        ))}
      </div>
      <div className="resource-layout">
        <div className="resource-map">
          <div className="map-floating-tools">
            <button
              onClick={() => choose(!choosing)}
              className={choosing ? "selected" : ""}
            >
              <MapPin size={16} />
              {choosing ? "Annuler" : "Choisir sur la carte"}
            </button>
            <button
              aria-pressed={showEvents}
              onClick={() => setShowEvents(!showEvents)}
            >
              <Layers size={16} /> Événements
            </button>
          </div>
          {choosing && (
            <div className="map-help">
              Touchez la carte pour rechercher les lieux autour de ce point.
            </div>
          )}
          <WorldMap
            events={showEvents ? events : []}
            position={position}
            focus={lookAt}
            onSelect={onSelect}
            online={online}
            pois={visible}
            roads={local?.roads || []}
            onPOISelect={selectPOI}
            choose={choosing ? selectArea : undefined}
            resourceView
            searchRadiusKm={local?.nearbyRadiusKm}
          />
          {loading && (
            <div className="map-loading" role="status">
              <RefreshCw size={16} className="spin" /> Recherche des lieux
              utiles…
            </div>
          )}
          {!position && !focus && (
            <div className="map-start">
              <Pictogram icon={Navigation} />
              <h3>Votre point de départ</h3>
              <p>
                Choisissez une ville ou utilisez votre position pour afficher
                les lieux utiles.
              </p>
              <button
                onClick={() =>
                  selectArea({
                    lat: 48.8535,
                    lon: 2.3484,
                    label: "Paris, France · exemple",
                  })
                }
              >
                Explorer Paris en exemple <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </div>
        <aside className="resource-panel">
          {selected ? (
            <>
              <div className="panel-top">
                <span className="eyebrow">FICHE DU LIEU</span>
                <button
                  className="icon-button"
                  onClick={() => setSelected(null)}
                  aria-label="Fermer la fiche du lieu"
                >
                  <X size={17} />
                </button>
              </div>
              <POIDetail poi={selected} origin={position} />
            </>
          ) : (
            <>
              <div className="panel-top">
                <div>
                  <p className="eyebrow">DANS LA ZONE CHOISIE</p>
                  <h3>
                    {category === "all"
                      ? "Les lieux utiles"
                      : poiCategories[category].label}{" "}
                    <span>{visible.length}</span>
                  </h3>
                </div>
                <MapPin size={20} />
              </div>
              <p className="panel-location">
                {position?.label || "Aucune zone sélectionnée"}
                {local && (
                  <small>
                    Relevé du {dateLabel(local.received)}
                    {local.sourceDate &&
                      ` · source du ${dateLabel(Date.parse(local.sourceDate))}`}
                  </small>
                )}
              </p>
              <div className="poi-list">
                {visible.map((p) => {
                  const c = poiCategories[poiCategory(p)];
                  return (
                    <button key={p.id} onClick={() => selectPOI(p)}>
                      <span
                        className="poi-symbol"
                        style={{ color: c.color, background: c.tint }}
                      >
                        <c.icon size={21} />
                      </span>
                      <span>
                        <strong>{p.name}</strong>
                        <small>{p.kind}</small>
                        {position && (
                          <em>
                            {formatDistance(distance(position, p))} · à vol
                            d’oiseau
                          </em>
                        )}
                      </span>
                      <ArrowUpRight size={15} />
                    </button>
                  );
                })}
                {!visible.length && (
                  <div className="resource-empty">
                    <MapPin size={28} />
                    <p>
                      {loading
                        ? "Les lieux vont apparaître ici."
                        : position
                          ? "Aucun lieu de cette catégorie dans les données chargées."
                          : "Les hôpitaux, points d’eau et autres repères apparaîtront ici."}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="resource-panel-footer">
            <span className="mini-dot" /> Données cartographiques · ouverture
            non confirmée
          </div>
        </aside>
      </div>
      {position && online && !loading && !local && (
        <button onClick={() => void loadArea(position, true)}>
          <RefreshCw size={16} /> Réessayer les lieux
        </button>
      )}
      {message && (
        <p className="notice" role="status">
          {message}
        </p>
      )}
      <div className="map-bottom-grid">
        <section className="offline-strip">
          <Pictogram icon={Download} tone="navy" />
          <div>
            <p className="eyebrow">GARDER CES REPÈRES AVEC SOI</p>
            <h3>
              {savedHere
                ? "Cette zone est enregistrée"
                : "Votre carte, même sans réseau"}
            </h3>
            <p>
              {local?.nearbyRadiusKm
                ? `Lieux sauvegardés jusqu’à ${local.nearbyRadiusKm} km. Rues simplifiées uniquement sur `
                : "Lieux et tracés simplifiés sur environ "}
              {2 * (local?.radiusKm ?? 1)} × {2 * (local?.radiusKm ?? 1)} km.
              Sans itinéraires ni disponibilité en direct.
            </p>
          </div>
          <button
            className="primary"
            disabled={!local || saving || !ready || savedHere}
            onClick={save}
          >
            {savedHere ? <Check size={17} /> : <Download size={17} />}{" "}
            {savedHere
              ? "Enregistrée"
              : saving
                ? "Enregistrement…"
                : "Garder hors ligne"}
          </button>
        </section>
      </div>
      <details className="map-info">
        <summary>Comprendre les informations de la carte</summary>
        <p>
          Source : OpenStreetMap (ODbL). Couverture partielle : un lieu absent
          peut exister sur le terrain. « Eau » désigne les points renseignés
          comme eau potable dans la carte, sans contrôle sanitaire en temps
          réel. Un abri cartographié n’est pas nécessairement adapté au danger
          en cours. Les hôpitaux n’ont pas tous un service d’urgence.
        </p>
        <p>
          Les horaires et coordonnées sont déclaratifs. Les consignes locales
          priment. Les points d’événements ne représentent pas des périmètres de
          danger.
        </p>
        {saved && (
          <button
            onClick={() => {
              selectArea(saved.position);
              setCurrent(saved);
            }}
          >
            Revenir au pack enregistré
          </button>
        )}
        {position && (
          <button
            className="text-button"
            onClick={() => {
              setPosition(null);
              setLookAt(null);
              setQuery("");
            }}
          >
            Effacer ma zone
          </button>
        )}
      </details>
    </>
  );
}
function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}
function POIDetail({ poi, origin }: { poi: POI; origin: Position | null }) {
  const c = poiCategories[poiCategory(poi)],
    phone = poi.phone?.split(";")[0].trim();
  return (
    <div className="poi-detail">
      <span
        className="poi-detail-icon"
        style={{ color: c.color, background: c.tint }}
      >
        <c.icon size={36} />
      </span>
      <span className="eyebrow">{poi.kind}</span>
      <h3>{poi.name}</h3>
      {origin && (
        <p className="distance-label">
          <Navigation size={15} />
          {formatDistance(distance(origin, poi))} à vol d’oiseau
        </p>
      )}
      <dl>
        <dt>Adresse</dt>
        <dd>{poi.address || "Non renseignée"}</dd>
        <dt>Disponibilité</dt>
        <dd>Ouverture et accès non confirmés</dd>
        {poi.hours && (
          <>
            <dt>Horaires déclarés</dt>
            <dd>{poi.hours}</dd>
          </>
        )}
        {poi.access && (
          <>
            <dt>Accès déclaré</dt>
            <dd>{poi.access}</dd>
          </>
        )}
        {poi.emergency && (
          <>
            <dt>Indication d’urgence dans la source</dt>
            <dd>
              {poi.emergency === "yes"
                ? "Mentionné dans la carte, à confirmer"
                : poi.emergency === "no"
                  ? "Non indiqué comme service d’urgence"
                  : poi.emergency}
            </dd>
          </>
        )}
        <dt>Coordonnées</dt>
        <dd>
          {poi.lat.toFixed(5)}°, {poi.lon.toFixed(5)}°
        </dd>
      </dl>
      {phone && /^[+\d\s().-]+$/.test(phone) && (
        <a className="poi-phone" href={`tel:${phone.replace(/[\s().-]/g, "")}`}>
          <Phone size={17} />
          {phone}
        </a>
      )}
      <p className="small muted">
        {poiCategory(poi) === "water"
          ? "La potabilité actuelle n’est pas vérifiée. Suivez les avis du service d’eau."
          : poiCategory(poi) === "health"
            ? "Les services disponibles, notamment les urgences, sont à confirmer auprès de l’établissement."
            : "Les informations de la carte peuvent être incomplètes ou anciennes."}
      </p>
      {/^(node|way|relation)\d+$/.test(poi.id) && (
        <a
          className="source-link"
          target="_blank"
          rel="noreferrer"
          href={`https://www.openstreetmap.org/${poi.id.replace(/^(node|way|relation)/, "$1/")}`}
        >
          <ExternalLink size={15} /> Voir la fiche OpenStreetMap
        </a>
      )}
    </div>
  );
}
