const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

// Get all hospitals
router.get('/', hospitalController.getAllHospitals);

// Create a new hospital
router.post('/', hospitalController.createHospital);

// Get hospital by ID
router.get('/:id', hospitalController.getHospitalById);

// Update hospital
router.put('/:id', hospitalController.updateHospital);

// Delete hospital
router.delete('/:id', hospitalController.deleteHospital);

// Changer le mot de passe d'un hôpital
router.put('/:id/change-password', hospitalController.changeHospitalPassword);

module.exports = router; 