import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/crop-detail.css'; // You'll need to create this file

const CropDetailPage = () => {
  const { id } = useParams();
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCropDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/crops/${id}`);
        setCrop(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crop details:', error);
        setLoading(false);
      }
    };

    fetchCropDetail();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  const handleBack = () => {
    navigate('/crops');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">Loading crop details...</div>
      </div>
    );
  }

  // Show error if crop not found
  if (!crop) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="text-3xl mb-4">⚠️</div>
        <div className="text-xl font-bold mb-2">Crop not found</div>
        <p className="mb-4">The crop you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={handleBack}
          className="back-button"
        >
          Back to Crops
        </button>
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
            <span className="breadcrumb-item" onClick={handleBack} style={{cursor: 'pointer'}}>
              {language === 'english' ? 'Crops' : 'ফসল'}
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{crop.name[language]}</span>
          </div>
          <div className="user-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            <div className="avatar">
              {/* Default avatar */}
              U
            </div>
          </div>
        </nav>

        {/* Crop Detail Content */}
        <div className="dashboard-content">
          <button onClick={handleBack} className="back-button">
            ← {language === 'english' ? 'Back to Crops' : 'ফসলে ফিরে যাও'}
          </button>
          
          <div className="crop-detail-container">
            <div className="crop-detail-header">
              <div className="crop-detail-image">
                <img src={crop.image || '/images/default-crop.jpg'} alt={crop.name[language]} />
              </div>
              <div className="crop-detail-info">
                <h1 className="crop-detail-name">{crop.name[language]}</h1>
                <div className="crop-detail-category">
                  <span className="detail-label">{language === 'english' ? 'Category:' : 'বিভাগ:'}</span>
                  <span className="detail-value">{crop.category[language]}</span>
                </div>
                <div className="crop-detail-season">
                  <span className="detail-label">{language === 'english' ? 'Growing Season:' : 'রোপণের মৌসুম:'}</span>
                  <span className="detail-value">{crop.growingSeason[language]}</span>
                </div>
                <div className="crop-detail-harvest">
                  <span className="detail-label">{language === 'english' ? 'Time to Harvest:' : 'ফসল তোলার সময়:'}</span>
                  <span className="detail-value">{crop.timeToHarvest[language]}</span>
                </div>
              </div>
            </div>
            
            <div className="crop-detail-sections">
              <div className="detail-section">
                <h2>{language === 'english' ? 'Growing Requirements' : 'চাষের প্রয়োজনীয়তা'}</h2>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-icon">💧</div>
                    <div className="detail-content">
                      <h3>{language === 'english' ? 'Water Requirements' : 'পানির প্রয়োজনীয়তা'}</h3>
                      <p>{crop.waterRequirements[language]}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon">🌱</div>
                    <div className="detail-content">
                      <h3>{language === 'english' ? 'Soil Type' : 'মাটির ধরণ'}</h3>
                      <p>{crop.soilType[language]}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon">🧪</div>
                    <div className="detail-content">
                      <h3>{language === 'english' ? 'Fertilizers' : 'সার'}</h3>
                      <p>{crop.fertilizers[language]}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h2>{language === 'english' ? 'Disease Management' : 'রোগ ব্যবস্থাপনা'}</h2>
                <div className="diseases-list">
                  {crop.commonDiseases.map((disease, index) => (
                    <div key={index} className="disease-item">
                      <h3>{disease.name[language]}</h3>
                      <p><strong>{language === 'english' ? 'Treatment:' : 'চিকিৎসা:'}</strong> {disease.treatment[language]}</p>
                    </div>
                  ))}
                </div>
                
                <div className="pest-management">
                  <h3>{language === 'english' ? 'Pest Management' : 'কীটপতঙ্গ ব্যবস্থাপনা'}</h3>
                  <p>{crop.pestManagement[language]}</p>
                </div>
              </div>
              
              <div className="detail-section">
                <h2>{language === 'english' ? 'Yield & Market Information' : 'উৎপাদন ও বাজার তথ্য'}</h2>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-icon">📊</div>
                    <div className="detail-content">
                      <h3>{language === 'english' ? 'Yield Estimate' : 'উৎপাদন অনুমান'}</h3>
                      <p>{crop.yieldEstimate[language]}</p>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon">💰</div>
                    <div className="detail-content">
                      <h3>{language === 'english' ? 'Market Value' : 'বাজার মূল্য'}</h3>
                      <p>{crop.marketValue[language]}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h2>{language === 'english' ? 'Farming Tips' : 'চাষাবাদের টিপস'}</h2>
                <div className="tips-content">
                  <div className="tips-icon">💡</div>
                  <p>{crop.tips[language]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropDetailPage;