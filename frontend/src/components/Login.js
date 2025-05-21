import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section">
          <div className="login-header">
            <div className="logo">
              <i className="fas fa-user-md"></i>
            </div>
            <h1>Bienvenue</h1>
            <p>Connectez-vous à votre espace médical</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                Se souvenir de moi
              </label>
              <a href="#" className="forgot-password">
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" className="login-button">
              <i className="fas fa-sign-in-alt"></i>
              Se connecter
            </button>
          </form>

          <div className="login-footer">
            <p>
              Pas encore de compte ?{' '}
              <a href="#" onClick={() => navigate('/register')}>
                Créer un compte
              </a>
            </p>
          </div>
        </div>
        <div className="login-image-section">
          <img 
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80" 
            alt="Medical Environment" 
            className="login-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Login; 