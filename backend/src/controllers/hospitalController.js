const { Hospital } = require('../models');

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
    const { name, address, phone, email } = req.body;
    const hospital = await Hospital.create({
      name,
      address,
      phone,
      email
    });
    res.status(201).json(hospital);
  } catch (error) {
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