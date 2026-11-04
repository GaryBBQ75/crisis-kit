import { pack } from "../pack";
import {
  defaultFamily,
  usePersisted,
  type Family as FamilyType,
} from "../store";

export default function Family() {
  const [family, setFamily, ready] = usePersisted<FamilyType>(
    "family",
    defaultFamily,
  );
  if (!ready) return null;

  return (
    <>
      <p className="muted">
        Convenez du plan à l'avance. Il reste sur ce téléphone.
      </p>
      <label>
        Point de rendez-vous
        <textarea
          rows={3}
          value={family.rdv}
          onChange={(e) => setFamily({ ...family, rdv: e.target.value })}
          placeholder="Où se retrouver si on est séparés, et un second lieu si le premier est inaccessible"
        />
      </label>
      <label>
        Contacts importants
        <textarea
          rows={5}
          value={family.contacts}
          onChange={(e) => setFamily({ ...family, contacts: e.target.value })}
          placeholder="Nom, téléphone, rôle (école, proche hors de la ville...)"
        />
      </label>
      <section className="card">
        <h2>Numéros d’urgence · France</h2>
        <ul className="plain">
          {pack.urgences.map((u) => (
            <li key={u.numero}>
              <a href={`tel:${u.numero}`}>{u.numero}</a> {u.nom}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
