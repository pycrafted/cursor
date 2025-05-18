const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Fonction utilitaire pour les logs
function logInfo(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[INFO][${timestamp}] ${message}`);
  if (data) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
}

function logError(message, error) {
  const timestamp = new Date().toISOString();
  console.error(`[ERROR][${timestamp}] ${message}`);
  if (error.response) {
    console.error('Response Error:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    });
  } else if (error.request) {
    console.error('Request Error:', error.request);
  } else {
    console.error('Error Details:', error.message);
  }
  console.error('Stack:', error.stack);
}

const app = express();

// Configuration de multer pour les fichiers DICOM
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      logInfo(`Création du répertoire d'upload: ${uploadDir}`);
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    logInfo(`Nouveau fichier en cours d'upload: ${filename}`);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    logInfo(`Vérification du type de fichier: ${file.mimetype}, nom: ${file.originalname}`);
    if (file.mimetype === 'application/dicom' || file.originalname.endsWith('.dcm')) {
      cb(null, true);
    } else {
      const error = new Error('Format de fichier non supporté. Seuls les fichiers DICOM (.dcm) sont acceptés.');
      logError('Fichier rejeté', error);
      cb(error);
    }
  }
});

// Configuration de base
app.use(cors());
app.use(express.json());

// Configuration d'Orthanc
const ORTHANC_URL = 'http://localhost:8042';
const ORTHANC_AUTH = {
  auth: {
    username: 'orthanc',
    password: 'orthanc'
  }
};

// Fonction utilitaire pour obtenir les détails d'une étude
async function getStudyDetails(studyId) {
  logInfo(`Récupération des détails de l'étude: ${studyId}`);
  try {
    const response = await axios.get(`${ORTHANC_URL}/studies/${studyId}`, ORTHANC_AUTH);
    const studyData = response.data;
    
    const details = {
      ...studyData,
      studyInstanceUID: studyData.MainDicomTags.StudyInstanceUID,
      studyDate: studyData.MainDicomTags.StudyDate,
      studyDescription: studyData.MainDicomTags.StudyDescription || ''
    };
    
    logInfo(`Détails de l'étude récupérés avec succès`, details);
    return details;
  } catch (error) {
    logError(`Erreur lors de la récupération des détails de l'étude ${studyId}`, error);
    return null;
  }
}

// Fonction pour trier les études
function sortStudies(studies, sortBy = 'date') {
  return studies.sort((a, b) => {
    if (sortBy === 'date') {
      return b.studyDate.localeCompare(a.studyDate);
    }
    return a.studyInstanceUID.localeCompare(b.studyInstanceUID);
  });
}

// Fonction pour filtrer les études
function filterStudies(studies, searchTerm = '') {
  if (!searchTerm) return studies;
  
  const term = searchTerm.toLowerCase();
  return studies.filter(study => 
    study.studyInstanceUID.toLowerCase().includes(term) ||
    study.studyDescription.toLowerCase().includes(term)
  );
}

// Route pour récupérer la liste des études
app.get('/api/dicom/studies', async (req, res) => {
  const { search, sort } = req.query;
  logInfo('Requête de liste des études', { search, sort });
  
  try {
    logInfo('Connexion à Orthanc pour récupérer les études...');
    const response = await axios.get(`${ORTHANC_URL}/studies`, ORTHANC_AUTH);
    const studyIds = response.data;
    logInfo(`${studyIds.length} études trouvées dans Orthanc`);
    
    // Récupérer les détails de chaque étude
    let studies = await Promise.all(
      studyIds.map(async (studyId) => {
        const details = await getStudyDetails(studyId);
        if (!details) {
          logInfo(`Pas de détails trouvés pour l'étude ${studyId}`);
          return null;
        }
        return {
          id: studyId,
          studyInstanceUID: details.studyInstanceUID,
          studyDate: details.studyDate,
          studyDescription: details.studyDescription,
          mainDicomTags: details.MainDicomTags,
          patientMainDicomTags: details.PatientMainDicomTags
        };
      })
    );

    studies = studies.filter(study => study !== null);
    
    if (search) {
      logInfo(`Application du filtre de recherche: "${search}"`);
      studies = filterStudies(studies, search);
    }
    
    if (sort) {
      logInfo(`Application du tri: "${sort}"`);
      studies = sortStudies(studies, sort);
    }

    logInfo(`Envoi de ${studies.length} études au client`);
    res.json(studies);
  } catch (error) {
    logError('Erreur lors de la récupération des études', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des études',
      details: error.message
    });
  }
});

