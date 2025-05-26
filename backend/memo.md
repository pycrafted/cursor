# Système de Gestion Médicale

## Structure des Comptes et Rôles

### Types de Comptes
- Hôpital
- Gestionnaire
- Administrateur
- Secrétaire
- Médecin
- Patient

## Hiérarchie et Relations

### Gestionnaire
- Rôle de plus haut niveau dans le système
- Responsabilités :
  - Création des comptes hôpital
  - Création des comptes administrateur
  - Gestion globale du système

### Hôpital
- Structure principale du système
- Caractéristiques :
  - Peut avoir plusieurs administrateurs
  - Page principale affichant :
    - Liste des secrétaires
    - Liste des médecins avec leurs spécialités
    - Informations sur l'établissement :
      - Localisation
      - Liste des départements
    - Interface visuelle soignée et professionnelle

### Administrateur
- Gestion au niveau de l'hôpital
- Caractéristiques :
  - Lié à un seul hôpital lors de sa création
  - Responsabilités :
    - Création des comptes médecin et secrétaire pour son hôpital
    - Gestion des ressources de l'hôpital

### Secrétaire
- Support administratif
- Caractéristiques :
  - Lié à l'hôpital de l'administrateur qui l'a créé
- Responsabilités :
  - Création des comptes patients avec informations personnelles (informations médicales initialisées vides)
  - Validation des comptes patients créés via la page register (peut valider les comptes de tous les patients, quel que soit l'hôpital)
  - Possibilité de lier un patient à un médecin de son hôpital lors de la création/validation du compte
  - Validation des demandes de rendez-vous uniquement pour les médecins de son hôpital
- Restrictions :
  - Pas d'accès aux informations médicales des patients

### Médecin
- Personnel médical
- Caractéristiques :
  - Peut être lié à plusieurs hôpitaux
  - Lien automatique avec l'hôpital de l'administrateur qui le crée
  - Possibilité d'être lié à d'autres hôpitaux par d'autres administrateurs
- Droits d'accès :
  - Accès automatique au dossier médical d'un patient lorsque :
    - Le patient est lié à lui lors de la création/validation de son compte
    - Le patient demande un rendez-vous auprès de lui (validation par la secrétaire)
  - Possède des icônes stylo sous chaque carte du dossier médical pour modifier les informations (uniquement visible et modifiable par lui)
  - Peut uploader de nouvelles images DICOM pour un patient lorsqu'il accède à son dossier médical
- Pour ses patients :
  - Accès complet à toutes les informations médicales
  - Peut modifier toutes les informations
  - Peut ajouter de nouvelles informations
  - Peut supprimer des informations
  - Peut gérer toutes les images DICOM (upload, suppression, modification)

### Patient
- Utilisateur final
- Fonctionnalités :
  - Peut créer un compte via la page register (nécessite validation par une secrétaire)
  - Peut être lié à un médecin lors de la création/validation de son compte
  - Peut demander des rendez-vous auprès des médecins
- Accès aux informations :
  - Son dossier médical est accessible uniquement aux médecins avec lesquels il a pris rendez-vous ou auxquels il est lié
  - Peut consulter son dossier médical en lecture seule (pas de droits de modification)
- Gestion des images DICOM :
  - Possède ses propres images DICOM qui lui sont spécifiques
  - Droits limités :
    - Peut les consulter
    - Peut les télécharger
    - Ne peut pas les supprimer
    - Ne peut pas en uploader de nouvelles
    - Ne peut pas les modifier

## Flux de Travail
1. Création des comptes :
   - Gestionnaire crée les comptes hôpital et administrateur
   - Administrateur crée les comptes médecin et secrétaire
   - Secrétaire crée les comptes patients ou valide les inscriptions
   - Possibilité de lier le patient à un médecin lors de la création/validation

2. Gestion des rendez-vous :
   - Patient demande un rendez-vous
   - Secrétaire valide la demande
   - Médecin accède au dossier médical

3. Gestion des dossiers médicaux :
   - Médecin a accès complet aux dossiers de ses patients (liés ou avec rendez-vous)
   - Patient peut consulter son dossier en lecture seule
   - Images DICOM gérées par le médecin, consultables par le patient

## Problème de la route de changement de mot de passe (POST /api/hospitals/:id/change-password)

### Symptômes
- La route retourne une erreur 404 (Not Found)
- Le frontend envoie correctement la requête à `http://localhost:3001/api/hospitals/2/change-password`
- Les logs du serveur ne montrent pas la route dans la liste des routes exposées

### Analyse
1. **Configuration du serveur**
   - Le fichier principal est `backend/src/index.js`
   - Le port est correctement configuré (PORT=3001 dans .env)
   - Les routes hospitalières sont montées avec `app.use('/api/hospitals', hospitalRoutes)`

2. **Routes définies**
   - La route est correctement définie dans `hospitalRoutes.js`
   - Le contrôleur `changeHospitalPassword` existe dans `hospitalController.js`

### Solution
1. **Arrêter tous les serveurs Node en cours**
   ```sh
   taskkill /F /IM node.exe
   ```

2. **Lancer le serveur avec le bon fichier**
   ```sh
   cd backend
   node src/index.js
   ```

3. **Vérifier les logs**
   - Le serveur doit afficher "Server is running on port 3001"
   - Les routes `/api/hospitals` doivent être listées

### Points importants à retenir
- Toujours lancer le serveur depuis le dossier `backend`
- Utiliser `node src/index.js` et non `node index.js`
- Vérifier qu'aucun autre serveur Node ne tourne sur le port 3001
- Les routes dynamiques (avec paramètres comme `:id`) ne sont pas affichées dans les logs mais sont bien actives

### Configuration requise
- Port backend : 3001
- URL frontend : http://localhost:3001
- Fichier principal : backend/src/index.js