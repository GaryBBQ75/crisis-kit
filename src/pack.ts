import fr from "../data/packs/FR.fr.json";
import type { Profile } from "./store";

export type Provision = {
  id: string;
  nom: string;
  quantite_par_personne_jour?: number;
  unite?: string;
  jours?: number;
};

export type Pack = {
  pays: string;
  langue: string;
  version: string;
  urgences: { nom: string; numero: string }[];
  alerte: {
    systeme: string;
    type: string;
    installation_requise: boolean;
    info: string;
  };
  autonomie_heures: number;
  provisions: Provision[];
  sources: { titre: string; url: string }[];
  note?: string;
};

/** Pack embarqué dans l'app. Plus tard : pack téléchargé selon la localisation. */
export const pack: Pack = fr as Pack;

export type ChecklistItem = { id: string; nom: string; detail: string };

export function buildChecklist(p: Pack, profile: Profile): ChecklistItem[] {
  const personnes = Math.max(1, profile.adultes + profile.enfants);
  const jours = Math.round(p.autonomie_heures / 24);

  const items: ChecklistItem[] = p.provisions.map((prov) => {
    if (prov.quantite_par_personne_jour) {
      const total = prov.quantite_par_personne_jour * personnes * jours;
      return {
        id: prov.id,
        nom: prov.nom,
        detail:
          `${total} ${prov.unite ?? ""} pour ${personnes} personne(s) sur ${jours} jours`.replace(
            "  ",
            " ",
          ),
      };
    }
    if (prov.jours) {
      return {
        id: prov.id,
        nom: prov.nom,
        detail: `${prov.jours} jours pour ${personnes} personne(s)`,
      };
    }
    return { id: prov.id, nom: prov.nom, detail: "" };
  });

  if (profile.animaux > 0) {
    items.push({
      id: "animaux",
      nom: "Nourriture et eau pour les animaux",
      detail: `${jours} jours pour ${profile.animaux} animal(aux)`,
    });
  }
  if (profile.enfants > 0) {
    items.push({
      id: "enfants",
      nom: "Besoins des enfants (lait, couches, doudou)",
      detail: `${profile.enfants} enfant(s)`,
    });
  }
  if (profile.medicaments.trim()) {
    items.push({
      id: "ordonnances",
      nom: "Médicaments et ordonnances du foyer",
      detail: profile.medicaments.trim(),
    });
  }
  if (profile.allergies.trim()) {
    items.push({
      id: "allergies",
      nom: "Alimentation adaptée aux allergies",
      detail: profile.allergies.trim(),
    });
  }
  return items;
}
