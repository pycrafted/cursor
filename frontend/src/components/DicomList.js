import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import './DicomList.css';

const DicomList = forwardRef(({ onSelectStudy }, ref) => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/dicom/studies');
      setStudies(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur détaillée:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Erreur lors de la récupération des études');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchStudies
  }));

  useEffect(() => {
    fetchStudies();
  }, []);

  if (loading) {
    return <div className="loading">Chargement des études...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const getStudyDescription = (study) => {
    const tags = study.mainDicomTags;
    const patientTags = study.patientMainDicomTags;
    return {
      patientName: patientTags.PatientName || 'Patient inconnu',
      studyDate: tags.StudyDate || 'Date inconnue',
      studyDescription: tags.StudyDescription || 'Description non disponible',
      accessionNumber: tags.AccessionNumber || 'N/A'
    };
  };

  return (
    <div className="dicom-list">
      <h2>Liste des études DICOM</h2>
      <button onClick={fetchStudies} className="refresh-button">
        Rafraîchir la liste
      </button>
      {studies.length === 0 ? (
        <p>Aucune étude disponible</p>
      ) : (
        <ul>
          {studies.map((study) => {
            const { patientName, studyDate, studyDescription, accessionNumber } = getStudyDescription(study);
            return (
              <li key={study.id}>
                <div className="study-info">
                  <div className="patient-name">{patientName}</div>
                  <div className="study-details">
                    <span className="study-date">{studyDate}</span>
                    <span className="study-description">{studyDescription}</span>
                    <span className="accession-number">ACC#: {accessionNumber}</span>
                  </div>
                </div>
                <button onClick={() => onSelectStudy(study.studyInstanceUID)}>
                  Visualiser
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});

export default DicomList; 