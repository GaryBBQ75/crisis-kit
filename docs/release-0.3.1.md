# 0.3.1 — Recherche rurale

La zone locale de 2 × 2 km ne contenait aucun lieu utile à Rosay-sur-Lieure. La recherche passe automatiquement à un rayon de 10 km si moins de trois POI sont chargés. Choix explicite 5, 10 et 25 km, rayon affiché, cercle de couverture et cadrage adapté. Cache v2 pour invalider les anciennes zones vides. Les changements de zone et le passage hors ligne annulent les requêtes en cours.

Les POI éloignés viennent de requêtes Overpass ciblées, sans télécharger les rues de toute la région. Instance européenne Dresel, puis FOSSGIS en secours ; hors Europe, FOSSGIS puis Private.coffee. Services publics sans garantie de disponibilité. Réponses signalant une erreur même avec des éléments partiels rejetées. Centres des bâtiments et relations pris en charge ; filtrage des centres par distance. Dates de collecte et de source distinctes.

Références des services : https://wiki.openstreetmap.org/wiki/Overpass_API . Endpoint Europe : https://ovp.dresel.systems/api/interpreter . Le navigateur transmet la zone demandée ; mention dans la carte et l’écran hors ligne. À grande échelle, remplacer ces instances publiques par une infrastructure dédiée.

Hors ligne : les POI élargis sont sauvegardés avec le pack ; les rues restent limitées à la petite zone locale, ce que l’interface indique explicitement.

Validation : 11 tests réussis et compilation production ; parcours réel recherche Rosay → 29 POI à 10 km → 492 à 25 km dont 22 soins → sauvegarde → mode hors ligne (rayon et points conservés). Pharmacie Charleval environ 3,5 km ; hôpital Saint-Jacques des Andelys environ 13,3 km à vol d’oiseau. Données cartographiques, pas confirmation d’ouverture ou de services d’urgence.
