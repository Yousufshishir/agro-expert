// client/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ language, handleLogout }) => {
  const location = useLocation();
  
  // Check if the path matches the current location
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="https://i.ibb.co.com/jPWQRt1G/Chat-GPT-Image-Apr-27-2025-02-09-32-PM-1.png" alt="Agro Expert" className="logo-img" />
          <h2 className="app-name">Agro Expert</h2>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <Link to="/dashboard" className={`sidebar-menu-item ${isActive('/dashboard')}`}>
          <span className="menu-icon">🏠</span>
          <span>{language === 'english' ? 'Dashboard' : 'ড্যাশবোর্ড'}</span>
        </Link>
        <Link to="/crops" className={`sidebar-menu-item ${isActive('/crops')}`}>
          <span className="menu-icon">🌾</span>
          <span>{language === 'english' ? 'Crops' : 'ফসল'}</span>
        </Link>
        <Link to="/soil-analyzer" className={`sidebar-menu-item ${isActive('/soil-analyzer')}`}>
          <span className="menu-icon">🧪</span>
          <span>{language === 'english' ? 'Soil Tests' : 'মাটি পরীক্ষা'}</span>
        </Link>
        <Link to="/weather" className={`sidebar-menu-item ${isActive('/weather')}`}>
          <span className="menu-icon">🌦️</span>
          <span>{language === 'english' ? 'Weather' : 'আবহাওয়া'}</span>
        </Link>
        {/* <Link to="/calendar" className={`sidebar-menu-item ${isActive('/calendar')}`}>
          <span className="menu-icon">📅</span>
          <span>{language === 'english' ? 'Farming Calendar' : 'কৃষি ক্যালেন্ডার'}</span>
        </Link> */}
        <Link to="/marketplace" className={`sidebar-menu-item ${isActive('/marketplace')}`}>
          <span className="menu-icon">🛒</span>
          <span>{language === 'english' ? 'Marketplace' : 'বাজার'}</span>
        </Link>
        <Link to="/community" className={`sidebar-menu-item ${isActive('/community')}`}>
          <span className="menu-icon">👨‍🌾</span>
          <span>{language === 'english' ? 'Community' : 'সম্প্রদায়'}</span>
        </Link>
        <Link to="/logout" onClick={handleLogout} className="sidebar-menu-item">
          <span className="menu-icon">🚪</span>
          <span>{language === 'english' ? 'Logout' : 'লগআউট'}</span>
        </Link>
      </div>
      <div className="team-info">
    <div className="team-name">
        {language === 'english' ? `DEVELOPED BY` : 'DEVELOPED BY'}
    </div>
    <div className="team-members">
        {['Yousuf (Leader)', 'Tawhid', 'Jasim', 'Akib'].map((member, i) => (
            <span 
                className="member-name" 
                key={member}
                style={{ '--i': i }}
            >
                {member}
            </span>
        ))}
    </div>
</div>
    </div>
  );
};

export default Sidebar;