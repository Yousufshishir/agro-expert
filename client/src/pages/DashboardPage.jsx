// client/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    farmSize: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  // Bangladesh districts for the dropdown
  const districts = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 
    'Sylhet', 'Rangpur', 'Mymensingh', 'Comilla', 'Narayanganj',
    'Jessore', 'Dinajpur', 'Bogra', 'Faridpur', 'Tangail'
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if user data is already available in AuthContext
        if (user) {
          setUserData(user);
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            district: user.district || '',
            farmSize: user.farmSize || ''
          });
          setLoading(false);
          return;
        }

        // Try to get authentication data from localStorage
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        // If no auth data is found, redirect to login
        if (!token || !userId) {
          console.log("No authentication data found in localStorage");
          navigate('/login');
          return;
        }

        // If we have token and userId, try to fetch user data
        const res = await axios.get(`http://localhost:5000/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        

        setUserData(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          district: res.data.district || '',
          farmSize: res.data.farmSize || ''
        });
        
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
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (editMode) {
      // If we're exiting edit mode, reset form data to current user data
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        district: userData.district || '',
        farmSize: userData.farmSize || ''
      });
    }
    setEditMode(!editMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = userData.id || localStorage.getItem('userId');
      
      const res = await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUserData(res.data);
      setEditMode(false);
      
      // Show success message
      alert(language === 'english' ? 'Profile updated successfully!' : 'প্রোফাইল সফলভাবে আপডেট হয়েছে!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(language === 'english' ? 'Failed to update profile' : 'প্রোফাইল আপডেট করতে ব্যর্থ');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = userData.id || localStorage.getItem('userId');
      
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      navigate('/login');
      
      // Show success message
      alert(language === 'english' ? 'Account deleted successfully' : 'অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(language === 'english' ? 'Failed to delete account' : 'অ্যাকাউন্ট মুছতে ব্যর্থ');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">Loading your dashboard...</div>
      </div>
    );
  }

  // Show login prompt if no user data is available
  if (!userData && !loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-xl font-bold mb-4 text-gray-700">Authentication Required</div>
        <p className="mb-6 text-gray-600">Please log in to access your Agro Expert dashboard</p>
        <button 
          onClick={() => navigate('/login')}
          className="login-button"
        >
          Go to Login
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
            <span className="breadcrumb-item active">{language === 'english' ? 'Dashboard' : 'ড্যাশবোর্ড'}</span>
          </div>
          <div className="user-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            <div className="avatar">
              {userData.profileImage ? (
                <img src={userData.profileImage} alt={userData.name} />
              ) : (
                userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="profile-header">
            <div className="bg-pattern"></div>
            <div className="profile-header-content">
              <div className="profile-avatar">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt={userData.name} />
                ) : (
                  <div className="profile-initial">{userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}</div>
                )}
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{userData.name}</h1>
                <p className="profile-role">{userData.role || (language === 'english' ? 'Farmer' : 'কৃষক')}</p>
                <div className="profile-meta">
                  <div className="meta-item">
                    <span className="meta-icon">📧</span>
                    <span>{userData.email}</span>
                  </div>
                  {userData.phone && (
                    <div className="meta-item">
                      <span className="meta-icon">📱</span>
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  {userData.district && (
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{userData.district}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>{language === 'english' ? 'Your Account' : 'আপনার অ্যাকাউন্ট'}</h2>
                <button onClick={handleEditToggle} className="edit-button">
                  {editMode ? 
                    (language === 'english' ? 'Cancel' : 'বাতিল') : 
                    (language === 'english' ? 'Edit Profile' : 'প্রোফাইল সম্পাদনা করুন')}
                </button>
              </div>

              {editMode ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label>{language === 'english' ? 'Name' : 'নাম'}</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{language === 'english' ? 'Email' : 'ইমেইল'}</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>{language === 'english' ? 'Phone' : 'ফোন'}</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{language === 'english' ? 'Address' : 'ঠিকানা'}</label>
                    <textarea 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>{language === 'english' ? 'District' : 'জেলা'}</label>
                      <select 
                        name="district" 
                        value={formData.district}
                        onChange={handleInputChange}
                      >
                        <option value="">{language === 'english' ? 'Select District' : 'জেলা নির্বাচন করুন'}</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{language === 'english' ? 'Farm Size (acres)' : 'খামারের আকার (একর)'}</label>
                      <input 
                        type="number" 
                        name="farmSize" 
                        value={formData.farmSize}
                        onChange={handleInputChange}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="save-button">
                      {language === 'english' ? 'Save Changes' : 'পরিবর্তন সংরক্ষণ করুন'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-row">
                    <div className="detail-label">
                      <span className="detail-icon">👤</span>
                      <span>{language === 'english' ? 'Name' : 'নাম'}</span>
                    </div>
                    <div className="detail-value">{userData.name}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">
                      <span className="detail-icon">📧</span>
                      <span>{language === 'english' ? 'Email' : 'ইমেইল'}</span>
                    </div>
                    <div className="detail-value">{userData.email}</div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">
                      <span className="detail-icon">📱</span>
                      <span>{language === 'english' ? 'Phone' : 'ফোন'}</span>
                    </div>
                    <div className="detail-value">
                      {userData.phone || (language === 'english' ? 'Not provided' : 'প্রদান করা হয়নি')}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">
                      <span className="detail-icon">📍</span>
                      <span>{language === 'english' ? 'Address' : 'ঠিকানা'}</span>
                    </div>
                    <div className="detail-value">
                      {userData.address || (language === 'english' ? 'Not provided' : 'প্রদান করা হয়নি')}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">
                      <span className="detail-icon">🏙️</span>
                      <span>{language === 'english' ? 'District' : 'জেলা'}</span>
                    </div>
                    <div className="detail-value">
                      {userData.district || (language === 'english' ? 'Not provided' : 'প্রদান করা হয়নি')}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">
                      <span className="detail-icon">🌾</span>
                      <span>{language === 'english' ? 'Farm Size' : 'খামারের আকার'}</span>
                    </div>
                    <div className="detail-value">
                      {userData.farmSize ? `${userData.farmSize} ${language === 'english' ? 'acres' : 'একর'}` : 
                       (language === 'english' ? 'Not provided' : 'প্রদান করা হয়নি')}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-label">
                      <span className="detail-icon">🔐</span>
                      <span>{language === 'english' ? 'Password' : 'পাসওয়ার্ড'}</span>
                    </div>
                    <div className="detail-value password-change">
                      <span>••••••••</span>
                      <button className="change-password-button">
                        {language === 'english' ? 'Change Password' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {!editMode && (
                <div className="danger-zone">
                  <h3 className="danger-title">
                    {language === 'english' ? 'Danger Zone' : 'বিপদ জোন'}
                  </h3>
                  <p className="danger-description">
                    {language === 'english' 
                      ? 'Once you delete your account, there is no going back. Please be certain.' 
                      : 'আপনার অ্যাকাউন্ট মুছে ফেলার পর, ফিরে আসার কোন উপায় নেই। অনুগ্রহ করে নিশ্চিত হোন।'}
                  </p>
                  {showDeleteConfirm ? (
                    <div className="delete-confirm">
                      <p className="delete-warning">
                        {language === 'english' 
                          ? 'Are you sure you want to delete your account? This action cannot be undone.' 
                          : 'আপনি কি নিশ্চিত যে আপনি আপনার অ্যাকাউন্ট মুছতে চান? এই পদক্ষেপ পূর্বাবস্থায় ফেরানো যাবে না।'}
                      </p>
                      <div className="delete-actions">
                        <button onClick={handleDeleteAccount} className="confirm-delete-button">
                          {language === 'english' ? 'Yes, Delete My Account' : 'হ্যাঁ, আমার অ্যাকাউন্ট মুছুন'}
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)} className="cancel-delete-button">
                          {language === 'english' ? 'Cancel' : 'বাতিল করুন'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowDeleteConfirm(true)} className="delete-account-button">
                      {language === 'english' ? 'Delete Account' : 'অ্যাকাউন্ট মুছুন'}
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="profile-card-secondary">
              <div className="info-block">
                <div className="info-icon">🌱</div>
                <h3>{language === 'english' ? 'Farming Tips' : 'কৃষি পরামর্শ'}</h3>
                <p>{language === 'english' 
                  ? 'Complete your profile to receive personalized recommendations for your farm.' 
                  : 'আপনার খামারের জন্য ব্যক্তিগতকৃত সুপারিশ পেতে আপনার প্রোফাইল সম্পূর্ণ করুন।'}</p>
              </div>
              
              <div className="info-block">
                <div className="info-icon">🧪</div>
                <h3>{language === 'english' ? 'Soil Testing' : 'মাটি পরীক্ষা'}</h3>
                <p>{language === 'english' 
                  ? 'Regular soil testing helps you understand your farm better and improves crop yield.' 
                  : 'নিয়মিত মাটি পরীক্ষা আপনাকে আপনার খামার আরও ভালোভাবে বুঝতে এবং ফসলের ফলন উন্নত করতে সাহায্য করে।'}</p>
              </div>
              
              <div className="info-block">
                <div className="info-icon">📊</div>
                <h3>{language === 'english' ? 'Farm Analytics' : 'খামার বিশ্লেষণ'}</h3>
                <p>{language === 'english' 
                  ? 'Track your farm performance and get insights to maximize productivity.' 
                  : 'আপনার খামারের কার্যক্ষমতা ট্র্যাক করুন এবং উৎপাদনশীলতা বাড়ানোর জন্য অন্তর্দৃষ্টি পান।'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;