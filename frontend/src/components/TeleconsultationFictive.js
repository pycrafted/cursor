import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeleconsultationFictive.css';

const TeleconsultationFictive = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [consultation, setConsultation] = useState({
    date: new Date().toISOString().split('T')[0],
    diagnostic: '',
    ordonnance: '',
    // Champs supplémentaires
    motif: '',
    symptomes: '',
    observations: '',
    recommandations: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsultation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/teleconsultations', {
        ...consultation
      });
      navigate('/teleconsultations');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  return (
    <div className="teleconsultation-container">
      <div className="teleconsultation-form">
        <div className="form-header">
          <h2>Nouvelle Téléconsultation</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date de la consultation</label>
            <input
              type="date"
              name="date"
              value={consultation.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Diagnostic</label>
            <textarea
              name="diagnostic"
              value={consultation.diagnostic}
              onChange={handleChange}
              required
              placeholder="Entrez le diagnostic..."
            />
            <button 
              type="button" 
              className="more-button"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i> Plus d'informations
            </button>
          </div>

          <div className="form-group">
            <label>Ordonnance</label>
            <textarea
              name="ordonnance"
              value={consultation.ordonnance}
              onChange={handleChange}
              required
              placeholder="Entrez l'ordonnance..."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Enregistrer la téléconsultation
            </button>
          </div>
        </form>
      </div>

      {/* Modal pour les informations supplémentaires */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Informations supplémentaires</h3>
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Motif de la consultation</label>
                <textarea
                  name="motif"
                  value={consultation.motif}
                  onChange={handleChange}
                  placeholder="Entrez le motif de la consultation..."
                />
              </div>

              <div className="form-group">
                <label>Symptômes</label>
                <textarea
                  name="symptomes"
                  value={consultation.symptomes}
                  onChange={handleChange}
                  placeholder="Décrivez les symptômes..."
                />
              </div>

              <div className="form-group">
                <label>Observations</label>
                <textarea
                  name="observations"
                  value={consultation.observations}
                  onChange={handleChange}
                  placeholder="Ajoutez vos observations..."
                />
              </div>

              <div className="form-group">
                <label>Recommandations</label>
                <textarea
                  name="recommandations"
                  value={consultation.recommandations}
                  onChange={handleChange}
                  placeholder="Ajoutez vos recommandations..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="close-modal-button"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeleconsultationFictive; 