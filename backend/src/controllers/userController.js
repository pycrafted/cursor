const { User } = require('../models');

// Lister tous les utilisateurs, avec filtrage optionnel par rôle
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = role ? { role } : {};
    const users = await User.findAll({ where });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

// Modifier un utilisateur
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, role, isActive } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    user.email = email ?? user.email;
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.role = role ?? user.role;
    user.isActive = isActive ?? user.isActive;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'utilisateur' });
  }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    await user.destroy();
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

// Valider un compte patient (isActive = true)
const validatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user || user.role !== 'patient') return res.status(404).json({ message: 'Patient non trouvé' });
    user.isActive = true;
    await user.save();
    res.json({ message: 'Compte patient validé', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation du patient' });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  validatePatient
}; 