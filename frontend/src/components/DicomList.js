import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import axios from 'axios';
import DicomUpload from './DicomUpload';
import './DicomList.css';
import { useNavigate } from 'react-router-dom';

const DicomList = forwardRef(({ onSelectStudy }, ref) => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const navigate = useNavigate();

  const fetchStudies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/dicom/studies`, {
        params: {
          search: searchTerm,
          sort: sortBy
        }
      });
      setStudies(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur détaillée:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Erreur lors de la récupération des études');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, sortBy]);

  useImperativeHandle(ref, () => ({
    fetchStudies
  }));

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const handleDownload = async (studyId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/dicom/download/${studyId}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DICOM-${studyId}.dcm`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur lors du téléchargement:', err);
      alert('Erreur lors du téléchargement du fichier');
    }
  };

  const handleDelete = async (studyId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette étude ?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/dicom/studies/${studyId}`);
      fetchStudies();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression de l\'étude');
    }
  };

  const handleRefresh = () => {
    fetchStudies();
  };

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
    <div className="dicom-container">
      <div className="dicom-header">
        <h1>Images Médicales</h1>
        <DicomUpload onUploadSuccess={fetchStudies} />
      </div>

      <div className="dicom-controls">
        <input
          type="text"
          placeholder="Rechercher une étude..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="date">Trier par date</option>
          <option value="uid">Trier par ID</option>
        </select>
      </div>

      <button 
        onClick={handleRefresh}
        className="refresh-button"
      >
        <i className="fas fa-sync-alt"></i>
        <span>Rafraîchir</span>
      </button>

      <div className="studies-grid">
        {loading ? (
          <div className="loading">Chargement des études...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : studies.length === 0 ? (
          <p className="no-results">Aucune étude disponible</p>
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
                  <div className="study-actions">
                    <button 
                      onClick={() => handleDownload(study.id)}
                      className="action-button download-button"
                    >
                      <i className="fas fa-download"></i>
                      Télécharger
                    </button>
                    <button 
                      onClick={() => onSelectStudy(study.studyInstanceUID)}
                      className="action-button view-button"
                    >
                      <i className="fas fa-eye"></i>
                      Visualiser
                    </button>
                    <button 
                      onClick={() => navigate(`/patient/123`)}
                      className="action-button info-button"
                    >
                      <i className="fas fa-user"></i>
                      Dossier patient
                    </button>
                    <button 
                      onClick={() => handleDelete(study.id)}
                      className="action-button delete-button"
                    >
                      <i className="fas fa-trash"></i>
                      Supprimer
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
});

export default DicomList; 