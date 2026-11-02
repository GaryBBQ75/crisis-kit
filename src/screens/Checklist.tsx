import { useEffect } from 'react';
import { buildChecklist, pack } from '../pack';
import { programmerRappels, rappelsDisponibles } from '../reminders';
import { defaultProfile, usePersisted, type Inventory, type Profile } from '../store';

function statut(peremption?: string): 'expire' | 'bientot' | null {
  if (!peremption) return null;
  const date = new Date(peremption).getTime();
  if (Number.isNaN(date)) return null;
  const maintenant = Date.now();
  if (date < maintenant) return 'expire';
  if (date - maintenant < 30 * 24 * 3600 * 1000) return 'bientot';
  return null;
}

export default function Checklist() {
  const [profile, , profileReady] = usePersisted<Profile>('profile', defaultProfile);
  const [inventory, setInventory, ready] = usePersisted<Inventory>('inventory', {});
  const items = buildChecklist(pack, profile);

  useEffect(() => {
    if (!ready || !profileReady) return;
    programmerRappels(items.map((i) => ({ id: i.id, nom: i.nom, peremption: inventory[i.id]?.peremption }))).catch(
      () => {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, profileReady, inventory, profile]);

  if (!ready || !profileReady) return null;

  const done = items.filter((i) => inventory[i.id]?.checked).length;

  const patch = (id: string, change: Partial<Inventory[string]>) => {
    const current = inventory[id] ?? { checked: false };
    setInventory({ ...inventory, [id]: { ...current, ...change } });
  };

  return (
    <>
      <p className="muted">
        {done} sur {items.length} prêts. Base : {pack.autonomie_heures} h d'autonomie, à ajuster dans Mon foyer.
      </p>
      <ul className="plain">
        {items.map((item) => {
          const state = inventory[item.id];
          const alerte = statut(state?.peremption);
          return (
            <li key={item.id} className={`item ${alerte ?? ''}`}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={state?.checked ?? false}
                  onChange={(e) => patch(item.id, { checked: e.target.checked })}
                />
                <span>
                  <strong>{item.nom}</strong>
                  {item.detail && <small>{item.detail}</small>}
                </span>
              </label>
              <label className="date">
                Péremption
                <input
                  type="date"
                  value={state?.peremption ?? ''}
                  onChange={(e) => patch(item.id, { peremption: e.target.value })}
                />
              </label>
              {alerte === 'expire' && <p className="flag">Périmé, à renouveler</p>}
              {alerte === 'bientot' && <p className="flag">À renouveler dans moins de 30 jours</p>}
            </li>
          );
        })}
      </ul>
      {!rappelsDisponibles && (
        <p className="muted small">
          Les rappels de péremption par notification fonctionnent dans l'app Android et iOS. Ici, les produits à
          renouveler sont seulement signalés dans la liste.
        </p>
      )}
      {pack.note && <p className="muted small">{pack.note}</p>}
    </>
  );
}
