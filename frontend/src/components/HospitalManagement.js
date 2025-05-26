import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HospitalManagement.css';

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/hospitals');
      setHospitals(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des hôpitaux');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/hospitals', formData);
      setSuccess('Hôpital créé avec succès');
      setFormData({ name: '', address: '', phone: '', email: '' });
      fetchHospitals();
    } catch (err) {
      setError('Erreur lors de la création de l\'hôpital');
    }
  };

  return (
    <div className="hospital-management">
      <h2>Gestion des Hôpitaux</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="hospital-form">
        <div className="form-group">
          <label htmlFor="name">Nom de l'hôpital</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Adresse</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Créer l'hôpital
        </button>
      </form>

      <div className="hospitals-list">
        <h3>Liste des Hôpitaux</h3>
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td>{hospital.name}</td>
                <td>{hospital.address}</td>
                <td>{hospital.phone}</td>
                <td>{hospital.email}</td>
                <td>
                  <button className="edit-button">Modifier</button>
                  <button className="delete-button">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HospitalManagement; 