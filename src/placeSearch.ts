import { get, set } from "idb-keyval";
import type { Position } from "./feeds";
export async function searchPlaces(query: string): Promise<Position[]> {
  const q = query.trim().slice(0, 120);
  if (q.length < 2) return [];
  const key = "place-search-v1-" + q.toLowerCase();
  try {
    const cached = await get<{ received: number; places: Position[] }>(key);
    if (cached && Date.now() - cached.received < 604800000)
      return cached.places;
  } catch {}
  const r = await fetch(
    "https://photon.komoot.io/api/?" +
      new URLSearchParams({ q, limit: "5", lang: "fr" }),
    { signal: AbortSignal.timeout(15000) },
  );
  if (!r.ok) throw Error("Recherche indisponible");
  const d = await r.json();
  if (!Array.isArray(d.features)) throw Error("Réponse invalide");
  const places = d.features.flatMap((f: any) => {
    const c = f.geometry?.coordinates,
      p = f.properties;
    if (
      !Number.isFinite(c?.[0]) ||
      !Number.isFinite(c?.[1]) ||
      Math.abs(c[0]) > 180 ||
      Math.abs(c[1]) > 85
    )
      return [];
    return [
      {
        lon: c[0],
        lat: c[1],
        label: [p?.name, p?.city !== p?.name ? p?.city : null, p?.country]
          .filter(Boolean)
          .join(", "),
      },
    ];
  });
  try {
    await set(key, { received: Date.now(), places });
  } catch {}
  return places;
}
