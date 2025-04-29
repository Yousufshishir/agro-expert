// client/src/components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Agro Expert</h2>
      </div>
      <div className="sidebar-user">
        <div className="user-info">
          <p>{user && user.name}</p>
          <small>{user && user.email}</small>
        </div>
      </div>
      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard" className={pathname === '/admin/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
            {/* Add admin-specific links here */}
            <Link to="/admin/users" className={pathname === '/admin/users' ? 'active' : ''}>
              Manage Users
            </Link>
            <Link to="/admin/crops" className={pathname === '/admin/crops' ? 'active' : ''}>
              Manage Crops
            </Link>
            <Link to="/admin/analytics" className={pathname === '/admin/analytics' ? 'active' : ''}>
              Analytics
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/crops" className={pathname === '/crops' ? 'active' : ''}>
              Crops
            </Link>
            <Link to="/soil-analyzer" className={pathname === '/soil-analyzer' ? 'active' : ''}>
              Soil Analyzer
            </Link>
            <Link to="/weather" className={pathname === '/weather' ? 'active' : ''}>
              Weather
            </Link>
            <Link to="/recommendations" className={pathname === '/recommendations' ? 'active' : ''}>
              Recommendations
            </Link>
            <Link to="/settings" className={pathname === '/settings' ? 'active' : ''}>
              Settings
            </Link>
          </>
        )}
      </nav>
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;