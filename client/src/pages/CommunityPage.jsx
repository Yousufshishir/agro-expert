// client/src/pages/CommunityPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/community.css';
import Sidebar from '../components/Sidebar';

const CommunityPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    currentCrops: [],
    plannedCrops: [],
    farmingMethod: 'conventional',
    farmSize: 'small',
    farmingExperience: 'beginner',
    challenges: [],
    preferredAssistance: [],
    notes: '',
    improvementSuggestions: '',
    farmingArea: '',
    preferredCommunication: 'app'
  });
  
  // Success message state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if user data is already available in AuthContext
        if (user && user.token) {  
          setUserData(user);
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
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (checked) {
      setFormData({
        ...formData,
        [name]: [...formData[name], value]
      });
    } else {
      setFormData({
        ...formData,
        [name]: formData[name].filter(item => item !== value)
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      if (!token) {
        setErrorMessage(language === 'english' ? 'Authentication error. Please login again.' : 'প্রমাণীকরণ ত্রুটি। অনুগ্রহ করে আবার লগইন করুন।');
        return;
      }
      
      const response = await axios.post(
        'http://localhost:5000/api/community/feedback',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.status === 201) {
        // Clear form
        setFormData({
          currentCrops: [],
          plannedCrops: [],
          farmingMethod: 'conventional',
          farmSize: 'small',
          farmingExperience: 'beginner',
          challenges: [],
          preferredAssistance: [],
          notes: '',
          improvementSuggestions: '',
          farmingArea: '',
          preferredCommunication: 'app'
        });
        
        // Show success message
        setSuccessMessage(language === 'english' ? 'Your feedback has been submitted successfully!' : 'আপনার মতামত সফলভাবে জমা দেওয়া হয়েছে!');
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage(language === 'english' ? 'Failed to submit feedback. Please try again.' : 'মতামত জমা দিতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  };
  
  // Available crops options
  const cropOptions = [
    { value: 'rice', labelEn: 'Rice', labelBn: 'ধান' },
    { value: 'wheat', labelEn: 'Wheat', labelBn: 'গম' },
    { value: 'maize', labelEn: 'Maize', labelBn: 'ভুট্টা' },
    { value: 'potato', labelEn: 'Potato', labelBn: 'আলু' },
    { value: 'tomato', labelEn: 'Tomato', labelBn: 'টমেটো' },
    { value: 'onion', labelEn: 'Onion', labelBn: 'পেঁয়াজ' },
    { value: 'garlic', labelEn: 'Garlic', labelBn: 'রসুন' },
    { value: 'chili', labelEn: 'Chili', labelBn: 'মরিচ' },
    { value: 'brinjal', labelEn: 'Brinjal', labelBn: 'বেগুন' },
    { value: 'cucumber', labelEn: 'Cucumber', labelBn: 'শসা' },
    { value: 'jute', labelEn: 'Jute', labelBn: 'পাট' },
    { value: 'sugarcane', labelEn: 'Sugarcane', labelBn: 'আখ' },
    { value: 'mustard', labelEn: 'Mustard', labelBn: 'সরিষা' },
    { value: 'pulses', labelEn: 'Pulses', labelBn: 'ডাল' },
    { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' }
  ];
  
  // Challenges options
  const challengeOptions = [
    { value: 'water_scarcity', labelEn: 'Water Scarcity', labelBn: 'পানির অভাব' },
    { value: 'pests', labelEn: 'Pests and Diseases', labelBn: 'কীটপতঙ্গ এবং রোগ' },
    { value: 'soil_quality', labelEn: 'Poor Soil Quality', labelBn: 'খারাপ মাটির গুণমান' },
    { value: 'climate_change', labelEn: 'Climate Change Effects', labelBn: 'জলবায়ু পরিবর্তনের প্রভাব' },
    { value: 'market_access', labelEn: 'Market Access', labelBn: 'বাজারে প্রবেশাধিকার' },
    { value: 'financial', labelEn: 'Financial Constraints', labelBn: 'আর্থিক সীমাবদ্ধতা' },
    { value: 'labor', labelEn: 'Labor Shortage', labelBn: 'শ্রমিক সংকট' },
    { value: 'technology', labelEn: 'Lack of Technology', labelBn: 'প্রযুক্তির অভাব' },
    { value: 'knowledge', labelEn: 'Knowledge Gap', labelBn: 'জ্ঞানের ঘাটতি' },
    { value: 'equipment', labelEn: 'Equipment Shortage', labelBn: 'সরঞ্জামের অভাব' }
  ];
  
  // Assistance options
  const assistanceOptions = [
    { value: 'soil_testing', labelEn: 'Soil Testing Services', labelBn: 'মাটি পরীক্ষা পরিষেবা' },
    { value: 'crop_advice', labelEn: 'Crop Selection Advice', labelBn: 'ফসল নির্বাচন পরামর্শ' },
    { value: 'pest_management', labelEn: 'Pest Management Tips', labelBn: 'কীটপতঙ্গ নিয়ন্ত্রণ টিপস' },
    { value: 'weather_alerts', labelEn: 'Weather Alerts', labelBn: 'আবহাওয়া সতর্কতা' },
    { value: 'market_info', labelEn: 'Market Information', labelBn: 'বাজারের তথ্য' },
    { value: 'organic_methods', labelEn: 'Organic Farming Methods', labelBn: 'জৈব কৃষি পদ্ধতি' },
    { value: 'water_management', labelEn: 'Water Management', labelBn: 'পানি ব্যবস্থাপনা' },
    { value: 'financial_resources', labelEn: 'Financial Resources', labelBn: 'আর্থিক সংস্থান' },
    { value: 'community_connect', labelEn: 'Connection with Other Farmers', labelBn: 'অন্যান্য কৃষকদের সাথে সংযোগ' },
    { value: 'equipment_access', labelEn: 'Access to Equipment', labelBn: 'সরঞ্জামের অ্যাক্সেস' }
  ];
  
  // Farming area options
  const farmingAreaOptions = [
    { value: 'dhaka', labelEn: 'Dhaka Division', labelBn: 'ঢাকা বিভাগ' },
    { value: 'chittagong', labelEn: 'Chittagong Division', labelBn: 'চট্টগ্রাম বিভাগ' },
    { value: 'rajshahi', labelEn: 'Rajshahi Division', labelBn: 'রাজশাহী বিভাগ' },
    { value: 'khulna', labelEn: 'Khulna Division', labelBn: 'খুলনা বিভাগ' },
    { value: 'barisal', labelEn: 'Barisal Division', labelBn: 'বরিশাল বিভাগ' },
    { value: 'sylhet', labelEn: 'Sylhet Division', labelBn: 'সিলেট বিভাগ' },
    { value: 'rangpur', labelEn: 'Rangpur Division', labelBn: 'রংপুর বিভাগ' },
    { value: 'mymensingh', labelEn: 'Mymensingh Division', labelBn: 'ময়মনসিংহ বিভাগ' },
    { value: 'other', labelEn: 'Other', labelBn: 'অন্যান্য' }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">
          {language === 'english' ? 'Loading...' : 'লোড হচ্ছে...'}
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
              {language === 'english' ? 'Community' : 'সম্প্রদায়'}
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

        {/* Community Content */}
        <div className="dashboard-content">
          <div className="community-header">
            <h1 className="page-title">
              {language === 'english' ? '👨‍🌾 Farmer Community Hub' : '👨‍🌾 কৃষক সম্প্রদায় কেন্দ্র'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? 'Share your farming experience and connect with other farmers' 
                : 'আপনার কৃষি অভিজ্ঞতা শেয়ার করুন এবং অন্যান্য কৃষকদের সাথে সংযোগ করুন'}
            </p>
          </div>

          <div className="community-content">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {errorMessage}
              </div>
            )}
            
            {/* Community Form */}
            <div className="community-form-container">
              <form onSubmit={handleSubmit} className="community-form">
                <div className="form-section">
                  <h3 className="section-title">
                    {language === 'english' ? '🌱 Your Farming Profile' : '🌱 আপনার কৃষি প্রোফাইল'}
                  </h3>
                  
                  {/* Current Crops */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'What are you currently growing?' : 'আপনি বর্তমানে কী উৎপাদন করছেন?'}
                    </label>
                    <div className="checkbox-group crops-group">
                      {cropOptions.map(crop => (
                        <div className="checkbox-item" key={`current-${crop.value}`}>
                          <input
                            type="checkbox"
                            id={`current-${crop.value}`}
                            name="currentCrops"
                            value={crop.value}
                            checked={formData.currentCrops.includes(crop.value)}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor={`current-${crop.value}`}>
                            {language === 'english' ? crop.labelEn : crop.labelBn}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Planned Crops */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'What would you like to grow in the future?' : 'ভবিষ্যতে আপনি কী উৎপাদন করতে চান?'}
                    </label>
                    <div className="checkbox-group crops-group">
                      {cropOptions.map(crop => (
                        <div className="checkbox-item" key={`planned-${crop.value}`}>
                          <input
                            type="checkbox"
                            id={`planned-${crop.value}`}
                            name="plannedCrops"
                            value={crop.value}
                            checked={formData.plannedCrops.includes(crop.value)}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor={`planned-${crop.value}`}>
                            {language === 'english' ? crop.labelEn : crop.labelBn}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Farm Size */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'Farm Size:' : 'খামারের আকার:'}
                    </label>
                    <div className="radio-group">
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="farm-small"
                          name="farmSize"
                          value="small"
                          checked={formData.farmSize === 'small'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="farm-small">
                          {language === 'english' ? 'Small (< 1 Acre)' : 'ছোট (< ১ একর)'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="farm-medium"
                          name="farmSize"
                          value="medium"
                          checked={formData.farmSize === 'medium'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="farm-medium">
                          {language === 'english' ? 'Medium (1-5 Acres)' : 'মাঝারি (১-৫ একর)'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="farm-large"
                          name="farmSize"
                          value="large"
                          checked={formData.farmSize === 'large'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="farm-large">
                          {language === 'english' ? 'Large (> 5 Acres)' : 'বড় (> ৫ একর)'}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Farming Area */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'Farming Area:' : 'কৃষি এলাকা:'}
                    </label>
                    <select
                      name="farmingArea"
                      value={formData.farmingArea}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">
                        {language === 'english' ? '-- Select Area --' : '-- এলাকা নির্বাচন করুন --'}
                      </option>
                      {farmingAreaOptions.map(area => (
                        <option key={area.value} value={area.value}>
                          {language === 'english' ? area.labelEn : area.labelBn}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Farming Method */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'Farming Method:' : 'কৃষি পদ্ধতি:'}
                    </label>
                    <div className="radio-group">
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="method-conventional"
                          name="farmingMethod"
                          value="conventional"
                          checked={formData.farmingMethod === 'conventional'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="method-conventional">
                          {language === 'english' ? 'Conventional' : 'পারম্পরিক'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="method-organic"
                          name="farmingMethod"
                          value="organic"
                          checked={formData.farmingMethod === 'organic'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="method-organic">
                          {language === 'english' ? 'Organic' : 'জৈবিক'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="method-hybrid"
                          name="farmingMethod"
                          value="hybrid"
                          checked={formData.farmingMethod === 'hybrid'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="method-hybrid">
                          {language === 'english' ? 'Hybrid (Mixed)' : 'হাইব্রিড (মিশ্রিত)'}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Farming Experience */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'Farming Experience:' : 'কৃষি অভিজ্ঞতা:'}
                    </label>
                    <div className="radio-group">
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="exp-beginner"
                          name="farmingExperience"
                          value="beginner"
                          checked={formData.farmingExperience === 'beginner'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="exp-beginner">
                          {language === 'english' ? 'Beginner (< 2 years)' : 'নবীন (< ২ বছর)'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="exp-intermediate"
                          name="farmingExperience"
                          value="intermediate"
                          checked={formData.farmingExperience === 'intermediate'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="exp-intermediate">
                          {language === 'english' ? 'Intermediate (2-5 years)' : 'মধ্যবর্তী (২-৫ বছর)'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="exp-experienced"
                          name="farmingExperience"
                          value="experienced"
                          checked={formData.farmingExperience === 'experienced'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="exp-experienced">
                          {language === 'english' ? 'Experienced (5+ years)' : 'অভিজ্ঞ (৫+ বছর)'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3 className="section-title">
                    {language === 'english' ? '🤔 Challenges & Needs' : '🤔 চ্যালেঞ্জ এবং প্রয়োজনীয়তা'}
                  </h3>
                  
                  {/* Challenges */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'What challenges are you facing in farming?' : 'কৃষিতে আপনি কী ধরনের চ্যালেঞ্জের সম্মুখীন হচ্ছেন?'}
                    </label>
                    <div className="checkbox-group challenges-group">
                      {challengeOptions.map(challenge => (
                        <div className="checkbox-item" key={challenge.value}>
                          <input
                            type="checkbox"
                            id={`challenge-${challenge.value}`}
                            name="challenges"
                            value={challenge.value}
                            checked={formData.challenges.includes(challenge.value)}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor={`challenge-${challenge.value}`}>
                            {language === 'english' ? challenge.labelEn : challenge.labelBn}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Preferred Assistance */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'What assistance would you like?' : 'আপনি কোন ধরনের সহায়তা চান?'}
                    </label>
                    <div className="checkbox-group assistance-group">
                      {assistanceOptions.map(assistance => (
                        <div className="checkbox-item" key={assistance.value}>
                          <input
                            type="checkbox"
                            id={`assistance-${assistance.value}`}
                            name="preferredAssistance"
                            value={assistance.value}
                            checked={formData.preferredAssistance.includes(assistance.value)}
                            onChange={handleCheckboxChange}
                          />
                          <label htmlFor={`assistance-${assistance.value}`}>
                            {language === 'english' ? assistance.labelEn : assistance.labelBn}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Preferred Communication Method */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'Preferred way to receive agricultural updates:' : 'কৃষি আপডেট পাওয়ার পছন্দসই উপায়:'}
                    </label>
                    <div className="radio-group">
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="comm-app"
                          name="preferredCommunication"
                          value="app"
                          checked={formData.preferredCommunication === 'app'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="comm-app">
                          {language === 'english' ? 'In-App Notifications' : 'অ্যাপ নোটিফিকেশন'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="comm-sms"
                          name="preferredCommunication"
                          value="sms"
                          checked={formData.preferredCommunication === 'sms'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="comm-sms">
                          {language === 'english' ? 'SMS' : 'এসএমএস'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="comm-email"
                          name="preferredCommunication"
                          value="email"
                          checked={formData.preferredCommunication === 'email'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="comm-email">
                          {language === 'english' ? 'Email' : 'ইমেইল'}
                        </label>
                      </div>
                      <div className="radio-item">
                        <input
                          type="radio"
                          id="comm-whatsapp"
                          name="preferredCommunication"
                          value="whatsapp"
                          checked={formData.preferredCommunication === 'whatsapp'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="comm-whatsapp">
                          {language === 'english' ? 'WhatsApp' : 'হোয়াটসঅ্যাপ'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h3 className="section-title">
                    {language === 'english' ? '💬 Your Feedback' : '💬 আপনার মতামত'}
                  </h3>
                  
                  {/* Notes Field */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'Share your farming experience and questions:' : 'আপনার কৃষি অভিজ্ঞতা এবং প্রশ্নগুলি শেয়ার করুন:'}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder={language === 'english' ? 'Share your farming journey, challenges, or any questions you have...' : 'আপনার কৃষি যাত্রা, চ্যালেঞ্জ, বা আপনার কোন প্রশ্ন শেয়ার করুন...'}
                      rows="5"
                    ></textarea>
                  </div>
                  
                  {/* Improvement Suggestions */}
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'english' ? 'Suggestions for improving this platform:' : 'এই প্ল্যাটফর্ম উন্নত করার জন্য পরামর্শ:'}
                    </label>
                    <textarea
                      name="improvementSuggestions"
                      value={formData.improvementSuggestions}
                      onChange={handleInputChange}
                      className="form-textarea"
                      placeholder={language === 'english' ? 'Any features you would like to see added or improved...' : 'আপনি যে বৈশিষ্ট্যগুলি যোগ করতে বা উন্নত করতে চান...'}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="form-submit">
                  <button type="submit" className="submit-button">
                    {language === 'english' ? 'Submit Feedback' : 'মতামত জমা দিন'}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Community Features Preview */}
            <div className="community-features">
              <div className="feature-card">
                <div className="feature-icon">👨‍👩‍👧‍👦</div>
                <h3 className="feature-title">
                  {language === 'english' ? 'Connect with Farmers' : 'কৃষকদের সাথে সংযোগ করুন'}
                </h3>
                <p className="feature-description">
                  {language === 'english' 
                    ? 'Coming soon: Connect with farmers in your area, share knowledge, and build a supportive network.' 
                    : 'শীঘ্রই আসছে: আপনার এলাকার কৃষকদের সাথে সংযোগ করুন, জ্ঞান ভাগ করুন এবং একটি সহায়ক নেটওয়ার্ক তৈরি করুন।'}
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎓</div>
                <h3 className="feature-title">
                  {language === 'english' ? 'Farming Workshops' : 'কৃষি কর্মশালা'}
                </h3>
                <p className="feature-description">
                  {language === 'english' 
                    ? 'Coming soon: Join virtual workshops to learn new farming techniques and improve your skills.' 
                    : 'শীঘ্রই আসছে: নতুন কৃষি কৌশল শিখতে এবং আপনার দক্ষতা উন্নত করতে ভার্চুয়াল কর্মশালায় যোগ দিন।'}
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h3 className="feature-title">
                  {language === 'english' ? 'Discussion Forums' : 'আলোচনা ফোরাম'}
                </h3>
                <p className="feature-description">
                  {language === 'english' 
                    ? 'Coming soon: Participate in topic-based discussions about farming practices, challenges, and innovations.' 
                    : 'শীঘ্রই আসছে: কৃষি অনুশীলন, চ্যালেঞ্জ এবং উদ্ভাবন সম্পর্কে বিষয়-ভিত্তিক আলোচনায় অংশ নিন।'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;