const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
const User = require('./User');
const Hospital = require('./Hospital');
const Department = require('./Department');
const HospitalAdmin = require('./HospitalAdmin');

// Définir les associations de base
Hospital.hasMany(Department);
Department.belongsTo(Hospital);

// Définir les associations pour les administrateurs d'hôpital
Hospital.hasMany(HospitalAdmin, { 
  foreignKey: 'hospitalId',
  as: 'hospitalAdmins'
});
HospitalAdmin.belongsTo(Hospital, { 
  foreignKey: 'hospitalId',
  as: 'hospital'
});

// Définir les associations pour les utilisateurs et les hôpitaux
const HospitalUser = sequelize.define('HospitalUser', {
  role: {
    type: DataTypes.ENUM('admin', 'doctor', 'secretary'),
    allowNull: false
  }
});

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

// Exporter tous les modèles
module.exports = {
  sequelize,
  User,
  Hospital,
  Department,
  HospitalAdmin,
  HospitalUser
}; 