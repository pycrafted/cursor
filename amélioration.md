Je veux ajouter une nouvelle page à mon application DICOM existante (React frontend, Node.js/Express backend, Orthanc comme PACS, OHIF Viewer pour les images DICOM). La nouvelle page affichera des informations médicales fictives codées en dur pour un patient, incluant une image, des informations médicales complètes, une section radiologie, et un lien vers la liste des images médicales. Voici les exigences :

1. **Nouvelle page React** :
   - Créez un nouveau composant `PatientInfo.js` dans `frontend/src/components/` pour une page accessible via une route `/patient/:id` (ex. : `/patient/123`).
   - Utilisez React Router pour ajouter la route dans `App.js` afin d’afficher cette page.
   - La page doit afficher des données fictives codées en dur (pas de requêtes backend) pour un patient, incluant :
     - **Image** : Une photo de profil fictive (ex. : un placeholder comme `https://via.placeholder.com/150` ou une image statique dans `public/`).
     - **Informations médicales complètes** : Nom, âge, sexe, date de naissance, numéro de dossier, allergies, antécédents médicaux, traitements en cours.
     - **Section radiologie** : Une liste de rapports radiologiques fictifs (ex. : date, type d’examen, résumé des findings).
     - **Lien vers la liste des images médicales** : Un bouton ou lien renvoyant à la page existante `/` (DicomList.js) pour voir les images DICOM associées.
   - Structurez la page avec des sections claires (ex. : en-tête pour le patient, tableaux pour les rapports radiologiques, carte pour les informations).

2. **Données fictives** :
   - Exemple de données codées en dur dans `PatientInfo.js` :
     - Nom : Jean Dupont
     - Âge : 45 ans
     - Sexe : Masculin
     - Date de naissance : 15/03/1978
     - Numéro de dossier : PAT123456
     - Allergies : Pénicilline
     - Antécédents : Hypertension, diabète type 2
     - Traitements : Metformine, Lisinopril
     - Rapports radiologiques :
       - 01/05/2025 : IRM cérébrale, "Aucune anomalie détectée"
       - 15/04/2025 : Scanner thoracique, "Nodule pulmonaire à surveiller"
   - Les données doivent être réalistes mais fictives, adaptées à un contexte médical.

3. **Styles** :
   - Créez un fichier `PatientInfo.css` pour styliser la page avec CSS moderne (flexbox, grid).
   - Assurez-vous que la page est responsive (ex. : image et sections réorganisées sur mobile).
   - Utilisez des styles cohérents avec le reste de l’application (ex. : mêmes couleurs, polices que DicomList.css).
   - Stylez l’image du patient comme une vignette ronde, les informations dans une carte, et les rapports radiologiques dans un tableau clair.
   - Ajoutez des media queries pour les petits écrans (ex. : tableau en liste sur mobile).

4. **Navigation** :
   - Ajoutez un bouton ou lien "Voir les images médicales" qui redirige vers la page principale (`/` où se trouve DicomList.js).
   - Incluez un lien ou bouton dans `DicomList.js` pour accéder à la page du patient (ex. : "Voir le dossier patient" menant à `/patient/123`).
   - Assurez-vous que la navigation est fluide avec React Router.

5. **Instructions supplémentaires** :
   - Gardez l’application minimaliste, sans authentification ni requêtes backend pour cette page (données codées en dur).
   - Utilisez les bonnes pratiques React (hooks useState, useEffect si nécessaire, composants réutilisables).
   - Ajoutez des commentaires clairs dans le code.
   - Ne modifiez pas la configuration existante (Orthanc sur http://localhost:8042, OHIF Viewer sur http://localhost:8042/ohif/viewer).
   - Mettez à jour le `README.md` pour documenter la nouvelle page et son accès (ex. : URL `/patient/123`).
   - Structure des fichiers à créer ou modifier :
     - `frontend/src/components/PatientInfo.js`
     - `frontend/src/components/PatientInfo.css`
     - `frontend/src/App.js` (pour la route)
     - `frontend/src/components/DicomList.js` (pour le lien vers la page patient)
     - `README.md` (pour la documentation)

**Attentes** :
   - Une page claire, moderne, et responsive avec des données fictives réalistes.
   - Intégration fluide avec la navigation existante.
   - Code modulaire, bien commenté, et cohérent avec le style de l’application.
   - Documentation mise à jour dans le README.