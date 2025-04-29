// client/src/pages/SoilAnalyzerPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/soilanalyzer.css';
import Sidebar from '../components/Sidebar';

const SoilAnalyzerPage = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const navigate = useNavigate();
  
  // Soil analysis states
  const [soilType, setSoilType] = useState('');
  const [phLevel, setPhLevel] = useState(7);
  const [moistureLevel, setMoistureLevel] = useState(50);
  const [nitrogenLevel, setNitrogenLevel] = useState(0);
  const [phosphorusLevel, setPhosphorusLevel] = useState(0);
  const [potassiumLevel, setPotassiumLevel] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [location, setLocation] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if user data is already available in AuthContext
        if (user && user.token) {  
          setUserData(user);
          
          // Fetch soil analysis history from the API
          await fetchSoilData(user.token);
          
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
        
        // Fetch soil analysis history from the API
        await fetchSoilData(token);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, user]);

  const fetchSoilData = async (token) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/soil-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalysisHistory(data.soilData);
      setAnalysisCount(data.analysisCount);
    } catch (error) {
      console.error('Error fetching soil data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleSoilTypeChange = (e) => {
    const type = e.target.value;
    setSoilType(type);
    
    // Adjust default values based on soil type
    if (type === 'sandy') {
      setPhLevel(6.0);
      setMoistureLevel(30);
    } else if (type === 'clay') {
      setPhLevel(7.5);
      setMoistureLevel(60);
    } else if (type === 'loamy') {
      setPhLevel(6.5);
      setMoistureLevel(45);
    } else if (type === 'silty') {
      setPhLevel(6.8);
      setMoistureLevel(55);
    }
  };

  const analyzeSoil = async () => {
    if (!soilType) {
      setSaveError(language === 'english' ? 'Please select a soil type' : 'দয়া করে মাটির ধরন নির্বাচন করুন');
      return;
    }
    
    setSaveError('');
    setSaveMessage('');
    
    // Generate recommendations for display only (not saved)
    generateRecommendations();
    
    // Save soil data to database
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      if (!token) {
        setSaveError(language === 'english' ? 'Authentication error' : 'অনুমোদন ত্রুটি');
        return;
      }
      
      const soilData = {
        soilType,
        phLevel,
        moistureLevel,
        nitrogen: nitrogenLevel,
        phosphorus: phosphorusLevel,
        potassium: potassiumLevel,
        location
      };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/soil-data',
        soilData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the analysis count
      setAnalysisCount(data.analysisCount);
      
      // Fetch updated soil data
      await fetchSoilData(token);
      
      setSaveMessage(language === 'english' ? 'Soil data saved successfully!' : 'মাটির তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error saving soil data:', error);
      setSaveError(language === 'english' ? 'Error saving soil data' : 'মাটির তথ্য সংরক্ষণ করতে ত্রুটি');
    }
  };
  
  const generateRecommendations = () => {
    // Generate recommendations (for display only, not saved)
    let cropRecommendations = [];
    let fertilizerRecommendations = [];
    let irrigationTips = [];
    
    // Basic recommendations based on soil type
    if (soilType === 'sandy') {
      cropRecommendations = language === 'english' ? 
        ['Carrots', 'Potatoes', 'Radishes', 'Lettuce'] : 
        ['গাজর', 'আলু', 'মূলা', 'লেটুস'];
      fertilizerRecommendations.push(language === 'english' ? 
        'Add organic matter to improve water retention' : 
        'পানি ধরে রাখার ক্ষমতা বাড়াতে জৈব পদার্থ যোগ করুন');
    } else if (soilType === 'clay') {
      cropRecommendations = language === 'english' ? 
        ['Broccoli', 'Cabbage', 'Brussels sprouts', 'Beans'] : 
        ['ব্রোকলি', 'বাঁধাকপি', 'ব্রাসেলস স্প্রাউটস', 'বিন'];
      fertilizerRecommendations.push(language === 'english' ? 
        'Add gypsum to improve soil structure' : 
        'মাটির গঠন উন্নত করতে জিপসাম যোগ করুন');
    } else if (soilType === 'loamy') {
      cropRecommendations = language === 'english' ? 
        ['Tomatoes', 'Corn', 'Peppers', 'Cucumbers'] : 
        ['টমেটো', 'ভুট্টা', 'মরিচ', 'শসা'];
      fertilizerRecommendations.push(language === 'english' ? 
        'Balanced NPK fertilizer recommended' : 
        'ভারসাম্যপূর্ণ NPK সার সুপারিশ করা হয়');
    } else if (soilType === 'silty') {
      cropRecommendations = language === 'english' ? 
        ['Pumpkins', 'Squash', 'Melons', 'Fruit trees'] : 
        ['কুমড়া', 'স্কোয়াশ', 'তরমুজ', 'ফলের গাছ'];
      fertilizerRecommendations.push(language === 'english' ? 
        'Add organic matter to improve drainage' : 
        'জল নিষ্কাশন উন্নত করতে জৈব পদার্থ যোগ করুন');
    }
    
    // pH based recommendations
    if (phLevel < 6.0) {
      fertilizerRecommendations.push(language === 'english' ? 
        'Apply lime to raise pH' : 
        'pH বাড়াতে চুন প্রয়োগ করুন');
    } else if (phLevel > 7.5) {
      fertilizerRecommendations.push(language === 'english' ? 
        'Apply sulfur to lower pH' : 
        'pH কমাতে সালফার প্রয়োগ করুন');
    }
    
    // Moisture based recommendations
    if (moistureLevel < 30) {
      irrigationTips.push(language === 'english' ? 
        'Increase irrigation frequency' : 
        'সেচের পরিমাণ বাড়ান');
    } else if (moistureLevel > 60) {
      irrigationTips.push(language === 'english' ? 
        'Improve drainage to prevent waterlogging' : 
        'জলাবদ্ধতা রোধ করতে জল নিষ্কাশন উন্নত করুন');
    }
    
    // Advanced nutrient recommendations
    if (showAdvancedOptions) {
      if (nitrogenLevel < 30) {
        fertilizerRecommendations.push(language === 'english' ? 
          'Apply nitrogen-rich fertilizer' : 
          'নাইট্রোজেন সমৃদ্ধ সার প্রয়োগ করুন');
      }
      if (phosphorusLevel < 30) {
        fertilizerRecommendations.push(language === 'english' ? 
          'Apply phosphorus-rich fertilizer' : 
          'ফসফরাস সমৃদ্ধ সার প্রয়োগ করুন');
      }
      if (potassiumLevel < 30) {
        fertilizerRecommendations.push(language === 'english' ? 
          'Apply potassium-rich fertilizer' : 
          'পটাশিয়াম সমৃদ্ধ সার প্রয়োগ করুন');
      }
    }
    
    setRecommendations({
      crops: cropRecommendations,
      fertilizers: fertilizerRecommendations,
      irrigation: irrigationTips
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">Loading soil analyzer...</div>
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
            <span className="breadcrumb-item active">{language === 'english' ? 'Soil Analyzer' : 'মাটি বিশ্লেষক'}</span>
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

        {/* Soil Analyzer Content */}
        <div className="dashboard-content">
          <div className="soil-analyzer-header">
            <h1 className="page-title">
              {language === 'english' ? '🌱 Soil Analyzer' : '🌱 মাটি বিশ্লেষক'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? `Analyze your soil parameters (${analysisCount} analysis performed)` 
                : `আপনার মাটির পরামিতি বিশ্লেষণ করুন (${analysisCount} বিশ্লেষণ সম্পন্ন হয়েছে)`}
            </p>
          </div>

          <div className="soil-analyzer-content">
            <div className="soil-input-card">
              <div className="card-header">
                <h2>{language === 'english' ? '📊 Soil Parameters' : '📊 মাটির পরামিতি'}</h2>
              </div>
              <div className="soil-input-form">
                <div className="form-group">
                  <label>{language === 'english' ? 'Soil Type' : 'মাটির ধরন'}</label>
                  <select 
                    value={soilType} 
                    onChange={handleSoilTypeChange}
                    className="soil-select"
                  >
                    <option value="">{language === 'english' ? 'Select Soil Type' : 'মাটির ধরন নির্বাচন করুন'}</option>
                    <option value="sandy">{language === 'english' ? 'Sandy' : 'বালিময়'}</option>
                    <option value="clay">{language === 'english' ? 'Clay' : 'এঁটেল'}</option>
                    <option value="loamy">{language === 'english' ? 'Loamy' : 'দোআঁশ'}</option>
                    <option value="silty">{language === 'english' ? 'Silty' : 'পলিময়'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    {language === 'english' ? 'pH Level' : 'পিএইচ মাত্রা'}: {phLevel}
                  </label>
                  <div className="slider-container">
                    <span className="slider-min">4.0</span>
                    <input 
                      type="range" 
                      min="4.0" 
                      max="10.0" 
                      step="0.1" 
                      value={phLevel} 
                      onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                      className="range-slider"
                    />
                    <span className="slider-max">10.0</span>
                  </div>
                  <div className="ph-scale">
                    <div className="ph-marker acidic">{language === 'english' ? 'Acidic' : 'অম্লীয়'}</div>
                    <div className="ph-marker neutral">{language === 'english' ? 'Neutral' : 'নিরপেক্ষ'}</div>
                    <div className="ph-marker alkaline">{language === 'english' ? 'Alkaline' : 'ক্ষারীয়'}</div>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    {language === 'english' ? 'Moisture Level' : 'আর্দ্রতার মাত্রা'}: {moistureLevel}%
                  </label>
                  <div className="slider-container">
                    <span className="slider-min">0%</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={moistureLevel} 
                      onChange={(e) => setMoistureLevel(parseInt(e.target.value))}
                      className="range-slider moisture-slider"
                    />
                    <span className="slider-max">100%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>{language === 'english' ? 'Location (Optional)' : 'অবস্থান (ঐচ্ছিক)'}</label>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={language === 'english' ? 'e.g. North field' : 'যেমন উত্তর ক্ষেত্র'}
                    className="location-input"
                  />
                </div>

                <div className="advanced-toggle">
                  <button 
                    className="toggle-button"
                    onClick={toggleAdvancedOptions}
                  >
                    {showAdvancedOptions ? '🔽' : '▶️'} 
                    {language === 'english' ? 'Advanced Options' : 'উন্নত বিকল্প'}
                  </button>
                </div>

                {showAdvancedOptions && (
                  <div className="advanced-options">
                    <div className="nutrient-sliders">
                      <div className="form-group">
                        <label>
                          {language === 'english' ? '🌿 Nitrogen (N)' : '🌿 নাইট্রোজেন (N)'}: {nitrogenLevel}%
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={nitrogenLevel} 
                          onChange={(e) => setNitrogenLevel(parseInt(e.target.value))}
                          className="range-slider nitrogen-slider"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>
                          {language === 'english' ? '🪨 Phosphorus (P)' : '🪨 ফসফরাস (P)'}: {phosphorusLevel}%
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={phosphorusLevel} 
                          onChange={(e) => setPhosphorusLevel(parseInt(e.target.value))}
                          className="range-slider phosphorus-slider"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>
                          {language === 'english' ? '🌺 Potassium (K)' : '🌺 পটাশিয়াম (K)'}: {potassiumLevel}%
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={potassiumLevel} 
                          onChange={(e) => setPotassiumLevel(parseInt(e.target.value))}
                          className="range-slider potassium-slider"
                        />
                      </div>
                    </div>
                  </div>
                )}

{saveMessage && (
                  <div className="success-message">
                    {saveMessage}
                  </div>
                )}

                {saveError && (
                  <div className="error-message">
                    {saveError}
                  </div>
                )}

                <div className="analyze-button-container">
                  <button 
                    className="analyze-button"
                    onClick={analyzeSoil}
                  >
                    {language === 'english' ? '🔍 Analyze Soil' : '🔍 মাটি বিশ্লেষণ করুন'}
                  </button>
                </div>
              </div>
            </div>

            {recommendations && (
              <div className="recommendations-card">
                <div className="card-header">
                  <h2>{language === 'english' ? '🌱 Recommendations' : '🌱 সুপারিশ'}</h2>
                </div>
                <div className="recommendation-content">
                  <div className="recommendation-section">
                    <h3>{language === 'english' ? '🌽 Recommended Crops' : '🌽 সুপারিশকৃত ফসল'}</h3>
                    <ul className="recommendation-list">
                      {recommendations.crops.map((crop, index) => (
                        <li key={index}>{crop}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="recommendation-section">
                    <h3>{language === 'english' ? '🧪 Fertilizer Recommendations' : '🧪 সার সুপারিশ'}</h3>
                    <ul className="recommendation-list">
                      {recommendations.fertilizers.map((fertilizer, index) => (
                        <li key={index}>{fertilizer}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="recommendation-section">
                    <h3>{language === 'english' ? '💧 Irrigation Tips' : '💧 সেচ টিপস'}</h3>
                    <ul className="recommendation-list">
                      {recommendations.irrigation.length > 0 ? (
                        recommendations.irrigation.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))
                      ) : (
                        <li>{language === 'english' ? 'Current moisture level appears adequate' : 'বর্তমান আর্দ্রতার মাত্রা যথেষ্ট বলে মনে হচ্ছে'}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {analysisHistory.length > 0 && (
              <div className="history-card">
                <div className="card-header">
                  <h2>{language === 'english' ? '📜 Analysis History' : '📜 বিশ্লেষণ ইতিহাস'}</h2>
                </div>
                <div className="history-content">
                  <div className="history-table-container">
                    <table className="history-table">
                      <thead>
                        <tr>
                          <th>{language === 'english' ? 'Date' : 'তারিখ'}</th>
                          <th>{language === 'english' ? 'Soil Type' : 'মাটির ধরন'}</th>
                          <th>{language === 'english' ? 'pH' : 'পিএইচ'}</th>
                          <th>{language === 'english' ? 'Moisture' : 'আর্দ্রতা'}</th>
                          <th>{language === 'english' ? 'Location' : 'অবস্থান'}</th>
                          <th>{language === 'english' ? 'Actions' : 'অ্যাকশন'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisHistory.map((analysis) => (
                          <tr key={analysis._id}>
                            <td>{formatDate(analysis.createdAt)}</td>
                            <td>
                              {language === 'english' 
                                ? analysis.soilType.charAt(0).toUpperCase() + analysis.soilType.slice(1) 
                                : analysis.soilType === 'sandy' 
                                  ? 'বালিময়' 
                                  : analysis.soilType === 'clay' 
                                    ? 'এঁটেল' 
                                    : analysis.soilType === 'loamy' 
                                      ? 'দোআঁশ' 
                                      : 'পলিময়'
                              }
                            </td>
                            <td>{analysis.phLevel}</td>
                            <td>{analysis.moistureLevel}%</td>
                            <td>{analysis.location || '-'}</td>
                            <td>
                              <button 
                                className="view-details-button"
                                onClick={() => navigate(`/soil-analysis/${analysis._id}`)}
                              >
                                {language === 'english' ? 'View' : 'দেখুন'}
                              </button>
                              <button 
                                className="delete-button"
                                onClick={async () => {
                                  try {
                                    const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
                                    await axios.delete(`http://localhost:5000/api/soil-data/${analysis._id}`, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    await fetchSoilData(token);
                                  } catch (error) {
                                    console.error('Error deleting soil data:', error);
                                  }
                                }}
                              >
                                {language === 'english' ? 'Delete' : 'মুছুন'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalyzerPage;