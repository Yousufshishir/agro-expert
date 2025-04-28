import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import '../styles/crops.css'; // You'll need to create this file

const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  const handleCropClick = (cropId) => {
    navigate(`/crops/${cropId}`);
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
      {/* Import Sidebar Component */}
      <Sidebar language={language} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-topnav">
          <div className="breadcrumb">
            <span className="breadcrumb-item">🏠 {language === 'english' ? 'Home' : 'হোম'}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{language === 'english' ? 'Crops' : 'ফসল'}</span>
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

        {/* Crops Content */}
        <div className="dashboard-content">
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
                {categories.map(category => (
                  <option key={category} value={category}>{language === 'english' ? category : ''}</option>
                ))}
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
                  onClick={() => handleCropClick(crop._id)}
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
        </div>
      </div>
    </div>
  );
};

export default CropsPage;