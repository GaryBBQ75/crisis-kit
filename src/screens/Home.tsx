import type { Screen } from '../App';
import { pack } from '../pack';

export default function Home({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <div className="big-buttons">
        <button className="big alert" onClick={() => go('reflexes')}>
          Alerte
          <small>Fiches réflexes</small>
        </button>
        <button className="big" onClick={() => go('checklist')}>
          Checklist
          <small>Provisions {pack.autonomie_heures} h</small>
        </button>
        <button className="big" onClick={() => go('map')}>
          Carte
          <small>Hors ligne, bientôt</small>
        </button>
      </div>

      <nav className="grid">
        <button onClick={() => go('profile')}>Mon foyer</button>
        <button onClick={() => go('family')}>Plan familial</button>
        <button onClick={() => go('firstaid')}>Premiers secours</button>
      </nav>

      <section className="card">
        <h2>Urgences</h2>
        <ul className="plain">
          {pack.urgences.map((u) => (
            <li key={u.numero}>
              <a href={`tel:${u.numero}`}>{u.numero}</a> {u.nom}
            </li>
          ))}
        </ul>
        <p className="muted">
          Alerte officielle : {pack.alerte.systeme}, reçue directement par le téléphone, sans installation.
        </p>
      </section>

      <p className="muted small">
        Données embarquées : pack {pack.pays} du {pack.version}. Cette app ne remplace pas les consignes
        officielles et n'est pas une application gouvernementale.
      </p>
    </>
  );
}
