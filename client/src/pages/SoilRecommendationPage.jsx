import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/recommendationPage.css';
import Sidebar from '../components/Sidebar';

const SoilRecommendationPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english');
  const navigate = useNavigate();
  const { id } = useParams();
  const [soilData, setSoilData] = useState(null);
  const [suggestedCrops, setSuggestedCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropDetails, setCropDetails] = useState(null);
  const [cropLoading, setCropLoading] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && user.token) {  
          setUserData(user);
          await fetchSoilAnalysis(user.token);
          setLoading(false);
          return;
        }
    
        const userInfo = localStorage.getItem('userInfo');
        
        if (!userInfo) {
          console.log("No authentication data found in localStorage");
          navigate('/login');
          return;
        }
    
        const parsedInfo = JSON.parse(userInfo);
        const token = parsedInfo.token;
    
        const res = await axios.get(`http://localhost:5000/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        setUserData(res.data);
        await fetchSoilAnalysis(token);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, user, id]);

  useEffect(() => {
    if (soilData) {
      generateCropRecommendations();
    }
  }, [soilData]);

  const fetchSoilAnalysis = async (token) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/soil-data/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSoilData(data);
    } catch (error) {
      console.error('Error fetching soil analysis data:', error);
    }
  };

  const generateCropRecommendations = async () => {
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      const { data: crops } = await axios.get('http://localhost:5000/api/crops', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let matchedCrops = [];
      
      if (crops && crops.length > 0) {
        matchedCrops = crops.filter(crop => {
          const soilTypeMatch = crop.soilType.english.toLowerCase().includes(soilData.soilType.toLowerCase());
          let phMatch = true;
          const ph = parseFloat(soilData.phLevel);
          
          if (ph < 5.5) {
            phMatch = crop.soilType.english.toLowerCase().includes('acidic');
          } else if (ph > 7.5) {
            phMatch = crop.soilType.english.toLowerCase().includes('alkaline');
          }
          
          let moistureMatch = true;
          const moisture = parseFloat(soilData.moistureLevel);
          
          if (moisture < 30) {
            moistureMatch = crop.waterRequirements.english.toLowerCase().includes('low');
          } else if (moisture > 70) {
            moistureMatch = crop.waterRequirements.english.toLowerCase().includes('high');
          }
          
          return soilTypeMatch || (phMatch && moistureMatch);
        });
        
        if (matchedCrops.length === 0) {
          matchedCrops = crops.slice(0, 5);
        } else if (matchedCrops.length > 10) {
          matchedCrops = matchedCrops.slice(0, 10);
        }
      }
      
      setSuggestedCrops(matchedCrops);
    } catch (error) {
      console.error('Error generating crop recommendations:', error);
    }
  };

  const fetchCropDetails = async (cropId) => {
    setCropLoading(true);
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      const { data } = await axios.get(`http://localhost:5000/api/crops/${cropId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCropDetails(data);
      setSelectedCrop(cropId);
      setCropLoading(false);
    } catch (error) {
      console.error('Error fetching crop details:', error);
      setCropLoading(false);
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

  const handleBackToAnalyzer = () => {
    navigate('/soil-analyzer');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleCloseCropDetails = () => {
    setCropDetails(null);
    setSelectedCrop(null);
  };

  if (loading) {
    return (
      <div id="loading-container">
        <div id="loading-spinner"></div>
        <div id="loading-text">{language === 'english' ? 'Loading recommendations...' : 'সুপারিশ লোড হচ্ছে...'}</div>
      </div>
    );
  }

  return (
    <div id="recommendation-page-container">
      <Sidebar language={language} handleLogout={handleLogout} />

      <div id="recommendation-main-content">
        <nav id="recommendation-top-nav">
          <div id="breadcrumb-container">
            <span id="home-breadcrumb">{language === 'english' ? 'Home' : 'হোম'}</span>
            <span id="breadcrumb-separator">/</span>
            <span id="analyzer-breadcrumb" onClick={handleBackToAnalyzer}>
              {language === 'english' ? 'Soil Analyzer' : 'মাটি বিশ্লেষক'}
            </span>
            <span id="breadcrumb-separator">/</span>
            <span id="recommendation-breadcrumb">
              {language === 'english' ? 'Recommendations' : 'সুপারিশ'}
            </span>
          </div>
          <div id="user-controls-container">
            <button id="language-toggle-btn" onClick={toggleLanguage}>
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div id="notification-icon">🔔</div>
            <div id="user-avatar">
              {userData && userData.profileImage ? (
                <img src={userData.profileImage} alt={userData.name} />
              ) : (
                userData && userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
          </div>
        </nav>

        <div id="recommendation-content-container">
          <div id="recommendation-header">
            <h1 id="recommendation-title">
              {language === 'english' ? '🌱 Soil Analysis Details' : '🌱 মাটি বিশ্লেষণের বিবরণ'}
            </h1>
            <p id="recommendation-subtitle">
              {language === 'english' 
                ? 'Detailed information about your soil analysis' 
                : 'আপনার মাটি বিশ্লেষণের বিস্তারিত তথ্য'}
            </p>
          </div>

          <div id="soil-data-container">
            {soilData ? (
              <>
                <div id="soil-basic-info-card" className="recommendation-card">
                  <div id="soil-info-header">
                    <h2>{language === 'english' ? '📊 Basic Soil Information' : '📊 মূল মাটির তথ্য'}</h2>
                  </div>
                  <div id="soil-info-content">
                    <div id="soil-data-grid">
                      <div id="soil-type-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Type:' : 'মাটির ধরন:'}</span>
                        <span className="data-value">{soilData.soilType}</span>
                      </div>
                      <div id="ph-level-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'pH Level:' : 'পিএইচ মাত্রা:'}</span>
                        <span className="data-value">{soilData.phLevel}</span>
                      </div>
                      <div id="moisture-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Moisture Level:' : 'আর্দ্রতা মাত্রা:'}</span>
                        <span className="data-value">{soilData.moistureLevel}%</span>
                      </div>
                      <div id="organic-matter-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Organic Matter:' : 'জৈব পদার্থ:'}</span>
                        <span className="data-value">{soilData.organicMatter}%</span>
                      </div>
                      <div id="soil-temp-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Temperature:' : 'মাটির তাপমাত্রা:'}</span>
                        <span className="data-value">{soilData.soilTemp}°C</span>
                      </div>
                      <div id="soil-depth-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Depth:' : 'মাটির গভীরতা:'}</span>
                        <span className="data-value">{soilData.soilDepth} cm</span>
                      </div>
                      <div id="soil-color-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Soil Color:' : 'মাটির রং:'}</span>
                        <div id="color-sample" style={{ backgroundColor: soilData.soilColor }}></div>
                      </div>
                      <div id="weather-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Weather Condition:' : 'আবহাওয়া অবস্থা:'}</span>
                        <span className="data-value">{soilData.weatherCondition}</span>
                      </div>
                      <div id="location-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Location:' : 'অবস্থান:'}</span>
                        <span className="data-value">{soilData.location || 'Not specified'}</span>
                      </div>
                      <div id="date-item" className="data-item">
                        <span className="data-label">{language === 'english' ? 'Analysis Date:' : 'বিশ্লেষণের তারিখ:'}</span>
                        <span className="data-value">{formatDate(soilData.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="nutrient-levels-card" className="recommendation-card">
                  <div id="nutrient-header">
                    <h2>{language === 'english' ? '🧪 Nutrient Levels' : '🧪 পুষ্টি মাত্রা'}</h2>
                  </div>
                  <div id="nutrient-content">
                    <div id="nutrient-grid">
                      <div id="nitrogen-item" className="nutrient-item">
                        <span className="nutrient-label">{language === 'english' ? 'Nitrogen (N):' : 'নাইট্রোজেন (N):'}</span>
                        <div className="nutrient-bar-container">
                          <div className="nutrient-bar" style={{ width: `${soilData.nutrients.nitrogen}%`, backgroundColor: '#4CAF50' }}></div>
                        </div>
                        <span className="nutrient-value">{soilData.nutrients.nitrogen}%</span>
                      </div>
                      <div id="phosphorus-item" className="nutrient-item">
                        <span className="nutrient-label">{language === 'english' ? 'Phosphorus (P):' : 'ফসফরাস (P):'}</span>
                        <div className="nutrient-bar-container">
                          <div className="nutrient-bar" style={{ width: `${soilData.nutrients.phosphorus}%`, backgroundColor: '#2196F3' }}></div>
                        </div>
                        <span className="nutrient-value">{soilData.nutrients.phosphorus}%</span>
                      </div>
                      <div id="potassium-item" className="nutrient-item">
                        <span className="nutrient-label">{language === 'english' ? 'Potassium (K):' : 'পটাসিয়াম (K):'}</span>
                        <div className="nutrient-bar-container">
                          <div className="nutrient-bar" style={{ width: `${soilData.nutrients.potassium}%`, backgroundColor: '#FF9800' }}></div>
                        </div>
                        <span className="nutrient-value">{soilData.nutrients.potassium}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {soilData.notes && (
                  <div id="notes-card" className="recommendation-card">
                    <div id="notes-header">
                      <h2>{language === 'english' ? '📝 Notes' : '📝 নোট'}</h2>
                    </div>
                    <div id="notes-content">
                      <p id="notes-text">{soilData.notes}</p>
                    </div>
                  </div>
                )}

                <div id="crop-recommendations-card" className="recommendation-card">
                  <div id="crop-recommendations-header">
                    <h2>{language === 'english' ? '🌾 Recommended Crops' : '🌾 সুপারিশকৃত ফসল'}</h2>
                  </div>
                  <div id="crop-recommendations-content">
                    {suggestedCrops.length > 0 ? (
                      <div id="crop-recommendations-container">
                        <p id="recommendation-intro-text">
                          {language === 'english' 
                            ? 'Based on your soil analysis, these crops are recommended for optimal growth:' 
                            : 'আপনার মাটি বিশ্লেষণের উপর ভিত্তি করে, এই ফসলগুলি সেরা উত্পাদনের জন্য সুপারিশ করা হয়েছে:'}
                        </p>
                        <div id="crop-list-container">
                          {suggestedCrops.map(crop => (
                            <div 
                              key={crop._id} 
                              id={`crop-item-${crop._id}`}
                              className={`crop-item ${selectedCrop === crop._id ? 'selected' : ''}`} 
                              onClick={() => fetchCropDetails(crop._id)}
                            >
                              <div id={`crop-image-${crop._id}`} className="crop-image">
                                <img src={crop.image} alt={language === 'english' ? crop.name.english : crop.name.bengali} />
                              </div>
                              <div id={`crop-name-${crop._id}`} className="crop-name">
                                {language === 'english' ? crop.name.english : crop.name.bengali}
                              </div>
                              <div id={`crop-category-${crop._id}`} className="crop-category">
                                {language === 'english' ? crop.category.english : crop.category.bengali}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div id="no-crops-message">
                        {language === 'english' 
                          ? 'Loading crop recommendations...' 
                          : 'ফসল সুপারিশ লোড হচ্ছে...'}
                      </div>
                    )}
                  </div>
                </div>

                {/* <div id="analysis-details-card" className="recommendation-card">
                  <div id="analysis-details-header">
                    <h2>{language === 'english' ? '🔍 Soil Analysis Details' : '🔍 মাটি বিশ্লেষণ বিবরণ'}</h2>
                  </div>
                  <div id="analysis-details-content">
                    <div id="analysis-id-container">
                      <span id="analysis-id-label">{language === 'english' ? 'Analysis ID:' : 'বিশ্লেষণ আইডি:'}</span>
                      <span id="analysis-id-value">{soilData._id}</span>
                    </div>
                  </div>
                </div> */}
              </>
            ) : (
              <div id="no-data-message">
                {language === 'english' 
                  ? 'No soil analysis data found for this ID. Please try another analysis or return to the analyzer page.' 
                  : 'এই আইডির জন্য কোন মাটি বিশ্লেষণ ডেটা পাওয়া যায়নি। অন্য বিশ্লেষণ চেষ্টা করুন বা বিশ্লেষক পৃষ্ঠায় ফিরে যান।'}
              </div>
            )}
            
            <div id="action-buttons-container">
              <button 
                id="back-button"
                onClick={handleBackToAnalyzer} 
              >
                {language === 'english' ? '← Back to Soil Analyzer' : '← মাটি বিশ্লেষকে ফিরে যান'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {cropDetails && (
        <div id="crop-details-modal">
          <div id="modal-content-container">
            <div id="modal-header-container">
              <h2 id="modal-title">{language === 'english' ? cropDetails.name.english : cropDetails.name.bengali}</h2>
              <button id="modal-close-button" onClick={handleCloseCropDetails}>×</button>
            </div>
            <div id="modal-body-container">
              {cropLoading ? (
                <div id="modal-loading-spinner">Loading crop details...</div>
              ) : (
                <div id="crop-details-content">
                  <div id="modal-crop-image">
                    <img src={cropDetails.image} alt={language === 'english' ? cropDetails.name.english : cropDetails.name.bengali} />
                  </div>
                  
                  <div id="crop-info-grid-container">
                    <div id="category-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Category:' : 'বিভাগ:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.category.english : cropDetails.category.bengali}</span>
                    </div>
                    <div id="season-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Growing Season:' : 'উৎপাদন মৌসুম:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.growingSeason.english : cropDetails.growingSeason.bengali}</span>
                    </div>
                    <div id="water-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Water Requirements:' : 'পানির প্রয়োজনীয়তা:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.waterRequirements.english : cropDetails.waterRequirements.bengali}</span>
                    </div>
                    <div id="soil-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Soil Type:' : 'মাটির ধরন:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.soilType.english : cropDetails.soilType.bengali}</span>
                    </div>
                    <div id="harvest-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Time to Harvest:' : 'ফসল কাটার সময়:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.timeToHarvest.english : cropDetails.timeToHarvest.bengali}</span>
                    </div>
                    <div id="fertilizer-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Fertilizers:' : 'সার:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.fertilizers.english : cropDetails.fertilizers.bengali}</span>
                    </div>
                    <div id="pest-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Pest Management:' : 'কীটপতঙ্গ ব্যবস্থাপনা:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.pestManagement.english : cropDetails.pestManagement.bengali}</span>
                    </div>
                    <div id="yield-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Yield Estimate:' : 'ফলন অনুমান:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.yieldEstimate.english : cropDetails.yieldEstimate.bengali}</span>
                    </div>
                    <div id="market-info-item" className="crop-info-item">
                      <span className="info-label">{language === 'english' ? 'Market Value:' : 'বাজার মূল্য:'}</span>
                      <span className="info-value">{language === 'english' ? cropDetails.marketValue.english : cropDetails.marketValue.bengali}</span>
                    </div>
                  </div>
                  
                  <div id="diseases-section">
                    <h3>{language === 'english' ? 'Common Diseases' : 'সাধারণ রোগ'}</h3>
                    <div id="diseases-list-container">
                      {cropDetails.commonDiseases.map((disease, index) => (
                        <div key={index} id={`disease-item-${index}`} className="disease-item">
                          <div id={`disease-name-${index}`} className="disease-name">
                            {language === 'english' ? disease.name.english : disease.name.bengali}
                          </div>
                          <div id={`disease-treatment-${index}`} className="disease-treatment">
                            {language === 'english' ? disease.treatment.english : disease.treatment.bengali}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div id="tips-section">
                    <h3>{language === 'english' ? 'Growing Tips' : 'চাষের টিপস'}</h3>
                    <p id="tips-text">{language === 'english' ? cropDetails.tips.english : cropDetails.tips.bengali}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilRecommendationPage;