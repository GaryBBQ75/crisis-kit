import { reflexes } from '../content/reflexes';

export default function Reflexes() {
  return (
    <>
      <p className="muted">Consignes générales. Suis toujours les consignes officielles du moment.</p>
      {reflexes.map((r) => (
        <details key={r.id} className="card">
          <summary>{r.titre}</summary>
          {r.avant && (
            <>
              <h3>Avant</h3>
              <ul>{r.avant.map((t) => <li key={t}>{t}</li>)}</ul>
            </>
          )}
          <h3>Pendant</h3>
          <ul>{r.pendant.map((t) => <li key={t}>{t}</li>)}</ul>
          {r.apres && (
            <>
              <h3>Après</h3>
              <ul>{r.apres.map((t) => <li key={t}>{t}</li>)}</ul>
            </>
          )}
        </details>
      ))}
    </>
  );
}
