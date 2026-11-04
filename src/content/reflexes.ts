export type Reflexe = {
  id: string;
  titre: string;
  category: string;
  avant?: string[];
  pendant: string[];
  apres?: string[];
  source: string;
  url: string;
  scope: string;
};
export const reflexes: Reflexe[] = [
  {
    id: "seisme",
    titre: "La terre tremble",
    category: "Nature",
    scope: "Conseils généraux · CDC",
    avant: [
      "Repérer les endroits où protéger sa tête et s’entraîner avec son foyer.",
    ],
    pendant: [
      "À l’intérieur, se baisser, protéger sa tête et son cou, se mettre sous une table solide si elle est proche et s’y tenir.",
      "Rester à l’écart des fenêtres. Ne pas se précipiter dehors pendant les secousses.",
    ],
    apres: ["Anticiper les répliques et suivre les consignes locales."],
    source: "CDC · Séismes",
    url: "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
  },
  {
    id: "incendie",
    titre: "Un feu de forêt approche",
    category: "Nature",
    scope: "Repères France · adapter aux instructions locales",
    avant: [
      "Identifier les risques locaux, préparer son kit et les contacts utiles.",
    ],
    pendant: [
      "Consulter immédiatement les consignes des autorités et respecter les instructions d’évacuation ou de mise à l’abri.",
      "Signaler un départ de feu aux secours depuis un lieu sûr : en France, le 18 ou le 112. Ne pas s’approcher pour filmer.",
    ],
    source: "Ministère de la Transition écologique · Feux de forêt",
    url: "https://www.ecologie.gouv.fr/feux-foret-et-vegetation",
  },
  {
    id: "tsunami",
    titre: "Une alerte tsunami",
    category: "Nature",
    scope: "Repères généraux · service météorologique américain",
    avant: ["Repérer les zones d’évacuation et leur signalisation sur place."],
    pendant: [
      "En zone côtière exposée, après une alerte officielle ou des signes naturels de tsunami, rejoindre les hauteurs ou s’éloigner à l’intérieur des terres suivant les chemins d’évacuation.",
      "Ne pas aller observer la mer. Ne pas attendre une notification de cette application.",
    ],
    apres: [
      "Attendre les indications des autorités avant de retourner dans la zone.",
    ],
    source: "NOAA / NWS · During a Tsunami",
    url: "https://www.weather.gov/safety/tsunami-during",
  },
  {
    id: "nucleaire",
    titre: "Une urgence radiologique",
    category: "Technologique",
    scope: "Repères généraux · CDC",
    avant: [
      "Préparer un moyen d’écouter les informations officielles et un kit familial.",
    ],
    pendant: [
      "Rejoindre l’intérieur d’un bâtiment et y rester à l’écoute des autorités.",
      "Suivre les instructions locales de mise à l’abri et les informations officielles à la radio ou sur les canaux disponibles.",
      "Ne pas décider de sortir à partir d’un calcul théorique de décroissance radioactive. Cette fiche ne mesure pas l’exposition.",
    ],
    source: "CDC · Urgences radiologiques",
    url: "https://www.cdc.gov/radiation-emergencies/response/",
  },
  {
    id: "eau",
    titre: "L’eau pourrait être contaminée",
    category: "Santé",
    scope: "Repères généraux · CDC",
    avant: [
      "Conserver une réserve d’eau potable conditionnée et les coordonnées du service d’eau.",
    ],
    pendant: [
      "Suivre l’avis local : faire bouillir, ne pas boire et ne pas utiliser sont des consignes différentes.",
      "Utiliser de l’eau embouteillée sûre lorsqu’elle est disponible.",
      "L’ébullition ne rend pas potable une eau contenant des produits chimiques toxiques ou des substances radioactives. Ne pas improviser un traitement.",
    ],
    source: "CDC · Avis sur l’eau potable",
    url: "https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html",
  },
  {
    id: "blackout",
    titre: "Plus d’électricité ni de réseau",
    category: "Services essentiels",
    scope: "Repères de préparation · Canada et autorités locales",
    avant: [
      "Charger les batteries, prévoir un éclairage à piles et organiser les besoins des appareils médicaux avec un professionnel.",
    ],
    pendant: [
      "Économiser la batterie du téléphone et consulter les informations déjà enregistrées.",
      "Ne jamais utiliser de barbecue, réchaud de camping ou groupe électrogène à combustion à l’intérieur.",
      "Utiliser son plan familial et suivre les informations officielles disponibles à la radio.",
    ],
    source: "Gouvernement du Canada · Pannes de courant",
    url: "https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/hazards-emergencies/power-outages/how-prepare.html",
  },
  {
    id: "epidemie",
    titre: "Une épidémie respiratoire",
    category: "Santé",
    scope:
      "Virus respiratoires uniquement · pas un protocole pour toute pandémie",
    avant: [
      "Discuter des vaccinations recommandées et des risques particuliers avec son professionnel de santé.",
    ],
    pendant: [
      "Se laver régulièrement les mains et améliorer l’air intérieur lorsque cela est possible et compatible avec les autres dangers.",
      "En cas de maladie, limiter les contacts pour protéger les autres ; demander rapidement un avis médical si l’on risque une forme grave.",
      "Adapter les précautions supplémentaires, dont le masque, aux recommandations sanitaires locales.",
    ],
    source: "CDC · Prévention des infections respiratoires",
    url: "https://www.cdc.gov/respiratory-viruses/prevention/index.html",
  },
  {
    id: "depart",
    titre: "Je dois quitter mon logement",
    category: "Préparation",
    scope: "Préparation du foyer · France",
    avant: [
      "Préparer un kit accessible, les copies de documents, les traitements habituels et les contacts utiles.",
      "Convenir de points de rendez-vous et des besoins des enfants et animaux.",
    ],
    pendant: [
      "Suivre le lieu et le trajet indiqués par les autorités. Prendre son kit s’il est accessible sans se mettre en danger.",
      "Utiliser le plan de contact familial lorsque les communications le permettent.",
    ],
    source: "Gouvernement français · Se préparer",
    url: "https://www.info.gouv.fr/risques/se-preparer-a-une-situation-durgence",
  },
];
