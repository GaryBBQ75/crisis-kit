# Architecture

## Les trois états du réseau

| État du réseau | Ce que fait l'app | D'où viennent les données |
| --- | --- | --- |
| Aucun réseau | Tout fonctionne : checklist, inventaire, fiches réflexes, carte, plan familial, premiers secours | Copie locale sur le téléphone |
| Réseau dégradé | Idem, plus lecture des alertes FR-Alert reçues par le téléphone, messagerie Bluetooth en V2 | Copie locale et radio du téléphone |
| Réseau normal | Mise à jour des packs et des cartes, alertes officielles par zone, rappels | Serveur et sources publiques |

## Écrans de la V0

1. Accueil en mode survie : trois gros boutons (Alerte, Checklist, Carte), état de la dernière synchro
2. Profil du foyer : adultes, enfants, animaux, médicaments, allergies
3. Checklist et provisions : liste générée selon le profil, quantités, dates de péremption, rappels
4. Fiches réflexes : nucléaire, séisme, tsunami, inondation, incendie, guerre
5. Carte hors ligne : zone téléchargée, points importants, points perso
6. Plan familial : point de rendez-vous, contacts, numéros d'urgence du pays
7. Premiers secours : gestes essentiels

## Packs de données

- `data/versions.json` : la version de chaque pack. L'app le compare à sa copie locale et propose la mise à jour en Wi-Fi.
- `data/packs/<pays>.<langue>.json` : un pack pays dans une langue.
- Les packs de carte (PMTiles) seront publiés par région, hors dépôt.

Un voyageur garde son socle dans sa langue et ajoute le pack du pays où il se trouve.

## Mises à jour et alertes

- Mises à jour des packs et des cartes en Wi-Fi uniquement, date de dernière synchro visible.
- V2 : lecture de flux CAP des agences nationales, GDACS (mondial), NASA FIRMS et EFFIS (incendies), USGS et EMSC (séismes).
- Notifications par zone (département ou région), jamais par position précise.
- L'app ne déclenche aucune alerte. Pour une attaque ou un missile, l'alerte passe par le canal officiel (FR-Alert en France) et l'app affiche les consignes.

## Serveur

Distribution de fichiers uniquement : versions, packs pays, cartes. Il ne stocke jamais le profil du foyer, l'inventaire, la position ou les contacts. Un petit relais d'alertes (VPS) n'arrive qu'en V2.

## Limites connues

- Bluetooth sur iPhone : iOS limite le relais en arrière-plan, la messagerie mesh sera plus fiable sur Android et se fait en natif.
- Maintenance des packs : un pays exact demande une veille sur les sources officielles. Démarrer par la France et l'UE.
- Ne pas laisser croire que l'app est officielle. N'afficher que des alertes de sources officielles.
