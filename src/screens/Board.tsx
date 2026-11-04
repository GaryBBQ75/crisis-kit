import { useState } from "react";
import {
  RefreshCw,
  Globe,
  MapPin,
  ExternalLink,
  ArrowUpRight,
  Radio,
  BookOpen,
} from "lucide-react";
import {
  distance,
  dateLabel,
  sources,
  type Incident,
  type Position,
} from "../feeds";
import type { FeedState } from "../useFeeds";
import IncidentCard from "../components/IncidentCard";
import HealthBulletins from "../components/HealthBulletins";
import { risks } from "../content/risks";
export default function Board({
  state,
  position,
  onSelect,
  paused = false,
  onGuide,
}: {
  state: FeedState;
  position: Position | null;
  onSelect: (e: Incident) => void;
  paused?: boolean;
  onGuide?: () => void;
}) {
  const [topic, setTopic] = useState("all"),
    [local, setLocal] = useState(false),
    [search, setSearch] = useState("");
  const risk = risks.find((r) => r.id === topic);
  const scoped = state.events.filter(
    (e) => !local || (position && distance(position, e) <= 200),
  );
  const events = scoped.filter(
    (e) =>
      (topic === "all" ||
        (topic === "other" ? e.kind === "other" : e.kind === risk?.kind)) &&
      e.title.toLowerCase().includes(search.toLowerCase()),
  );
  const integrated = topic === "all" || topic === "other" || !!risk?.kind;
  function choose(id: string) {
    setTopic(id);
    setSearch("");
    requestAnimationFrame(() =>
      document
        .getElementById("situation-results")
        ?.scrollIntoView({ block: "start" }),
    );
  }
  function feedStatus(k: string) {
    const id = k === "earthquake" ? "usgs" : "nasa";
    return !state.feeds[id]
      ? "Pas de relevé"
      : state.errors[id]
        ? "Dernier relevé conservé"
        : !state.online
          ? "Relevé enregistré"
          : "Observations intégrées";
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OBSERVER · VÉRIFIER · COMPRENDRE</p>
          <h2>Situation</h2>
          <p className="muted">
            Les risques naturels, sanitaires et humains, avec leurs sources.
          </p>
        </div>
        <button
          className="icon-button"
          aria-label="Actualiser les sources"
          disabled={state.loading || !state.online}
          onClick={state.refresh}
        >
          <RefreshCw className={state.loading ? "spin" : ""} />
        </button>
      </div>
      <div className="situation-key">
        <span>
          <i /> Observations dans l’app
        </span>
        <span>
          <BookOpen size={13} /> Bulletins sanitaires
        </span>
        <span>
          <ExternalLink size={13} /> Sources à consulter
        </span>
      </div>
      <div
        id="risk-directory"
        className="risk-directory"
        aria-label="Choisir un risque"
      >
        {[...new Set(risks.map((r) => r.group))].map((group) => (
          <section key={group}>
            <h3>{group}</h3>
            <div className="risk-grid">
              {risks
                .filter((r) => r.group === group)
                .map((r) => (
                  <button
                    key={r.id}
                    aria-pressed={topic === r.id}
                    onClick={() => choose(r.id)}
                  >
                    <r.icon size={22} />
                    <span>
                      <strong>{r.label}</strong>
                      <small>
                        {r.kind
                          ? feedStatus(r.kind)
                          : r.mode === "health"
                            ? "Bulletins OMS"
                            : "Sources à consulter"}
                      </small>
                    </span>
                    {r.kind ? (
                      <b>
                        {state.feeds[r.kind === "earthquake" ? "usgs" : "nasa"]
                          ? scoped.filter((e) => e.kind === r.kind).length
                          : "—"}
                      </b>
                    ) : (
                      <ArrowUpRight size={15} />
                    )}
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
      <p className="small muted">
        Les chiffres comptent les observations reçues dans le périmètre choisi,
        pas tous les dangers. « Sources à consulter » signifie qu’aucun flux
        n’est intégré pour ce risque.
      </p>
      <div id="situation-results" className="situation-selection">
        <button
          onClick={() =>
            document
              .getElementById("risk-directory")
              ?.scrollIntoView({ block: "start" })
          }
        >
          Tous les risques ↑
        </button>
        <button
          className={topic === "all" ? "selected" : ""}
          onClick={() => choose("all")}
        >
          <Radio size={16} /> Toutes les observations
        </button>
        <button
          className={topic === "other" ? "selected" : ""}
          onClick={() => choose("other")}
        >
          Autres événements naturels
        </button>
      </div>
      {risk && (
        <section
          className="risk-detail"
          aria-label={"Informations " + risk.label}
        >
          <div className="risk-detail-heading">
            <span className="pictogram pic-navy">
              <risk.icon size={27} />
            </span>
            <div>
              <p className="eyebrow">
                {risk.kind
                  ? "OBSERVATIONS & SOURCES"
                  : risk.mode === "health"
                    ? "BULLETINS OFFICIELS"
                    : "CONSULTATION DES SOURCES"}
              </p>
              <h3>{risk.label}</h3>
            </div>
            {onGuide && (
              <button className="text-button" onClick={onGuide}>
                <BookOpen size={15} /> Guide de terrain
              </button>
            )}
          </div>
          <p>{risk.description}</p>
          <p className="risk-scope">Couverture : {risk.scope}</p>
          <p className="small muted">{risk.limit}</p>
          {!state.online && risk.links.length > 0 && (
            <p className="notice">
              Hors ligne : les liens externes nécessitent une connexion. Les
              informations de couverture restent disponibles.
            </p>
          )}
          <div className="risk-source-links">
            {risk.links.map((link) =>
              state.online ? (
                <a
                  href={link.url}
                  key={link.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <strong>{link.name}</strong>
                    <small>{link.scope}</small>
                  </span>
                  <ExternalLink size={17} />
                </a>
              ) : (
                <div className="source-offline" key={link.url}>
                  <strong>{link.name}</strong>
                  <small>{link.scope} · accès en ligne</small>
                </div>
              ),
            )}
          </div>
        </section>
      )}
      {risk?.mode === "health" && (
        <HealthBulletins online={state.online} paused={paused} />
      )}
      {integrated && (
        <>
          <div className="section-heading">
            <div>
              <p className="eyebrow">RELEVÉS DES SOURCES CONNECTÉES</p>
              <h3>{risk?.label || "Observations naturelles"}</h3>
            </div>
            <span className="tag">{events.length} résultat(s)</span>
          </div>
          <div className="segment">
            <button
              className={!local ? "selected" : ""}
              onClick={() => setLocal(false)}
            >
              <Globe size={16} /> Monde
            </button>
            <button
              disabled={!position}
              className={local ? "selected" : ""}
              onClick={() => setLocal(true)}
            >
              <MapPin size={16} /> Ma zone · 200 km
            </button>
          </div>
          {local && (
            <p className="small muted">
              Périmètre : {position?.label || "point choisi sur la carte"} · 200
              km à vol d’oiseau. Ce filtre ne s’applique pas aux bulletins OMS
              ni aux sites externes.
            </p>
          )}
          <input
            className="search"
            aria-label="Rechercher un événement"
            placeholder="Rechercher un lieu ou un événement…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="small muted">
            USGS : dernières 24 h · NASA EONET : événements ouverts sur 30
            jours. Actualisation toutes les 5 minutes lorsque l’app est visible,
            sauf mode économe. Aucun suivi lorsque l’app est fermée.
          </p>
          <div className="event-list">
            {events.map((e) => (
              <IncidentCard
                key={e.id}
                event={e}
                position={position}
                onClick={() => onSelect(e)}
              />
            ))}
            {!events.length && (
              <div className="empty-state">
                <Globe />
                <h3>
                  {state.loading
                    ? "Chargement des observations…"
                    : "Aucune observation dans cette sélection"}
                </h3>
                <p>
                  Une absence de données ne signifie pas une absence de danger.
                </p>
              </div>
            )}
          </div>
        </>
      )}
      <details className="card source-details">
        <summary>État des sources d’événements naturels</summary>
        {sources.map((s) => (
          <div className="source-row" key={s.id}>
            <div>
              <strong>{s.name}</strong>
              <p>{s.description}</p>
              <small>
                {state.feeds[s.id]
                  ? `Reçu le ${dateLabel(state.feeds[s.id].received)}`
                  : "Pas de relevé enregistré"}
              </small>
              {state.errors[s.id] && (
                <p className="warning-text">{state.errors[s.id]}</p>
              )}
            </div>
            <span className="tag">
              {state.errors[s.id]
                ? "Indisponible"
                : state.feeds[s.id]
                  ? "Relevé disponible"
                  : "En attente"}
            </span>
          </div>
        ))}
        <p className="small muted">
          Couverture non exhaustive. Les observations ne sont pas des consignes
          officielles. Les autres rubriques précisent leur propre couverture et
          leur mode de consultation.
        </p>
      </details>
    </>
  );
}
