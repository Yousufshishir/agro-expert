// client/src/pages/CalendarPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import Sidebar from '../components/Sidebar';

const CalendarPage = () => {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState('english');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  return (
    <div className="dashboard-layout">
      {/* Import Sidebar Component */}
      <Sidebar language={language} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation - Same as other pages */}
        <nav className="dashboard-topnav">
          <div className="breadcrumb">
            <span className="breadcrumb-item">🏠 {language === 'english' ? 'Home' : 'হোম'}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">
              {language === 'english' ? 'Farming Calendar' : 'কৃষি ক্যালেন্ডার'}
            </span>
          </div>
          <div className="user-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            <div className="avatar">
              {user && user.profileImage ? (
                <img src={user.profileImage} alt={user.name} />
              ) : (
                user && user.name ? user.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
          </div>
        </nav>

        {/* Calendar Content */}
        <div className="dashboard-content">
          <div className="calendar-header">
            <h1 className="page-title">
              {language === 'english' ? '📅 Farming Calendar' : '📅 কৃষি ক্যালেন্ডার'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? 'Plan your farming activities throughout the year' 
                : 'সারা বছর আপনার কৃষি কার্যক্রম পরিকল্পনা করুন'}
            </p>
          </div>

          <div className="calendar-content">
            <div className="welcome-message">
              <h2>
                {language === 'english' 
                  ? 'Welcome to the Farming Calendar' 
                  : 'কৃষি ক্যালেন্ডারে স্বাগতম'}
              </h2>
              <p>
                {language === 'english' 
                  ? 'This feature is coming soon! Here you will be able to plan your farming activities based on seasons and crop cycles.'
                  : 'এই বৈশিষ্ট্যটি শীঘ্রই আসছে! এখানে আপনি মৌসুম এবং ফসল চক্রের উপর ভিত্তি করে আপনার কৃষি কার্যক্রম পরিকল্পনা করতে সক্ষম হবেন।'}
              </p>
              <div className="coming-soon">
                {language === 'english' ? '🚧 Under Construction 🚧' : '🚧 নির্মাণাধীন 🚧'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;