import React, { useState } from 'react';
import './SuperAdmin.css';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('hospitals');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');

  // Données fictives pour les hôpitaux
  const hospitals = [
    {
      id: 1,
      name: 'Hôpital Central',
      address: '123 Avenue de la Santé, Paris',
      phone: '01 23 45 67 89',
      email: 'contact@hopital-central.fr',
      adminCount: 3,
      status: 'active'
    },
    {
      id: 2,
      name: 'Clinique Saint-Joseph',
      address: '45 Rue des Médecins, Lyon',
      phone: '04 56 78 90 12',
      email: 'contact@clinique-saint-joseph.fr',
      adminCount: 2,
      status: 'active'
    }
  ];

  // Données fictives pour les administrateurs
  const admins = [
    {
      id: 1,
      name: 'Dr. Martin',
      email: 'martin@hopital-central.fr',
      hospital: 'Hôpital Central',
      role: 'Administrateur Principal',
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Dubois',
      email: 'dubois@clinique-saint-joseph.fr',
      hospital: 'Clinique Saint-Joseph',
      role: 'Administrateur Principal',
      status: 'active'
    }
  ];

  const handleAddClick = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  return (
    <div className="super-admin-container">
      <div className="super-admin-header">
        <h1>Super Administration</h1>
        <div className="header-actions">
          {activeTab === 'hospitals' ? (
            <button 
              className="add-button"
              onClick={() => handleAddClick('hospital')}
            >
              <i className="fas fa-plus"></i>
              Ajouter un hôpital
            </button>
          ) : (
            <button 
              className="add-button"
              onClick={() => handleAddClick('admin')}
            >
              <i className="fas fa-plus"></i>
              Ajouter un administrateur
            </button>
          )}
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'hospitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('hospitals')}
        >
          <i className="fas fa-hospital"></i>
          Hôpitaux
        </button>
        <button 
          className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          <i className="fas fa-user-shield"></i>
          Administrateurs
        </button>
      </div>

      {activeTab === 'hospitals' ? (
        <div className="hospitals-grid">
          {hospitals.map(hospital => (
            <div key={hospital.id} className="hospital-card">
              <div className="hospital-header">
                <h3>{hospital.name}</h3>
                <span className={`status-badge ${hospital.status}`}>
                  {hospital.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="hospital-info">
                <p><i className="fas fa-map-marker-alt"></i> {hospital.address}</p>
                <p><i className="fas fa-phone"></i> {hospital.phone}</p>
                <p><i className="fas fa-envelope"></i> {hospital.email}</p>
                <p><i className="fas fa-users"></i> {hospital.adminCount} administrateurs</p>
              </div>
              <div className="hospital-actions">
                <button className="action-button edit">
                  <i className="fas fa-edit"></i>
                  Modifier
                </button>
                <button className="action-button delete">
                  <i className="fas fa-trash"></i>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admins-grid">
          {admins.map(admin => (
            <div key={admin.id} className="admin-card">
              <div className="admin-header">
                <h3>{admin.name}</h3>
                <span className={`status-badge ${admin.status}`}>
                  {admin.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="admin-info">
                <p><i className="fas fa-envelope"></i> {admin.email}</p>
                <p><i className="fas fa-hospital"></i> {admin.hospital}</p>
                <p><i className="fas fa-user-tag"></i> {admin.role}</p>
              </div>
              <div className="admin-actions">
                <button className="action-button edit">
                  <i className="fas fa-edit"></i>
                  Modifier
                </button>
                <button className="action-button delete">
                  <i className="fas fa-trash"></i>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {modalType === 'hospital' ? 'Ajouter un hôpital' : 'Ajouter un administrateur'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {modalType === 'hospital' ? (
                <form className="add-form">
                  <div className="form-group">
                    <label>Nom de l'hôpital</label>
                    <input type="text" placeholder="Entrez le nom de l'hôpital" />
                  </div>
                  <div className="form-group">
                    <label>Adresse</label>
                    <input type="text" placeholder="Entrez l'adresse" />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input type="tel" placeholder="Entrez le numéro de téléphone" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Entrez l'adresse email" />
                  </div>
                </form>
              ) : (
                <form className="add-form">
                  <div className="form-group">
                    <label>Nom de l'administrateur</label>
                    <input type="text" placeholder="Entrez le nom de l'administrateur" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Entrez l'adresse email" />
                  </div>
                  <div className="form-group">
                    <label>Hôpital</label>
                    <select>
                      <option value="">Sélectionnez un hôpital</option>
                      {hospitals.map(hospital => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Rôle</label>
                    <select>
                      <option value="admin">Administrateur Principal</option>
                      <option value="subadmin">Administrateur Secondaire</option>
                    </select>
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowAddModal(false)}
              >
                Annuler
              </button>
              <button className="submit-button">
                {modalType === 'hospital' ? 'Ajouter l\'hôpital' : 'Ajouter l\'administrateur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin; 