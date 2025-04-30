// client/src/pages/SoilRecommendationPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/recommendationPage.css'
import Sidebar from '../components/Sidebar';

const SoilRecommendationPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const navigate = useNavigate();
  const { id } = useParams(); // Get soil analysis ID from URL parameters
  const [soilData, setSoilData] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if user data is already available in AuthContext
        if (user && user.token) {  
          setUserData(user);
          
          // Fetch soil analysis data for the specific ID
          await fetchSoilAnalysis(user.token);
          
          setLoading(false);
          return;
        }
    
        // Try to get authentication data from localStorage
        const userInfo = localStorage.getItem('userInfo');
        
        if (!userInfo) {
          console.log("No authentication data found in localStorage");
          navigate('/login');
          return;
        }
    
        // Parse localStorage data
        const parsedInfo = JSON.parse(userInfo);
        const token = parsedInfo.token;
    
        // Fetch fresh user profile from backend
        const res = await axios.get(`http://localhost:5000/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        setUserData(res.data);
        
        // Fetch soil analysis data for the specific ID
        await fetchSoilAnalysis(token);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, user, id]);

  const fetchSoilAnalysis = async (token) => {
    try {
      // Fetch specific soil analysis data by ID
      const { data } = await axios.get(`http://localhost:5000/api/soil-data/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSoilData(data);
    } catch (error) {
      console.error('Error fetching soil analysis data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  // Navigate back to soil analyzer page
  const handleBackToAnalyzer = () => {
    navigate('/soil-analyzer');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">Loading recommendations...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Import Sidebar Component */}
      <Sidebar language={language} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-topnav">
          <div className="breadcrumb">
            <span className="breadcrumb-item">🏠 {language === 'english' ? 'Home' : 'হোম'}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item" onClick={handleBackToAnalyzer} style={{ cursor: 'pointer' }}>
              {language === 'english' ? 'Soil Analyzer' : 'মাটি বিশ্লেষক'}
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">
              {language === 'english' ? 'Recommendations' : 'সুপারিশ'}
            </span>
          </div>
          <div className="user-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            <div className="avatar">
              {userData && userData.profileImage ? (
                <img src={userData.profileImage} alt={userData.name} />
              ) : (
                userData && userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
          </div>
        </nav>

        {/* Recommendation Content */}
        <div className="dashboard-content">
          <div className="soil-analyzer-header">
            <h1 className="page-title">
              {language === 'english' ? '🌱 Soil Recommendations' : '🌱 মাটির সুপারিশ'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? 'Personalized recommendations based on your soil analysis' 
                : 'আপনার মাটি বিশ্লেষণের উপর ভিত্তি করে ব্যক্তিগতকৃত সুপারিশ'}
            </p>
          </div>

          <div className="soil-analyzer-content">
            <div className="recommendation-card full-width">
              <div className="card-header">
                <h2>{language === 'english' ? '📊 Soil Analysis Results' : '📊 মাটি বিশ্লেষণের ফলাফল'}</h2>
              </div>
              <div className="recommendation-content">
                <div className="welcome-message">
                  <h3>{language === 'english' ? 'Welcome to Soil Recommendations!' : 'মাটির সুপারিশে স্বাগতম!'}</h3>
                  <p>
                    {language === 'english' 
                      ? 'Based on your soil analysis, we will provide personalized recommendations for optimal crop growth, fertilizer usage, and soil health improvement.' 
                      : 'আপনার মাটি বিশ্লেষণের উপর ভিত্তি করে, আমরা সর্বোত্তম ফসল বৃদ্ধি, সার ব্যবহার এবং মাটির স্বাস্থ্য উন্নতির জন্য ব্যক্তিগতকৃত সুপারিশ প্রদান করব।'}
                  </p>
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={handleBackToAnalyzer} 
                    className="back-button"
                  >
                    {language === 'english' ? '← Back to Soil Analyzer' : '← মাটি বিশ্লেষকে ফিরে যান'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilRecommendationPage;