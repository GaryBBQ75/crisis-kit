import { useState } from "react";
import { BookOpen, ExternalLink, WifiOff } from "lucide-react";
import { Pictogram, guideIcons } from "../components/Pictogram";
import { reflexes } from "../content/reflexes";
export default function Reflexes() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const categories = ["Toutes", ...new Set(reflexes.map((r) => r.category))];
  const visible = reflexes.filter(
    (r) =>
      (category === "Toutes" || category === r.category) &&
      (r.titre + " " + r.pendant.join(" "))
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">RETROUVER LES BONS REPÈRES</p>
          <h2>Le guide de terrain.</h2>
          <p className="muted">
            Préparation & survie · des repères simples à garder avec soi.
          </p>
        </div>
        <span className="page-stamp">
          <BookOpen />
          <small>
            GUIDE
            <br />
            DE TERRAIN
          </small>
        </span>
      </div>
      <div className="notice">
        <WifiOff size={15} /> Contenu embarqué · les liens sources nécessitent
        Internet. Les instructions locales actualisées restent prioritaires.
      </div>
      <input
        className="search"
        style={{ marginTop: 20 }}
        placeholder="Rechercher : eau, séisme, électricité…"
        aria-label="Rechercher une fiche"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chips">
        {categories.map((c) => (
          <button
            key={c}
            className={c === category ? "active" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="guide-grid">
        {visible.map((r) => (
          <details key={r.id} className="card">
            <summary>
              <Pictogram icon={guideIcons[r.id] || BookOpen} tone="orange" />
              {r.titre}
              <span
                className="event-meta"
                style={{ display: "block", marginTop: 6 }}
              >
                {r.category} · Ouvrir la fiche
              </span>
            </summary>
            <p className="small muted">{r.scope}</p>
            {r.avant && (
              <>
                <h3>Avant · préparer</h3>
                <ul>
                  {r.avant.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </>
            )}
            <h3>Pendant · premiers repères</h3>
            <ol className="guide-steps">
              {r.pendant.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
            {r.apres && (
              <>
                <h3>Après</h3>
                <ul>
                  {r.apres.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </>
            )}
            <a
              className="source-link"
              href={r.url}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={15} />
              {r.source}
            </a>
            <p className="small muted">
              Synthèse consultée le 4 novembre 2026. Elle ne remplace ni un avis
              médical ni les instructions d’urgence.
            </p>
          </details>
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          Aucune fiche correspondante dans cette version.
        </div>
      )}
      <section className="card">
        <h3>Urgences en France</h3>
        <p className="muted">
          Ces numéros concernent le pack France. Vérifiez les numéros locaux
          lors de vos déplacements.
        </p>
        <div className="toolbar">
          <a href="tel:112">112 · Urgence</a>
          <a href="tel:15">15 · SAMU</a>
          <a href="tel:18">18 · Pompiers</a>
        </div>
      </section>
    </>
  );
}
