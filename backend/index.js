const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();

// Configuration de multer pour les fichiers DICOM
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/dicom' || file.originalname.endsWith('.dcm')) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Seuls les fichiers DICOM (.dcm) sont acceptés.'));
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
  try {
    const response = await axios.get(`${ORTHANC_URL}/studies/${studyId}`, ORTHANC_AUTH);
    const studyData = response.data;
    
    // Récupérer le StudyInstanceUID depuis les tags DICOM
    const studyInstanceUID = studyData.MainDicomTags.StudyInstanceUID;
    
    return {
      ...studyData,
      studyInstanceUID: studyInstanceUID
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de l'étude ${studyId}:`, error.message);
    return null;
  }
}

// Route pour récupérer la liste des études
app.get('/api/dicom/studies', async (req, res) => {
  try {
    console.log('Récupération des études depuis Orthanc...');
    const response = await axios.get(`${ORTHANC_URL}/studies`, ORTHANC_AUTH);
    const studyIds = response.data;
    
    // Récupérer les détails de chaque étude
    const studies = await Promise.all(
      studyIds.map(async (studyId) => {
        const details = await getStudyDetails(studyId);
        if (!details) return null;
        
        return {
          id: studyId,
          studyInstanceUID: details.studyInstanceUID,
          mainDicomTags: details.MainDicomTags || {},
          patientMainDicomTags: details.PatientMainDicomTags || {}
        };
      })
    );

    // Filtrer les études null
    const validStudies = studies.filter(study => study !== null);
    console.log(`${validStudies.length} études trouvées`);
    res.json(validStudies);
  } catch (error) {
    console.error('Erreur lors de la récupération des études:', error.message);
    if (error.response) {
      console.error('Réponse d\'erreur Orthanc:', error.response.data);
    }
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des études',
      details: error.message
    });
  }
});

// Route pour téléverser des fichiers DICOM
app.post('/api/dicom/upload', upload.single('dicom'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier DICOM fourni' });
  }

  try {
    console.log('Lecture du fichier DICOM:', req.file.path);
    const fileBuffer = fs.readFileSync(req.file.path);
    
    console.log('Envoi du fichier à Orthanc...');
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

    console.log('Réponse Orthanc:', response.data);

    // Nettoyage du fichier temporaire
    fs.unlinkSync(req.file.path);
    console.log('Fichier temporaire supprimé');

    // Récupérer les détails de l'étude parent
    const studyDetails = await getStudyDetails(response.data.ParentStudy);
    
    res.json({
      message: 'Upload réussi',
      studyInstanceUID: studyDetails.studyInstanceUID
    });
  } catch (error) {
    console.error('Erreur lors du téléversement:', error.message);
    if (error.response) {
      console.error('Réponse d\'erreur Orthanc:', error.response.data);
    }
    
    // Nettoyage en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Fichier temporaire supprimé après erreur');
    }

    res.status(500).json({ 
      error: 'Erreur lors du téléversement du fichier DICOM',
      details: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur le port ${PORT}`);
  console.log(`Orthanc configuré sur ${ORTHANC_URL}`);
}); 