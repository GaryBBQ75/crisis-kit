import {
  Activity,
  Backpack,
  BatteryCharging,
  BookOpen,
  Building2,
  Compass,
  Droplets,
  Flame,
  HeartPulse,
  Hospital,
  House,
  Landmark,
  MapPin,
  Pill,
  Radio,
  ShieldCheck,
  Toilet,
  TriangleAlert,
  Users,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { POI } from "../localMap";
export type POICategory =
  "health" | "pharmacy" | "water" | "aed" | "rescue" | "shelter" | "toilets";
export const poiCategories: Record<
  POICategory,
  {
    label: string;
    singular: string;
    icon: LucideIcon;
    color: string;
    tint: string;
  }
> = {
  health: {
    label: "Soins",
    singular: "Établissement de soins",
    icon: Hospital,
    color: "#bf4d44",
    tint: "#f9e9e5",
  },
  pharmacy: {
    label: "Pharmacies",
    singular: "Pharmacie",
    icon: Pill,
    color: "#347968",
    tint: "#e7f2ec",
  },
  water: {
    label: "Eau",
    singular: "Point d’eau",
    icon: Droplets,
    color: "#257d9d",
    tint: "#e4f2f7",
  },
  aed: {
    label: "Défibrillateurs",
    singular: "Défibrillateur",
    icon: HeartPulse,
    color: "#a85b79",
    tint: "#f6e8ee",
  },
  rescue: {
    label: "Secours",
    singular: "Service de secours",
    icon: ShieldCheck,
    color: "#b16a26",
    tint: "#fbefdf",
  },
  shelter: {
    label: "Abris",
    singular: "Abri cartographié",
    icon: House,
    color: "#6c67a0",
    tint: "#eeedf7",
  },
  toilets: {
    label: "Sanitaires",
    singular: "Sanitaires",
    icon: Toilet,
    color: "#5b7180",
    tint: "#e8eef2",
  },
};
export function poiCategory(p: POI): POICategory {
  if (p.category && p.category in poiCategories)
    return p.category as POICategory;
  const k = p.kind.toLowerCase();
  return k.includes("eau")
    ? "water"
    : k.includes("pharm")
      ? "pharmacy"
      : k.includes("défib")
        ? "aed"
        : k.includes("abri")
          ? "shelter"
          : k.includes("sanitaire")
            ? "toilets"
            : k.includes("police") || k.includes("caserne")
              ? "rescue"
              : "health";
}
export const guideIcons: Record<string, LucideIcon> = {
  seisme: Activity,
  incendie: Flame,
  tsunami: Waves,
  nucleaire: Landmark,
  eau: Droplets,
  blackout: Zap,
  epidemie: Wind,
  depart: Backpack,
};
export function Pictogram({
  icon: Icon,
  tone = "orange",
  size = 25,
}: {
  icon: LucideIcon;
  tone?: string;
  size?: number;
}) {
  return (
    <span className={`pictogram pic-${tone}`}>
      <Icon size={size} strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}
export function KitVisual() {
  return (
    <div className="kit-visual" aria-hidden="true">
      <div className="field-grid" />
      <span className="visual-coordinate">KIT / 01 — LES ESSENTIELS</span>
      <div className="field-orbit orbit-one" />
      <div className="field-orbit orbit-two" />
      <div className="kit-bag">
        <div className="bag-handle" />
        <div className="bag-lid" />
        <div className="bag-seam" />
        <div className="bag-label">
          <ShieldCheck size={37} strokeWidth={1.7} />
          <span>CRISIS KIT</span>
        </div>
        <div className="bag-pocket" />
        <i className="bag-strap strap-left" />
        <i className="bag-strap strap-right" />
      </div>
      <div className="equipment water">
        <Droplets size={30} />
        <span>EAU</span>
      </div>
      <div className="equipment radio">
        <Radio size={31} />
        <span>INFORMATION</span>
      </div>
      <div className="equipment power">
        <BatteryCharging size={30} />
        <span>ÉNERGIE</span>
      </div>
      <div className="equipment care">
        <HeartPulse size={29} />
        <span>SOINS</span>
      </div>
      <span className="visual-caption">
        <Compass size={14} /> PRÉPARER, C’EST DÉJÀ AGIR.
      </span>
    </div>
  );
}
