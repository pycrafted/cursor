require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
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

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Medical System API' });
});

// API Routes
console.log('Registering API routes...');
app.use('/api/hospitals', (req, res, next) => {
  console.log(`[ROUTE] Hospital route accessed: ${req.method} ${req.url}`);
  next();
}, hospitalRoutes);
console.log('✓ Hospital routes registered');
app.use('/api/hospital-admins', (req, res, next) => {
  console.log(`[ROUTE] Admin route accessed: ${req.method} ${req.url}`);
  next();
}, hospitalAdminRoutes);
console.log('✓ Hospital Admin routes registered');
app.use('/api/auth', (req, res, next) => {
  console.log(`[ROUTE] Auth route accessed: ${req.method} ${req.url}`);
  next();
}, authRoutes);
console.log('✓ Auth routes registered');
app.use('/api/users', (req, res, next) => {
  console.log(`[ROUTE] User route accessed: ${req.method} ${req.url}`);
  next();
}, userRoutes);
console.log('✓ User routes registered');

// Middleware pour logger les erreurs
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  next(err);
});

// Middleware pour logger les réponses
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`[RESPONSE] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    console.log('Response data:', data);
    return oldSend.apply(res, arguments);
  };
  next();
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
      console.log('\n=== Server Configuration ===');
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n=== Available Routes ===');
      console.log('Hospital Routes:');
      console.log('- GET    /api/hospitals');
      console.log('- POST   /api/hospitals');
      console.log('- GET    /api/hospitals/:id');
      console.log('- PUT    /api/hospitals/:id');
      console.log('- DELETE /api/hospitals/:id');
      console.log('- POST   /api/hospitals/:id/change-password');
      console.log('\n=== Server Started ===');
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer(); 