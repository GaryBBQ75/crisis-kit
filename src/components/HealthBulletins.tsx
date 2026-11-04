import { useEffect, useRef, useState } from "react";
import { get, set } from "idb-keyval";
import { RefreshCw, ExternalLink, WifiOff } from "lucide-react";
import { healthURL, parseHealth, type HealthSnapshot } from "../healthFeed";
import { dateLabel } from "../feeds";
export default function HealthBulletins({
  online,
  paused,
}: {
  online: boolean;
  paused: boolean;
}) {
  const [snapshot, save] = useState<HealthSnapshot | null>(null),
    [loading, busy] = useState(false),
    [error, fail] = useState(""),
    [search, query] = useState("");
  const request = useRef<AbortController | null>(null);
  async function refresh() {
    request.current?.abort();
    const c = new AbortController();
    request.current = c;
    busy(true);
    fail("");
    try {
      const r = await fetch(healthURL, {
        cache: "no-store",
        signal: AbortSignal.any([c.signal, AbortSignal.timeout(20000)]),
      });
      if (!r.ok) throw Error();
      const next = { received: Date.now(), items: parseHealth(await r.json()) };
      if (c.signal.aborted) return;
      save(next);
      try {
        await set("health-who-v1", next);
      } catch {
        fail("Bulletins reçus, mais sauvegarde hors ligne impossible.");
      }
    } catch {
      if (!c.signal.aborted)
        fail(
          "Actualisation OMS indisponible. Consultez la source ou les derniers titres enregistrés.",
        );
    } finally {
      if (request.current === c) busy(false);
    }
  }
  useEffect(() => {
    let active = true;
    void (async () => {
      const cache = await get<HealthSnapshot>("health-who-v1").catch(
        () => null,
      );
      if (!active) return;
      if (cache) save(cache);
      if (
        online &&
        !paused &&
        (!cache || Date.now() - cache.received > 3600000)
      )
        void refresh();
    })();
    return () => {
      active = false;
      request.current?.abort();
      busy(false);
    };
  }, [online, paused]);
  const visible = (snapshot?.items || []).filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className="health-bulletins">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PUBLICATIONS DE L’OMS · MONDE</p>
          <h3>Derniers bulletins sanitaires</h3>
        </div>
        <button
          className="icon-button"
          aria-label="Actualiser les bulletins OMS"
          onClick={() => void refresh()}
          disabled={!online || loading}
        >
          <RefreshCw size={18} className={loading ? "spin" : ""} />
        </button>
      </div>
      <p className="small muted">
        Titres d’origine en anglais · jusqu’à 20 publications. Un bulletin n’est
        pas une déclaration de pandémie et ne décrit pas nécessairement la
        situation actuelle. Pas de filtre de proximité.
      </p>
      {snapshot && (
        <p className="small muted">
          Dernière réception : {dateLabel(snapshot.received)}.{" "}
          {!online && (
            <>
              <WifiOff size={12} /> Titres enregistrés ; articles complets
              accessibles en ligne.
            </>
          )}
        </p>
      )}
      {error && (
        <p className="notice" role="status">
          {error}
        </p>
      )}
      <input
        className="search"
        aria-label="Rechercher un bulletin sanitaire"
        placeholder="Filtrer les titres : France, Ebola, cholera…"
        value={search}
        onChange={(e) => query(e.target.value)}
      />
      <div className="bulletin-list">
        {visible.map((b) => (
          <article key={b.url}>
            <div>
              <small>
                OMS · publié le{" "}
                {new Date(b.time).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </small>
              <h4 lang="en">{b.title}</h4>
            </div>
            {online ? (
              <a href={b.url} target="_blank" rel="noreferrer">
                Lire le bulletin <ExternalLink size={14} />
              </a>
            ) : (
              <span className="tag">Article en ligne</span>
            )}
          </article>
        ))}
        {!visible.length && (
          <p className="empty-state">
            {loading
              ? "Chargement des bulletins OMS…"
              : snapshot
                ? "Aucun titre dans cette sélection."
                : "Aucun bulletin enregistré. Actualisez en ligne ou ouvrez le site de l’OMS."}
          </p>
        )}
      </div>
    </section>
  );
}
