const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testAuth() {
  try {
    // Générer un email unique
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    // Test d'inscription
    console.log('Test d\'inscription...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      email: uniqueEmail,
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'patient'
    });
    console.log('Inscription réussie:', registerResponse.data);

    // Test de connexion
    console.log('\nTest de connexion...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: uniqueEmail,
      password: 'password123'
    });
    console.log('Connexion réussie:', loginResponse.data);

  } catch (error) {
    if (error.response) {
      console.error('Erreur API:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else {
      console.error('Erreur:', error.message);
    }
  }
}

testAuth(); 