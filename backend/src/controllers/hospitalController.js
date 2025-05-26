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
    const { name, address, phone, email, description, website } = req.body;
    console.log('Données reçues :', { name, address, phone, email, description, website });

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
      description,
      website,
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
    console.log('--- Début de la mise à jour de l\'hôpital ---');
    console.log('Données reçues:', req.body);

    const { name, address, phone, email, description, website } = req.body;
    const hospital = await Hospital.findByPk(req.params.id);
    
    if (!hospital) {
      console.log('Hôpital non trouvé');
      return res.status(404).json({ message: 'Hôpital non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre hôpital
    if (email !== hospital.email) {
      const existing = await Hospital.findOne({ where: { email } });
      if (existing) {
        console.log('Email déjà utilisé par un autre hôpital');
        return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre hôpital' });
      }
    }

    const updateData = {
      name,
      address,
      phone,
      email,
      description,
      website
    };

    console.log('Données de mise à jour:', updateData);
    await hospital.update(updateData);
    console.log('Hôpital mis à jour avec succès');
    res.json(hospital);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
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
    console.log('--- Début du changement de mot de passe ---');
    console.log('ID de l\'hôpital:', req.params.id);
    console.log('Données reçues:', req.body);

    const { currentPassword, newPassword } = req.body;
    const hospital = await Hospital.findByPk(req.params.id);

    console.log('Hôpital trouvé:', hospital ? 'Oui' : 'Non');

    if (!hospital) {
      console.log('Hôpital non trouvé avec l\'ID:', req.params.id);
      return res.status(404).json({ message: 'Hôpital non trouvé' });
    }

    console.log('Vérification du mot de passe actuel...');
    const isValid = await bcrypt.compare(currentPassword, hospital.password);
    console.log('Mot de passe actuel valide:', isValid);

    if (!isValid) {
      console.log('Mot de passe actuel incorrect');
      return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
    }

    console.log('Hachage du nouveau mot de passe...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    console.log('Mise à jour du mot de passe...');
    await hospital.update({
      password: hashedPassword,
      mustChangePassword: false
    });

    console.log('Mot de passe mis à jour avec succès');
    res.json({ message: 'Mot de passe modifié avec succès' });
    console.log('--- Fin du changement de mot de passe ---');
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ 
      message: 'Erreur lors du changement de mot de passe', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 