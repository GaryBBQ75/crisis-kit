import {
  defaultProfile,
  usePersisted,
  type Profile as ProfileType,
} from "../store";

function Counter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="row">
      <span>{label}</span>
      <div className="counter">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          aria-label={`Moins de ${label}`}
        >
          −
        </button>
        <strong>{value}</strong>
        <button
          onClick={() => onChange(value + 1)}
          aria-label={`Plus de ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile, ready] = usePersisted<ProfileType>(
    "profile",
    defaultProfile,
  );
  if (!ready) return null;
  const update = (patch: Partial<ProfileType>) =>
    setProfile({ ...profile, ...patch });

  return (
    <>
      <p className="muted">
        Ces informations restent sur ce téléphone. Elles servent à calculer ta
        checklist.
      </p>
      <Counter
        label="Adultes"
        value={profile.adultes}
        onChange={(n) => update({ adultes: Math.max(1, n) })}
      />
      <Counter
        label="Enfants"
        value={profile.enfants}
        onChange={(n) => update({ enfants: n })}
      />
      <Counter
        label="Animaux"
        value={profile.animaux}
        onChange={(n) => update({ animaux: n })}
      />

      <label>
        Médicaments à prévoir
        <textarea
          rows={3}
          value={profile.medicaments}
          onChange={(e) => update({ medicaments: e.target.value })}
          placeholder="Traitements habituels du foyer"
        />
      </label>
      <label>
        Allergies alimentaires
        <textarea
          rows={2}
          value={profile.allergies}
          onChange={(e) => update({ allergies: e.target.value })}
          placeholder="Optionnel"
        />
      </label>
    </>
  );
}
