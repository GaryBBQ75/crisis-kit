import type { Position } from "./feeds";

export function nearbyQuery(p: Position, radiusKm: number) {
  if (
    !Number.isFinite(p.lat) ||
    !Number.isFinite(p.lon) ||
    Math.abs(p.lat) > 85 ||
    Math.abs(p.lon) > 180 ||
    ![5, 10, 25].includes(radiusKm)
  )
    throw Error("Zone invalide");
  const around = `(around:${radiusKm * 1000},${p.lat},${p.lon})`;
  return `[out:json][timeout:20];(nwr${around}[amenity~"^(hospital|clinic|pharmacy|drinking_water|fire_station|police|shelter|toilets)$"];nwr${around}[healthcare~"^(hospital|clinic|pharmacy)$"];nwr${around}[emergency=defibrillator];);out center tags;`;
}
export async function fetchNearby(
  p: Position,
  radiusKm: number,
  signal: AbortSignal,
) {
  const query = nearbyQuery(p, radiusKm);
  const european = p.lat >= 34 && p.lat <= 72 && p.lon >= -25 && p.lon <= 45;
  const endpoints = european
    ? [
        "https://ovp.dresel.systems/api/interpreter",
        "https://overpass-api.de/api/interpreter",
      ]
    : [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.private.coffee/api/interpreter",
      ];
  for (const endpoint of endpoints) {
    signal.throwIfAborted();
    try {
      const r = await fetch(
        endpoint + "?" + new URLSearchParams({ data: query }),
        { signal: AbortSignal.any([signal, AbortSignal.timeout(25000)]) },
      );
      if (!r.ok) throw Error();
      const data = await r.json();
      if (!Array.isArray(data.elements) || data.remark)
        throw Error("Réponse partielle");
      return data;
    } catch {
      signal.throwIfAborted();
    }
  }
  throw Error("Recherche élargie indisponible");
}
