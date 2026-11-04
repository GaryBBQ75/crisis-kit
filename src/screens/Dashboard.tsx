import {
  ArrowRight,
  ShieldCheck,
  Backpack,
  Users,
  Download,
  BookOpen,
  MapPin,
  ArrowUpRight,
  WifiOff,
} from "lucide-react";
import {
  usePersisted,
  defaultProfile,
  type Profile,
  type Inventory,
  defaultFamily,
  type Family,
} from "../store";
import { buildChecklist, pack } from "../pack";
import { distance, type Incident, type Position } from "../feeds";
import type { FeedState } from "../useFeeds";
import type { Screen } from "../App";
import WorldMap from "../components/WorldMap";
import IncidentCard from "../components/IncidentCard";
export default function Dashboard({
  go,
  state,
  position,
  onSelect,
}: {
  go: (s: Screen) => void;
  state: FeedState;
  position: Position | null;
  onSelect: (e: Incident) => void;
}) {
  const [profile] = usePersisted<Profile>("profile", defaultProfile);
  const [inventory] = usePersisted<Inventory>("inventory", {});
  const items = buildChecklist(pack, profile);
  const done = items.filter((i) => inventory[i.id]?.checked).length;
  const near = state.events.filter(
    (e) =>
      position &&
      distance(position, e) <= 200 &&
      Date.now() - e.time < 86400000,
  );
  const events = near.length ? near.slice(0, 3) : state.events.slice(0, 3);
  const progress = Math.round((done / items.length) * 100);
  return (
    <>
      <div className="dashboard-heading">
        <p className="eyebrow">PRÊT AU QUOTIDIEN. PRÉSENT DANS L’URGENCE.</p>
        <h2>
          Un peu plus prêt.
          <br />
          <span>Un peu plus serein.</span>
        </h2>
        <p className="muted">
          Votre préparation et les informations essentielles,
          <br className="desktop-only" /> réunies au même endroit.
        </p>
      </div>
      {near.length > 0 && (
        <button className="nearby-banner" onClick={() => go("situation")}>
          <MapPin />
          <span>
            <strong>
              {near.length} événement(s) récent(s) à moins de 200 km
            </strong>
            <small>
              Observations enregistrées · consulter les dates et les sources
            </small>
          </span>
          <ArrowRight />
        </button>
      )}
      <div className="dashboard-grid">
        <section className="hero-card">
          <div className="card-top">
            <span className="eyebrow">MA PRÉPARATION</span>
            <ShieldCheck size={21} />
          </div>
          <div className="readiness">
            <div>
              <strong>
                {done}
                <span> / {items.length}</span>
              </strong>
              <p>essentiels cochés dans mon kit</p>
            </div>
            <div
              className="progress-ring"
              style={{
                background: `conic-gradient(var(--mint) ${progress}%, #ffffff12 0)`,
              }}
            >
              <span>{progress}%</span>
            </div>
          </div>
          <div className="progress-track">
            <i style={{ width: progress + "%" }} />
          </div>
          <p className="small muted">
            Un repère de progression, pas une garantie de sécurité.
          </p>
          <button className="primary full" onClick={() => go("checklist")}>
            Continuer ma préparation <ArrowRight size={17} />
          </button>
        </section>
        <section className="quick-card">
          <p className="eyebrow">LES BONS RÉFLEXES, SANS ATTENDRE</p>
          <BookOpen size={32} />
          <h3>
            J’ai besoin d’aide
            <br />
            maintenant
          </h3>
          <p>
            Accès direct aux fiches embarquées.
            <br />
            Disponible sans connexion.
          </p>
          <button onClick={() => go("reflexes")}>
            Ouvrir les fiches <ArrowUpRight size={17} />
          </button>
        </section>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">GARDER UNE VUE D’ENSEMBLE</p>
          <h3>Autour de vous et dans le monde</h3>
        </div>
        <button className="text-button" onClick={() => go("situation")}>
          Tout voir <ArrowRight size={16} />
        </button>
      </div>
      <div className="overview-grid">
        <div className="map-preview">
          <WorldMap
            events={state.events}
            position={position}
            onSelect={onSelect}
            online={state.online}
            compact
          />
          <button className="map-open" onClick={() => go("map")}>
            Explorer la carte <ArrowUpRight size={16} />
          </button>
        </div>
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
              <WifiOff />
              <p>
                {state.loading
                  ? "Connexion aux sources…"
                  : "Aucune observation enregistrée."}
              </p>
              <button onClick={() => go("situation")}>
                Consulter les sources
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="small muted">
        USGS & NASA EONET · observations non exhaustives, pas des alertes
        officielles.{" "}
        {position
          ? "Zone enregistrée sur cet appareil."
          : "Choisissez une zone sur la carte pour personnaliser cet accueil."}
      </p>
      <div className="section-heading">
        <h3>Des bases solides, à votre rythme</h3>
      </div>
      <div className="action-grid">
        {[
          {
            s: "profile",
            icon: Users,
            title: "Mon foyer",
            text: "Personnes et besoins particuliers",
          },
          {
            s: "family",
            icon: ShieldCheck,
            title: "Mon plan familial",
            text: "Contacts et lieux de rendez-vous",
          },
          {
            s: "offline",
            icon: Download,
            title: "Mes données hors ligne",
            text: "Vérifier ce qui reste accessible",
          },
        ].map((c) => (
          <button key={c.s} onClick={() => go(c.s as Screen)}>
            <c.icon size={22} />
            <strong>{c.title}</strong>
            <span>{c.text}</span>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>
    </>
  );
}
export function Prepare({ go }: { go: (s: Screen) => void }) {
  const [family] = usePersisted<Family>("family", defaultFamily);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">UN GESTE À LA FOIS</p>
          <h2>Me préparer</h2>
          <p className="muted">Un plan qui ressemble à votre foyer.</p>
        </div>
      </div>
      <div className="preparation-list">
        {[
          {
            s: "profile",
            n: "01",
            icon: Users,
            title: "Définir mon foyer",
            text: "Adultes, enfants, animaux et besoins spécifiques.",
          },
          {
            s: "checklist",
            n: "02",
            icon: Backpack,
            title: "Préparer mes essentiels",
            text: "Une checklist adaptée, avec le suivi des péremptions.",
          },
          {
            s: "family",
            n: "03",
            icon: ShieldCheck,
            title: "Organiser mon plan familial",
            text: family.rdv
              ? "Point de rendez-vous renseigné. Complétez vos contacts."
              : "Choisissez où vous retrouver et qui contacter.",
          },
          {
            s: "offline",
            n: "04",
            icon: Download,
            title: "Vérifier mon accès hors ligne",
            text: "Guides, contacts, relevés et lieux sauvegardés.",
          },
        ].map((c) => (
          <button key={c.s} onClick={() => go(c.s as Screen)}>
            <span className="step-number">{c.n}</span>
            <c.icon />
            <span>
              <strong>{c.title}</strong>
              <small>{c.text}</small>
            </span>
            <ArrowRight size={19} />
          </button>
        ))}
      </div>
      <p className="small muted">
        Référence de préparation : pack France. Les numéros et recommandations
        de ce pack ne s’appliquent pas automatiquement aux autres pays.
      </p>
    </>
  );
}
