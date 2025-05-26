import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion
    navigate('/login');
  };

  // Décoder le token pour vérifier le rôle
  let isSuperAdmin = false;
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isSuperAdmin = payload.role === 'super_admin';
    } catch (e) {
      isSuperAdmin = false;
    }
  }

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
            to="/teleconsultation-fictive" 
            className={`nav-link ${isActive('/teleconsultation-fictive') ? 'active' : ''}`}
          >
            <i className="fas fa-video"></i>
            <span>Téléconsultation</span>
          </Link>

          <Link 
            to="/admin" 
            className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
          >
            <i className="fas fa-user-shield"></i>
            <span>Administration</span>
          </Link>

          <Link 
            to="/hospitals" 
            className={`nav-link ${isActive('/hospitals') ? 'active' : ''}`}
          >
            <i className="fas fa-hospital"></i>
            <span>Gestion des Hôpitaux</span>
          </Link>

          {/* Lien Super Admin visible uniquement pour les super admin */}
          {isSuperAdmin && (
            <Link 
              to="/super-admin" 
              className={`nav-link ${isActive('/super-admin') ? 'active' : ''}`}
            >
              <i className="fas fa-user-cog"></i>
              <span>Super Admin</span>
            </Link>
          )}

          <Link 
            to="/patients/create" 
            className={`nav-link ${isActive('/patients/create') ? 'active' : ''}`}
          >
            <i className="fas fa-user-plus"></i>
            <span>Créer Patient</span>
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