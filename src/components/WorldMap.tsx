import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { colors, type Incident, type Position } from "../feeds";
import type { POI, Road } from "../localMap";
export default function WorldMap({
  events,
  position,
  focus,
  onSelect,
  online,
  pois = [],
  roads = [],
  compact = false,
  choose,
}: {
  events: Incident[];
  position: Position | null;
  focus?: Position | null;
  onSelect: (e: Incident) => void;
  online: boolean;
  pois?: POI[];
  roads?: Road[];
  compact?: boolean;
  choose?: (p: Position) => void;
}) {
  const el = useRef<HTMLDivElement>(null),
    map = useRef<L.Map | null>(null),
    callback = useRef(onSelect),
    chooser = useRef(choose);
  callback.current = onSelect;
  chooser.current = choose;
  useEffect(() => {
    if (!el.current) return;
    const m = L.map(el.current, {
      zoomControl: !compact,
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView([24, 12], 2);
    map.current = m;
    m.attributionControl.addAttribution(
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    );
    m.on("click", (e: L.LeafletMouseEvent) =>
      chooser.current?.({
        lat: e.latlng.lat,
        lon: ((((e.latlng.lng + 180) % 360) + 360) % 360) - 180,
        label: "Zone choisie sur la carte",
      }),
    );
    const observer = new ResizeObserver(() => m.invalidateSize());
    observer.observe(el.current);
    return () => {
      observer.disconnect();
      m.remove();
      map.current = null;
    };
  }, [compact]);
  useEffect(() => {
    const m = map.current;
    if (!m || !online) return;
    const layer = L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "",
        maxZoom: 19,
      },
    ).addTo(m);
    return () => {
      m.removeLayer(layer);
    };
  }, [online, compact]);
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const group = L.layerGroup().addTo(m);
    if (!online)
      for (const road of roads) {
        const line = L.polyline(road.points, {
          color: "#688d78",
          weight: 2,
          opacity: 0.7,
        }).addTo(group);
        if (road.name) {
          const text = document.createElement("span");
          text.textContent = road.name;
          line.bindTooltip(text);
        }
      }
    for (const e of events) {
      const marker = L.circleMarker([e.lat, e.lon], {
        radius: compact ? 4 : 7,
        color: colors[e.kind],
        fillColor: colors[e.kind],
        fillOpacity: 0.8,
        weight: 1,
      }).addTo(group);
      const title = document.createElement("span");
      title.textContent = e.title;
      marker.bindTooltip(title);
      marker.on("click", () => callback.current(e));
    }
    for (const p of pois) {
      const marker = L.circleMarker([p.lat, p.lon], {
        radius: 6,
        color: "#7cd4b4",
        fillOpacity: 0.7,
      }).addTo(group);
      const title = document.createElement("div");
      title.textContent =
        p.name + " · " + p.kind + " · disponibilité non confirmée";
      marker.bindPopup(title);
    }
    if (position) {
      L.circleMarker([position.lat, position.lon], {
        radius: 8,
        color: "#fff",
        fillColor: "#83ccb5",
        fillOpacity: 1,
        weight: 3,
      }).addTo(group);
    }
    return () => {
      m.removeLayer(group);
    };
  }, [events, position, pois, roads, online, compact]);
  useEffect(() => {
    const p = focus || position;
    if (p) map.current?.setView([p.lat, p.lon], compact ? 5 : focus ? 10 : 14);
  }, [focus, position, compact]);
  return (
    <div className={`map-wrap ${compact ? "compact-map" : ""}`}>
      <div
        ref={el}
        className="map-canvas"
        aria-label="Carte des événements et points enregistrés"
      />
      {!online && (
        <div className="map-notice">
          Hors ligne : tracés et points enregistrés · carte partielle, aucune
          disponibilité en direct
        </div>
      )}
    </div>
  );
}
