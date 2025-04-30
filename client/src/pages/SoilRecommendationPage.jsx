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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
              {language === 'english' ? '🌱 Soil Analysis Details' : '🌱 মাটি বিশ্লেষণের বিবরণ'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? 'Detailed information about your soil analysis' 
                : 'আপনার মাটি বিশ্লেষণের বিস্তারিত তথ্য'}
            </p>
          </div>

          <div className="soil-analyzer-content">
            {soilData ? (
              <>
                {/* Basic Soil Information Card */}
                <div className="recommendation-card">
                  <div className="card-header">
                    <h2>{language === 'english' ? '📊 Basic Soil Information' : '📊 মূল মাটির তথ্য'}</h2>
                  </div>
                  <div className="recommendation-content">
                    <div className="data-grid">
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Type:' : 'মাটির ধরন:'}</span>
                        <span className="data-value">{soilData.soilType}</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'pH Level:' : 'পিএইচ মাত্রা:'}</span>
                        <span className="data-value">{soilData.phLevel}</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Moisture Level:' : 'আর্দ্রতা মাত্রা:'}</span>
                        <span className="data-value">{soilData.moistureLevel}%</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Organic Matter:' : 'জৈব পদার্থ:'}</span>
                        <span className="data-value">{soilData.organicMatter}%</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Temperature:' : 'মাটির তাপমাত্রা:'}</span>
                        <span className="data-value">{soilData.soilTemp}°C</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Depth:' : 'মাটির গভীরতা:'}</span>
                        <span className="data-value">{soilData.soilDepth} cm</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Color:' : 'মাটির রং:'}</span>
                        <div className="color-sample" style={{ backgroundColor: soilData.soilColor, width: '20px', height: '20px', display: 'inline-block', marginLeft: '8px', border: '1px solid #ddd', borderRadius: '4px' }}></div>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Weather Condition:' : 'আবহাওয়া অবস্থা:'}</span>
                        <span className="data-value">{soilData.weatherCondition}</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Location:' : 'অবস্থান:'}</span>
                        <span className="data-value">{soilData.location || 'Not specified'}</span>
                      </div>
                      <div className="data-item">
                        <span className="data-label">{language === 'english' ? 'Analysis Date:' : 'বিশ্লেষণের তারিখ:'}</span>
                        <span className="data-value">{formatDate(soilData.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nutrient Levels Card */}
                <div className="recommendation-card">
                  <div className="card-header">
                    <h2>{language === 'english' ? '🧪 Nutrient Levels' : '🧪 পুষ্টি মাত্রা'}</h2>
                  </div>
                  <div className="recommendation-content">
                    <div className="nutrient-grid">
                      <div className="nutrient-item">
                        <span className="nutrient-label">{language === 'english' ? 'Nitrogen (N):' : 'নাইট্রোজেন (N):'}</span>
                        <div className="nutrient-bar-container">
                          <div className="nutrient-bar" style={{ width: `${soilData.nutrients.nitrogen}%`, backgroundColor: '#4CAF50' }}></div>
                        </div>
                        <span className="nutrient-value">{soilData.nutrients.nitrogen}%</span>
                      </div>
                      <div className="nutrient-item">
                        <span className="nutrient-label">{language === 'english' ? 'Phosphorus (P):' : 'ফসফরাস (P):'}</span>
                        <div className="nutrient-bar-container">
                          <div className="nutrient-bar" style={{ width: `${soilData.nutrients.phosphorus}%`, backgroundColor: '#2196F3' }}></div>
                        </div>
                        <span className="nutrient-value">{soilData.nutrients.phosphorus}%</span>
                      </div>
                      <div className="nutrient-item">
                        <span className="nutrient-label">{language === 'english' ? 'Potassium (K):' : 'পটাসিয়াম (K):'}</span>
                        <div className="nutrient-bar-container">
                          <div className="nutrient-bar" style={{ width: `${soilData.nutrients.potassium}%`, backgroundColor: '#FF9800' }}></div>
                        </div>
                        <span className="nutrient-value">{soilData.nutrients.potassium}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Card */}
                {soilData.notes && (
                  <div className="recommendation-card">
                    <div className="card-header">
                      <h2>{language === 'english' ? '📝 Notes' : '📝 নোট'}</h2>
                    </div>
                    <div className="recommendation-content">
                      <p className="notes-text">{soilData.notes}</p>
                    </div>
                  </div>
                )}

                {/* Additional Information Card */}
                <div className="recommendation-card">
                  <div className="card-header">
                    <h2>{language === 'english' ? '🔍 Soil Analysis Details' : '🔍 মাটি বিশ্লেষণ বিবরণ'}</h2>
                  </div>
                  <div className="recommendation-content">
                    <div className="analysis-id">
                      <span className="label">{language === 'english' ? 'Analysis ID:' : 'বিশ্লেষণ আইডি:'}</span>
                      <span className="value">{soilData._id}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-data-message">
                {language === 'english' 
                  ? 'No soil analysis data found for this ID. Please try another analysis or return to the analyzer page.' 
                  : 'এই আইডির জন্য কোন মাটি বিশ্লেষণ ডেটা পাওয়া যায়নি। অন্য বিশ্লেষণ চেষ্টা করুন বা বিশ্লেষক পৃষ্ঠায় ফিরে যান।'}
              </div>
            )}
            
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
  );
};

export default SoilRecommendationPage;