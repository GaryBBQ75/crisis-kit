import { useState } from "react";
import { set } from "idb-keyval";
import { LocateFixed, Download, MapPin, Trash2 } from "lucide-react";
import WorldMap from "../components/WorldMap";
import { localBounds, parseLocalMap, type POI, type Road } from "../localMap";
import { dateLabel, type Incident, type Position } from "../feeds";
import { usePersisted } from "../store";
export type LocalPack = {
  position: Position;
  received: number;
  pois: POI[];
  roads?: Road[];
};
export default function MapScreen({
  events,
  position,
  setPosition,
  focus,
  onSelect,
  online,
}: {
  events: Incident[];
  position: Position | null;
  setPosition: (p: Position | null) => void;
  focus: Position | null;
  onSelect: (e: Incident) => void;
  online: boolean;
}) {
  const [pack, savePack, ready] = usePersisted<LocalPack | null>(
    "local-pois-v1",
    null,
  );
  const [choosing, choose] = useState(false);
  const [loading, busy] = useState(false);
  const [message, msg] = useState("");
  function locate() {
    if (!navigator.geolocation) {
      msg("Localisation indisponible. Choisissez votre zone sur la carte.");
      return;
    }
    msg("Recherche de votre position…");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPosition({
          lat: p.coords.latitude,
          lon: p.coords.longitude,
          label: "Ma position enregistrée",
        });
        msg("Position enregistrée sur cet appareil.");
      },
      () =>
        msg(
          "Position inaccessible. Vous pouvez choisir un point sur la carte.",
        ),
      { timeout: 12000 },
    );
  }
  async function download() {
    if (!position || loading) return;
    busy(true);
    msg("Téléchargement du plan et des lieux dans une zone de 2 × 2 km…");
    try {
      const r = await fetch(
        `https://api.openstreetmap.org/api/0.6/map?bbox=${localBounds(position)}`,
        {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(25000),
        },
      );
      if (!r.ok) throw Error();
      const { pois, roads } = parseLocalMap(await r.json());
      const next = { position, received: Date.now(), pois, roads };
      await set("local-pois-v1", next);
      savePack(next);
      msg(
        `${pois.length} lieux ajoutés au pack local. Leur ouverture et leur disponibilité ne sont pas vérifiées.`,
      );
    } catch {
      msg(
        "Téléchargement impossible. Le pack précédent est conservé. Réessayez plus tard.",
      );
    } finally {
      busy(false);
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SE REPÉRER</p>
          <h2>Votre carte</h2>
          <p className="muted">
            Événements mondiaux et ressources de proximité.
          </p>
        </div>
      </div>
      <div className="toolbar">
        <button onClick={locate}>
          <LocateFixed size={17} /> Me localiser
        </button>
        <button
          className={choosing ? "selected" : ""}
          onClick={() => choose(!choosing)}
        >
          <MapPin size={17} />
          {choosing ? "Annuler" : "Choisir une zone"}
        </button>
      </div>
      {choosing && (
        <p className="notice">
          Touchez un point vide de la carte pour enregistrer votre zone.
        </p>
      )}
      <WorldMap
        events={events}
        position={position}
        focus={focus}
        onSelect={onSelect}
        online={online}
        pois={pack?.pois}
        roads={pack?.roads}
        choose={
          choosing
            ? (p) => {
                setPosition(p);
                choose(false);
                msg("Zone enregistrée.");
              }
            : undefined
        }
      />
      <div className="map-legend">
        <span>
          <i style={{ background: "#eebd69" }} /> Séismes
        </span>
        <span>
          <i style={{ background: "#f18d72" }} /> Feux
        </span>
        <span>
          <i style={{ background: "#8fa7ef" }} /> Tempêtes
        </span>
        <span>
          <i style={{ background: "#7cd4b4" }} /> Lieux utiles
        </span>
      </div>
      <p className="small muted">
        Points indicatifs, pas des zones sûres ni des itinéraires d’évacuation.
        Les distances sont à vol d’oiseau.
      </p>
      <section className="card">
        <p className="eyebrow">MON PACK LOCAL</p>
        <h3>{position?.label || "Choisissez une zone"}</h3>
        {position && (
          <p className="muted">
            {position.lat.toFixed(3)}°, {position.lon.toFixed(3)}° · zone
            d’environ 2 × 2 km
          </p>
        )}
        <p>
          Enregistrez les lieux utiles et les rues dans un carré d’environ 2 × 2
          km pour les consulter sans réseau. Ce plan partiel ne calcule pas
          d’itinéraire et ne garantit pas qu’une route est praticable.
        </p>
        <button
          className="primary"
          disabled={!online || !position || loading || !ready}
          onClick={download}
        >
          <Download size={17} />
          {loading ? "Téléchargement…" : "Télécharger mon pack local"}
        </button>
        <p className="small muted">
          Cette action transmet la zone choisie à l’API OpenStreetMap.
          Téléchargement ponctuel limité à une petite zone ; les zones très
          denses peuvent être refusées par la source.
        </p>
        {message && (
          <p role="status" className="notice">
            {message}
          </p>
        )}
        {pack && (
          <>
            <div className="source-row">
              <span>
                {pack.pois.length} lieux · {pack.roads?.length || 0} tronçons ·{" "}
                {dateLabel(pack.received)}
              </span>
              <button
                className="icon-button"
                aria-label="Supprimer les lieux enregistrés"
                onClick={() => savePack(null)}
              >
                <Trash2 size={17} />
              </button>
            </div>
            <p className="small muted">
              Source : OpenStreetMap, licence ODbL. Eau potable et abris : usage
              à vérifier auprès des autorités, particulièrement pendant une
              crise.
            </p>
            <details>
              <summary>Consulter la liste hors ligne</summary>
              {pack.pois.map((p) => (
                <div className="source-row" key={p.id}>
                  <div>
                    <strong>{p.name}</strong>
                    <p>{p.kind}</p>
                    <small>
                      {p.lat.toFixed(4)}°, {p.lon.toFixed(4)}°
                    </small>
                  </div>
                </div>
              ))}
            </details>
          </>
        )}
        {position && (
          <button className="text-button" onClick={() => setPosition(null)}>
            Effacer ma zone de surveillance
          </button>
        )}
      </section>
    </>
  );
}
