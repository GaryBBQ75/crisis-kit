import type { Position } from "./feeds";
export type POI = Position & { id: string; name: string; kind: string };
export type Road = { name: string; points: [number, number][] };
export function localBounds(p: Position) {
  if (
    !Number.isFinite(p.lat) ||
    !Number.isFinite(p.lon) ||
    Math.abs(p.lat) > 85 ||
    Math.abs(p.lon) > 180
  )
    throw Error("Zone hors couverture");
  const dy = 1 / 111.32,
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
        : Array.isArray(e.nodes)
          ? e.nodes.flatMap((id: number) =>
              nodes.has(id) ? [nodes.get(id)!] : [],
            )
          : [];
    if (e.tags?.highway && points.length > 1)
      roads.push({ name: String(e.tags.name || ""), points });
    const kind =
      e.tags?.emergency === "defibrillator"
        ? "Défibrillateur"
        : names[e.tags?.amenity];
    if (kind && points.length) {
      pois.push({
        id: e.type + e.id,
        name: String(e.tags.name || kind),
        kind,
        lat: points.reduce((s, p) => s + p[0], 0) / points.length,
        lon: points.reduce((s, p) => s + p[1], 0) / points.length,
      });
    }
  }
  return { pois, roads };
}
