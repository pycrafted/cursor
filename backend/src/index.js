require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./database/config');
const hospitalRoutes = require('./routes/hospitalRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hospitalAdminRoutes = require('./routes/hospitalAdminRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Medical System API' });
});

// API Routes
console.log('Registering API routes...');
app.use('/api/hospitals', hospitalRoutes);
console.log('✓ Hospital routes registered');
app.use('/api/hospital-admins', hospitalAdminRoutes);
console.log('✓ Hospital Admin routes registered');
app.use('/api/auth', authRoutes);
console.log('✓ Auth routes registered');
app.use('/api/users', userRoutes);
console.log('✓ User routes registered');

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync database models
    console.log('Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('Database models synced successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Available routes:');
      console.log('- GET    /api/hospitals');
      console.log('- POST   /api/hospitals');
      console.log('- GET    /api/hospital-admins');
      console.log('- POST   /api/hospital-admins');
      console.log('- DELETE /api/hospital-admins/:id');
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer(); 