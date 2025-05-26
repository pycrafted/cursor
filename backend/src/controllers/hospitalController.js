const { Hospital } = require('../models');
const bcrypt = require('bcryptjs');

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.findAll({
      where: { isActive: true }
    });
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des hôpitaux', error: error.message });
  }
};

// Create a new hospital
exports.createHospital = async (req, res) => {
  try {
    console.log('--- Début de la création d\'un hôpital ---');
    const { name, address, phone, email } = req.body;
    console.log('Données reçues :', { name, address, phone, email });

    // Vérifier si l'email existe déjà
    const existing = await Hospital.findOne({ where: { email } });
    if (existing) {
      console.log('Email déjà utilisé pour un hôpital :', email);
      return res.status(400).json({ message: 'Cet email est déjà utilisé pour un hôpital' });
    }

    // Générer le mot de passe par défaut hashé
    const defaultPassword = 'mediconnect';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    console.log('Mot de passe par défaut hashé généré');

    const hospital = await Hospital.create({
      name,
      address,
      phone,
      email,
      password: hashedPassword,
      mustChangePassword: true
    });
    console.log('Hôpital créé :', hospital.toJSON());
    res.status(201).json(hospital);
    console.log('--- Fin de la création d\'un hôpital ---');
  } catch (error) {
    console.error('Erreur lors de la création de l\'hôpital :', error);
    res.status(400).json({ message: 'Erreur lors de la création de l\'hôpital', error: error.message });
  }
};

// Get hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findByPk(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: 'Hôpital non trouvé' });
    }
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'hôpital', error: error.message });
  }
};

// Update hospital
exports.updateHospital = async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    const hospital = await Hospital.findByPk(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hôpital non trouvé' });
    }

    await hospital.update({
      name,
      address,
      phone,
      email
    });

    res.json(hospital);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'hôpital', error: error.message });
  }
};

// Delete hospital (soft delete)
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByPk(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hôpital non trouvé' });
    }

    await hospital.update({ isActive: false });
    res.json({ message: 'Hôpital supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'hôpital', error: error.message });
  }
};

// Changer le mot de passe d'un hôpital
exports.changeHospitalPassword = async (req, res) => {
  try {
    console.log('--- Début du changement de mot de passe HÔPITAL ---');
    const hospitalId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    console.log('ID hôpital:', hospitalId);
    const hospital = await Hospital.findByPk(hospitalId);
    if (!hospital) {
      console.log('Hôpital non trouvé');
      return res.status(404).json({ message: 'Hôpital non trouvé' });
    }
    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, hospital.password);
    console.log('Ancien mot de passe valide:', isValid);
    if (!isValid) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }
    // Hasher le nouveau mot de passe
    const hashed = await bcrypt.hash(newPassword, 10);
    await hospital.update({ password: hashed, mustChangePassword: false });
    console.log('Mot de passe changé avec succès pour l\'hôpital', hospital.email);
    res.json({ message: 'Mot de passe changé avec succès' });
    console.log('--- Fin du changement de mot de passe HÔPITAL ---');
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe HÔPITAL:', error);
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe', error: error.message });
  }
}; 