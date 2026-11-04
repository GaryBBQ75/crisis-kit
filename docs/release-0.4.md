# 0.4 — Situation : risques naturels, sanitaires et humains

Quinze rubriques regroupées en Nature & météo, Santé & environnement, Sécurité & infrastructures. Les cinq catégories naturelles connectées conservent leurs observations USGS/EONET ; autres événements naturels accessibles séparément. Les compteurs suivent désormais le périmètre Monde / 200 km et distinguent absence de relevé, cache et panne. Aucun compteur inventé pour les catégories sans flux.

Nouveau connecteur OMS Disease Outbreak News : requête documentée https://www.who.int/api/news/diseaseoutbreaknews/sfhelp, vingt titres, dates de publication et liens source. Chargement à l’ouverture si cache de plus d’une heure, actualisation manuelle, sans rafraîchissement automatique en mode économe. Titres sauvegardés dans IndexedDB ; articles complets non téléchargés. Titres dans leur langue d'origine. Pas de géolocalisation des bulletins, ni de décompte de pandémies.

Rubriques documentaires avec liens vérifiés : EURDEP pour les radiations (Europe, non-validé pour beaucoup de mesures, pas un système d’alerte), NASA FIRMS pour les feux/anomalies thermiques, NOAA pour les tsunamis (couverture par bassin), Atmo France, eau du ministère de la Santé, Géorisques, FR-Alert (inclut exercices et archives), Vigipirate, France Diplomatie. Chaque rubrique indique territoire et limites. Ces liens ne sont pas des API intégrées et aucun niveau de menace en direct n’est déduit. Pas de suivi de missiles ni d’attaques en direct.

Validation : douze tests, compilation production ; API OMS réellement chargée dans le navigateur ; fiches radiations et terrorisme contrôlées ; mobile 390 px sans débordement ; titres OMS lisibles en simulation hors ligne, liens externes désactivés.
