import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './PatientInfo.css';

// Données fictives du patient
const patientData = {
  id: '123',
  photo: process.env.PUBLIC_URL + '/images.jpeg',
  informationsPersonnelles: {
    nom: 'Jean Dupont',
    age: 45,
    sexe: 'Masculin',
    dateNaissance: '15/03/1978',
    numeroDossier: 'PAT123456',
    adresse: '123 rue de la Santé, 75001 Paris',
    telephone: '01 23 45 67 89',
    email: 'jean.dupont@email.com'
  },
  informationsMedicales: {
    groupeSanguin: 'A+',
    poids: '75 kg',
    taille: '175 cm',
    imc: '24.5',
    allergies: ['Pénicilline', 'Arachides'],
    antecedents: [
      {
        date: '1978',
        age: '0',
        type: 'Naissance',
        description: 'Naissance à terme, poids 3.5kg',
        details: 'Accouchement normal sans complications',
        lieu: 'Maternité Saint-Joseph, Paris'
      },
      {
        date: '1980',
        age: '2',
        type: 'Maladie infantile',
        description: 'Varicelle',
        details: 'Évolution normale, sans complications',
        lieu: 'Traitement à domicile'
      },
      {
        date: '1985',
        age: '7',
        type: 'Chirurgie',
        description: 'Amygdalectomie',
        details: 'Ablation des amygdales suite à des angines récurrentes',
        lieu: 'Clinique des Enfants, Lyon'
      },
      {
        date: '1995',
        age: '17',
        type: 'Fracture',
        description: 'Fracture du bras gauche',
        details: 'Suite à une chute en vélo, plâtre pendant 6 semaines',
        lieu: 'Hôpital Central, Paris'
      },
      {
        date: '2010',
        age: '32',
        type: 'Diagnostic',
        description: 'Diagnostic d\'hypertension',
        details: 'Découverte lors d\'un contrôle de routine, mise sous traitement',
        lieu: 'Cabinet Dr. Martin'
      },
      {
        date: '2015',
        age: '37',
        type: 'Diagnostic',
        description: 'Diabète type 2',
        details: 'Découvert suite à des analyses de routine, mise en place d\'un régime et traitement',
        lieu: 'Centre Médical de Diabétologie'
      },
      {
        date: '2020',
        age: '42',
        type: 'Chirurgie',
        description: 'Arthroscopie du genou droit',
        details: 'Suite à une déchirure méniscale, rééducation 3 mois',
        lieu: 'Clinique du Sport, Paris'
      },
      {
        date: '2023',
        age: '45',
        type: 'Hospitalisation',
        description: 'COVID-19',
        details: 'Hospitalisation 5 jours pour détresse respiratoire, rétablissement complet',
        lieu: 'Hôpital Saint-Antoine'
      }
    ],
    traitements: [
      {
        nom: 'Metformine',
        dosage: '1000mg',
        frequence: '2 fois par jour',
        duree: '6 mois',
        dateDebut: '01/01/2024',
        prescripteur: 'Dr. Martin',
        instructions: 'À prendre pendant les repas',
        effetsSecondaires: 'Possibles troubles digestifs'
      },
      {
        nom: 'Lisinopril',
        dosage: '10mg',
        frequence: '1 fois par jour',
        duree: 'Continue',
        dateDebut: '15/12/2023',
        prescripteur: 'Dr. Dubois',
        instructions: 'À prendre le matin',
        effetsSecondaires: 'Surveillance tension artérielle'
      },
      {
        nom: 'Aspirine',
        dosage: '75mg',
        frequence: '1 fois par jour',
        duree: 'Continue',
        dateDebut: '01/02/2024',
        prescripteur: 'Dr. Martin',
        instructions: 'À prendre pendant le repas du soir',
        effetsSecondaires: 'Risque de saignements'
      }
    ],
    vaccinations: [
      { nom: 'COVID-19', date: '01/01/2023' },
      { nom: 'Grippe', date: '15/10/2022' }
    ]
  },
  rapportsRadiologiques: [
    {
      date: '01/05/2025',
      type: 'IRM cérébrale',
      resultat: 'Aucune anomalie détectée',
      details: 'Examen de contrôle annuel. Images de bonne qualité. Pas de lésion visible.'
    },
    {
      date: '15/04/2025',
      type: 'Scanner thoracique',
      resultat: 'Nodule pulmonaire à surveiller',
      details: 'Nodule de 4mm dans le lobe supérieur droit. Contrôle recommandé dans 6 mois.'
    }
  ]
};

