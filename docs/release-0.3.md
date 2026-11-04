# Crisis Kit 0.3 — Carnet de secours

Nouvel accueil bleu marine, ivoire et orange, illustration du kit en CSS, pictogrammes Lucide, raccourcis soins/eau/pharmacie/défibrillateur. Guide de terrain : huit fiches existantes, pictogrammes par danger et actions numérotées. Responsive mobile et bureau.

Carte : recherche volontaire via Photon (https://github.com/komoot/photon), sans recherche à chaque frappe, cache sept jours. Chargement automatique des lieux après choix explicite d'une zone, depuis l'API cartographique OpenStreetMap. Zone nominale 2 × 2 km ; réduction à 1 × 1 ou 0,5 × 0,5 km si le serveur refuse la densité. Taille effective affichée. Cache de consultation un jour ; sauvegarde hors ligne explicite avec rues simplifiées et POI. Pas de téléchargement massif de tuiles.

Filtres soins, pharmacies, eau, défibrillateurs, secours, abris et sanitaires. Fiches avec distance à vol d'oiseau, métadonnées disponibles et lien source. Les lieux ne garantissent ni ouverture, ni capacité d'accueil, ni potabilité actuelle. Relations OSM non interprétées ; couverture partielle. Le service Photon public et l'API OSM ne constituent pas une infrastructure de production garantie : avant un déploiement à grande échelle, prévoir des services adaptés et des cartes vectorielles régionales.

Validation : compilation TypeScript et production, neuf tests de parsing/sécurité/distance/zone. Essai réel de Paris : 101 lieux dans la zone réduite, dont deux établissements de soins, 11 pharmacies et 23 points d'eau. Recherche Photon, fiche Hôtel-Dieu, enregistrement et simulation hors ligne vérifiés. Accueil, carte et guide vérifiés à 390 px, sans débordement horizontal.

Les flux USGS/NASA de la version précédente restent disponibles. Cette livraison n'ajoute pas de suivi de missiles, d'alertes officielles universelles, de messagerie Bluetooth ni de surveillance en arrière-plan.
