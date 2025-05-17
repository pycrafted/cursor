# Visualiseur DICOM avec OHIF

Cette application permet de téléverser et visualiser des fichiers DICOM en utilisant OHIF (Open Health Imaging Foundation) Viewer et Orthanc comme PACS.

## Prérequis

- Node.js (v14 ou supérieur)
- Orthanc Server en cours d'exécution sur http://localhost:8042
- npm ou yarn

## Structure du projet

```
.
├── backend/             # Serveur Node.js/Express
│   ├── index.js        # Point d'entrée du serveur
│   └── package.json    # Dépendances du backend
│
└── frontend/           # Application React
    ├── public/        # Fichiers statiques
    ├── src/           # Code source React
    └── package.json   # Dépendances du frontend
```

## Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
```

2. Installer les dépendances du backend :
```bash
cd backend
npm install
```

3. Installer les dépendances du frontend :
```bash
cd ../frontend
npm install
```

## Configuration

1. Assurez-vous qu'Orthanc est en cours d'exécution sur http://localhost:8042
2. Les identifiants par défaut pour Orthanc sont :
   - Username: orthanc
   - Password: orthanc

## Démarrage

1. Démarrer le backend :
```bash
cd backend
npm start
```

2. Dans un nouveau terminal, démarrer le frontend :
```bash
cd frontend
npm start
```

L'application sera accessible à :
- Frontend : http://localhost:3000
- Backend : http://localhost:3001
- OHIF Viewer : http://localhost:8042/ohif/viewer

## Fonctionnalités

- Téléversement de fichiers DICOM
- Liste des études DICOM disponibles
- Visualisation des études avec OHIF Viewer
- Interface responsive
- Gestion des erreurs
- Rafraîchissement automatique de la liste après téléversement

## Développement

- Le backend utilise Express.js avec multer pour la gestion des fichiers
- Le frontend est construit avec React et utilise axios pour les requêtes HTTP
- Les styles utilisent CSS moderne avec flexbox pour la mise en page

## Notes

- Les fichiers téléversés sont temporairement stockés dans `/backend/uploads/` avant d'être envoyés à Orthanc
- Les fichiers temporaires sont automatiquement supprimés après le téléversement
- Seuls les fichiers DICOM (.dcm) sont acceptés

## Sécurité

⚠️ Cette version est destinée au développement et aux tests. Pour la production :
- Ajoutez une authentification
- Utilisez HTTPS
- Configurez correctement CORS
- Utilisez des variables d'environnement pour les configurations sensibles 