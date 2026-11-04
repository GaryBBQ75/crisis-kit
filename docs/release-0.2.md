# Crisis Kit 0.2 — 4 novembre 2026

## Livré

- Interface responsive : accueil, situation, carte, préparation, fiches, disponibilité hors ligne.
- USGS M2.5+ sur 24 h et NASA EONET événements ouverts sur 30 jours, parsing contrôlé et dates explicites.
- Chargement à l'ouverture et toutes les 5 minutes tant que l'app est visible. Pas de notifications push.
- Carte Leaflet, fond OpenStreetMap pour consultation en ligne uniquement. Aucun téléchargement massif de tuiles.
- Zone sélectionnée manuellement ou par géolocalisation volontaire ; proximité à 200 km, sans déduction de sécurité.
- Pack API OpenStreetMap : points utiles et tracés de rues dans un carré d’environ 2 × 2 km. Dessin vectoriel local hors ligne, partiel, sans calcul d'itinéraire. Licences OpenStreetMap/ODbL.
- Stockage IndexedDB des relevés, du foyer, du kit et du plan familial. Cache PWA des fichiers de l'application.
- Mode économe, simulation de coupure, écran de disponibilité et demande de stockage persistant.
- Huit fiches synthétiques sourcées. Références France pour les provisions et les numéros, explicitement identifiées.

## Limites et suite

- L'observation d'un événement n'est pas une alerte civile ni une instruction d'évacuation.
- EONET n'est pas exhaustif et comporte aussi des feux dirigés ; une entrée ouverte ne garantit pas un danger actuel.
- Pas encore de flux officiels CAP, tsunami, santé, radiations ou missiles ; aucun suivi militaire.
- Pas de partage communautaire, Bluetooth, authentification ou backend à ce stade.
- Cache navigateur soumis aux politiques d'éviction ; des tests natifs Android/iOS restent nécessaires.
- À plus grande échelle : fournisseurs de cartes et de données adaptés à la charge, packs vectoriels hébergés, revue éditoriale spécialisée et notification serveur.

## Vérification

- Build TypeScript/Vite/PWA, tests des parseurs et distances.
- Contrôle navigateur desktop et 390 px, chargement réel USGS/NASA, navigation et détail d'événement.
- Test navigateur : pack téléchargé réellement sur une zone rurale de test (46 tronçons) puis affiché sans fond en ligne ; checklist persistée et progression mise à jour.
- Serveur local arrêté : rechargement de l'accueil et ouverture des fiches réussis depuis le cache PWA.
- Audit des dépendances de production : aucune vulnérabilité signalée au 4 novembre 2026. Les dépendances de développement comportent encore des avis modérés/faibles.
