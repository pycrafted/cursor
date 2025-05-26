const { DataTypes } = require('sequelize');
const sequelize = require('../database/config');
const Hospital = require('./Hospital');

const HospitalAdmin = sequelize.define('HospitalAdmin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  hospitalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hospital,
      key: 'id'
    }
  }
});

HospitalAdmin.belongsTo(Hospital, { foreignKey: 'hospitalId' });
Hospital.hasMany(HospitalAdmin, { foreignKey: 'hospitalId' });

module.exports = HospitalAdmin; 