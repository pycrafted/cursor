const HospitalAdmin = require('../models/HospitalAdmin');
const bcrypt = require('bcryptjs');

// Récupérer tous les administrateurs
exports.getAllAdmins = async (req, res) => {
  console.log('Getting all hospital admins...');
  try {
    const admins = await HospitalAdmin.findAll({
      where: { isActive: true },
      attributes: { exclude: ['password'] }
    });
    console.log(`Found ${admins.length} active admins`);
    res.json(admins);
  } catch (error) {
    console.error('Error in getAllAdmins:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des administrateurs' });
  }
};

// Créer un nouvel administrateur
exports.createAdmin = async (req, res) => {
  console.log('Creating new hospital admin...', { body: req.body });
  try {
    const { email, password, hospitalId } = req.body;

    // Vérifier si l'email existe déjà
    console.log('Checking if email exists:', email);
    const existingAdmin = await HospitalAdmin.findOne({ where: { email } });
    if (existingAdmin) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'administrateur
    console.log('Creating admin with hospitalId:', hospitalId);
    const admin = await HospitalAdmin.create({
      email,
      password: hashedPassword,
      hospitalId
    });

    // Retourner l'administrateur sans le mot de passe
    const { password: _, ...adminWithoutPassword } = admin.toJSON();
    console.log('Admin created successfully:', adminWithoutPassword);
    res.status(201).json(adminWithoutPassword);
  } catch (error) {
    console.error('Error in createAdmin:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'administrateur' });
  }
};

// Supprimer un administrateur
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  console.log('Deleting admin with id:', id);
  try {
    const result = await HospitalAdmin.update(
      { isActive: false },
      { where: { id } }
    );
    console.log('Delete result:', result);
    res.json({ message: 'Administrateur supprimé avec succès' });
  } catch (error) {
    console.error('Error in deleteAdmin:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'administrateur' });
  }
}; 