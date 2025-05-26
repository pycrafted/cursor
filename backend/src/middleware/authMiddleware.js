const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le rôle de l'utilisateur
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
}; 