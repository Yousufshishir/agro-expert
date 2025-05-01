import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/community.css';
import Sidebar from '../components/Sidebar';
import { LogOut } from 'lucide-react';

const CommunityPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    currentCrops: '',
    futureCrops: '',
    challenges: '',
    suggestions: '',
    communityQuestion: ''
  });
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      // Get token from localStorage or user context
      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Send data to backend
      await axios.post(
        'http://localhost:5000/api/community/feedback',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Reset form after successful submission
      setFormData({
        currentCrops: '',
        futureCrops: '',
        challenges: '',
        suggestions: '',
        communityQuestion: ''
      });
      
      setSubmitStatus({
        success: true,
        message: language === 'english' 
          ? 'Thank you for your feedback! Your input has been recorded.'
          : 'আপনার মতামতের জন্য ধন্যবাদ! আপনার ইনপুট রেকর্ড করা হয়েছে।'
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ success: false, message: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({
        success: false,
        message: language === 'english'
          ? 'Failed to submit your feedback. Please try again later.'
          : 'আপনার মতামত জমা দিতে ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।'
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">Loading...</div>
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
              {language === 'english' ? '👨‍🌾 Community Feedback' : '👨‍🌾 সম্প্রদায়ের মতামত'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? 'Share your farming experience and suggestions to help us improve' 
                : 'আমাদের উন্নতি করতে সাহায্য করার জন্য আপনার কৃষি অভিজ্ঞতা এবং পরামর্শ শেয়ার করুন'}
            </p>
          </div>

          <div className="community-content">
            <div className="feedback-form-container">
              {submitStatus.message && (
                <div className={`form-notification ${submitStatus.success ? 'success' : 'error'}`}>
                  {submitStatus.message}
                </div>
              )}
              
              <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="currentCrops">
                    {language === 'english' ? 'What crops are you currently growing?' : 'আপনি বর্তমানে কোন ফসল উৎপাদন করছেন?'}
                  </label>
                  <textarea
                    id="currentCrops"
                    name="currentCrops"
                    value={formData.currentCrops}
                    onChange={handleChange}
                    rows="3"
                    placeholder={language === 'english' ? 'E.g., Rice, Wheat, Vegetables...' : 'যেমন, ধান, গম, শাকসবজি...'}
                    required
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="futureCrops">
                    {language === 'english' ? 'What crops would you like to grow in the future?' : 'ভবিষ্যতে আপনি কোন ফসল উৎপাদন করতে চান?'}
                  </label>
                  <textarea
                    id="futureCrops"
                    name="futureCrops"
                    value={formData.futureCrops}
                    onChange={handleChange}
                    rows="3"
                    placeholder={language === 'english' ? 'E.g., Fruits, Cash crops...' : 'যেমন, ফল, অর্থকরী ফসল...'}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="challenges">
                    {language === 'english' ? 'What challenges do you face in farming?' : 'কৃষিকাজে আপনি কি কি চ্যালেঞ্জের সম্মুখীন হন?'}
                  </label>
                  <textarea
                    id="challenges"
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleChange}
                    rows="4"
                    placeholder={language === 'english' ? 'E.g., Water scarcity, Pest management...' : 'যেমন, পানির অভাব, কীটপতঙ্গ ব্যবস্থাপনা...'}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="suggestions">
                    {language === 'english' ? 'Suggestions to improve this platform' : 'এই প্ল্যাটফর্ম উন্নত করার জন্য পরামর্শ'}
                  </label>
                  <textarea
                    id="suggestions"
                    name="suggestions"
                    value={formData.suggestions}
                    onChange={handleChange}
                    rows="4"
                    placeholder={language === 'english' ? 'What features would you like to see added?' : 'আপনি কি কি বৈশিষ্ট্য যোগ করতে চান?'}
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="communityQuestion">
                    {language === 'english' ? 'Questions for the farming community' : 'কৃষি সম্প্রদায়ের জন্য প্রশ্ন'}
                  </label>
                  <textarea
                    id="communityQuestion"
                    name="communityQuestion"
                    value={formData.communityQuestion}
                    onChange={handleChange}
                    rows="4"
                    placeholder={language === 'english' ? 'Ask a question to get advice from other farmers' : 'অন্য কৃষকদের কাছ থেকে পরামর্শ পেতে একটি প্রশ্ন করুন'}
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={submitLoading}
                  >
                    {submitLoading 
                      ? (language === 'english' ? 'Submitting...' : 'জমা দেওয়া হচ্ছে...') 
                      : (language === 'english' ? 'Submit Feedback' : 'মতামত জমা দিন')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;