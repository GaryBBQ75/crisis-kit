# Android — Crisis Kit

Application : app.crisiskit · version 0.4.0 · code 1 · Android 7+ (API 24), cible API 36.

## Construire

Node 22.12+, Java 21 et SDK Android 36 sont nécessaires.

```sh
npm ci
npm run android:build
```

Le projet Android embarque dist : aucun serveur n’est requis pour ouvrir les écrans et guides. Les relevés et les lieux doivent être téléchargés avant une coupure. La géolocalisation est demandée uniquement après une action sur le bouton de localisation. Aucun suivi en arrière-plan.

APK de test : android/app/build/outputs/apk/debug/app-debug.apk.
Bundle Play : android/app/build/outputs/bundle/release/app-release.aab.

Sans variables de signature, le bundle release reste non signé. Pour signer, fournir CRISIS_KEYSTORE (chemin absolu), CRISIS_STORE_PASSWORD, CRISIS_KEY_ALIAS et CRISIS_KEY_PASSWORD. Ne jamais les ajouter au dépôt.

## Avant envoi à Google Play

Tester sur un téléphone Android : lancement en mode avion, guides, bouton Retour, position refusée puis autorisée, pack de carte téléchargé, relance après fermeture, rappels. Le build seul ne valide pas ces comportements sur appareil.

Préparer la fiche Play, les captures, la politique de confidentialité publique, les déclarations de données et les accès au compte Play Console. Aucun envoi au store n’est effectué automatiquement.

Les données personnelles saisies restent sur l’appareil. Les services de carte reçoivent les recherches ou zones demandées ; les sources publiques reçoivent des requêtes réseau et leurs métadonnées habituelles. Ne pas déclarer une absence totale de partage sans vérifier les définitions Play.

## Clé locale de dépôt

Une nouvelle clé de dépôt est conservée dans `.release-secrets/crisis-kit-upload.jks`, avec son mot de passe dans `.release-secrets/password.txt`. Sauvegarder ces deux fichiers dans un coffre privé avant publication. Ils sont exclus de Git et ne doivent jamais être placés sur le site public. Cette clé est destinée à une première publication de cette application ; une application déjà publiée nécessite sa clé de dépôt existante.

`python3 scripts/build-android-local.py` reconstruit les APK et le bundle signés avec cette clé. Google Play App Signing gérera la signature de distribution lors de la configuration de l’application dans Play Console.
