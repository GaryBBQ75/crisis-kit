# Crisis Kit

App légère de préparation aux crises (guerre, accident nucléaire, catastrophe naturelle). Elle fonctionne sans réseau, stocke tout sur le téléphone et devient plus utile quand le réseau revient.

Nom de travail, à changer.

## Principes

- **Local d'abord** : aucun compte, aucune donnée perso sur un serveur. Le profil du foyer, l'inventaire et les contacts restent sur le téléphone.
- **Trois états du réseau** : aucun réseau (tout marche), réseau dégradé (alertes reçues par le téléphone), réseau normal (mises à jour des packs et des cartes).
- **Mondial mais local** : un socle de conseils généraux embarqué, plus des packs par pays (numéros d'urgence, recommandations officielles, provisions) et des packs de carte par zone.
- **Légère et sobre** : fond sombre, peu de batterie, peu de poids.

## Trois couches de données

| Couche | Contenu | Où elle vit |
| --- | --- | --- |
| Socle mondial | Fiches réflexes, premiers secours, checklist 72 h de base | Embarqué dans l'app |
| Pack pays | Numéros d'urgence, système d'alerte, recommandations officielles, provisions | JSON téléchargé puis copié en local |
| Pack carte | Fond de carte et points importants dans un rayon choisi | PMTiles téléchargé en Wi-Fi |

Le dossier `data/` contient le format des packs et un premier pack France. Le détail est dans `docs/architecture.md`.

## Feuille de route

- [ ] V0 : profil du foyer, checklist et provisions, rappels de péremption, fiches réflexes, plan familial, premiers secours, pack France
- [ ] V1 : carte hors ligne par rayon ou région, points importants, coffre de documents chiffré, packs UE
- [ ] V2 : alertes par zone (CAP, GDACS), messagerie Bluetooth en natif, contributions ouvertes aux packs pays

## Stack envisagée

- Interface web (React, Tailwind), prototypée avec Lovable
- Emballage Android et iOS avec Capacitor
- Stockage local : IndexedDB
- Cartes : MapLibre et fichiers PMTiles, données OpenStreetMap
- Hébergement des packs : serveur OVH, fichiers statiques

## Démarrer

```
npm install
npm run dev          # développement
npm run build        # compile et construit dist/
npm run cap:add:android   # une seule fois, crée le projet Android
npm run cap:sync     # build puis copie dans les projets natifs
```

État actuel : squelette V0 fonctionnel, hors ligne grâce au service worker et à IndexedDB. Écrans présents : accueil, mon foyer, checklist avec péremptions, fiches réflexes, plan familial, premiers secours. Rappels de péremption par notification locale (30 et 7 jours avant) dans l'app Android et iOS. La carte et le téléchargement de packs sont à venir.

## Avertissement

Cette app ne remplace pas les consignes officielles et n'est pas une application gouvernementale. Chaque recommandation affiche sa source.

## Données et licences

Les données de carte viennent d'OpenStreetMap (licence ODbL), source à citer dans l'app. La licence du code reste à choisir.
