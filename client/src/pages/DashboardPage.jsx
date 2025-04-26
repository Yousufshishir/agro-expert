// client/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    crops: 0,
    soilTests: 0,
    recommendations: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if user data is already available in AuthContext
        if (user) {
          setUserData(user);
          
          // Fetch additional user-specific data if needed
          if (user.id) {
            // Simulate fetching stats (in a real app, this would be an API call)
            setStats({
              crops: Math.floor(Math.random() * 10) + 1,
              soilTests: Math.floor(Math.random() * 15) + 1,
              recommendations: Math.floor(Math.random() * 8) + 1
            });

            // Simulate recent activities
            setRecentActivities([
              { id: 1, action: 'Soil Test Submitted', date: '2025-04-22', status: 'completed' },
              { id: 2, action: 'Crop Plan Created', date: '2025-04-20', status: 'in-progress' },
              { id: 3, action: 'Weather Alert', date: '2025-04-18', status: 'alert' },
            ]);

            // Simulate weather data
            setWeatherData({
              location: 'Your Farm',
              current: { temp: 24, condition: 'Sunny', humidity: 65 },
              forecast: [
                { day: 'Today', high: 26, low: 18, condition: 'Sunny' },
                { day: 'Tomorrow', high: 28, low: 19, condition: 'Partly Cloudy' },
                { day: 'Day After', high: 25, low: 17, condition: 'Chance of Rain' }
              ]
            });
          }
          
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
        const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserData(res.data);
        
        // Set demo data for stats and activities
        setStats({
          crops: Math.floor(Math.random() * 10) + 1,
          soilTests: Math.floor(Math.random() * 15) + 1,
          recommendations: Math.floor(Math.random() * 8) + 1
        });

        setRecentActivities([
          { id: 1, action: 'Soil Test Submitted', date: '2025-04-22', status: 'completed' },
          { id: 2, action: 'Crop Plan Created', date: '2025-04-20', status: 'in-progress' },
          { id: 3, action: 'Weather Alert', date: '2025-04-18', status: 'alert' },
        ]);

        setWeatherData({
          location: 'Your Farm',
          current: { temp: 24, condition: 'Sunny', humidity: 65 },
          forecast: [
            { day: 'Today', high: 26, low: 18, condition: 'Sunny' },
            { day: 'Tomorrow', high: 28, low: 19, condition: 'Partly Cloudy' },
            { day: 'Day After', high: 25, low: 17, condition: 'Chance of Rain' }
          ]
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
    // Use the existing logout function from AuthContext
    logout();
    // Additionally clear localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Get status color based on activity status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 className="app-name">Agro Expert</h2>
        </div>
        <div className="sidebar-menu">
          <a href="#" className="sidebar-menu-item active">
            <span className="menu-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a href="#" className="sidebar-menu-item">
            <span className="menu-icon">🌱</span>
            <span>Crops</span>
          </a>
          <Link to="/soil-analyzer" className="sidebar-menu-item">
  <span className="menu-icon">🧪</span>
  <span>Soil Tests</span>
</Link>
          <a href="#" className="sidebar-menu-item">
            <span className="menu-icon">🌦️</span>
            <span>Weather</span>
          </a>
          <a href="#" className="sidebar-menu-item">
            <span className="menu-icon">📋</span>
            <span>Recommendations</span>
          </a>
          <a href="#" className="sidebar-menu-item">
            <span className="menu-icon">⚙️</span>
            <span>Settings</span>
          </a>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <span className="menu-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-topnav">
          <div className="search-box">
            <input type="text" placeholder="Search..." className="search-input" />
            <button className="search-button">🔍</button>
          </div>
          <div className="user-profile">
            <div className="notification-icon">🔔</div>
            <div className="avatar">{userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-info">
              <span className="user-name">{userData.name}</span>
              <span className="user-role">{userData.role || 'Farmer'}</span>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome back, {userData.name}!</h1>
            <p className="welcome-subtitle">Here's what's happening with your farm today</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon crop-icon">🌾</div>
              <div className="stat-info">
                <h3 className="stat-title">Active Crops</h3>
                <span className="stat-number">{stats.crops}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon soil-icon">🧪</div>
              <div className="stat-info">
                <h3 className="stat-title">Soil Tests</h3>
                <span className="stat-number">{stats.soilTests}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon recommend-icon">📋</div>
              <div className="stat-info">
                <h3 className="stat-title">Recommendations</h3>
                <span className="stat-number">{stats.recommendations}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Recent Activities */}
            <div className="dashboard-card activities-card">
              <h2 className="card-title">Recent Activities</h2>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-content">
                      <div className="activity-title">{activity.action}</div>
                      <div className="activity-date">{activity.date}</div>
                    </div>
                    <div className={`activity-status ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-button">View All Activities</button>
            </div>

            {/* Weather Card */}
            {weatherData && (
              <div className="dashboard-card weather-card">
                <h2 className="card-title">Weather Forecast</h2>
                <div className="current-weather">
                  <div className="weather-location">{weatherData.location}</div>
                  <div className="weather-now">
                    <div className="weather-temp">{weatherData.current.temp}°C</div>
                    <div className="weather-condition">{weatherData.current.condition}</div>
                  </div>
                  <div className="weather-humidity">Humidity: {weatherData.current.humidity}%</div>
                </div>
                <div className="weather-forecast">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                      <div className="day-name">{day.day}</div>
                      <div className="day-condition">{day.condition}</div>
                      <div className="day-temp">
                        <span className="high-temp">{day.high}°</span>
                        <span className="low-temp">{day.low}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-button">
                <span className="action-icon">➕</span>
                <span>Add Crop</span>
              </button>
              <button className="action-button">
                <span className="action-icon">🧪</span>
                <span>New Soil Test</span>
              </button>
              <button className="action-button">
                <span className="action-icon">📊</span>
                <span>View Reports</span>
              </button>
              <button className="action-button">
                <span className="action-icon">📅</span>
                <span>Schedule Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;