import React, { useState } from 'react';
import './PatientCreation.css';

// Données fictives de patients
const existingPatients = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    dateNaissance: '1980-05-12',
    sexe: 'Masculin',
    adresse: '12 rue de Paris, 75001 Paris',
    telephone: '01 23 45 67 89',
    email: 'jean.dupont@email.com',
    numeroDossier: 'PAT1001'
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Claire',
    dateNaissance: '1992-11-03',
    sexe: 'Féminin',
    adresse: '8 avenue Victor Hugo, 69006 Lyon',
    telephone: '04 78 12 34 56',
    email: 'claire.martin@email.com',
    numeroDossier: 'PAT1002'
  }
];

const PatientCreation = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [patients, setPatients] = useState(existingPatients);
  const [newPatient, setNewPatient] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    adresse: '',
    telephone: '',
    email: '',
    numeroDossier: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Générer un ID et un numéro de dossier fictif
    const id = patients.length + 1;
    const numeroDossier = `PAT10${id.toString().padStart(2, '0')}`;
    setPatients([
      ...patients,
      { ...newPatient, id, numeroDossier }
    ]);
    setShowCreateForm(false);
    setNewPatient({
      nom: '', prenom: '', dateNaissance: '', sexe: '', adresse: '', telephone: '', email: '', numeroDossier: ''
    });
  };

  return (
    <div className="patient-creation-dashboard">
      <div className="header">
        <h1>Création de Dossier Patient</h1>
        <button className="create-patient-btn" onClick={() => setShowCreateForm(true)}>
          Nouveau patient
        </button>
      </div>
      <div className="patients-list">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Date de naissance</th>
              <th>Sexe</th>
              <th>Téléphone</th>
              <th>Numéro dossier</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>{patient.nom}</td>
                <td>{patient.prenom}</td>
                <td>{patient.dateNaissance}</td>
                <td>
                  <span className={`sexe-badge ${patient.sexe.toLowerCase()}`}>{patient.sexe === 'Masculin' ? '♂' : patient.sexe === 'Féminin' ? '♀' : '⚧'} {patient.sexe}</span>
                </td>
                <td>{patient.telephone}</td>
                <td><span className="dossier-badge">{patient.numeroDossier}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="create-patient-modal">
            <h2>Nouveau patient</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" name="nom" value={newPatient.nom} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Prénom</label>
                  <input type="text" name="prenom" value={newPatient.prenom} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Date de naissance</label>
                  <input type="date" name="dateNaissance" value={newPatient.dateNaissance} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Sexe</label>
                  <select name="sexe" value={newPatient.sexe} onChange={handleInputChange} required>
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Adresse</label>
                  <input type="text" name="adresse" value={newPatient.adresse} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" name="telephone" value={newPatient.telephone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={newPatient.email} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>Annuler</button>
                <button type="submit" className="submit-btn">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientCreation; 