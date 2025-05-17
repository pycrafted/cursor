import React, { useState } from 'react';
import axios from 'axios';
import './DicomUpload.css';

const DicomUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier DICOM');
      return;
    }

    const formData = new FormData();
    formData.append('dicom', file);

    try {
      setUploading(true);
      setError(null);
      
      await axios.post('http://localhost:3001/api/dicom/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFile(null);
      event.target.reset();
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error('Erreur détaillée:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Erreur lors du téléversement du fichier');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dicom-upload">
      <h2>Téléverser un fichier DICOM</h2>
      <form onSubmit={handleSubmit}>
        <div className="file-input-container">
          <input
            type="file"
            accept=".dcm,application/dicom"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={uploading || !file}>
          {uploading ? 'Téléversement en cours...' : 'Téléverser'}
        </button>
      </form>
    </div>
  );
};

export default DicomUpload; 