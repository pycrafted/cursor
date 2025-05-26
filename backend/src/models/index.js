const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');

console.log('Initialisation des modèles...');

// Fonction pour initialiser un modèle avec logging
const initModel = (modelName, modelPath) => {
  console.log(`Initialisation du modèle ${modelName}...`);
  try {
    const Model = require(modelPath);
    console.log(`Modèle ${modelName} chargé avec succès`);
    const initializedModel = Model(sequelize);
    console.log(`Modèle ${modelName} initialisé avec succès`);
    return initializedModel;
  } catch (error) {
    console.error(`Erreur lors de l'initialisation du modèle ${modelName}:`, error);
    throw error;
  }
};

console.log('Chargement des modèles...');
const User = initModel('User', './User');
const Hospital = initModel('Hospital', './Hospital');
const Department = initModel('Department', './Department');
const HospitalAdmin = initModel('HospitalAdmin', './HospitalAdmin');
const Doctor = initModel('Doctor', './Doctor');
const Secretary = initModel('Secretary', './Secretary');

console.log('Définition des associations...');

// Définir les associations de base
console.log('Association Hospital-Department...');
Hospital.hasMany(Department);
Department.belongsTo(Hospital);

// Définir les associations pour les administrateurs d'hôpital
console.log('Association Hospital-HospitalAdmin...');
Hospital.hasMany(HospitalAdmin, { 
  foreignKey: 'hospitalId',
  as: 'hospitalAdmins'
});
HospitalAdmin.belongsTo(Hospital, { 
  foreignKey: 'hospitalId',
  as: 'hospital'
});

// Définir les associations pour les médecins
console.log('Association Hospital-Doctor...');
Hospital.hasMany(Doctor, {
  foreignKey: 'hospitalId',
  as: 'doctors'
});
Doctor.belongsTo(Hospital, {
  foreignKey: 'hospitalId',
  as: 'hospital'
});

// Définir les associations pour les secrétaires
console.log('Association Hospital-Secretary...');
Hospital.hasMany(Secretary, {
  foreignKey: 'hospitalId',
  as: 'secretaries'
});
Secretary.belongsTo(Hospital, {
  foreignKey: 'hospitalId',
  as: 'hospital'
});

// Définir les associations pour les utilisateurs et les hôpitaux
console.log('Création de la table de jointure HospitalUser...');
const HospitalUser = sequelize.define('HospitalUser', {
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'secretary'),
    allowNull: false
  }
});

console.log('Association Hospital-User...');
Hospital.belongsToMany(User, { 
  through: HospitalUser,
  as: 'users',
  foreignKey: 'hospitalId',
  otherKey: 'userId'
});

User.belongsToMany(Hospital, {
  through: HospitalUser,
  as: 'hospitals',
  foreignKey: 'userId',
  otherKey: 'hospitalId'
});

console.log('Initialisation des modèles terminée avec succès');

module.exports = {
  sequelize,
  User,
  Hospital,
  Department,
  HospitalAdmin,
  Doctor,
  Secretary,
  HospitalUser
}; 