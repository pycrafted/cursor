Instructions pour Cursor : Application de test DICOM avec OHIF
Ce document fournit un prompt pour Cursor afin de générer une application React avec un backend Node.js permettant de téléverser des fichiers DICOM et de les afficher via le visualiseur OHIF. L'application est simple, sans authentification, restrictions, ou fichier .env, avec toutes les informations visibles pour un test.
Prompt pour Cursor
Je veux créer une application React avec un backend Node.js pour téléverser des fichiers DICOM et les afficher avec le visualiseur OHIF, sans authentification ni fonctionnalités supplémentaires. Voici les exigences :
1. Backend (Node.js avec Express)

Configurez un serveur Express avec axios (pour interagir avec Orthanc) et multer (pour gérer les téléversements).
Créez une route GET /api/dicom/studies qui récupère la liste des StudyInstanceUID depuis Orthanc à http://localhost:8042/studies, en utilisant l'authentification basique (utilisateur : orthanc, mot de passe : orthanc).
Créez une route POST /api/dicom/upload qui accepte des fichiers DICOM via multer, les envoie à Orthanc (http://localhost:8042/instances), et renvoie le StudyInstanceUID de la réponse.
Pas de base de données, d'authentification, ou de restrictions.

2. Frontend (React)

Créez un composant DicomViewer.js qui affiche OHIF via une <iframe> pointant vers http://localhost:8042/ohif/viewer?StudyInstanceUIDs={studyId}.
Ajoutez des états isLoading (pour un indicateur de chargement) et error (pour les erreurs), avec un spinner centré pendant le chargement.
Créez un composant DicomList.js qui récupère les études via /api/dicom/studies et affiche une liste avec un bouton "Visualiser" pour chaque StudyInstanceUID, déclenchant DicomViewer.
Créez un composant DicomUpload.js avec un formulaire pour téléverser des fichiers DICOM (.dcm ou application/dicom) vers /api/dicom/upload. Après un upload réussi, rafraîchissez la liste des études.
Intégrez ces composants dans App.js pour une interface simple avec une section pour l'upload et une section pour la liste des études.

3. Styles

Ajoutez des styles CSS dans src/styles/global.css pour une interface propre.
Dans DicomViewer.js, utilisez des styles locaux pour que l'iframe occupe 100% de la largeur et ait une hauteur de 600px, avec un spinner centré pendant le chargement.
Incluez des media queries pour les écrans mobiles (par exemple, hauteur de l'iframe à 400px sur petits écrans).
Stylez les boutons, formulaires, et messages d'erreur (fond rouge pour les erreurs, fond vert pour les succès).

4. Structure des fichiers

Backend :backend/
├── index.js
├── package.json
├── routes/dicom.js


Frontend :frontend/
├── src/
│   ├── components/
│   │   ├── DicomViewer.js
│   │   ├── DicomList.js
│   │   ├── DicomUpload.js
│   ├── styles/
│   │   ├── global.css
│   ├── App.js
│   ├── index.js
├── package.json



5. Instructions supplémentaires

Utilisez les bonnes pratiques React (hooks useState, useEffect, composants réutilisables).
Codez de manière modulaire avec des commentaires clairs.
Pas de fichier .env ; utilisez directement l'URL http://localhost:8042, utilisateur orthanc, et mot de passe orthanc dans le code.
Gérez les erreurs dans le frontend (par exemple, Orthanc inaccessible) et le backend (par exemple, échec de l'upload).
L'application est pour un test, donc restez minimaliste, sans gestion des patients ou rôles.

Attentes pour le code généré

Le backend doit gérer les requêtes vers Orthanc et le téléversement de fichiers.
Le frontend doit afficher une interface avec un formulaire d'upload, une liste d'études, et un visualiseur OHIF via iframe.
Les styles doivent être réactifs avec des indicateurs de chargement et des messages d'erreur clairs.
Les fichiers doivent respecter la structure indiquée et inclure des commentaires.

Générez le code complet pour les fichiers listés, en utilisant une iframe pour OHIF et des requêtes axios/multer pour Orthanc, de manière minimaliste pour un test.
