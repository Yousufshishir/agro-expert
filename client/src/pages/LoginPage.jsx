// client/src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { email, password } = formData;

  // Animation effect for rice plants
  useEffect(() => {
    const interval = setInterval(() => {
      const ricePlants = document.querySelectorAll('.rice-plant');
      ricePlants.forEach(plant => {
        plant.classList.toggle('sway');
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });

      login(response.data);

      // Redirect based on user role
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="rice-field-background">
        {/* Rice plants in the background */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`rice-plant plant-${i}`}></div>
        ))}
        {/* Water effect */}
        <div className="water-ripple"></div>
      </div>
      
      <div className="login-form-container">
        <div className="logo-container">
          <div className="logo-image"></div>
          <h1 className="title">Agro Expert</h1>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-container">
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={email} 
                onChange={onChange} 
                required 
                placeholder="Enter your email"
              />
              <span className="input-icon email-icon"></span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={password} 
                onChange={onChange} 
                required 
                placeholder="Enter your password"
              />
              <span className="input-icon password-icon"></span>
            </div>
          </div>
          
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? 'Logging in...' : 'Login'}
            <span className="button-overlay"></span>
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
          <p>
            <Link to="/reset-password">Forgot Password?</Link>
          </p>
        </div>
      </div>

      <div className="decorative-elements">
        <div className="jute-rope left"></div>
        <div className="jute-rope right"></div>
        <div className="floating-leaf leaf-1"></div>
        <div className="floating-leaf leaf-2"></div>
        <div className="floating-leaf leaf-3"></div>
      </div>
    </div>
  );
};

export default LoginPage;