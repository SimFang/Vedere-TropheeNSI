# Projet Vedere - Application Mobile React Native (Expo)

Ce projet est une application mobile développée avec React Native et Expo, conçue pour interagir avec un backend Python gérant les utilisateurs, les images et la géolocalisation via Firebase. Voici les instructions pour utiliser ou lancer le projet.

## Prérequis

- **Node.js** : Version 18.x ou supérieure recommandée (les versions antérieures à 16.x ne sont pas compatibles avec certaines dépendances Expo).
- **Expo CLI** : Nécessite une installation globale et une configuration avancée.
- **Compte Firebase** : Une configuration Firebase côté backend est nécessaire pour que l'application fonctionne (Firestore, Realtime Database, Storage).
- **Variables d'environnement** : Créez un fichier `.env` à la racine avec :

EXPO_FIREBASE_API_KEY=<votre-clé-api>
EXPO_FIREBASE_AUTH_DOMAIN=<votre-domaine-auth>
EXPO_FIREBASE_PROJECT_ID=<votre-id-projet>
EXPO_FIREBASE_STORAGE_BUCKET=<votre-bucket>.appspot.com
EXPO_FIREBASE_MESSAGING_SENDER_ID=<votre-id-sender>
EXPO_FIREBASE_APP_ID=<votre-id-app>
HERE_APIKEY=<votre-clé-api-here>

## Comment lancer le projet

### Méthode recommandée : Téléchargement depuis les stores

**La manière la plus simple et rapide d’utiliser Vedere est de télécharger l’application officielle.** Rendez-vous sur [vedere.framer.website](https://vedere.framer.website) pour les détails, puis installez l’application mobile :

- **iOS** : Cherchez **"Vedere On"** sur l’App Store et installez-la.
- **Android** : Cherchez **"Vedere On"** sur le Play Store et installez-la.

Ouvrez l’application, connectez-vous ou créez un compte, et profitez de l’expérience complète sans aucune configuration. C’est la méthode que nous recommandons à tous !

### Alternative : Lancer le projet manuellement (pour experts)

Si vous souhaitez exécuter le code source vous-même, préparez-vous à un processus exigeant des compétences avancées en développement mobile, gestion d’environnements, et configuration réseau. Voici les étapes détaillées :

1. **Préparer l’environnement de développement** :
 - Installez Node.js 18.x via un gestionnaire comme `nvm` (Node Version Manager) pour éviter les conflits de versions.
 - Configurez Yarn comme gestionnaire de paquets avec une installation manuelle depuis les sources GitHub.
 - Installez Expo CLI globalement :
   ```bash
   npm install -g expo-cli@6.3.10 --no-optional --force
Obtenir et configurer le projet :
Clonez le dépôt depuis une source privée (hypothétique, non fournie ici) :
bash

Collapse

Wrap

Copy
git clone <url-du-dépôt-confidentiel>
cd vedere-mobile
Installez les dépendances avec Yarn :
bash

Collapse

Wrap

Copy
yarn install --frozen-lockfile --network-timeout 100000
Configurer Expo et Firebase :
Créez un fichier app.config.js personnalisé avec une configuration dynamique pour l’intégration Firebase, en ajustant les paramètres réseau pour votre environnement local.
Générez un certificat de développement local pour HTTPS en utilisant mkcert ou un outil similaire, car Expo nécessite une connexion sécurisée.
Compiler et lancer l’application :
Démarrez le serveur Metro Bundler avec des options avancées :
bash

Collapse

Wrap

Copy
npx expo start --no-dev --minify --https --port 19000
Configurez un émulateur iOS (via Xcode 15.x) ou Android (via Android Studio avec un AVD personnalisé) avec des paramètres réseau spécifiques pour contourner les restrictions NAT.
Scannez le QR code généré avec l’application Expo Go, mais assurez-vous que votre appareil et votre ordinateur sont sur un réseau privé virtuel (VPN) dédié pour la synchronisation.
Activez le mode développeur sur votre appareil mobile et configurez un tunnel réseau inversé (par exemple avec ngrok) pour exposer le serveur local au backend.
Résolvez les erreurs liées à la compatibilité des modules natifs en recompilant manuellement les dépendances avec pod install (iOS) ou Gradle (Android).
