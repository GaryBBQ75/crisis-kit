import {
  Activity,
  Flame,
  Wind,
  Waves,
  Mountain,
  Radiation,
  Biohazard,
  Droplets,
  Factory,
  Zap,
  ShieldAlert,
  Globe,
  CloudFog,
  CloudRain,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { Kind } from "../feeds";
export type Risk = {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  kind?: Kind;
  mode?: "health";
  description: string;
  scope: string;
  limit: string;
  links: { name: string; url: string; scope: string }[];
};
const alerts = {
  name: "FR-Alert · publications et exercices",
  url: "https://www.fr-alert.gouv.fr/les-alertes",
  scope: "France · vérifier date et nature réelle/exercice",
};
const travel = {
  name: "France Diplomatie · conseils par pays",
  url: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs",
  scope: "International · conseils aux voyageurs français",
};
const gdacs = {
  name: "GDACS · suivi des catastrophes",
  url: "https://www.gdacs.org/",
  scope: "Monde · couverture partielle",
};
export const risks: Risk[] = [
  {
    id: "earthquake",
    kind: "earthquake",
    label: "Séismes",
    group: "Nature & météo",
    icon: Activity,
    description: "Observations sismiques publiées par l’USGS.",
    scope: "Monde · magnitude ≥ 2,5 · dernières 24 h",
    limit: "Les points ne délimitent pas les zones endommagées.",
    links: [],
  },
  {
    id: "wildfire",
    kind: "wildfire",
    label: "Feux de forêt",
    group: "Nature & météo",
    icon: Flame,
    description:
      "Événements recensés par NASA EONET et accès à la carte satellite FIRMS.",
    scope: "Monde · EONET : événements ouverts des 30 derniers jours",
    limit:
      "EONET n’inventorie pas tous les feux locaux. Les anomalies thermiques FIRMS ne sont pas toutes des incendies et ne sont pas des ordres d’évacuation.",
    links: [
      {
        name: "NASA FIRMS · feux et anomalies thermiques",
        url: "https://firms.modaps.eosdis.nasa.gov/map/",
        scope: "Monde · carte satellite externe",
      },
      alerts,
    ],
  },
  {
    id: "storm",
    kind: "storm",
    label: "Tempêtes",
    group: "Nature & météo",
    icon: Wind,
    description: "Tempêtes sévères recensées par NASA EONET.",
    scope: "Monde · événements ouverts des 30 derniers jours",
    limit:
      "Un point de tempête ne représente pas toute sa trajectoire ni son emprise.",
    links: [gdacs],
  },
  {
    id: "flood",
    kind: "flood",
    label: "Inondations",
    group: "Nature & météo",
    icon: CloudRain,
    description: "Inondations recensées par NASA EONET.",
    scope: "Monde · événements ouverts des 30 derniers jours",
    limit:
      "Couverture partielle, insuffisante pour évaluer une route ou un logement.",
    links: [gdacs, alerts],
  },
  {
    id: "volcano",
    kind: "volcano",
    label: "Volcans",
    group: "Nature & météo",
    icon: Mountain,
    description: "Activité volcanique recensée par NASA EONET.",
    scope: "Monde · événements ouverts des 30 derniers jours",
    limit:
      "Les observatoires locaux publient les consignes et périmètres applicables.",
    links: [gdacs],
  },
  {
    id: "tsunami",
    label: "Tsunamis",
    group: "Nature & météo",
    icon: Waves,
    description: "Consulter les bulletins des centres d’alerte tsunami.",
    scope: "NOAA · couverture selon le centre et le bassin",
    limit:
      "Aucun flux tsunami intégré. Un séisme ne suffit pas à déduire une menace tsunami. Vérifiez les territoires cités dans chaque bulletin.",
    links: [
      {
        name: "NOAA · Tsunami Warning Centers",
        url: "https://www.tsunami.gov/",
        scope:
          "Zones couvertes par les centres NOAA ; messages internationaux selon le bassin",
      },
    ],
  },
  {
    id: "weather",
    label: "Chaleur & sécheresse",
    group: "Nature & météo",
    icon: Sun,
    description:
      "Retrouver des informations sur les sécheresses et les dangers météorologiques.",
    scope: "GDACS : sécheresses recensées · FR-Alert : France",
    limit:
      "Pas de mesure locale de température ni de vigilance canicule intégrée.",
    links: [gdacs, alerts],
  },
  {
    id: "radiation",
    label: "Radiations & nucléaire",
    group: "Santé & environnement",
    icon: Radiation,
    description:
      "Accéder aux mesures de radioactivité environnementale et aux communications des autorités.",
    scope: "EURDEP · stations européennes",
    limit:
      "Carte externe, pas de mesures importées ici. EURDEP n’est pas un système d’alerte ; de nombreuses mesures ne sont pas validées. Une valeur isolée ne permet pas de diagnostiquer un accident.",
    links: [
      {
        name: "Commission européenne · cartes EURDEP",
        url: "https://remap.jrc.ec.europa.eu/",
        scope: "Europe · mesures environnementales",
      },
      alerts,
    ],
  },
  {
    id: "epidemic",
    mode: "health",
    label: "Épidémies & pandémies",
    group: "Santé & environnement",
    icon: Biohazard,
    description:
      "Lire les dernières publications sanitaires de l’Organisation mondiale de la Santé.",
    scope: "Monde · bulletins OMS, sélection non exhaustive",
    limit:
      "Les publications ont leur propre date. Elles ne constituent ni un décompte de pandémies ni une alerte sanitaire locale.",
    links: [
      {
        name: "OMS · Disease Outbreak News",
        url: "https://www.who.int/emergencies/disease-outbreak-news",
        scope: "Monde · publications officielles",
      },
    ],
  },
  {
    id: "air",
    label: "Air & fumées",
    group: "Santé & environnement",
    icon: CloudFog,
    description:
      "Consulter les indices de qualité de l’air près d’une commune.",
    scope: "Atmo France · territoires couverts par les associations agréées",
    limit:
      "Carte externe. L’indice de fond ne détecte pas à lui seul un nuage toxique ou une attaque chimique.",
    links: [
      {
        name: "Atmo France · qualité de l’air",
        url: "https://www.atmo-france.org/",
        scope: "France · indices et prévisions",
      },
    ],
  },
  {
    id: "water",
    label: "Eau & contamination",
    group: "Santé & environnement",
    icon: Droplets,
    description:
      "Retrouver les résultats du contrôle sanitaire de l’eau et les publications d’alerte.",
    scope: "France · contrôle sanitaire par commune",
    limit:
      "Les derniers résultats ne garantissent pas l’absence d’une contamination récente. Avis du distributeur, de la mairie et de l’ARS à consulter.",
    links: [
      {
        name: "Ministère de la Santé · qualité de l’eau",
        url: "https://sante.gouv.fr/sante-et-environnement/eaux/eau",
        scope: "France · analyses sanitaires",
      },
      alerts,
    ],
  },
  {
    id: "industrial",
    label: "Chimique & industriel",
    group: "Sécurité & infrastructures",
    icon: Factory,
    description:
      "Identifier les risques industriels et retrouver les publications d’alerte.",
    scope: "France · Géorisques et FR-Alert",
    limit:
      "Géorisques décrit l’exposition aux risques, pas les accidents en cours. Aucun capteur de substances toxiques connecté.",
    links: [
      {
        name: "Géorisques · risques naturels et technologiques",
        url: "https://www.georisques.gouv.fr/consulter-les-dossiers-thematiques",
        scope: "France · information préventive",
      },
      alerts,
    ],
  },
  {
    id: "blackout",
    label: "Coupures & réseaux",
    group: "Sécurité & infrastructures",
    icon: Zap,
    description:
      "Retrouver les communications de crise concernant les infrastructures.",
    scope: "France pour FR-Alert · opérateur local à consulter",
    limit:
      "Aucun suivi des coupures d’électricité, d’eau ou de télécommunications intégré. FR-Alert ne recense pas toutes les pannes.",
    links: [alerts],
  },
  {
    id: "terrorism",
    label: "Terrorisme & attaques",
    group: "Sécurité & infrastructures",
    icon: ShieldAlert,
    description:
      "Retrouver les communications officielles et les niveaux de vigilance applicables.",
    scope: "France : Vigipirate · international : conseils par pays",
    limit:
      "Pas de flux d’attaques confirmées connecté. Un niveau de vigilance n’est pas la confirmation d’une attaque en cours. Aucun signalement communautaire non vérifié affiché.",
    links: [
      {
        name: "Gouvernement · plan Vigipirate",
        url: "https://www.info.gouv.fr/risques/le-plan-vigipirate",
        scope: "France · dispositif de vigilance",
      },
      alerts,
      travel,
    ],
  },
  {
    id: "conflict",
    label: "Conflits & sécurité",
    group: "Sécurité & infrastructures",
    icon: Globe,
    description:
      "Consulter les recommandations et informations de sécurité par pays.",
    scope: "International · point de vue des autorités françaises",
    limit:
      "Pas de suivi de missiles, de trajectoires ou de combats en temps réel. Les consignes locales et alertes nationales restent prioritaires.",
    links: [travel],
  },
];
