const express = require('express');
const router = express.Router();
const hospitalAdminController = require('../controllers/hospitalAdminController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/authMiddleware');

console.log('Initializing hospital admin routes...');

// Middleware de logging pour les routes d'administrateurs
router.use((req, res, next) => {
  console.log(`[Hospital Admin Route] ${req.method} ${req.path}`);
  next();
});

// Routes protégées par authentification et rôle super_admin ou hospital
router.use(authenticateToken, checkRole(['super_admin', 'hospital']));

// Récupérer tous les administrateurs
router.get('/', (req, res, next) => {
  console.log('GET / - Fetching all hospital admins');
  hospitalAdminController.getAllAdmins(req, res, next);
});

// Créer un nouvel administrateur (super_admin uniquement)
router.post('/', checkRole(['super_admin']), (req, res, next) => {
  console.log('POST / - Creating new hospital admin');
  hospitalAdminController.createAdmin(req, res, next);
});

// Supprimer un administrateur (super_admin uniquement)
router.delete('/:id', checkRole(['super_admin']), (req, res, next) => {
  console.log(`DELETE /${req.params.id} - Deleting hospital admin`);
  hospitalAdminController.deleteAdmin(req, res, next);
});

console.log('Hospital admin routes initialized');

module.exports = router; 