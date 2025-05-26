import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DicomViewer from './components/DicomViewer';
import DicomList from './components/DicomList';
import DicomUpload from './components/DicomUpload';
import PatientInfo from './components/PatientInfo';
import AppointmentForm from './components/AppointmentForm';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import TeleconsultationFictive from './components/TeleconsultationFictive';
import AdminDashboard from './components/AdminDashboard';
import PatientCreation from './components/PatientCreation';
import SuperAdmin from './components/SuperAdmin';
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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <>
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
                    <Route path="/teleconsultation-fictive" element={<TeleconsultationFictive />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/super-admin" element={<SuperAdmin />} />
                    <Route path="/patients/create" element={<PatientCreation />} />
                  </Routes>
                </div>
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 