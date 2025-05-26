import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './PatientInfo.css';
import { jsPDF } from 'jspdf';

// Données fictives du patient
const patientData = {
  id: '123',
  photo: process.env.PUBLIC_URL + '/re.jpeg',
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
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
      <div className="patient-card">
        <div className="patient-identity">
          <div className="patient-photo-container">
            <img 
              src={patientData.photo} 
              alt={`${patientData.informationsPersonnelles.nom}`} 
              className="patient-photo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, border: 'none', boxShadow: 'none' }}
            />
          </div>
          <div className="patient-basic-info">
            <h1>{patientData.informationsPersonnelles.nom}</h1>
            <div className="patient-details">
              <p><strong>Numéro patient:</strong> {patientData.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="medical-info-grid">
        <div className="medical-info-section clickable" onClick={() => setIsContactModalOpen(true)}>
          <div className="section-header">
            <i className="fas fa-user-circle"></i>
            <h2>Informations du Patient et Coordonnées</h2>
          </div>
          <div className="section-content">
            <div className="vital-signs preview">
              <p><strong>Sexe:</strong> {patientData.informationsPersonnelles.sexe}</p>
              <p><strong>Âge:</strong> {patientData.informationsPersonnelles.age} ans</p>
              <p><strong>Téléphone:</strong> {patientData.informationsPersonnelles.telephone}</p>
            </div>
          </div>
        </div>

        <div className="medical-info-section clickable" onClick={() => setIsVitalInfoModalOpen(true)}>
          <div className="section-header">
            <i className="fas fa-heartbeat"></i>
            <h2>Informations Vitales</h2>
          </div>
          <div className="section-content">
            <p><strong>Groupe sanguin:</strong> {patientData.informationsMedicales.groupeSanguin}</p>
            <p><strong>IMC:</strong> {patientData.informationsMedicales.imc}</p>
          </div>
        </div>

        <div className="medical-info-section clickable" onClick={() => setIsAllergyVaccinationModalOpen(true)}>
          <div className="section-header">
            <i className="fas fa-allergies"></i>
            <h2>Allergies & Vaccinations</h2>
          </div>
          <div className="section-content">
            <p><strong>Allergies:</strong> {patientData.informationsMedicales.allergies.length} allergies connues</p>
            <p><strong>Vaccinations:</strong> {patientData.informationsMedicales.vaccinations.length} vaccins à jour</p>
          </div>
        </div>

        <div className="medical-info-section clickable" onClick={() => setIsAntecedentModalOpen(true)}>
          <div className="section-header">
            <i className="fas fa-history"></i>
            <h2>Antécédents</h2>
          </div>
          <div className="section-content">
            <ul className="info-list">
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
        </div>

        <div className="medical-info-section clickable" onClick={() => setIsTreatmentModalOpen(true)}>
          <div className="section-header">
            <i className="fas fa-pills"></i>
            <h2>Traitements en cours</h2>
          </div>
          <div className="section-content">
            <ul className="info-list">
              {patientData.informationsMedicales.traitements.slice(0, 2).map((traitement, index) => (
                <li key={index}>{traitement.nom} - {traitement.dosage}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="medical-info-section clickable" onClick={() => setIsRadiologyModalOpen(true)}>
          <div className="section-header">
            <i className="fas fa-x-ray"></i>
            <h2>Rapports radiologiques</h2>
          </div>
          <div className="section-content">
            <div className="radiology-preview">
              {patientData.rapportsRadiologiques.slice(0, 2).map((rapport, index) => (
                <div key={index} className="radiology-preview-item">
                  <span className="date">{rapport.date}</span>
                  <span className="type">{rapport.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button 
          className="primary-button"
          onClick={() => navigate('/images')}
        >
          Voir les images médicales
        </button>
        <button 
          className="primary-button"
          onClick={() => navigate('/teleconsultation-fictive')}
        >
          Téléconsultation
        </button>
        <button 
          className="primary-button"
          onClick={() => {
            // Créer un nouveau document PDF
            const doc = new jsPDF();
            
            // Titre
            doc.setFontSize(20);
            doc.text('Dossier Médical', 105, 20, { align: 'center' });
            
            // Informations personnelles
            doc.setFontSize(16);
            doc.text('Informations Personnelles', 20, 40);
            doc.setFontSize(12);
            doc.text(`Nom: ${patientData.informationsPersonnelles.nom}`, 20, 50);
            doc.text(`Âge: ${patientData.informationsPersonnelles.age} ans`, 20, 60);
            doc.text(`Sexe: ${patientData.informationsPersonnelles.sexe}`, 20, 70);
            doc.text(`Date de naissance: ${patientData.informationsPersonnelles.dateNaissance}`, 20, 80);
            doc.text(`Numéro de dossier: ${patientData.informationsPersonnelles.numeroDossier}`, 20, 90);
            doc.text(`Adresse: ${patientData.informationsPersonnelles.adresse}`, 20, 100);
            doc.text(`Téléphone: ${patientData.informationsPersonnelles.telephone}`, 20, 110);
            doc.text(`Email: ${patientData.informationsPersonnelles.email}`, 20, 120);
            
            // Informations médicales
            doc.setFontSize(16);
            doc.text('Informations Médicales', 20, 140);
            doc.setFontSize(12);
            doc.text(`Groupe sanguin: ${patientData.informationsMedicales.groupeSanguin}`, 20, 150);
            doc.text(`Poids: ${patientData.informationsMedicales.poids}`, 20, 160);
            doc.text(`Taille: ${patientData.informationsMedicales.taille}`, 20, 170);
            doc.text(`IMC: ${patientData.informationsMedicales.imc}`, 20, 180);
            
            // Allergies
            doc.text('Allergies:', 20, 200);
            patientData.informationsMedicales.allergies.forEach((allergie, index) => {
              doc.text(`- ${allergie}`, 30, 210 + (index * 10));
            });
            
            // Vaccinations
            doc.text('Vaccinations:', 20, 240);
            patientData.informationsMedicales.vaccinations.forEach((vaccin, index) => {
              doc.text(`- ${vaccin.nom} (${vaccin.date})`, 30, 250 + (index * 10));
            });
            
            // Traitements en cours
            doc.setFontSize(16);
            doc.text('Traitements en cours', 20, 280);
            doc.setFontSize(12);
            patientData.informationsMedicales.traitements.forEach((traitement, index) => {
              const y = 290 + (index * 40);
              doc.text(`Médicament: ${traitement.nom}`, 20, y);
              doc.text(`Dosage: ${traitement.dosage}`, 20, y + 10);
              doc.text(`Fréquence: ${traitement.frequence}`, 20, y + 20);
              doc.text(`Prescripteur: ${traitement.prescripteur}`, 20, y + 30);
            });
            
            // Antécédents
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Antécédents médicaux', 20, 20);
            doc.setFontSize(12);
            patientData.informationsMedicales.antecedents.forEach((antecedent, index) => {
              const y = 30 + (index * 40);
              doc.text(`Date: ${antecedent.date} (${antecedent.age} ans)`, 20, y);
              doc.text(`Type: ${antecedent.type}`, 20, y + 10);
              doc.text(`Description: ${antecedent.description}`, 20, y + 20);
              doc.text(`Lieu: ${antecedent.lieu}`, 20, y + 30);
            });
            
            // Rapports radiologiques
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Rapports radiologiques', 20, 20);
            doc.setFontSize(12);
            patientData.rapportsRadiologiques.forEach((rapport, index) => {
              const y = 30 + (index * 40);
              doc.text(`Date: ${rapport.date}`, 20, y);
              doc.text(`Type: ${rapport.type}`, 20, y + 10);
              doc.text(`Résultat: ${rapport.resultat}`, 20, y + 20);
              doc.text(`Détails: ${rapport.details}`, 20, y + 30);
            });
            
            // Télécharger le PDF
            doc.save(`dossier_medical_${patientData.informationsPersonnelles.nom.replace(/\s+/g, '_')}.pdf`);
          }}
        >
          Télécharger le dossier médical
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
            <div className="vaccination-list">
              {patientData.informationsMedicales.vaccinations.map((vaccination, index) => (
                <div key={index} className="vaccination-item">
                  <span className="vaccination-name">{vaccination.nom}</span>
                  <span className="vaccination-date">{vaccination.date}</span>
                </div>
              ))}
            </div>
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

      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Informations du Patient et Coordonnées"
      >
        <div className="contact-details-modal">
          <div className="contact-info-section">
            <div className="contact-info-header">
              <i className="fas fa-user"></i>
              <h3>Informations Personnelles</h3>
            </div>
            <div className="contact-info-content">
              <div className="contact-info-item">
                <i className="fas fa-calendar"></i>
                <div className="contact-info-text">
                  <p><span className="contact-label">Date de naissance :</span> {patientData.informationsPersonnelles.dateNaissance}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-birthday-cake"></i>
                <div className="contact-info-text">
                  <p><span className="contact-label">Âge :</span> {patientData.informationsPersonnelles.age} ans</p>
                </div>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-venus-mars"></i>
                <div className="contact-info-text">
                  <p><span className="contact-label">Sexe :</span> {patientData.informationsPersonnelles.sexe}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-info-section">
            <div className="contact-info-header">
              <i className="fas fa-address-book"></i>
              <h3>Informations de contact</h3>
            </div>
            <div className="contact-info-content">
              <div className="contact-info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div className="contact-info-text">
                  <p><span className="contact-label">Adresse :</span> {patientData.informationsPersonnelles.adresse}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-phone"></i>
                <div className="contact-info-text">
                  <p><span className="contact-label">Téléphone :</span> {patientData.informationsPersonnelles.telephone}</p>
                </div>
              </div>
              <div className="contact-info-item">
                <i className="fas fa-envelope"></i>
                <div className="contact-info-text">
                  <p><span className="contact-label">Email :</span> {patientData.informationsPersonnelles.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="emergency-section">
            <h3>Personnes à contacter en cas d'urgence</h3>
            <div className="emergency-contact-grid">
              <div className="emergency-contact-item">
                <div className="emergency-contact-header">
                  <i className="fas fa-user"></i>
                  <h4>Marie Dupont</h4>
                </div>
                <p className="relation">Épouse</p>
                <p className="phone">01 23 45 67 90</p>
              </div>

              <div className="emergency-contact-item">
                <div className="emergency-contact-header">
                  <i className="fas fa-user-md"></i>
                  <h4>Dr. Sophie Martin</h4>
                </div>
                <p className="relation">Médecin traitant</p>
                <p className="phone">01 23 45 67 91</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PatientInfo;