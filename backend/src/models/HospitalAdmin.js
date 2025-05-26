const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class HospitalAdmin extends Model {}
  
  HospitalAdmin.init({
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hospitals',
        key: 'id'
      }
    },
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'admin'
    }
  }, {
    sequelize,
    modelName: 'HospitalAdmin',
    tableName: 'hospital_admins',
    timestamps: true
  });

  return HospitalAdmin;
}; 