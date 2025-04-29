import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/crops.css';
import { useAuth } from '../context/AuthContext';

const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/crops');
        setCrops(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map(crop => 
          crop.category.english
        ))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching crops:', error);
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  const handleCropClick = (crop) => {
    setSelectedCrop(crop);
  };

  const handleBackToList = () => {
    setSelectedCrop(null);
  };

  // Filter crops based on search term and category
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name[language].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || crop.category[language] === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">Loading crops...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar Component */}
      <Sidebar language={language} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-topnav">
          <div className="breadcrumb">
            <span className="breadcrumb-item">🏠 {language === 'english' ? 'Home' : 'হোম'}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{language === 'english' ? 'Crops' : 'ফসল'}</span>
            {selectedCrop && (
              <>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-item active">{selectedCrop.name[language]}</span>
              </>
            )}
          </div>
          <div className="user-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="dashboard-content">
          {!selectedCrop ? (
            // Crops Listing View
            <>
              <div className="crops-header">
                <h1>{language === 'english' ? 'Crop Directory' : 'ফসল নির্দেশিকা'}</h1>
                <p>{language === 'english' ? 'Browse all available crops and their details' : 'সমস্ত উপলব্ধ ফসল এবং তাদের বিবরণ দেখুন'}</p>
              </div>

              {/* Search and Filter */}
              <div className="crops-filters">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder={language === 'english' ? 'Search crops...' : 'ফসল অনুসন্ধান...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                
                <div className="filter-container">
                  <label className="filter-label">{language === 'english' ? 'Filter by Category:' : 'বিভাগ অনুযায়ী ফিল্টার:'}</label>
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="category-filter"
                  >
                    <option value="">{language === 'english' ? 'All Categories' : 'সব বিভাগ'}</option>
                    {categories.map(category => {
                      // Find a crop with this category to get the Bengali translation
                      const cropWithCategory = crops.find(crop => crop.category.english === category);
                      const categoryName = language === 'english' ? category : 
                        cropWithCategory ? cropWithCategory.category.bengali : category;
                      
                      return (
                        <option key={category} value={category}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Crops Grid */}
              <div className="crops-grid">
                {filteredCrops.length > 0 ? (
                  filteredCrops.map(crop => (
                    <div 
                      key={crop._id} 
                      className="crop-card" 
                      onClick={() => handleCropClick(crop)}
                    >
                      <div className="crop-image">
                        <img src={crop.image || '/images/default-crop.jpg'} alt={crop.name[language]} />
                      </div>
                      <div className="crop-info">
                        <h3 className="crop-name">{crop.name[language]}</h3>
                        <div className="crop-category">
                          <span className="category-label">{language === 'english' ? 'Category:' : 'বিভাগ:'}</span>
                          <span className="category-value">{crop.category[language]}</span>
                        </div>
                        <div className="crop-season">
                          <span className="season-label">{language === 'english' ? 'Growing Season:' : 'রোপণের মৌসুম:'}</span>
                          <span className="season-value">{crop.growingSeason[language]}</span>
                        </div>
                        <div className="crop-harvest">
                          <span className="harvest-label">{language === 'english' ? 'Time to Harvest:' : 'ফসল তোলার সময়:'}</span>
                          <span className="harvest-value">{crop.timeToHarvest[language]}</span>
                        </div>
                      </div>
                      <div className="crop-footer">
                        <button className="view-details">
                          {language === 'english' ? 'View Details' : 'বিস্তারিত দেখুন'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-crops-found">
                    <div className="no-results-icon">🔍</div>
                    <h3>{language === 'english' ? 'No crops found' : 'কোন ফসল পাওয়া যায়নি'}</h3>
                    <p>
                      {language === 'english' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'আপনার অনুসন্ধান বা ফিল্টার মানদণ্ড সামঞ্জস্য করার চেষ্টা করুন'}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Crop Detail View
            <div className="crop-detail-view">
              <button onClick={handleBackToList} className="back-button">
                ← {language === 'english' ? 'Back to Crops' : 'ফসলে ফিরে যাও'}
              </button>
              
              <div className="crop-detail-container">
                <div className="crop-detail-header">
                  <div className="crop-detail-image">
                    <img src={selectedCrop.image || '/images/default-crop.jpg'} alt={selectedCrop.name[language]} />
                  </div>
                  <div className="crop-detail-info">
                    <h1 className="crop-detail-name">{selectedCrop.name[language]}</h1>
                    <div className="crop-detail-category">
                      <span className="detail-label">{language === 'english' ? 'Category:' : 'বিভাগ:'}</span>
                      <span className="detail-value">{selectedCrop.category[language]}</span>
                    </div>
                    <div className="crop-detail-season">
                      <span className="detail-label">{language === 'english' ? 'Growing Season:' : 'রোপণের মৌসুম:'}</span>
                      <span className="detail-value">{selectedCrop.growingSeason[language]}</span>
                    </div>
                    <div className="crop-detail-harvest">
                      <span className="detail-label">{language === 'english' ? 'Time to Harvest:' : 'ফসল তোলার সময়:'}</span>
                      <span className="detail-value">{selectedCrop.timeToHarvest[language]}</span>
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
                          <p>{selectedCrop.waterRequirements[language]}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">🌱</div>
                        <div className="detail-content">
                          <h3>{language === 'english' ? 'Soil Type' : 'মাটির ধরণ'}</h3>
                          <p>{selectedCrop.soilType[language]}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">🧪</div>
                        <div className="detail-content">
                          <h3>{language === 'english' ? 'Fertilizers' : 'সার'}</h3>
                          <p>{selectedCrop.fertilizers[language]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h2>{language === 'english' ? 'Disease Management' : 'রোগ ব্যবস্থাপনা'}</h2>
                    <div className="diseases-list">
                      {selectedCrop.commonDiseases.map((disease, index) => (
                        <div key={index} className="disease-item">
                          <h3>{disease.name[language]}</h3>
                          <p><strong>{language === 'english' ? 'Treatment:' : 'চিকিৎসা:'}</strong> {disease.treatment[language]}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pest-management">
                      <h3>{language === 'english' ? 'Pest Management' : 'কীটপতঙ্গ ব্যবস্থাপনা'}</h3>
                      <p>{selectedCrop.pestManagement[language]}</p>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h2>{language === 'english' ? 'Yield & Market Information' : 'উৎপাদন ও বাজার তথ্য'}</h2>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-icon">📊</div>
                        <div className="detail-content">
                          <h3>{language === 'english' ? 'Yield Estimate' : 'উৎপাদন অনুমান'}</h3>
                          <p>{selectedCrop.yieldEstimate[language]}</p>
                        </div>
                      </div>
                      <div className="detail-item">
                        <div className="detail-icon">💰</div>
                        <div className="detail-content">
                          <h3>{language === 'english' ? 'Market Value' : 'বাজার মূল্য'}</h3>
                          <p>{selectedCrop.marketValue[language]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h2>{language === 'english' ? 'Farming Tips' : 'চাষাবাদের টিপস'}</h2>
                    <div className="tips-content">
                      <div className="tips-icon">💡</div>
                      <p>{selectedCrop.tips[language]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropsPage;