import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeleconsultationFictive.css';

const TeleconsultationFictive = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showOrdonnanceModal, setShowOrdonnanceModal] = useState(false);
  const [consultation, setConsultation] = useState({
    diagnostic: '',
    ordonnance: '',
    motif: '',
    symptomes: '',
    observations: '',
    recommandations: ''
  });

  const [ordonnance, setOrdonnance] = useState({
    nom: '',
    dosage: '',
    frequence: '',
    duree: '',
    dateDebut: new Date().toISOString().split('T')[0],
    prescripteur: '',
    instructions: '',
    effetsSecondaires: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsultation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrdonnanceChange = (e) => {
    const { name, value } = e.target;
    setOrdonnance(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrdonnanceSubmit = () => {
    const ordonnanceText = `
Médicament: ${ordonnance.nom}
Dosage: ${ordonnance.dosage}
Fréquence: ${ordonnance.frequence}
Durée: ${ordonnance.duree}
Date de début: ${ordonnance.dateDebut}
Prescripteur: ${ordonnance.prescripteur}
Instructions: ${ordonnance.instructions}
Effets secondaires: ${ordonnance.effetsSecondaires}
-------------------`;

    setConsultation(prev => ({
      ...prev,
      ordonnance: prev.ordonnance + ordonnanceText
    }));

    setOrdonnance({
      nom: '',
      dosage: '',
      frequence: '',
      duree: '',
      dateDebut: new Date().toISOString().split('T')[0],
      prescripteur: '',
      instructions: '',
      effetsSecondaires: ''
    });

    setShowOrdonnanceModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/teleconsultations', {
        ...consultation,
        date: new Date().toISOString().split('T')[0]
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
          <div className="date-display">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
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
            <button 
              type="button" 
              className="more-button"
              onClick={() => setShowOrdonnanceModal(true)}
            >
              <i className="fas fa-plus"></i> Ajouter un médicament
            </button>
            <textarea
              name="ordonnance"
              value={consultation.ordonnance}
              onChange={handleChange}
              required
              placeholder="Entrez l'ordonnance..."
              readOnly
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
          <div className="modal-content info-modal">
            <div className="modal-header">
              <h3>Informations supplémentaires</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
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
                type="button" 
                className="submit-button"
                onClick={() => setShowModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour l'ajout d'une ordonnance */}
      {showOrdonnanceModal && (
        <div className="modal-overlay">
          <div className="modal-content ordonnance-modal">
            <div className="modal-header">
              <h3>Ajouter un médicament</h3>
              <button className="close-button" onClick={() => setShowOrdonnanceModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
          <div className="form-group">
            <label>Nom du médicament</label>
            <input
              type="text"
              name="nom"
              value={ordonnance.nom}
              onChange={handleOrdonnanceChange}
              placeholder="Entrez le nom du médicament..."
              required
            />
          </div>
          <div className="form-group">
            <label>Dosage</label>
            <input
              type="text"
              name="dosage"
              value={ordonnance.dosage}
              onChange={handleOrdonnanceChange}
              placeholder="Ex: 1000mg"
              required
            />
          </div>
              </div>
              <div className="form-row">
          <div className="form-group">
            <label>Fréquence</label>
            <input
              type="text"
              name="frequence"
              value={ordonnance.frequence}
              onChange={handleOrdonnanceChange}
              placeholder="Ex: 2 fois par jour"
              required
            />
          </div>
          <div className="form-group">
            <label>Durée</label>
            <input
              type="text"
              name="duree"
              value={ordonnance.duree}
              onChange={handleOrdonnanceChange}
              placeholder="Ex: 6 mois"
              required
            />
          </div>
              </div>
              <div className="form-row">
          <div className="form-group">
            <label>Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={ordonnance.dateDebut}
              onChange={handleOrdonnanceChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Prescripteur</label>
            <input
              type="text"
              name="prescripteur"
              value={ordonnance.prescripteur}
              onChange={handleOrdonnanceChange}
                    placeholder="Nom du prescripteur"
              required
            />
                </div>
          </div>
          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={ordonnance.instructions}
              onChange={handleOrdonnanceChange}
                  placeholder="Instructions spécifiques..."
              required
            />
          </div>
          <div className="form-group">
            <label>Effets secondaires</label>
            <textarea
              name="effetsSecondaires"
              value={ordonnance.effetsSecondaires}
              onChange={handleOrdonnanceChange}
                  placeholder="Effets secondaires connus..."
            />
          </div>
            </div>
            <div className="modal-footer">
            <button 
              type="button" 
              className="submit-button"
              onClick={handleOrdonnanceSubmit}
            >
              Ajouter le médicament
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default TeleconsultationFictive; 