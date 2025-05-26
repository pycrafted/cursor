const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');

exports.authenticateToken = async (req, res, next) => {
  console.log('Authenticating token...');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', { userId: decoded.id, role: decoded.role });

    let entity;
    if (decoded.role === 'hospital') {
      // Vérifier dans la table Hospitals
      entity = await Hospital.findByPk(decoded.id);
      if (!entity) {
        console.log('Hospital not found');
        return res.status(401).json({ message: 'Hôpital non trouvé' });
      }
    } else {
      // Vérifier dans la table Users
      entity = await User.findByPk(decoded.id);
      if (!entity) {
        console.log('User not found');
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
    }

    req.user = { ...decoded, entity }; // Ajouter l'entité (User ou Hospital) à req.user
    console.log('Authentication successful');
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Token invalide' });
  }
};

exports.isSuperAdmin = (req, res, next) => {
  console.log('Checking super admin role...');
  if (req.user && req.user.role === 'super_admin') {
    console.log('Super admin role confirmed');
    next();
  } else {
    console.log('Super admin role denied');
    res.status(403).json({ message: 'Accès non autorisé' });
  }
};

module.exports = exports; 