Je veux améliorer mon application DICOM existante, construite avec un backend Node.js/Express et un frontend React, qui utilise Orthanc comme PACS et OHIF Viewer pour visualiser les fichiers DICOM. L'application a une structure avec backend/index.js pour les routes (/api/dicom/studies, /api/dicom/upload), et frontend/src/components avec DicomList.js, DicomUpload.js, et DicomViewer.js. Ajoutez les fonctionnalités simples suivantes, en respectant les bonnes pratiques, une interface moderne, et en restant minimaliste (pas d'authentification, pas de .env, URL Orthanc http://localhost:8042 avec utilisateur orthanc/mot de passe orthanc codés en dur). Voici les exigences :

1. **Recherche et filtrage des études** :
   - Dans DicomList.js, ajoutez une barre de recherche pour filtrer les études par StudyInstanceUID ou StudyDescription (insensible à la casse).
   - Modifiez la route backend /api/dicom/studies pour accepter un paramètre de requête ?search=term et filtrer les études en fonction du terme.
   - Affichez un message "Aucune étude trouvée" si le filtre ne retourne aucun résultat.
   - Stylez la barre de recherche avec CSS moderne (ex. : bordure, padding, focus visible).

2. **Téléchargement d'études** :
   - Ajoutez une route backend GET /api/dicom/download/:studyId qui récupère la première instance d'une étude depuis Orthanc (/studies/:studyId/instances, puis /instances/:id/file) et la renvoie comme fichier DICOM avec Content-Type: application/dicom et Content-Disposition: attachment.
   - Dans DicomList.js, ajoutez un bouton "Télécharger" à côté de chaque étude, déclenchant le téléchargement via un lien vers la nouvelle route.
   - Affichez une erreur claire si le téléchargement échoue (ex. : toast ou message).

3. **Suppression d'études** :
   - Ajoutez une route backend DELETE /api/dicom/studies/:studyId qui supprime une étude via Orthanc (/studies/:studyId).
   - Dans DicomList.js, ajoutez un bouton "Supprimer" pour chaque étude, avec une confirmation (ex. : window.confirm) avant la suppression.
   - Rafraîchissez automatiquement la liste des études après une suppression réussie.
   - Affichez une erreur si la suppression échoue.

4. **Tri des études** :
   - Dans DicomList.js, ajoutez un menu déroulant (select) pour trier les études par date (StudyDate dans mainDicomTags, plus récent au plus ancien) ou StudyInstanceUID (ordre alphabétique).
   - Passez le critère de tri à la route /api/dicom/studies via un paramètre de requête ?sort=date ou ?sort=uid.
   - Modifiez la route backend pour trier les études en conséquence avant de renvoyer la réponse.
   - Assurez-vous que le tri persiste lors du rafraîchissement de la liste.

**Instructions supplémentaires** :
- Utilisez axios pour les requêtes HTTP et multer pour les fichiers dans le backend.
- Gardez les styles CSS dans les fichiers existants (DicomList.css, etc.), avec flexbox pour la mise en page et media queries pour le responsive (ex. : barre de recherche pleine largeur sur mobile).
- Ajoutez des commentaires clairs dans le code pour expliquer la logique.
- Gérez les erreurs dans le frontend (ex. : Orthanc inaccessible) et le backend (ex. : échec de téléchargement/suppression) avec des messages utilisateur clairs.
- Mettez à jour le README.md pour documenter les nouvelles fonctionnalités et leurs dépendances.
- Ne modifiez pas la structure des fichiers existants sauf si nécessaire (ex. : ajout de nouvelles routes dans backend/index.js).
- Testez que tout fonctionne avec Orthanc sur http://localhost:8042 et OHIF Viewer sur http://localhost:8042/ohif/viewer.

**Attentes** :
- Code modulaire, réutilisable, avec des hooks React (useState, useEffect).
- Interface propre, responsive, avec des indicateurs de chargement et des messages d'erreur/succès.
- Respectez les contraintes de l'application de test (pas d'authentification, minimaliste).
- Fournissez le code complet pour les fichiers modifiés (backend/index.js, DicomList.js, DicomList.css, README.md, etc.).