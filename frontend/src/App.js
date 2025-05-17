import React, { useState, useRef } from 'react';
import DicomViewer from './components/DicomViewer';
import DicomList from './components/DicomList';
import DicomUpload from './components/DicomUpload';
import './App.css';

function App() {
  const [selectedStudy, setSelectedStudy] = useState(null);
  const dicomListRef = useRef();

  const handleStudySelect = (studyId) => {
    setSelectedStudy(studyId);
  };

  const handleCloseViewer = () => {
    setSelectedStudy(null);
  };

  const handleUploadSuccess = () => {
    // Rafraîchir la liste des études en utilisant la référence
    if (dicomListRef.current && dicomListRef.current.fetchStudies) {
      dicomListRef.current.fetchStudies();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Visualiseur DICOM</h1>
      </header>
      
      <main className="app-content">
        <DicomUpload onUploadSuccess={handleUploadSuccess} />
        <DicomList 
          ref={dicomListRef}
          onSelectStudy={handleStudySelect} 
        />
      </main>

      {selectedStudy && (
        <DicomViewer
          studyId={selectedStudy}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
}

export default App; 