export type Kind =
  "earthquake" | "wildfire" | "storm" | "volcano" | "flood" | "other";
export type Position = { lat: number; lon: number; label?: string };
export type Incident = Position & {
  id: string;
  title: string;
  kind: Kind;
  time: number;
  source: "USGS" | "NASA EONET";
  url: string;
  magnitude?: number;
  depth?: number;
};
export type Feed = { received: number; events: Incident[] };
export const labels: Record<Kind, string> = {
  earthquake: "Séismes",
  wildfire: "Incendies",
  storm: "Tempêtes",
  volcano: "Volcans",
  flood: "Inondations",
  other: "Autres événements",
};
export const colors: Record<Kind, string> = {
  earthquake: "#eebd69",
  wildfire: "#f18d72",
  storm: "#8fa7ef",
  volcano: "#ce9ee8",
  flood: "#65bdd5",
  other: "#a5c4b4",
};
export function distance(a: Position, b: Position) {
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) *
      Math.cos(b.lat * r) *
      Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, h)));
}
function coords(c: any): boolean {
  return (
    Array.isArray(c) &&
    Number.isFinite(c[0]) &&
    Number.isFinite(c[1]) &&
    Math.abs(c[0]) <= 180 &&
    Math.abs(c[1]) <= 90
  );
}
function safeURL(s: string, host: string) {
  const u = new URL(s);
  if (u.protocol !== "https:" || u.hostname !== host)
    throw Error("Source invalide");
  return u.href;
}
export function parseUSGS(d: any): Incident[] {
  if (d?.type !== "FeatureCollection" || !Array.isArray(d.features))
    throw Error("Flux invalide");
  return d.features
    .filter((f: any) => f.properties?.type === "earthquake")
    .flatMap((f: any) => {
      const p = f.properties,
        c = f.geometry?.coordinates;
      if (
        !coords(c) ||
        !Number.isFinite(p.time) ||
        !Number.isFinite(p.mag) ||
        typeof f.id !== "string"
      )
        return [];
      return [
        {
          id: "usgs-" + f.id,
          title: String(p.place || "Lieu non précisé"),
          kind: "earthquake" as Kind,
          time: p.time,
          source: "USGS" as const,
          url: safeURL(p.url, "earthquake.usgs.gov"),
          lat: c[1],
          lon: c[0],
          magnitude: p.mag,
          depth: c[2],
        },
      ];
    });
}
export function parseNASA(d: any): Incident[] {
  if (!Array.isArray(d?.events)) throw Error("Flux invalide");
  const kinds: Record<string, Kind> = {
    wildfires: "wildfire",
    severeStorms: "storm",
    volcanoes: "volcano",
    floods: "flood",
  };
  return d.events.flatMap((e: any) => {
    const g = e.geometry
      ?.filter(
        (g: any) =>
          g.type === "Point" &&
          coords(g.coordinates) &&
          Number.isFinite(Date.parse(g.date)),
      )
      .sort((a: any, b: any) => Date.parse(b.date) - Date.parse(a.date))[0];
    if (!g || typeof e.id !== "string") return [];
    return [
      {
        id: e.id,
        title: String(e.title),
        kind: kinds[e.categories?.[0]?.id] || "other",
        time: Date.parse(g.date),
        source: "NASA EONET" as const,
        url: safeURL(e.link, "eonet.gsfc.nasa.gov"),
        lat: g.coordinates[1],
        lon: g.coordinates[0],
      },
    ];
  });
}
export const sources = [
  {
    id: "usgs",
    name: "USGS",
    description: "Séismes ≥ 2,5 · dernières 24 h",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    parse: parseUSGS,
  },
  {
    id: "nasa",
    name: "NASA EONET",
    description: "Événements ouverts recensés · 30 derniers jours",
    url: "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&days=30&limit=200",
    parse: parseNASA,
  },
];
export function dateLabel(t: number) {
  return new Date(t).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
