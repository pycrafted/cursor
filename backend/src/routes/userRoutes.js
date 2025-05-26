const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  validatePatient
} = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Lister tous les utilisateurs (optionnel: ?role=patient)
router.get('/', verifyToken, checkRole(['admin', 'manager']), getAllUsers);

// Modifier un utilisateur
router.put('/:id', verifyToken, checkRole(['admin', 'manager']), updateUser);

// Supprimer un utilisateur
router.delete('/:id', verifyToken, checkRole(['admin', 'manager']), deleteUser);

// Valider un compte patient
router.post('/:id/validate', verifyToken, checkRole(['admin', 'manager', 'secretary']), validatePatient);

module.exports = router; 