import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DicomViewer from './components/DicomViewer';
import DicomList from './components/DicomList';
import DicomUpload from './components/DicomUpload';
import PatientInfo from './components/PatientInfo';
import AppointmentForm from './components/AppointmentForm';
import Navbar from './components/Navbar';
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
    if (dicomListRef.current && dicomListRef.current.fetchStudies) {
      dicomListRef.current.fetchStudies();
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <div className="page-container">
            <Routes>
              <Route path="/" element={<Navigate to="/patient/123" replace />} />
              <Route path="/patient/:id" element={<PatientInfo />} />
              <Route path="/appointment" element={<AppointmentForm />} />
              <Route path="/images" element={
                <div className="card">
                  <DicomList 
                    ref={dicomListRef}
                    onSelectStudy={handleStudySelect} 
                  />
                  {selectedStudy && (
                    <DicomViewer
                      studyId={selectedStudy}
                      onClose={handleCloseViewer}
                    />
                  )}
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App; 