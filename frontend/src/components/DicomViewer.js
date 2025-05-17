import React from 'react';
import './DicomViewer.css';

const DicomViewer = ({ studyId, onClose }) => {
  if (!studyId) return null;

  return (
    <div className="dicom-viewer-container">
      <div className="dicom-viewer-header">
        <button onClick={onClose} className="close-button">
          Fermer le visualiseur
        </button>
      </div>
      <iframe
        src={`http://localhost:8042/ohif/viewer?StudyInstanceUIDs=${studyId}`}
        title="OHIF DICOM Viewer"
        className="dicom-viewer-frame"
      />
    </div>
  );
};

export default DicomViewer; 