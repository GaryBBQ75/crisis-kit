import type { Position } from "./feeds";
export type POI = Position & {
  id: string;
  name: string;
  kind: string;
  category?: string;
  address?: string;
  phone?: string;
  hours?: string;
  access?: string;
  emergency?: string;
};
export type Road = { name: string; points: [number, number][] };
export function localBounds(p: Position, radiusKm = 1) {
  if (
    !Number.isFinite(p.lat) ||
    !Number.isFinite(p.lon) ||
    Math.abs(p.lat) > 85 ||
    Math.abs(p.lon) > 180
  )
    throw Error("Zone hors couverture");
  const dy = radiusKm / 111.32,
    dx = Math.min(0.1, dy / Math.cos((p.lat * Math.PI) / 180));
  return [
    Math.max(-180, p.lon - dx),
    p.lat - dy,
    Math.min(180, p.lon + dx),
    p.lat + dy,
  ].join(",");
}
export function parseLocalMap(d: any): { pois: POI[]; roads: Road[] } {
  if (!Array.isArray(d?.elements)) throw Error("Carte invalide");
  const nodes = new Map<number, [number, number]>();
  for (const e of d.elements)
    if (
      e.type === "node" &&
      Number.isFinite(e.lat) &&
      Number.isFinite(e.lon) &&
      Math.abs(e.lat) <= 90 &&
      Math.abs(e.lon) <= 180
    )
      nodes.set(e.id, [e.lat, e.lon]);
  const names: Record<string, string> = {
    hospital: "Hôpital",
    clinic: "Centre de soins",
    pharmacy: "Pharmacie",
    drinking_water: "Point d’eau cartographié",
    fire_station: "Caserne",
    police: "Police",
    shelter: "Abri cartographié (usage à vérifier)",
    toilets: "Sanitaires",
  };
  const pois: POI[] = [],
    roads: Road[] = [];
  for (const e of d.elements) {
    const points: [number, number][] =
      e.type === "node"
        ? nodes.has(e.id)
          ? [nodes.get(e.id)!]
          : []
        : Number.isFinite(e.center?.lat) &&
            Number.isFinite(e.center?.lon) &&
            Math.abs(e.center.lat) <= 90 &&
            Math.abs(e.center.lon) <= 180
          ? [[e.center.lat, e.center.lon]]
          : Array.isArray(e.nodes)
            ? e.nodes.flatMap((id: number) =>
                nodes.has(id) ? [nodes.get(id)!] : [],
              )
            : [];
    if (e.tags?.highway && points.length > 1)
      roads.push({ name: String(e.tags.name || ""), points });
    const healthcare = e.tags?.healthcare;
    const kind =
      e.tags?.emergency === "defibrillator"
        ? "Défibrillateur"
        : names[e.tags?.amenity] ||
          (healthcare === "pharmacy" ? "Pharmacie" : undefined) ||
          (healthcare === "hospital"
            ? "Hôpital"
            : healthcare === "clinic"
              ? "Centre de soins"
              : undefined);
    if (kind && points.length) {
      pois.push({
        id: e.type + e.id,
        name: String(e.tags.name || kind),
        kind,
        category:
          e.tags?.emergency === "defibrillator"
            ? "aed"
            : e.tags?.amenity === "drinking_water"
              ? "water"
              : e.tags?.amenity === "pharmacy" || healthcare === "pharmacy"
                ? "pharmacy"
                : e.tags?.amenity === "shelter"
                  ? "shelter"
                  : e.tags?.amenity === "toilets"
                    ? "toilets"
                    : ["police", "fire_station"].includes(e.tags?.amenity)
                      ? "rescue"
                      : "health",
        address: [
          e.tags?.["addr:housenumber"],
          e.tags?.["addr:street"],
          e.tags?.["addr:postcode"],
          e.tags?.["addr:city"],
        ]
          .filter(Boolean)
          .join(" "),
        phone: e.tags?.phone || e.tags?.["contact:phone"],
        hours: e.tags?.opening_hours,
        access: e.tags?.access,
        emergency: e.tags?.emergency,
        lat: points.reduce((s, p) => s + p[0], 0) / points.length,
        lon: points.reduce((s, p) => s + p[1], 0) / points.length,
      });
    }
  }
  return { pois, roads };
}
