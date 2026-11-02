export type Reflexe = {
  id: string;
  titre: string;
  avant?: string[];
  pendant: string[];
  apres?: string[];
};

/**
 * Consignes générales de départ, à valider avec les sources officielles
 * (Gouvernement, Sécurité civile) avant toute publication.
 */
export const reflexes: Reflexe[] = [
  {
    id: 'nucleaire',
    titre: 'Accident ou attaque nucléaire',
    pendant: [
      'Se mettre à l\'abri dans un bâtiment en dur, portes et fenêtres fermées.',
      'Couper la ventilation et la climatisation.',
      'Écouter la radio pour les consignes officielles.',
      'Limiter les appels pour ne pas saturer le réseau.',
      'Ne pas aller chercher ses enfants à l\'école : les équipes s\'en occupent.',
      'Ne prendre des comprimés d\'iode que sur consigne des autorités.',
    ],
  },
  {
    id: 'seisme',
    titre: 'Séisme',
    pendant: [
      'Se mettre sous un meuble solide ou contre un mur porteur, loin des fenêtres.',
      'Ne pas utiliser l\'ascenseur.',
    ],
    apres: [
      'Évacuer si le bâtiment est endommagé, en évitant de revenir chercher des affaires.',
      'Couper le gaz et l\'électricité si possible.',
      'Se méfier des répliques.',
    ],
  },
  {
    id: 'tsunami',
    titre: 'Tsunami',
    pendant: [
      'Près de la côte, après un fort séisme ou une alerte, aller tout de suite sur les hauteurs ou aux étages élevés d\'un bâtiment solide.',
      'S\'éloigner du rivage sans attendre de voir la vague.',
    ],
    apres: ['Rester en hauteur tant que les autorités n\'ont pas levé l\'alerte : plusieurs vagues peuvent se suivre.'],
  },
  {
    id: 'inondation',
    titre: 'Inondation',
    pendant: [
      'Monter à l\'étage ou sur un point haut.',
      'Ne pas s\'engager à pied ou en voiture dans une zone inondée.',
      'Couper l\'électricité et le gaz.',
      'Écouter la radio.',
    ],
  },
  {
    id: 'incendie',
    titre: 'Incendie de forêt',
    pendant: [
      'Suivre les consignes d\'évacuation des autorités.',
      'Si l\'évacuation est impossible, se confiner dans un bâtiment en dur, volets et fenêtres fermés.',
    ],
  },
  {
    id: 'guerre',
    titre: 'Attaque ou bombardement',
    pendant: [
      'Rejoindre un abri ou un lieu clos, loin des vitres.',
      'Suivre les consignes officielles : alerte sur le téléphone (FR-Alert) et radio.',
      'Garder le kit 72 h et les papiers à portée de main.',
    ],
  },
];