// Route pour télécharger une étude
app.get('/api/dicom/download/:studyId', async (req, res) => {
  const { studyId } = req.params;
  logInfo(`Demande de téléchargement de l'étude: ${studyId}`);
  
  try {
    logInfo(`Récupération des instances pour l'étude ${studyId}`);
    const instancesResponse = await axios.get(
      `${ORTHANC_URL}/studies/${studyId}/instances`,
      ORTHANC_AUTH
    );
    
    logInfo(`Réponse instances:`, instancesResponse.data);
    
    if (!instancesResponse.data.length) {
      logError(`Aucune instance trouvée pour l'étude ${studyId}`, new Error('No instances'));
      return res.status(404).json({ error: 'Aucune instance trouvée pour cette étude' });
    }
    
    // S'assurer que instanceId est une chaîne
    const instanceId = instancesResponse.data[0].ID || instancesResponse.data[0];
    logInfo(`Téléchargement de l'instance: ${instanceId}`);
    
    const fileResponse = await axios.get(
      `${ORTHANC_URL}/instances/${instanceId}/file`,
      {
        ...ORTHANC_AUTH,
        responseType: 'arraybuffer'
      }
    );
    
    logInfo(`Fichier DICOM récupéré, taille: ${fileResponse.data.length} bytes`);
    
    res.set('Content-Type', 'application/dicom');
    res.set('Content-Disposition', `attachment; filename=DICOM-${studyId}.dcm`);
    res.send(fileResponse.data);
    
    logInfo(`Téléchargement terminé pour l'étude ${studyId}`);
  } catch (error) {
    logError('Erreur lors du téléchargement', error);
    res.status(500).json({
      error: 'Erreur lors du téléchargement du fichier',
      details: error.message
    });
  }
});

// Route pour supprimer une étude
app.delete('/api/dicom/studies/:studyId', async (req, res) => {
  const { studyId } = req.params;
  logInfo(`Demande de suppression de l'étude: ${studyId}`);
  
  try {
    logInfo(`Envoi de la requête de suppression à Orthanc`);
    await axios.delete(
      `${ORTHANC_URL}/studies/${studyId}`,
      ORTHANC_AUTH
    );
    
    logInfo(`Étude ${studyId} supprimée avec succès`);
    res.json({ message: 'Étude supprimée avec succès' });
  } catch (error) {
    logError('Erreur lors de la suppression', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'étude',
      details: error.message
    });
  }
});

// Route pour téléverser des fichiers DICOM
app.post('/api/dicom/upload', upload.single('dicom'), async (req, res) => {
  if (!req.file) {
    logError('Upload sans fichier', new Error('Aucun fichier fourni'));
    return res.status(400).json({ error: 'Aucun fichier DICOM fourni' });
  }

  try {
    logInfo(`Lecture du fichier DICOM: ${req.file.path}`);
    const fileBuffer = fs.readFileSync(req.file.path);
    logInfo(`Taille du fichier: ${fileBuffer.length} bytes`);
    
    logInfo('Envoi du fichier à Orthanc...');
    const response = await axios.post(
      `${ORTHANC_URL}/instances`,
      fileBuffer,
      {
        ...ORTHANC_AUTH,
        headers: { 'Content-Type': 'application/dicom' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    logInfo('Réponse Orthanc reçue', response.data);

    // Nettoyage du fichier temporaire
    fs.unlinkSync(req.file.path);
    logInfo('Fichier temporaire supprimé');

    // Récupérer les détails de l'étude parent
    const studyDetails = await getStudyDetails(response.data.ParentStudy);
    
    logInfo('Upload terminé avec succès', {
      studyInstanceUID: studyDetails.studyInstanceUID
    });
    
    res.json({
      message: 'Upload réussi',
      studyInstanceUID: studyDetails.studyInstanceUID
    });
  } catch (error) {
    logError('Erreur lors du téléversement', error);
    
    // Nettoyage en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      logInfo('Fichier temporaire supprimé après erreur');
    }

    res.status(500).json({ 
      error: 'Erreur lors du téléversement du fichier DICOM',
      details: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  logInfo(`Serveur backend démarré sur le port ${PORT}`);
  logInfo(`Configuration Orthanc: ${ORTHANC_URL}`);
}); 