import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Simulation de déconnexion
    console.log('Déconnexion...');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-hospital-user"></i>
          <span>HospiCare</span>
        </Link>
        
        <div className="navbar-links">
          <Link 
            to="/patient/123" 
            className={`nav-link ${isActive('/patient/123') ? 'active' : ''}`}
          >
            <i className="fas fa-user-injured"></i>
            <span>Dossier Patient</span>
          </Link>
          
          <Link 
            to="/images" 
            className={`nav-link ${isActive('/images') ? 'active' : ''}`}
          >
            <i className="fas fa-x-ray"></i>
            <span>Images Médicales</span>
          </Link>

          <Link 
            to="/appointment" 
            className={`nav-link ${isActive('/appointment') ? 'active' : ''}`}
          >
            <i className="fas fa-calendar-plus"></i>
            <span>Rendez-vous</span>
          </Link>

          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            <i className="fas fa-user-shield"></i>
            <span>Administration</span>
          </Link>
        </div>
      </div>

      <div className="logout-container">
        <button className="logout-button" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Déconnexion</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 