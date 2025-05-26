import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SuperAdmin.css';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('hospitals');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    hospitalId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'super_admin') {
        navigate('/');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchHospitals();
    fetchAdmins();
  }, []);

  // Effet pour gérer la disparition des messages de succès
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Effet pour gérer la disparition des messages d'erreur
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchHospitals = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:3001/api/hospitals', { headers });
      setHospitals(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des hôpitaux');
    }
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://localhost:3001/api/hospital-admins', { headers });
      setAdmins(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des administrateurs');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      if (modalType === 'edit') {
        await axios.put(`http://localhost:3001/api/hospitals/${formData.id}`, formData, { headers });
        setSuccess('Hôpital modifié avec succès');
      } else if (modalType === 'admin') {
        await axios.post('http://localhost:3001/api/hospital-admins', formData, { headers });
        setSuccess('Administrateur ajouté avec succès');
        fetchAdmins();
      } else if (modalType === 'editAdmin') {
        // On n'envoie le mot de passe que s'il a été modifié
        const updateData = { email: formData.email, hospitalId: formData.hospitalId };
        if (formData.password) updateData.password = formData.password;
        await axios.put(`http://localhost:3001/api/hospital-admins/${formData.id}`, updateData, { headers });
        setSuccess('Administrateur modifié avec succès');
        fetchAdmins();
      } else {
        await axios.post('http://localhost:3001/api/hospitals', formData, { headers });
        setSuccess('Hôpital créé avec succès');
        setFormData({ name: '', address: '', phone: '', email: '', hospitalId: '', password: '' });
      }
      setShowAddModal(false);
      fetchHospitals();
    } catch (err) {
      setError('Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:3001/api/hospitals/${id}`, { headers });
      setSuccess('Hôpital supprimé avec succès');
      fetchHospitals();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'hôpital');
    }
  };

  const handleDeleteAdmin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`http://localhost:3001/api/hospital-admins/${id}`, { headers });
      setSuccess('Administrateur supprimé avec succès');
      fetchAdmins();
    } catch (err) {
      setError('Erreur lors de la suppression de l\'administrateur');
    }
  };

  const handleAddClick = (type) => {
    setModalType(type);
    setShowAddModal(true);
  };

  const handleEditAdmin = (admin) => {
    setFormData({
      email: admin.email,
      password: '', // Laisser vide, à remplir si on veut changer le mot de passe
      hospitalId: admin.hospitalId,
      id: admin.id
    });
    setModalType('editAdmin');
    setShowAddModal(true);
  };

  const handleEditHospital = (hospital) => {
    setFormData({
      id: hospital.id,
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email
    });
    setModalType('edit');
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

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

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
                <span className={`status-badge ${hospital.isActive ? 'active' : 'inactive'}`}>
                  {hospital.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="hospital-info">
                <p><i className="fas fa-map-marker-alt"></i> {hospital.address}</p>
                <p><i className="fas fa-phone"></i> {hospital.phone}</p>
                <p><i className="fas fa-envelope"></i> {hospital.email}</p>
              </div>
              <div className="hospital-actions">
                <button className="action-button edit" onClick={() => handleEditHospital(hospital)}>
                  <i className="fas fa-edit"></i> Modifier
                </button>
                <button className="action-button delete" onClick={() => handleDelete(hospital.id)}>
                  <i className="fas fa-trash"></i> Supprimer
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
                <h3>{admin.email}</h3>
                <span className={`status-badge ${admin.isActive ? 'active' : 'inactive'}`}>
                  {admin.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div className="admin-info">
                <p>
                  <i className="fas fa-hospital"></i> 
                  {hospitals.find(h => h.id === admin.hospitalId)?.name || 'Hôpital non assigné'}
                </p>
              </div>
              <div className="admin-actions">
                <button className="action-button edit" onClick={() => handleEditAdmin(admin)}>
                  <i className="fas fa-edit"></i> Modifier
                </button>
                <button className="action-button delete" onClick={() => handleDeleteAdmin(admin.id)}>
                  <i className="fas fa-trash"></i> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target.className === 'modal-overlay') {
              setShowAddModal(false);
            }
          }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {modalType === 'hospital' ? 'Ajouter un hôpital' : modalType === 'editAdmin' ? 'Modifier un administrateur' : 'Ajouter un administrateur'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form className="add-form" onSubmit={handleSubmit}>
              {(modalType === 'hospital' || modalType === 'edit') ? (
                  <>
                  <div className="form-group">
                    <label>Nom de l'hôpital</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        placeholder="Entrez le nom de l'hôpital" 
                        required
                      />
                  </div>
                  <div className="form-group">
                    <label>Adresse</label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        placeholder="Entrez l'adresse" 
                        required
                      />
                  </div>
                  <div className="form-group">
                    <label>Téléphone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Entrez le numéro de téléphone" 
                        required
                      />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        placeholder="Entrez l'adresse email" 
                        required
                      />
                  </div>
                  </>
              ) : modalType === 'editAdmin' ? (
                  <>
                  <div className="form-group">
                    <label>Email de l'administrateur</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Entrez l'email de l'administrateur"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nouveau mot de passe (laisser vide pour ne pas changer)</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Entrez le nouveau mot de passe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Hôpital</label>
                    <select
                      name="hospitalId"
                      value={formData.hospitalId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionnez un hôpital</option>
                      {hospitals.map(hospital => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  </>
                ) : (
                  <>
                  <div className="form-group">
                      <label>Email de l'administrateur</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Entrez l'email de l'administrateur" 
                        required
                      />
                  </div>
                  <div className="form-group">
                      <label>Mot de passe</label>
                      <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Entrez le mot de passe" 
                        required
                      />
                  </div>
                  <div className="form-group">
                    <label>Hôpital</label>
                      <select 
                        name="hospitalId" 
                        value={formData.hospitalId} 
                        onChange={handleInputChange}
                        required
                      >
                      <option value="">Sélectionnez un hôpital</option>
                      {hospitals.map(hospital => (
                        <option key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  </>
                )}
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    {modalType === 'hospital' ? 'Créer' : modalType === 'editAdmin' ? 'Modifier' : 'Ajouter'}
                  </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin; 