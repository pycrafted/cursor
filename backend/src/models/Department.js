const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  console.log('Définition du modèle Department...');
  
  class Department extends Model {}
  
  console.log('Initialisation des attributs du modèle Department...');
  Department.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hospitalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hospitals',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Department',
    tableName: 'departments',
    timestamps: true
  });

  console.log('Modèle Department initialisé avec succès');
  return Department;
}; 