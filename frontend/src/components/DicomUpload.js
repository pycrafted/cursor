import React, { useState } from 'react';
import './DicomUpload.css';

const DicomUpload = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    try {
      // Simulation d'upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      onUploadSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".dcm"
          multiple
          onChange={handleFileSelect}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-label">
          <i className="fas fa-cloud-upload-alt"></i>
          <span>
            {uploading ? 'Upload en cours...' : 'Déposer les fichiers DICOM ici ou cliquer pour sélectionner'}
          </span>
        </label>
      </div>
    </div>
  );
};

export default DicomUpload; 