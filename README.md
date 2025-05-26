# Système de Gestion Médicale

Un système complet de gestion médicale permettant la gestion des hôpitaux, des patients, des médecins et des dossiers médicaux.

## Fonctionnalités

- Gestion des hôpitaux et des départements
- Gestion des utilisateurs (Gestionnaire, Administrateur, Secrétaire, Médecin, Patient)
- Gestion des dossiers médicaux
- Gestion des images DICOM
- Système de rendez-vous
- Interface de téléconsultation

## Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_PROJET]
```

2. Installer les dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configuration de la base de données
```bash
# Créer une base de données PostgreSQL
createdb medical_system

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres
```

4. Lancer les migrations
```bash
cd backend
npm run migrate
```

5. Démarrer l'application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## Structure du Projet

```
.
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/    # Contrôleurs
│   │   ├── models/        # Modèles de données
│   │   ├── routes/        # Routes API
│   │   ├── middleware/    # Middleware
│   │   └── utils/         # Utilitaires
│   └── tests/             # Tests backend
│
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/        # Pages
│   │   ├── services/     # Services API
│   │   └── utils/        # Utilitaires
│   └── tests/            # Tests frontend
│
└── docs/                  # Documentation
```

## Rôles Utilisateurs

- **Gestionnaire** : Création des comptes hôpital et administrateur
- **Administrateur** : Gestion d'un hôpital spécifique
- **Secrétaire** : Gestion des patients et des rendez-vous
- **Médecin** : Accès aux dossiers médicaux et gestion des consultations
- **Patient** : Accès à son dossier médical et gestion des rendez-vous

## API Documentation

La documentation de l'API est disponible à `/api-docs` lorsque le serveur est en cours d'exécution.

## Tests

```bash
# Tests backend
cd backend
npm test

# Tests frontend
cd frontend
npm test
```

## Déploiement

1. Build de l'application
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

2. Configuration du serveur de production
```bash
# Configurer les variables d'environnement de production
cp .env.example .env.production
```

3. Démarrage en production
```bash
npm run start:prod
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

Pour toute question ou problème, veuillez ouvrir une issue dans le repository. 