const express = require('express');
const router = express.Router();
const { login, register, loginHospital } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.post('/login-hospital', loginHospital);

module.exports = router; 