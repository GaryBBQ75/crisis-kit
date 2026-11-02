import { pack } from '../pack';

export default function FirstAid() {
  return (
    <>
      <section className="card">
        <h2>En cas d'urgence vitale</h2>
        <ul className="plain">
          {pack.urgences
            .filter((u) => ['112', '15'].includes(u.numero))
            .map((u) => (
              <li key={u.numero}>
                <a href={`tel:${u.numero}`}>Appeler le {u.numero}</a> ({u.nom})
              </li>
            ))}
        </ul>
      </section>
      <p className="muted">
        Les fiches de gestes de premiers secours seront ajoutées à partir d'une source validée (Croix-Rouge,
        Protection civile), pour ne pas diffuser de consignes médicales approximatives. En attendant, suis
        les instructions de l'opérateur du 15 ou du 112 au téléphone.
      </p>
    </>
  );
}
