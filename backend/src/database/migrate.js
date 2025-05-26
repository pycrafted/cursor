const { sequelize } = require('./config');
const models = require('../models');

async function migrate() {
  try {
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');

    // Create initial manager user
    const { User } = models;
    await User.create({
      email: 'manager@medical.com',
      password: 'manager123',
      role: 'manager',
      firstName: 'System',
      lastName: 'Manager'
    });
    console.log('Initial manager user created');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 