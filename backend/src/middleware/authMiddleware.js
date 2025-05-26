const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  console.log('\n=== Vérification du token ===');
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('Token manquant dans les headers');
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error.message);
    return res.status(403).json({ message: 'Token invalide' });
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