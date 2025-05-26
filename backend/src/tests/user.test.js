const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testUserManagement() {
  try {
    // Création d'un patient
    const uniqueEmail = `patient${Date.now()}@example.com`;
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: uniqueEmail,
      password: 'password123',
      firstName: 'Test',
      lastName: 'Patient',
      role: 'patient'
    });
    const patient = registerRes.data.user;
    console.log('Patient créé:', patient);

    // Connexion pour obtenir un token
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: uniqueEmail,
      password: 'password123'
    });
    const token = loginRes.data.token;
    const headers = { Authorization: `Bearer ${token}` };

    // Listing des patients
    const listRes = await axios.get(`${API_URL}/users?role=patient`, { headers });
    console.log('Liste des patients:', listRes.data.map(u => u.email));

    // Modification du patient
    const updateRes = await axios.put(`${API_URL}/users/${patient.id}`, {
      firstName: 'PatientModifié',
      lastName: 'TestModifié'
    }, { headers });
    console.log('Patient modifié:', updateRes.data);

    // Validation du patient
    const validateRes = await axios.post(`${API_URL}/users/${patient.id}/validate`, {}, { headers });
    console.log('Validation du patient:', validateRes.data);

    // Suppression du patient
    const deleteRes = await axios.delete(`${API_URL}/users/${patient.id}`, { headers });
    console.log('Suppression du patient:', deleteRes.data);

  } catch (error) {
    if (error.response) {
      console.error('Erreur API:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('Erreur:', error.message);
      console.error(error);
    }
  }
}

testUserManagement(); 