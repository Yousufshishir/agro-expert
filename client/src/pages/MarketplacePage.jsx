// client/src/pages/MarketplacePage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/marketplace.css'; // This will be created separately
import Sidebar from '../components/Sidebar';

const MarketplacePage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByPrice, setFilterByPrice] = useState('');
  const navigate = useNavigate();

  // Product categories
  const categories = [
    { id: 'all', name: { english: 'All Products', bengali: 'সমস্ত পণ্য' } },
    { id: 'seeds', name: { english: 'Seeds', bengali: 'বীজ' } },
    { id: 'fertilizers', name: { english: 'Fertilizers', bengali: 'সার' } },
    { id: 'pesticides', name: { english: 'Pesticides', bengali: 'কীটনাশক' } },
    { id: 'tools', name: { english: 'Tools & Equipment', bengali: 'যন্ত্রপাতি' } },
    { id: 'irrigation', name: { english: 'Irrigation Systems', bengali: 'সেচ ব্যবস্থা' } },
    { id: 'organic', name: { english: 'Organic Products', bengali: 'জৈব পণ্য' } }
  ];

  // Mock product data - this would normally come from an API
  const productData = [
    {
      id: 1,
      name: { english: 'Premium Rice Seeds', bengali: 'প্রিমিয়াম চাল বীজ' },
      category: 'seeds',
      price: 250,
      image: 'https://i.ibb.co.com/nNCSQQzd/rice.jpg',
      rating: 4.8,
      link: 'https://agriculturalproducts.com/seeds/rice',
      description: { 
        english: 'High-yield rice seeds suitable for various soil types with disease resistance.', 
        bengali: 'বিভিন্ন মাটিতে চাষের উপযোগী উচ্চ ফলনশীল চাল বীজ যা রোগ প্রতিরোধী।' 
      }
    },
    {
      id: 2,
      name: { english: 'Organic Compost Fertilizer', bengali: 'জৈব কম্পোস্ট সার' },
      category: 'fertilizers',
      price: 450,
      image: 'https://i.ibb.co.com/5gccCKsv/Compost.jpg',
      rating: 4.5,
      link: 'https://agriculturalproducts.com/fertilizers/organic-compost',
      description: { 
        english: 'Natural compost fertilizer for all types of crops. Improves soil health.', 
        bengali: 'সব ধরনের ফসলের জন্য প্রাকৃতিক কম্পোস্ট সার। মাটির স্বাস্থ্য উন্নত করে।' 
      }
    },
    {
      id: 3,
      name: { english: 'Bio-Pesticide Spray', bengali: 'জৈব কীটনাশক স্প্রে' },
      category: 'pesticides',
      price: 350,
      image: 'https://i.ibb.co.com/gM23KKRT/biokill.jpg',
      rating: 4.2,
      link: 'https://agriculturalproducts.com/pesticides/bio',
      description: { 
        english: 'Environmentally friendly pesticide that targets harmful insects while being safe for beneficial ones.', 
        bengali: 'পরিবেশ বান্ধব কীটনাশক যা ক্ষতিকারক কীটপতঙ্গ নিয়ন্ত্রণ করে এবং উপকারী পোকামাকড়ের জন্য নিরাপদ।' 
      }
    },
    {
      id: 4,
      name: { english: 'Manual Weeder Tool', bengali: 'হাতে চালিত আগাছা নির্মূলকারী যন্ত্র' },
      category: 'tools',
      price: 550,
      image: 'https://i.ibb.co.com/LhnZT0Vg/weeder.jpg',
      rating: 4.3,
      link: 'https://agriculturalproducts.com/tools/weeder',
      description: { 
        english: 'Ergonomic manual weeding tool for efficient weed removal without chemicals.', 
        bengali: 'রাসায়নিক ছাড়া দক্ষতার সাথে আগাছা অপসারণের জন্য এর্গোনোমিক হাতের যন্ত্র।' 
      }
    },
    {
      id: 5,
      name: { english: 'Drip Irrigation Kit', bengali: 'ড্রিপ সেচ কিট' },
      category: 'irrigation',
      price: 1200,
      image: 'https://i.ibb.co.com/ycTpLXV6/dripKit.jpg',
      rating: 4.7,
      link: 'https://agriculturalproducts.com/irrigation/drip-kit',
      description: { 
        english: 'Water-efficient drip irrigation system suitable for small to medium farms.', 
        bengali: 'ছোট থেকে মাঝারি খামারের জন্য উপযুক্ত পানি-দক্ষ ড্রিপ সেচ ব্যবস্থা।' 
      }
    },
    {
      id: 6,
      name: { english: 'Wheat Seeds', bengali: 'গম বীজ' },
      category: 'seeds',
      price: 300,
      image: 'https://i.ibb.co.com/NgswLM5G/wheat.jpg',
      rating: 4.4,
      link: 'https://agriculturalproducts.com/seeds/wheat',
      description: { 
        english: 'High-quality wheat seeds with improved disease resistance and yield.', 
        bengali: 'উন্নত রোগ প্রতিরোধ ক্ষমতা এবং ফলনশীল উচ্চ মানের গম বীজ।' 
      }
    },
    {
      id: 7,
      name: { english: 'NPK Fertilizer', bengali: 'এনপিকে সার' },
      category: 'fertilizers',
      price: 520,
      image: 'https://i.ibb.co.com/4nTCQPV0/NPK.jpg',
      rating: 4.6,
      link: 'https://agriculturalproducts.com/fertilizers/npk',
      description: { 
        english: 'Balanced NPK formulation for healthy crop growth and improved yield.', 
        bengali: 'সুস্থ ফসল বৃদ্ধি এবং উন্নত ফলনের জন্য ভারসাম্যপূর্ণ এনপিকে সার।' 
      }
    },
    {
      id: 8,
      name: { english: 'Organic Neem Oil', bengali: 'জৈব নিম তেল' },
      category: 'organic',
      price: 380,
      image: 'https://i.ibb.co.com/G4m99pwm/Neeem.jpg',
      rating: 4.9,
      link: 'https://agriculturalproducts.com/organic/neem-oil',
      description: { 
        english: 'Natural pest repellent and plant health promoter extracted from neem seeds.', 
        bengali: 'নিম বীজ থেকে নিষ্কাশিত প্রাকৃতিক কীটপতঙ্গ প্রতিরোধক এবং উদ্ভিদ স্বাস্থ্য উন্নতকারী।' 
      }
    },
    {
      id: 9,
      name: { english: 'Garden Sprayer', bengali: 'বাগান স্প্রেয়ার' },
      category: 'tools',
      price: 650,
      image: 'https://i.ibb.co.com/Wv0bzq1s/sprayer.jpg',
      rating: 4.1,
      link: 'https://agriculturalproducts.com/tools/sprayer',
      description: { 
        english: 'Durable and easy-to-use garden sprayer for pesticide and fertilizer application.', 
        bengali: 'কীটনাশক এবং সার প্রয়োগের জন্য টেকসই এবং ব্যবহারে সহজ বাগান স্প্রেয়ার।' 
      }
    },
    {
      id: 10,
      name: { english: 'Rainwater Harvesting System', bengali: 'বৃষ্টির পানি সংরক্ষণ ব্যবস্থা' },
      category: 'irrigation',
      price: 3500,
      image: 'https://i.ibb.co.com/zVT28MSd/rain-Water.jpg',
      rating: 4.8,
      link: 'https://agriculturalproducts.com/irrigation/rainwater',
      description: { 
        english: 'Complete system to collect, filter and store rainwater for irrigation use.', 
        bengali: 'সেচের জন্য বৃষ্টির পানি সংগ্রহ, ফিল্টারিং এবং সংরক্ষণের সম্পূর্ণ ব্যবস্থা।' 
      }
    },
    {
      id: 11,
      name: { english: 'Vegetable Seeds Combo', bengali: 'শাকসবজি বীজ কম্বো' },
      category: 'seeds',
      price: 480,
      image: 'https://i.ibb.co.com/Jj0bdcJj/combo.jpg',
      rating: 4.5,
      link: 'https://agriculturalproducts.com/seeds/vegetable-combo',
      description: { 
        english: 'Variety pack of high-quality vegetable seeds for home gardens.', 
        bengali: 'বাড়ির বাগানের জন্য উচ্চ মানের শাকসবজি বীজের বৈচিত্র্যপূর্ণ প্যাক।' 
      }
    },
    {
      id: 12,
      name: { english: 'Soil pH Testing Kit', bengali: 'মাটির পিএইচ পরীক্ষার কিট' },
      category: 'tools',
      price: 280,
      image: 'https://i.ibb.co.com/7t4NMM1B/soilPh.jpg',
      rating: 4.2,
      link: 'https://agriculturalproducts.com/tools/ph-tester',
      description: { 
        english: 'Accurate soil pH testing kit for better soil health management.', 
        bengali: 'উন্নত মাটির স্বাস্থ্য ব্যবস্থাপনার জন্য নির্ভুল মাটির পিএইচ পরীক্ষার কিট।' 
      }
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user && user.token) {  
          setUserData(user);
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  // Filter products based on active category, search term, and price filter
  const filteredProducts = productData.filter(product => {
    // Category filter
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    
    // Search filter
    const searchMatch = product.name[language].toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.description[language].toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    let priceMatch = true;
    if (filterByPrice === 'low') {
      priceMatch = product.price < 300;
    } else if (filterByPrice === 'medium') {
      priceMatch = product.price >= 300 && product.price < 500;
    } else if (filterByPrice === 'high') {
      priceMatch = product.price >= 500;
    }
    
    return categoryMatch && searchMatch && priceMatch;
  });

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">
          {language === 'english' ? 'Loading marketplace...' : 'বাজার লোড হচ্ছে...'}
        </div>
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
            <span className="breadcrumb-item active">
              {language === 'english' ? 'Marketplace' : 'বাজার'}
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

        {/* Marketplace Content */}
        <div className="dashboard-content">
          <div className="marketplace-header">
            <h1 className="page-title">
              {language === 'english' ? '🛒 Agricultural Marketplace' : '🛒 কৃষি বাজার'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? 'Find and purchase high-quality agricultural products from trusted suppliers' 
                : 'বিশ্বস্ত সরবরাহকারীদের কাছ থেকে উচ্চ মানের কৃষি পণ্য খুঁজুন এবং কিনুন'}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="marketplace-controls">
            <div className="search-container">
              <input 
                type="text" 
                placeholder={language === 'english' ? 'Search products...' : 'পণ্য অনুসন্ধান করুন...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {/* <button className="search-button">🔍</button> */}
            </div>
            
            <div className="filter-container">
              <select 
                className="price-filter"
                value={filterByPrice}
                onChange={(e) => setFilterByPrice(e.target.value)}
              >
                <option value="">
                  {language === 'english' ? '-- Filter by Price --' : '-- মূল্য অনুযায়ী ফিল্টার --'}
                </option>
                <option value="low">
                  {language === 'english' ? 'Low (< ৳300)' : 'কম (< ৳৩০০)'}
                </option>
                <option value="medium">
                  {language === 'english' ? 'Medium (৳300 - ৳500)' : 'মাঝারি (৳৩০০ - ৳৫০০)'}
                </option>
                <option value="high">
                  {language === 'english' ? 'High (> ৳500)' : 'বেশি (> ৳৫০০)'}
                </option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="marketplace-categories">
            {categories.map(category => (
              <button 
                key={category.id}
                className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name[language]}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="marketplace-content">
            {filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name[language]} className="product-image" />
                      <div className="product-rating">
                        <span className="star">★</span>
                        <span className="rating-value">{product.rating}</span>
                      </div>
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">{product.name[language]}</h3>
                      <p className="product-description">{product.description[language]}</p>
                      <div className="product-price-action">
                        <span className="product-price">৳{product.price}</span>
                        <a 
                          href={product.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="buy-button"
                        >
                          {language === 'english' ? 'Buy Now' : 'এখনই কিনুন'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products-message">
                {language === 'english' 
                  ? 'No products found matching your criteria. Please try a different search or filter.' 
                  : 'আপনার মানদণ্ড অনুযায়ী কোন পণ্য পাওয়া যায়নি। অনুগ্রহ করে আলাদা অনুসন্ধান বা ফিল্টার চেষ্টা করুন।'}
              </div>
            )}
          </div>
          
          {/* Featured Suppliers */}
          <div className="marketplace-suppliers">
            <h2 className="section-title">
              {language === 'english' ? '🌟 Featured Suppliers' : '🌟 বিশেষ সরবরাহকারী'}
            </h2>
            <div className="suppliers-grid">
              <a href="https://aci-bd.com/agribusinesses.php" target="_blank" rel="noopener noreferrer" className="supplier-card">
                <div className="supplier-logo">ACI</div>
                <div className="supplier-name">
                  {language === 'english' ? 'ACI Agribusiness' : 'এসিআই এগ্রিবিজনেস'}
                </div>
              </a>
              <a href="https://www.naafcobd.com/" target="_blank" rel="noopener noreferrer" className="supplier-card">
                <div className="supplier-logo">NF</div>
                <div className="supplier-name">
                  {language === 'english' ? 'NAAFCO Agro' : 'নাফকো এগ্রো'}
                </div>
              </a>
              <a href="https://www.supremeseeds.com/" target="_blank" rel="noopener noreferrer" className="supplier-card">
                <div className="supplier-logo">SS</div>
                <div className="supplier-name">
                  {language === 'english' ? 'Supreme Seeds' : 'সুপ্রিম সীডস'}
                </div>
              </a>
              <a href="https://www.lalbagh.com/" target="_blank" rel="noopener noreferrer" className="supplier-card">
                <div className="supplier-logo">LG</div>
                <div className="supplier-name">
                  {language === 'english' ? 'Lal Teer Seed' : 'লাল টীর সীড'}
                </div>
              </a>
            </div>
          </div>
          
          {/* Promotional Banner */}
          <div className="promo-banner">
            <div className="promo-content">
              <h3 className="promo-title">
                {language === 'english' ? 'Special Discount!' : 'বিশেষ ছাড়!'}
              </h3>
              <p className="promo-text">
                {language === 'english' 
                  ? 'Get 15% off on all organic products until May 15, 2025. Use code: ORGANIC15' 
                  : 'মে ১৫, ২০২৫ পর্যন্ত সমস্ত জৈব পণ্যে ১৫% ছাড় পান। কোড ব্যবহার করুন: ORGANIC15'}
              </p>
              <button className="promo-button">
                {language === 'english' ? 'Shop Now' : 'এখনই কিনুন'}
              </button>
            </div>
          </div>
          
          {/* Market Tips */}
          <div className="market-tips">
            <h2 className="section-title">
              {language === 'english' ? '💡 Farming Product Tips' : '💡 কৃষি পণ্য টিপস'}
            </h2>
            <div className="tips-container">
              <div className="tip-card">
                <div className="tip-icon">🌱</div>
                <h3 className="tip-title">
                  {language === 'english' ? 'Choosing Seeds' : 'বীজ নির্বাচন'}
                </h3>
                <p className="tip-text">
                  {language === 'english' 
                    ? 'Always check germination rate and expiry date when purchasing seeds.' 
                    : 'বীজ কেনার সময় সর্বদা অঙ্কুরোদগম হার এবং মেয়াদ শেষ তারিখ যাচাই করুন।'}
                </p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🧪</div>
                <h3 className="tip-title">
                  {language === 'english' ? 'Fertilizer Tips' : 'সার টিপস'}
                </h3>
                <p className="tip-text">
                  {language === 'english' 
                    ? 'Use soil test results to determine the right fertilizer for your specific needs.' 
                    : 'আপনার নির্দিষ্ট প্রয়োজন অনুযায়ী সঠিক সার নির্ধারণ করতে মাটি পরীক্ষার ফলাফল ব্যবহার করুন।'}
                </p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🛠️</div>
                <h3 className="tip-title">
                  {language === 'english' ? 'Tool Maintenance' : 'যন্ত্রপাতি রক্ষণাবেক্ষণ'}
                </h3>
                <p className="tip-text">
                  {language === 'english' 
                    ? 'Clean and oil your tools regularly to extend their lifespan and performance.' 
                    : 'আপনার যন্ত্রপাতির আয়ু এবং কার্যক্ষমতা বাড়াতে নিয়মিত পরিষ্কার এবং তেল দিন।'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;