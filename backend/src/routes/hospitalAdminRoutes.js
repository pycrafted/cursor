const express = require('express');
const router = express.Router();
const hospitalAdminController = require('../controllers/hospitalAdminController');
const { authenticateToken, isSuperAdmin } = require('../middleware/auth');

console.log('Initializing hospital admin routes...');

// Middleware de logging pour les routes d'administrateurs
router.use((req, res, next) => {
  console.log(`[Hospital Admin Route] ${req.method} ${req.path}`);
  next();
});

// Routes protégées par authentification et rôle super admin
router.use(authenticateToken, isSuperAdmin);

// Récupérer tous les administrateurs
router.get('/', (req, res, next) => {
  console.log('GET / - Fetching all hospital admins');
  hospitalAdminController.getAllAdmins(req, res, next);
});

// Créer un nouvel administrateur
router.post('/', (req, res, next) => {
  console.log('POST / - Creating new hospital admin');
  hospitalAdminController.createAdmin(req, res, next);
});

// Supprimer un administrateur
router.delete('/:id', (req, res, next) => {
  console.log(`DELETE /${req.params.id} - Deleting hospital admin`);
  hospitalAdminController.deleteAdmin(req, res, next);
});

console.log('Hospital admin routes initialized');

module.exports = router; 