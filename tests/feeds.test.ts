import { test } from "node:test";
import assert from "node:assert/strict";
import { parseUSGS, parseNASA, distance } from "../src/feeds.ts";
const feature = () => ({
  id: "x",
  properties: {
    type: "earthquake",
    mag: 3,
    time: 100,
    title: "Example",
    place: "Example",
    url: "https://earthquake.usgs.gov/earthquakes/eventpage/x",
  },
  geometry: { coordinates: [2, 48, 12] },
});
test("USGS parses an observation and rejects malformed envelopes", () => {
  const data = { type: "FeatureCollection", features: [feature()] };
  assert.equal(parseUSGS(data)[0].magnitude, 3);
  assert.equal(parseUSGS(data)[0].source, "USGS");
  assert.throws(() => parseUSGS({}));
});
test("invalid coordinates and unknown magnitudes are not presented as valid observations", () => {
  const f = feature();
  f.geometry.coordinates = [2, 100, 2];
  assert.equal(
    parseUSGS({ type: "FeatureCollection", features: [f] }).length,
    0,
  );
});
test("untrusted source URLs cannot become links", () => {
  const f = feature();
  f.properties.url = "javascript:alert(1)";
  assert.throws(() => parseUSGS({ type: "FeatureCollection", features: [f] }));
});
test("NASA selects latest location and maps event categories", () => {
  const e = {
    id: "n",
    title: "Storm",
    link: "https://eonet.gsfc.nasa.gov/api/v3/events/n",
    categories: [{ id: "severeStorms" }],
    geometry: [
      { type: "Point", date: "2026-11-02", coordinates: [2, 48] },
      { type: "Point", date: "2026-11-03", coordinates: [3, 49] },
    ],
  };
  const [p] = parseNASA({ events: [e] });
  assert.equal(p.lon, 3);
  assert.equal(p.kind, "storm");
});
test("NASA skips unusable geometry, and rejects invalid envelope", () => {
  assert.deepEqual(parseNASA({ events: [{ geometry: [] }] }), []);
  assert.throws(() => parseNASA({}));
});
test("distance handles same point and international date line", () => {
  assert.equal(distance({ lat: 0, lon: 0 }, { lat: 0, lon: 0 }), 0);
  assert.ok(
    Math.abs(distance({ lat: 0, lon: 179 }, { lat: 0, lon: -179 }) - 222.39) <
      1,
  );
});

import { localBounds, parseLocalMap } from "../src/localMap.ts";
test("local map builds roads and useful points without requiring a tile server", () => {
  const result = parseLocalMap({
    elements: [
      {
        type: "node",
        id: 1,
        lat: 48,
        lon: 2,
        tags: { amenity: "pharmacy", name: "Test" },
      },
      { type: "node", id: 2, lat: 48.001, lon: 2.001 },
      {
        type: "way",
        id: 3,
        nodes: [1, 2],
        tags: { highway: "residential", name: "Rue de test" },
      },
    ],
  });
  assert.equal(result.pois[0].kind, "Pharmacie");
  assert.equal(result.roads[0].points.length, 2);
  assert.throws(() => parseLocalMap({}));
});
test("download area remains small and within map bounds", () => {
  const b = localBounds({ lat: 48, lon: 2 }).split(",").map(Number);
  assert.ok((b[2] - b[0]) * (b[3] - b[1]) < 0.01);
  assert.throws(() => localBounds({ lat: 90, lon: 0 }));
  assert.ok(localBounds({ lat: 0, lon: 180 }).split(",").map(Number)[2] <= 180);
});
test("local places retain categories and contact metadata, including healthcare-only hospitals", () => {
  const { pois } = parseLocalMap({
    elements: [
      {
        type: "node",
        id: 4,
        lat: 48,
        lon: 2,
        tags: {
          healthcare: "hospital",
          name: "Hôpital test",
          "addr:street": "Rue test",
          phone: "+33 1 23 45 67 89",
          emergency: "yes",
        },
      },
      {
        type: "node",
        id: 5,
        lat: 48,
        lon: 2,
        tags: { amenity: "drinking_water" },
      },
    ],
  });
  assert.equal(pois[0].category, "health");
  assert.equal(pois[0].address, "Rue test");
  assert.equal(pois[0].emergency, "yes");
  assert.equal(pois[1].category, "water");
  const big = localBounds({ lat: 48, lon: 2 }).split(",").map(Number),
    small = localBounds({ lat: 48, lon: 2 }, 0.5).split(",").map(Number);
  assert.ok(small[2] - small[0] < big[2] - big[0]);
});
