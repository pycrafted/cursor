const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes publiques
router.post('/', hospitalController.createHospital);

// Routes protégées
router.get('/', verifyToken, hospitalController.getAllHospitals);
router.get('/:id', verifyToken, hospitalController.getHospitalById);
router.put('/:id', verifyToken, hospitalController.updateHospital);
router.delete('/:id', verifyToken, hospitalController.deleteHospital);

// Route de changement de mot de passe
router.post('/:id/change-password', verifyToken, async (req, res, next) => {
  console.log('\n=== Changement de mot de passe ===');
  console.log('Méthode HTTP:', req.method);
  console.log('URL:', req.url);
  console.log('ID Hospital:', req.params.id);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  
  try {
    await hospitalController.changeHospitalPassword(req, res, next);
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    next(error);
  }
});

module.exports = router; 