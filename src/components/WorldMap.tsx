import { useEffect, useRef } from "react";
import L from "leaflet";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { poiCategory, poiCategories } from "./Pictogram";
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
  onPOISelect,
  resourceView = false,
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
  onPOISelect?: (p: POI) => void;
  resourceView?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null),
    map = useRef<L.Map | null>(null),
    callback = useRef(onSelect),
    chooser = useRef(choose);
  const poiCallback = useRef(onPOISelect);
  poiCallback.current = onPOISelect;
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
          color: "#8b9da3",
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
      const c = poiCategories[poiCategory(p)];
      const icon = L.divIcon({
        className: "resource-marker",
        iconSize: [38, 44],
        iconAnchor: [19, 42],
        html: `<span style="--marker-color:${c.color}">${renderToStaticMarkup(createElement(c.icon, { size: 20, strokeWidth: 2, "aria-hidden": true }))}</span>`,
      });
      const marker = L.marker([p.lat, p.lon], {
        icon,
        title: p.name,
        alt: p.name,
        keyboard: true,
        bubblingMouseEvents: false,
      }).addTo(group);
      const title = document.createElement("div");
      title.textContent = p.name + " · " + p.kind;
      marker.bindTooltip(title, { direction: "top", offset: [0, -36] });
      marker.on("click", () => poiCallback.current?.(p));
    }
    if (position) {
      L.circleMarker([position.lat, position.lon], {
        radius: 8,
        color: "#fff",
        fillColor: "#213d4b",
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
    if (p)
      map.current?.setView(
        [p.lat, p.lon],
        compact ? 5 : focus ? (resourceView ? 16 : 10) : 15,
      );
  }, [focus, position, compact, resourceView]);
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
