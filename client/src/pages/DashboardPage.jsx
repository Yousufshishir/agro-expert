// client/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/dashboard.css';  // Import the dashboard styles

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
  const [userCrops, setUserCrops] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [language, setLanguage] = useState('english'); // Default language
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if user data is already available in AuthContext
        if (user) {
          setUserData(user);
          
          // Fix: Use user.id instead of user._id
          if (user.id) {
            fetchUserStats(user.id);
            fetchUserCrops(user.id);
            fetchUserActivities(user.id);
            fetchWeatherData();
          }
          
          setLoading(false);
          return;
        }

// client/src/pages/DashboardPage.js (continued)
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
        
        // Fetch user-related data
        fetchUserStats(userId);
        fetchUserCrops(userId);
        fetchUserActivities(userId);
        fetchWeatherData();
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };

    const fetchUserStats = async (userId) => {
      try {
        // In a real app, this would be an API call
        // For now we're using sample data
        const res = await axios.get(`http://localhost:5000/api/users/${userId}/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => {
          // Fallback to demo data if API isn't ready
          return {
            data: {
              crops: Math.floor(Math.random() * 10) + 1,
              soilTests: Math.floor(Math.random() * 15) + 1,
              recommendations: Math.floor(Math.random() * 8) + 1
            }
          };
        });
        
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    const fetchUserCrops = async (userId) => {
      try {
        // Fetch user's crops
        const userCropsRes = await axios.get(`http://localhost:5000/api/users/${userId}/crops`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => {
          // Fallback demo data
          return { 
            data: [] 
          };
        });
        
        setUserCrops(userCropsRes.data);
        
        // Fetch all available crops
        const allCropsRes = await axios.get('http://localhost:5000/api/crops');
        setAvailableCrops(allCropsRes.data);
      } catch (error) {
        console.error('Error fetching crops data:', error);
      }
    };

    const fetchUserActivities = async (userId) => {
      try {
        // In a real app, this would be an API call
        // For now we're using sample data
        const res = await axios.get(`http://localhost:5000/api/users/${userId}/activities`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => {
          // Fallback to demo data if API isn't ready
          return {
            data: [
              { id: 1, action: 'Soil Test Submitted', date: '2025-04-22', status: 'completed' },
              { id: 2, action: 'Crop Plan Created', date: '2025-04-20', status: 'in-progress' },
              { id: 3, action: 'Weather Alert', date: '2025-04-18', status: 'alert' },
            ]
          };
        });
        
        setRecentActivities(res.data);
      } catch (error) {
        console.error('Error fetching user activities:', error);
      }
    };

    const fetchWeatherData = async () => {
      try {
        // In a real app, this would call a weather API
        const weatherRes = await axios.get('http://localhost:5000/api/weather').catch(() => {
          // Fallback to demo data if API isn't ready
          return {
            data: {
              location: 'Your Farm',
              current: { temp: 24, condition: 'Sunny', humidity: 65 },
              forecast: [
                { day: 'Today', high: 26, low: 18, condition: 'Sunny' },
                { day: 'Tomorrow', high: 28, low: 19, condition: 'Partly Cloudy' },
                { day: 'Day After', high: 25, low: 17, condition: 'Chance of Rain' }
              ]
            }
          };
        });
        
        setWeatherData(weatherRes.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  // Function to add a crop to user's crops
  // In the addCropToUser function:
const addCropToUser = async (cropId) => {
  try {
    const res = await axios.post(`http://localhost:5000/api/users/${userData.id}/crops`, 
      { cropId },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
    );
    
    // Fix: Use userData.id instead of userData._id
    fetchUserCrops(userData.id);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      crops: prev.crops + 1
    }));
    
    // Add to recent activities
    const crop = availableCrops.find(c => c._id === cropId);
    const newActivity = {
      id: Date.now(),
      action: `Added ${crop?.name?.[language] || 'New Crop'}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };
    
    setRecentActivities(prev => [newActivity, ...prev].slice(0, 5));
    
  } catch (error) {
    console.error('Error adding crop:', error);
  }
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
            <span>{language === 'english' ? 'Dashboard' : 'ড্যাশবোর্ড'}</span>
          </a>
          <Link to="/crops" className="sidebar-menu-item">
            <span className="menu-icon">🌱</span>
            <span>{language === 'english' ? 'Crops' : 'ফসল'}</span>
          </Link>
          <Link to="/soil-analyzer" className="sidebar-menu-item">
            <span className="menu-icon">🧪</span>
            <span>{language === 'english' ? 'Soil Tests' : 'মাটি পরীক্ষা'}</span>
          </Link>
          <Link to="/weather" className="sidebar-menu-item">
            <span className="menu-icon">🌦️</span>
            <span>{language === 'english' ? 'Weather' : 'আবহাওয়া'}</span>
          </Link>
          <Link to="/recommendations" className="sidebar-menu-item">
            <span className="menu-icon">📋</span>
            <span>{language === 'english' ? 'Recommendations' : 'সুপারিশমালা'}</span>
          </Link>
          <Link to="/settings" className="sidebar-menu-item">
            <span className="menu-icon">⚙️</span>
            <span>{language === 'english' ? 'Settings' : 'সেটিংস'}</span>
          </Link>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <span className="menu-icon">🚪</span>
            <span>{language === 'english' ? 'Logout' : 'লগআউট'}</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-topnav">
          <div className="search-box">
            <input type="text" placeholder={language === 'english' ? 'Search...' : 'অনুসন্ধান...'} className="search-input" />
            <button className="search-button">🔍</button>
          </div>
          <div className="user-profile">
            <button onClick={toggleLanguage} className="language-toggle ">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            <div className="avatar">{userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}</div>
            <div className="user-info">
              <span className="user-name">{userData.name}</span>
              <span className="user-role">{userData.role || (language === 'english' ? 'Farmer' : 'কৃষক')}</span>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>{language === 'english' ? `Welcome back, ${userData.name}!` : `স্বাগতম, ${userData.name}!`}</h1>
            <p className="welcome-subtitle">
              {language === 'english' 
                ? "Here's what's happening with your farm today" 
                : "আজ আপনার খামারে যা কিছু ঘটছে"}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon crop-icon">🌾</div>
              <div className="stat-info">
                <h3 className="stat-title">{language === 'english' ? 'Active Crops' : 'সক্রিয় ফসল'}</h3>
                <span className="stat-number">{stats.crops}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon soil-icon">🧪</div>
              <div className="stat-info">
                <h3 className="stat-title">{language === 'english' ? 'Soil Tests' : 'মাটি পরীক্ষা'}</h3>
                <span className="stat-number">{stats.soilTests}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon recommend-icon">📋</div>
              <div className="stat-info">
                <h3 className="stat-title">{language === 'english' ? 'Recommendations' : 'সুপারিশমালা'}</h3>
                <span className="stat-number">{stats.recommendations}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Recent Activities */}
            <div className="dashboard-card activities-card">
              <h2 className="card-title">{language === 'english' ? 'Recent Activities' : 'সাম্প্রতিক কার্যক্রম'}</h2>
              <div className="activities-list">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-content">
                      <div className="activity-title">{activity.action}</div>
                      <div className="activity-date">{activity.date}</div>
                    </div>
                    <div className={`activity-status ${getStatusColor(activity.status)}`}>
                      {activity.status === 'completed' 
                        ? (language === 'english' ? 'completed' : 'সম্পন্ন') 
                        : activity.status === 'in-progress' 
                          ? (language === 'english' ? 'in-progress' : 'চলমান')
                          : (language === 'english' ? 'alert' : 'সতর্কতা')}
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-button">
                {language === 'english' ? 'View All Activities' : 'সমস্ত কার্যক্রম দেখুন'}
              </button>
            </div>

            {/* Weather Card */}
            {weatherData && (
              <div className="dashboard-card weather-card">
                <h2 className="card-title">{language === 'english' ? 'Weather Forecast' : 'আবহাওয়া পূর্বাভাস'}</h2>
                <div className="current-weather">
                  <div className="weather-location">{weatherData.location}</div>
                  <div className="weather-now">
                    <div className="weather-temp">{weatherData.current.temp}°C</div>
                    <div className="weather-condition">
                      {language === 'english' 
                        ? weatherData.current.condition 
                        : weatherData.current.condition === 'Sunny' 
                          ? 'রৌদ্রোজ্জ্বল' 
                          : weatherData.current.condition === 'Partly Cloudy' 
                            ? 'আংশিক মেঘলা' 
                            : weatherData.current.condition === 'Chance of Rain' 
                              ? 'বৃষ্টির সম্ভাবনা' 
                              : weatherData.current.condition}
                    </div>
                  </div>
                  <div className="weather-humidity">
                    {language === 'english' ? 'Humidity' : 'আর্দ্রতা'}: {weatherData.current.humidity}%
                  </div>
                </div>
                <div className="weather-forecast">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="forecast-day">
                      <div className="day-name">
                        {language === 'english' 
                          ? day.day 
                          : day.day === 'Today' 
                            ? 'আজ' 
                            : day.day === 'Tomorrow' 
                              ? 'আগামীকাল' 
                              : 'পরশু'}
                      </div>
                      <div className="day-condition">
                        {language === 'english' 
                          ? day.condition 
                          : day.condition === 'Sunny' 
                            ? 'রৌদ্রোজ্জ্বল' 
                            : day.condition === 'Partly Cloudy' 
                              ? 'আংশিক মেঘলা' 
                              : day.condition === 'Chance of Rain' 
                                ? 'বৃষ্টির সম্ভাবনা' 
                                : day.condition}
                      </div>
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

          {/* Your Crops Section */}
          <div className="crops-section">
            <h2 className="section-title">{language === 'english' ? 'Your Crops' : 'আপনার ফসল'}</h2>
            
            {userCrops.length > 0 ? (
              <div className="user-crops-grid">
                {userCrops.map(crop => (
                  <div key={crop._id} className="crop-card">
                    <div className="crop-image" style={{ backgroundImage: `url(${crop.image})` }}></div>
                    <h3 className="crop-name">{crop.name[language]}</h3>
                    <p className="crop-category">{crop.category[language]}</p>
                    <Link to={`/crops/${crop._id}`} className="view-crop-button">
                      {language === 'english' ? 'View Details' : 'বিস্তারিত দেখুন'}
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-crops-message">
                {language === 'english' 
                  ? "You haven't added any crops yet. Add crops to get personalized recommendations." 
                  : "আপনি এখনও কোন ফসল যোগ করেননি। ব্যক্তিগতকৃত সুপারিশ পেতে ফসল যোগ করুন।"}
              </div>
            )}
          </div>

          {/* Available Crops Section */}
          <div className="available-crops-section">
            <h2 className="section-title">{language === 'english' ? 'Available Crops' : 'উপলব্ধ ফসল'}</h2>
            
            <div className="available-crops-grid">
              {availableCrops.slice(0, 8).map(crop => (
                <div key={crop._id} className="crop-card">
                  <div className="crop-image" style={{ backgroundImage: `url(${crop.image || '/images/default-crop.jpg'})` }}></div>
                  <h3 className="crop-name">{crop.name[language]}</h3>
                  {crop.category && <p className="crop-category">{crop.category[language]}</p>}
                  <button 
                    onClick={() => addCropToUser(crop._id)} 
                    className="add-crop-button"
                  >
                    {language === 'english' ? 'Add to My Crops' : 'আমার ফসলে যোগ করুন'}
                  </button>
                </div>
              ))}
            </div>
            
            <Link to="/crops" className="view-all-button">
              {language === 'english' ? 'View All Crops' : 'সমস্ত ফসল দেখুন'}
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-title">{language === 'english' ? 'Quick Actions' : 'দ্রুত পদক্ষেপ'}</h2>
            <div className="action-buttons">
              <button className="action-button">
                <span className="action-icon">➕</span>
                <span>{language === 'english' ? 'Add Crop' : 'ফসল যোগ করুন'}</span>
              </button>
              <button className="action-button">
                <span className="action-icon">🧪</span>
                <span>{language === 'english' ? 'New Soil Test' : 'নতুন মাটি পরীক্ষা'}</span>
              </button>
              <button className="action-button">
                <span className="action-icon">📊</span>
                <span>{language === 'english' ? 'View Reports' : 'রিপোর্ট দেখুন'}</span>
              </button>
              <button className="action-button">
                <span className="action-icon">📅</span>
                <span>{language === 'english' ? 'Schedule Task' : 'কাজ নির্ধারণ করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;