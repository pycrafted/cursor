const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'medical_system',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import des modèles
const Hospital = require('../models/Hospital')(sequelize);
const Doctor = require('../models/Doctor')(sequelize);
const Secretary = require('../models/Secretary')(sequelize);

// Définition des associations
Hospital.hasMany(Doctor, { foreignKey: 'hospitalId' });
Doctor.belongsTo(Hospital, { foreignKey: 'hospitalId' });

Hospital.hasMany(Secretary, { foreignKey: 'hospitalId' });
Secretary.belongsTo(Hospital, { foreignKey: 'hospitalId' });

// Test de la connexion
sequelize.authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; 