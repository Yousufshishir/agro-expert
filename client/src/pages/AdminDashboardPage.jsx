// client/src/pages/AdminDashboardPage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './AdminSidebar';
import '../styles/adminDashboard.css'
const AdminDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <div className="welcome-message">
          <h2>Welcome, Admin {user && user.name}!</h2>
          <p>This is your admin control panel for the Agro Expert system.</p>
        </div>
        {/* Admin panels and controls will go here */}
      </div>
    </div>
  );
};

export default AdminDashboardPage;