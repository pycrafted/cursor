const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion pour:', email);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    console.log('Utilisateur trouvé:', user.email);

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Mot de passe valide:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

const register = async (req, res) => {
  try {
    console.log('--- Début de la fonction register ---');
    console.log('Requête reçue pour inscription:', req.body);
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      console.log('Champs manquants:', { email, password, firstName, lastName, role });
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const existingUser = await User.findOne({ where: { email } });
    console.log('Recherche d\'un utilisateur existant:', existingUser);
    if (existingUser) {
      console.log('Cet email est déjà utilisé:', email);
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Le mot de passe sera hashé automatiquement par le hook beforeCreate
    console.log('Création de l\'utilisateur...');
    const user = await User.create({
      email,
      password, // On passe le mot de passe en clair, le hook s'en occupera
      firstName,
      lastName,
      role
    });
    console.log('Utilisateur créé:', user.toJSON());

    const token = generateToken(user);
    console.log('Token généré:', token);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
    console.log('--- Fin de la fonction register ---');
  } catch (error) {
    console.error('Erreur complète lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
  }
};

module.exports = {
  login,
  register
}; 