const PatientInfo = () => {
  const navigate = useNavigate();
  const [isVitalInfoModalOpen, setIsVitalInfoModalOpen] = useState(false);
  const [isTreatmentModalOpen, setIsTreatmentModalOpen] = useState(false);
  const [isAntecedentModalOpen, setIsAntecedentModalOpen] = useState(false);
  const [isAllergyVaccinationModalOpen, setIsAllergyVaccinationModalOpen] = useState(false);
  const [isRadiologyModalOpen, setIsRadiologyModalOpen] = useState(false);

  // Données radiologiques étendues pour le modal
  const extendedRadiologyData = [
    ...patientData.rapportsRadiologiques,
    {
      date: '01/03/2025',
      type: 'Échographie abdominale',
      resultat: 'Normal',
      details: 'Examen complet de l\'abdomen. Pas d\'anomalie détectée. Tous les organes sont de taille et d\'aspect normaux.'
    },
    {
      date: '15/02/2025',
      type: 'Radiographie thoracique',
      resultat: 'Normal',
      details: 'Clichés de face et de profil. Pas d\'anomalie pulmonaire. Silhouette cardiaque normale.'
    },
    {
      date: '01/01/2025',
      type: 'Scanner abdominal',
      resultat: 'Anomalie bénigne',
      details: 'Petit kyste hépatique de 2cm. Pas de signe de malignité. Suivi recommandé dans 6 mois.'
    },
    {
      date: '15/12/2024',
      type: 'IRM lombaire',
      resultat: 'Hernie discale',
      details: 'Hernie discale L4-L5 avec compression modérée de la racine nerveuse. Traitement conservateur recommandé.'
    },
    {
      date: '01/11/2024',
      type: 'Échographie cardiaque',
      resultat: 'Normal',
      details: 'Fonction cardiaque normale. Pas de valvulopathie. Fraction d\'éjection à 65%.'
    }
  ];

  return (
    <div className="patient-container">
      <div className="patient-header-grid">
        <div className="patient-identity-card">
          <div className="patient-photo-container">
            <img src={patientData.photo} alt="Patient" className="patient-photo" />
          </div>
          <div className="patient-basic-info">
            <h1>{patientData.informationsPersonnelles.nom}</h1>
            <div className="patient-details">
              <p><strong>N° Dossier:</strong> {patientData.informationsPersonnelles.numeroDossier}</p>
              <p><strong>Date de naissance:</strong> {patientData.informationsPersonnelles.dateNaissance}</p>
              <p><strong>Âge:</strong> {patientData.informationsPersonnelles.age} ans</p>
              <p><strong>Sexe:</strong> {patientData.informationsPersonnelles.sexe}</p>
            </div>
          </div>
        </div>

        <div className="contact-info-card">
          <h2>Coordonnées</h2>
          <div className="contact-details">
            <p><strong>Adresse:</strong> {patientData.informationsPersonnelles.adresse}</p>
            <p><strong>Téléphone:</strong> {patientData.informationsPersonnelles.telephone}</p>
            <p><strong>Email:</strong> {patientData.informationsPersonnelles.email}</p>
          </div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-card clickable" onClick={() => setIsVitalInfoModalOpen(true)}>
          <h2>Informations Vitales</h2>
          <div className="vital-signs preview">
            <p className="full-width"><strong>Groupe sanguin:</strong> {patientData.informationsMedicales.groupeSanguin}</p>
            <p className="full-width"><strong>IMC:</strong> {patientData.informationsMedicales.imc}</p>
          </div>
        </div>

        <div className="info-card clickable" onClick={() => setIsAllergyVaccinationModalOpen(true)}>
          <h2>Allergies & Vaccinations</h2>
          <div className="allergy-vaccination-preview">
            <p><strong>Allergies:</strong> {patientData.informationsMedicales.allergies.length} allergies connues</p>
            <p><strong>Vaccinations:</strong> {patientData.informationsMedicales.vaccinations.length} vaccins à jour</p>
          </div>
        </div>

        <div className="info-card clickable" onClick={() => setIsAntecedentModalOpen(true)}>
          <h2>Antécédents</h2>
          <ul className="info-list preview">
            {patientData.informationsMedicales.antecedents
              .slice(-2)
              .reverse()
              .map((antecedent, index) => (
                <li key={index}>
                  {antecedent.description} ({antecedent.date})
                </li>
            ))}
          </ul>
        </div>

        <div className="info-card clickable" onClick={() => setIsTreatmentModalOpen(true)}>
          <h2>Traitements en cours</h2>
          <ul className="info-list preview">
            {patientData.informationsMedicales.traitements.slice(0, 2).map((traitement, index) => (
              <li key={index}>{traitement.nom} - {traitement.dosage}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="radiology-section clickable" onClick={() => setIsRadiologyModalOpen(true)}>
        <h2>Rapports radiologiques</h2>
        <div className="radiology-table-container">
          <table className="radiology-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type d'examen</th>
                <th>Résultat</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {patientData.rapportsRadiologiques.map((rapport, index) => (
                <tr key={index}>
                  <td>{rapport.date}</td>
                  <td>{rapport.type}</td>
                  <td>{rapport.resultat}</td>
                  <td>{rapport.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="primary-button"
          onClick={() => navigate('/images')}
        >
          Voir les images médicales
        </button>
      </div>

      <Modal
        isOpen={isVitalInfoModalOpen}
        onClose={() => setIsVitalInfoModalOpen(false)}
        title="Informations Vitales Détaillées"
      >
        <div className="vital-info-grid">
          <div className="vital-info-item">
            <h3>Groupe Sanguin</h3>
            <p>{patientData.informationsMedicales.groupeSanguin}</p>
          </div>
          <div className="vital-info-item">
            <h3>Poids</h3>
            <p>{patientData.informationsMedicales.poids}</p>
          </div>
          <div className="vital-info-item">
            <h3>Taille</h3>
            <p>{patientData.informationsMedicales.taille}</p>
          </div>
          <div className="vital-info-item">
            <h3>IMC</h3>
            <p>{patientData.informationsMedicales.imc}</p>
          </div>
          <div className="vital-info-item">
            <h3>Tension Artérielle</h3>
            <p>120/80 mmHg</p>
          </div>
          <div className="vital-info-item">
            <h3>Fréquence Cardiaque</h3>
            <p>72 bpm</p>
          </div>
          <div className="vital-info-item">
            <h3>Température</h3>
            <p>37.2°C</p>
          </div>
          <div className="vital-info-item">
            <h3>Saturation en Oxygène</h3>
            <p>98%</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isTreatmentModalOpen}
        onClose={() => setIsTreatmentModalOpen(false)}
        title="Détails des Traitements en Cours"
      >
        <div className="treatments-grid">
          {patientData.informationsMedicales.traitements.map((traitement, index) => (
            <div key={index} className="treatment-info-item">
              <div className="treatment-header">
                <h3>{traitement.nom}</h3>
                <span className="treatment-dosage">{traitement.dosage}</span>
              </div>
              <div className="treatment-details">
                <p><strong>Fréquence:</strong> {traitement.frequence}</p>
                <p><strong>Durée:</strong> {traitement.duree}</p>
                <p><strong>Date de début:</strong> {traitement.dateDebut}</p>
                <p><strong>Prescripteur:</strong> {traitement.prescripteur}</p>
                <p><strong>Instructions:</strong> {traitement.instructions}</p>
                <p><strong>Effets secondaires:</strong> {traitement.effetsSecondaires}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isAntecedentModalOpen}
        onClose={() => setIsAntecedentModalOpen(false)}
        title="Historique Médical Complet"
      >
        <div className="antecedents-timeline">
          {patientData.informationsMedicales.antecedents.map((antecedent, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-date">
                <span className="year">{antecedent.date}</span>
                <span className="age">{antecedent.age} ans</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>{antecedent.type}</h3>
                  <span className="timeline-location">
                    <i className="fas fa-hospital"></i>
                    {antecedent.lieu}
                  </span>
                </div>
                <div className="timeline-body">
                  <p className="description">{antecedent.description}</p>
                  <p className="details">{antecedent.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isAllergyVaccinationModalOpen}
        onClose={() => setIsAllergyVaccinationModalOpen(false)}
        title="Détails des Allergies et Vaccinations"
      >
        <div className="allergy-vaccination-details">
          <div className="details-section">
            <h3>Allergies</h3>
            <ul className="info-list">
              {patientData.informationsMedicales.allergies.map((allergie, index) => (
                <li key={index}>{allergie}</li>
              ))}
            </ul>
          </div>
          <div className="details-section">
            <h3>Vaccinations</h3>
            <ul className="info-list">
              {patientData.informationsMedicales.vaccinations.map((vaccination, index) => (
                <li key={index}>
                  <div className="vaccination-item">
                    <span className="vaccination-name">{vaccination.nom}</span>
                    <span className="vaccination-date">{vaccination.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isRadiologyModalOpen}
        onClose={() => setIsRadiologyModalOpen(false)}
        title="Historique Complet des Rapports Radiologiques"
        className="radiology-modal"
      >
        <div className="radiology-modal-content">
          {extendedRadiologyData.map((rapport, index) => (
            <div key={index} className="radiology-report-item">
              <div className="radiology-report-header">
                <div className="radiology-report-date">{rapport.date}</div>
                <div className="radiology-report-type">{rapport.type}</div>
                <div className={`radiology-report-result ${rapport.resultat.toLowerCase()}`}>
                  {rapport.resultat}
                </div>
              </div>
              <div className="radiology-report-details">
                {rapport.details}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default PatientInfo;