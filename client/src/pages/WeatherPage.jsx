// client/src/pages/WeatherPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';
import '../styles/WeatherPage.css';

const WeatherPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Dhaka');
  const navigate = useNavigate();
  
  const apiKey = 'c8f214e1be934c85ae9163541252704';
  
  const bangladeshCities = [
    'Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 
    'Barisal', 'Rangpur', 'Comilla', 'Narayanganj', 'Mymensingh'
  ];

  // Weather condition to emoji mapping
  const getWeatherEmoji = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('partly cloudy')) return '⛅';
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return '☁️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('sleet')) return '🌨️';
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
    return '🌤️'; // Default emoji
  };

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
    
        // Parse and log localStorage data
        const parsedInfo = JSON.parse(userInfo);
        
        setUserData(parsedInfo);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, user]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setWeatherLoading(true);
      try {
        // Using WeatherAPI.com endpoints
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city},bangladesh&days=1&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
          throw new Error('Weather data not available');
        }
        
        const data = await response.json();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch weather data. Please try again later.');
        console.error('Weather fetch error:', err);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, apiKey]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  // Format time from ISO string
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* Sidebar Component */}
      <Sidebar language={language} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Navigation */}
        <nav className="dashboard-topnav">
          <div className="breadcrumb">
            <span className="breadcrumb-item">🏠 {language === 'english' ? 'Home' : 'হোম'}</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{language === 'english' ? 'Weather' : 'আবহাওয়া'}</span>
          </div>
          <div className="user-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            <div className="avatar">
              {userData?.profileImage ? (
                <img src={userData.profileImage} alt={userData.name} />
              ) : (
                userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
          </div>
        </nav>

        {/* Weather Content */}
        <div className="dashboard-content">
          <div className="weather-header">
            <h1 className="page-title">{language === 'english' ? '🌦️ Bangladesh Weather' : '🌦️ বাংলাদেশের আবহাওয়া'}</h1>
            <div className="city-selector">
              <label htmlFor="city-select">{language === 'english' ? 'Select City:' : 'শহর নির্বাচন করুন:'}</label>
              <select id="city-select" value={city} onChange={handleCityChange}>
                {bangladeshCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {weatherLoading && <div className="loading-message">⏳ {language === 'english' ? 'Loading weather data...' : 'আবহাওয়া ডেটা লোড হচ্ছে...'}</div>}
          
          {error && <div className="error-message">❌ {error}</div>}
          
          {!weatherLoading && !error && weatherData && (
            <div className="weather-container">
              <div className="weather-main">
                <div className="weather-icon">
                  {getWeatherEmoji(weatherData.current.condition.text)}
                </div>
                <div className="weather-info">
                  <h2>{weatherData.location.name}</h2>
                  <p className="temperature">{Math.round(weatherData.current.temp_c)}°C</p>
                  <p className="weather-description">{weatherData.current.condition.text}</p>
                </div>
              </div>
              
              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-label">🌡️ {language === 'english' ? 'Feels like:' : 'অনুভূত হচ্ছে:'}</span>
                  <span className="detail-value">{Math.round(weatherData.current.feelslike_c)}°C</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💧 {language === 'english' ? 'Humidity:' : 'আর্দ্রতা:'}</span>
                  <span className="detail-value">{weatherData.current.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💨 {language === 'english' ? 'Wind:' : 'বাতাস:'}</span>
                  <span className="detail-value">{weatherData.current.wind_kph} km/h</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🧭 {language === 'english' ? 'Wind Direction:' : 'বাতাসের দিক:'}</span>
                  <span className="detail-value">{weatherData.current.wind_dir}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👁️ {language === 'english' ? 'Visibility:' : 'দৃশ্যমানতা:'}</span>
                  <span className="detail-value">{weatherData.current.vis_km} km</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">☔ {language === 'english' ? 'Precipitation:' : 'বৃষ্টিপাত:'}</span>
                  <span className="detail-value">{weatherData.current.precip_mm} mm</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🌅 {language === 'english' ? 'Sunrise:' : 'সূর্যোদয়:'}</span>
                  <span className="detail-value">{formatTime(weatherData.forecast.forecastday[0].astro.sunrise)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🌇 {language === 'english' ? 'Sunset:' : 'সূর্যাস্ত:'}</span>
                  <span className="detail-value">{formatTime(weatherData.forecast.forecastday[0].astro.sunset)}</span>
                </div>
              </div>
              
              <div className="weather-forecast">
                <h3>📅 {language === 'english' ? 'Last updated:' : 'সর্বশেষ আপডেট:'} {new Date(weatherData.current.last_updated).toLocaleString()}</h3>
                <p className="forecast-note">
                  {language === 'english' ? 'Local time in' : 'স্থানীয় সময়'} {weatherData.location.name}: {weatherData.location.localtime}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;