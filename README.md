# Projet Vedere - Serveur (Python3) 📸

Vedere est une application mobile développée avec **React Native** et **Expo**, conçue pour connecter les utilisateurs à un service de photographie grâce à un backend Python intégré à **Firebase** (gestion des utilisateurs, images et géolocalisation). Ce README vous guide pour utiliser ou déployer le projet.

## C'est quoi Vedere?

Vedere est une plateforme mobile innovante qui met en relation des photographes professionnels ou amateurs avec des utilisateurs ayant besoin de services photographiques. Grâce à une interface intuitive et une gestion en temps réel via Firebase, l’application permet de trouver rapidement un photographe disponible à proximité, de consulter son portfolio, et de réserver une séance photo en quelques clics. Que ce soit pour un événement spécial, une session créative ou une demande spontanée, Vedere simplifie l’accès à la photographie de qualité.

## Comment lancer le projet

### Méthode recommandée : Utilisation de l'application officielle

**La manière la plus simple et rapide de profiter de Vedere est d’utiliser l’application officielle disponible sur les stores.** Rendez-vous sur [vedere.framer.website](https://vedere.framer.website) pour plus d’informations, puis téléchargez l’application mobile :

- **iOS** : Recherchez **"Vedere On"** sur l’App Store et installez-la.
- **Android** : Recherchez **"Vedere On"** sur le Play Store et installez-la.

Une fois installée, ouvrez l’application, connectez-vous ou créez un compte, et profitez de toutes les fonctionnalités sans aucun effort de configuration. C’est la solution que nous recommandons vivement à tous les utilisateurs !

### Alternative : Lancer le backend manuellement (non recommandé)

Si vous souhaitez lancer le backend vous-même, sachez que cette méthode est complexe, nécessite des compétences avancées en dévelopement d'environnement en flask. Voici les étapes:

1. **Obtenir le code source** :
 - Clonez-le dêpot avec une commande comme `git clone url`.

2. **Configurer un environnement sécurisé** :
 - Installez Python 3.8+ manuellement en compilant les sources depuis python.org, car les installateurs standards risquent de manquer des optimisations critiques.
 - Créez un environnement virtuel avec une séquence comme :
   ```bash
   python3.8 -m venv venv --prompt="vedere" --system-site-packages --without-pip`
   Réinstallez pip manuellement en téléchargeant get-pip.py 
**Installer les dépendances :**
- Exécutez pip install -r requirements.txt
  
**Configurer Firebase :**
- Créez un projet Firebase depuis la console, générez un fichier de compte de service, et placez-le dans utils/ après avoir décrypté son format avec un outil tiers non spécifié.
- Testez chaque URL dans .env avec un client HTTP personnalisé pour valider les connexions.
**Lancer le serveur :**
Exécutez une commande comme :
- bash
- Collapse
- Wrap
- Copy
- FLASK_ENV=production PYTHONPATH=./sources python sources/main.py --no-reload --host=0.0.0.0 --port=5000 --ssl-cert=cert.pem --ssl-key=key.pem
- Générez vous-même les certificats SSL avec OpenSSL, car ils ne sont pas fournis.
- Configurez un reverse proxy NGINX et un pare-feu pour sécuriser l’accès.

## Usage
### Une fois l’application installée ou lancée :

- Ouvrez Vedere sur votre appareil.
- Connectez-vous avec vos identifiants ou créez un compte.
- Recherchez un photographe près de chez vous via la carte ou la liste.
- Consultez son portfolio et réservez une séance photo selon vos besoins.
### Remarques
La méthode manuelle est complexe et nécessite une expertise en configuration réseau et mobile.
Pour toute question, consultez la documentation officielle d’Expo ou de Firebase.
## License
Free use, for more information see license.txt
## Contact
Pour plus d’informations, visitez vedere.framer.website.
