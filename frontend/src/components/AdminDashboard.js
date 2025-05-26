import React, { useState } from 'react';
import './AdminDashboard.css';

// Données fictives des utilisateurs existants
const existingUsers = {
  medecins: [
    {
      id: 1,
      nom: 'Dr. Sophie Martin',
      email: 'sophie.martin@hopital.fr',
      specialite: 'Cardiologie',
      statut: 'Actif',
      dateCreation: '2023-01-15'
    },
    {
      id: 2,
      nom: 'Dr. Pierre Dubois',
      email: 'pierre.dubois@hopital.fr',
      specialite: 'Neurologie',
      statut: 'Actif',
      dateCreation: '2023-02-20'
    }
  ],
  secretaires: [
    {
      id: 1,
      nom: 'Marie Laurent',
      email: 'marie.laurent@hopital.fr',
      hopital: 'Hôpital Central de Paris',
      statut: 'Actif',
      dateCreation: '2023-01-10'
    },
    {
      id: 2,
      nom: 'Thomas Bernard',
      email: 'thomas.bernard@hopital.fr',
      hopital: 'Clinique Saint-Joseph',
      statut: 'Actif',
      dateCreation: '2023-02-15'
    }
  ]
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('medecins');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    type: 'medecin',
    nom: '',
    email: '',
    specialite: '',
    departement: '',
    motDePasse: '',
    confirmerMotDePasse: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous ajouteriez la logique pour créer le compte
    console.log('Nouveau compte à créer:', newUser);
    setShowCreateForm(false);
    setNewUser({
      type: 'medecin',
      nom: '',
      email: '',
      specialite: '',
      departement: '',
      motDePasse: '',
      confirmerMotDePasse: ''
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Administration des Comptes</h1>
        <button 
          className="create-account-btn"
          onClick={() => setShowCreateForm(true)}
        >
          Créer un nouveau compte
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'medecins' ? 'active' : ''}`}
          onClick={() => setActiveTab('medecins')}
        >
          Médecins
        </button>
        <button 
          className={`tab-btn ${activeTab === 'secretaires' ? 'active' : ''}`}
          onClick={() => setActiveTab('secretaires')}
        >
          Secrétaires
        </button>
      </div>

      <div className="users-list">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>{activeTab === 'medecins' ? 'Spécialité' : 'Hôpital'}</th>
              <th>Statut</th>
              <th>Date de création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {existingUsers[activeTab].map(user => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{activeTab === 'medecins' ? user.specialite : user.hopital}</td>
                <td>
                  <span className={`status-badge ${user.statut.toLowerCase()}`}>
                    {user.statut}
                  </span>
                </td>
                <td>{user.dateCreation}</td>
                <td>
                  <div className="action-buttons-group">
                    <button className="action-btn edit">Modifier</button>
                    <button className="action-btn delete">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="create-account-modal">
            <h2>Créer un nouveau compte</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Type de compte</label>
                  <select 
                    name="type" 
                    value={newUser.type}
                    onChange={handleInputChange}
                  >
                    <option value="medecin">Médecin</option>
                    <option value="secretaire">Secrétaire</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    name="nom"
                    value={newUser.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {newUser.type === 'medecin' ? (
                  <div className="form-group">
                    <label>Spécialité</label>
                    <input
                      type="text"
                      name="specialite"
                      value={newUser.specialite}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Hôpital</label>
                    <input
                      type="text"
                      name="hopital"
                      value={newUser.hopital || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    name="motDePasse"
                    value={newUser.motDePasse}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    name="confirmerMotDePasse"
                    value={newUser.confirmerMotDePasse}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn">
                  Créer le compte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 