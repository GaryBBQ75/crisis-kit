import {
  ArrowRight,
  ShieldCheck,
  Backpack,
  Users,
  Download,
  BookOpen,
  ArrowUpRight,
  WifiOff,
  Hospital,
  Droplets,
  Pill,
  HeartPulse,
  Compass,
  Radio,
  Check,
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
import {
  KitVisual,
  Pictogram,
  type POICategory,
} from "../components/Pictogram";
export default function Dashboard({
  go,
  state,
  position,
  onSelect,
  openResources,
}: {
  go: (s: Screen) => void;
  state: FeedState;
  position: Position | null;
  onSelect: (e: Incident) => void;
  openResources: (category: POICategory | "all") => void;
}) {
  const [profile] = usePersisted<Profile>("profile", defaultProfile),
    [inventory] = usePersisted<Inventory>("inventory", {});
  const items = buildChecklist(pack, profile),
    done = items.filter((i) => inventory[i.id]?.checked).length,
    progress = Math.round((done / items.length) * 100);
  const near = state.events.filter(
    (e) =>
      position &&
      distance(position, e) <= 200 &&
      Date.now() - e.time < 86400000,
  );
  const recent = near.length ? near.slice(0, 3) : state.events.slice(0, 3);
  return (
    <>
      <div className="home-kicker">
        <span className="edition">
          <Compass size={14} /> VOTRE COMPAGNON DE PRÉPARATION
        </span>
        <span className="home-date">PRÉPARER / SE REPÉRER / AGIR</span>
      </div>
      <section className="rescue-hero">
        <div className="rescue-hero-copy">
          <div className="rescue-label">
            <span /> PRÉVOIR L’ESSENTIEL. GARDER SON CALME.
          </div>
          <h2>
            Les bons réflexes.
            <br />
            <em>Au bon moment.</em>
          </h2>
          <p>
            Un kit prêt, des repères autour de vous,
            <br className="desktop-only" /> des gestes à retrouver. Même sans
            réseau.
          </p>
          <div className="hero-buttons">
            <button className="primary" onClick={() => go("prepare")}>
              <Backpack size={19} /> Préparer mon kit <ArrowRight size={17} />
            </button>
            <button className="hero-secondary" onClick={() => go("reflexes")}>
              <BookOpen size={18} /> Le guide pratique
            </button>
          </div>
          <div className="hero-proof">
            <span>
              <Check size={14} /> Sans compte
            </span>
            <span>
              <WifiOff size={14} /> Guides embarqués
            </span>
            <span>
              <ShieldCheck size={14} /> Sources indiquées
            </span>
          </div>
        </div>
        <KitVisual />
      </section>
      {near.length > 0 && (
        <button className="nearby-banner" onClick={() => go("situation")}>
          <Radio />
          <span>
            <strong>
              {near.length} observation(s) récente(s) à moins de 200 km
            </strong>
            <small>Voir les sources et les dates avant de décider.</small>
          </span>
          <ArrowRight />
        </button>
      )}
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 / SE REPÉRER</p>
          <h3>De quoi avez-vous besoin ?</h3>
        </div>
        <button className="text-button" onClick={() => openResources("all")}>
          Ouvrir la carte <ArrowUpRight size={17} />
        </button>
      </div>
      <div className="resource-shortcuts">
        {[
          {
            id: "health",
            title: "Trouver des soins",
            description: "Hôpitaux & centres de soins",
            icon: Hospital,
            tone: "red",
          },
          {
            id: "water",
            title: "Trouver de l’eau",
            description: "Points d’eau cartographiés",
            icon: Droplets,
            tone: "blue",
          },
          {
            id: "pharmacy",
            title: "Une pharmacie",
            description: "Médicaments & matériel",
            icon: Pill,
            tone: "green",
          },
          {
            id: "aed",
            title: "Un défibrillateur",
            description: "Équipements renseignés",
            icon: HeartPulse,
            tone: "purple",
          },
        ].map((c) => (
          <button key={c.id} onClick={() => openResources(c.id as POICategory)}>
            <Pictogram icon={c.icon} tone={c.tone} size={30} />
            <strong>{c.title}</strong>
            <span>{c.description}</span>
            <ArrowUpRight size={18} />
          </button>
        ))}
      </div>
      <div className="home-middle">
        <section className="kit-progress-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / PRÉPARER</p>
              <h3>Votre kit prend forme.</h3>
            </div>
            <Pictogram icon={Backpack} tone="orange" />
          </div>
          <div className="kit-progress-main">
            <strong>
              {done}
              <span>/{items.length}</span>
            </strong>
            <div>
              <b>essentiels cochés</b>
              <p>Chaque petite étape compte.</p>
            </div>
            <span className="percent-tag">{progress}%</span>
          </div>
          <div className="progress-track">
            <i style={{ width: progress + "%" }} />
          </div>
          <div className="kit-progress-footer">
            <p>Repère de progression, pas une garantie de sécurité.</p>
            <button className="text-button" onClick={() => go("checklist")}>
              Continuer <ArrowRight size={16} />
            </button>
          </div>
        </section>
        <button className="field-guide-promo" onClick={() => go("reflexes")}>
          <span className="field-manual-art">
            <BookOpen size={70} strokeWidth={1} />
            <span>
              GUIDE
              <br />
              DE TERRAIN
            </span>
          </span>
          <span className="guide-promo-copy">
            <small>03 / RETROUVER LES BONS GESTES</small>
            <strong>
              Le guide
              <br />
              de préparation
              <br />& de survie.
            </strong>
            <span>Fiches courtes · consultables hors ligne</span>
          </span>
          <ArrowUpRight size={22} />
        </button>
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">04 / RESTER INFORMÉ</p>
          <h3>Un œil sur la situation.</h3>
        </div>
        <button className="text-button" onClick={() => go("situation")}>
          Tout consulter <ArrowRight size={16} />
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
          <div className="map-preview-label">
            <span className="mini-dot" /> OBSERVATIONS MONDIALES
          </div>
          <button className="map-open" onClick={() => go("map")}>
            Explorer la carte <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="event-list">
          {recent.map((e) => (
            <IncidentCard
              key={e.id}
              event={e}
              position={position}
              onClick={() => onSelect(e)}
            />
          ))}
          {!recent.length && (
            <div className="empty-state">
              <Radio />
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
      <p className="small muted source-caption">
        USGS & NASA EONET · couverture partielle. Observations, pas des
        consignes officielles d’évacuation.
      </p>
      <div className="action-grid">
        {[
          {
            s: "profile",
            icon: Users,
            title: "Mon foyer",
            text: "Adapter la préparation à mes proches",
          },
          {
            s: "family",
            icon: ShieldCheck,
            title: "Mon plan familial",
            text: "Savoir où se retrouver et qui appeler",
          },
          {
            s: "offline",
            icon: Download,
            title: "Mon accès hors ligne",
            text: "Vérifier ce qui reste avec moi",
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
          <p className="eyebrow">CARNET DE PRÉPARATION / 01</p>
          <h2>
            Un foyer préparé.
            <br />
            Un geste à la fois.
          </h2>
          <p className="muted">
            Quatre étapes simples pour organiser l’essentiel.
          </p>
        </div>
        <span className="page-stamp">
          <Backpack />
          <small>
            PRÊT À<br />
            SE PRÉPARER
          </small>
        </span>
      </div>
      <div className="prepare-banner">
        <KitVisual />
        <div>
          <p className="eyebrow">COMMENCEZ AVEC CE QUE VOUS AVEZ</p>
          <h3>
            Pas besoin de tout
            <br />
            faire aujourd’hui.
          </h3>
          <p>
            Rassemblez vos essentiels, adaptez-les à votre foyer et convenez
            d’un plan ensemble.
          </p>
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
            title: "Rassembler mes essentiels",
            text: "Une checklist adaptée, avec le suivi des péremptions.",
          },
          {
            s: "family",
            n: "03",
            icon: ShieldCheck,
            title: "Organiser mon plan familial",
            text: family.rdv
              ? "Point de rendez-vous renseigné. Complétez vos contacts."
              : "Choisir où se retrouver et qui contacter.",
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
            <Pictogram icon={c.icon} tone="navy" />
            <span>
              <strong>{c.title}</strong>
              <small>{c.text}</small>
            </span>
            <ArrowRight size={19} />
          </button>
        ))}
      </div>
      <p className="small muted source-caption">
        Référence de préparation : pack France. Les numéros et recommandations
        de ce pack ne s’appliquent pas automatiquement aux autres pays.
      </p>
    </>
  );
}
