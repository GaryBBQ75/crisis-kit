import { useState } from "react";
import { RefreshCw, Globe, MapPin } from "lucide-react";
import {
  labels,
  distance,
  dateLabel,
  sources,
  type Kind,
  type Incident,
  type Position,
} from "../feeds";
import type { FeedState } from "../useFeeds";
import IncidentCard from "../components/IncidentCard";
export default function Board({
  state,
  position,
  onSelect,
}: {
  state: FeedState;
  position: Position | null;
  onSelect: (e: Incident) => void;
}) {
  const [kind, setKind] = useState<Kind | "all">("all");
  const [local, setLocal] = useState(false);
  const [search, setSearch] = useState("");
  const events = state.events.filter(
    (e) =>
      (kind === "all" || e.kind === kind) &&
      (!local || (position && distance(position, e) <= 200)) &&
      e.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">COMPRENDRE CE QUI SE PASSE</p>
          <h2>Situation</h2>
          <p className="muted">Le monde, avec le contexte qui compte.</p>
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
      <input
        className="search"
        aria-label="Rechercher un événement"
        placeholder="Rechercher un lieu ou un événement…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chips">
        <button
          className={kind === "all" ? "active" : ""}
          onClick={() => setKind("all")}
        >
          Tout
        </button>
        {Object.entries(labels).map(([k, v]) => (
          <button
            className={kind === k ? "active" : ""}
            key={k}
            onClick={() => setKind(k as Kind)}
          >
            {v} <span>{state.events.filter((e) => e.kind === k).length}</span>
          </button>
        ))}
      </div>
      <p className="small muted">
        Observations publiées, pas des alertes d’évacuation. Actualisation
        toutes les 5 minutes lorsque l’app est visible, sauf en mode économe.
        Aucun suivi lorsque l’app est fermée.
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
        {events.length === 0 && (
          <div className="empty-state">
            <Globe />
            <h3>
              {state.loading
                ? "Chargement des observations…"
                : "Aucun événement dans cette sélection"}
            </h3>
            <p>Une absence de données ne signifie pas une absence de danger.</p>
          </div>
        )}
      </div>
      <section className="card">
        <h3>État des sources</h3>
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
          Couverture non exhaustive. EONET recense des événements naturels : ce
          n’est pas un flux local d’alerte incendie. Missiles, radiations,
          tsunamis et épidémies : aucun flux connecté pour le moment.
        </p>
      </section>
    </>
  );
}
