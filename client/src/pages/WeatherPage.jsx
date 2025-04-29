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

  // Weather condition to emoji mapping with more detailed icons
  const getWeatherEmoji = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('partly cloudy')) return '⛅';
    if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) return '☁️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    if (conditionLower.includes('rain') && conditionLower.includes('light')) return '🌦️';
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('heavy rain')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('sleet')) return '🌨️';
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⚡';
    return '🌤️'; // Default emoji
  };

  // Get appropriate activity suggestions based on weather conditions
  const getWeatherSuggestions = (weather) => {
    if (!weather) return [];
    
    const temp = weather.current.temp_c;
    const condition = weather.current.condition.text.toLowerCase();
    const wind = weather.current.wind_kph;
    const humidity = weather.current.humidity;
    const rainChance = weather.forecast?.forecastday[0]?.day?.daily_chance_of_rain;
    const uv = weather.current.uv;
    
    let suggestions = [];
    
    // Temperature-based suggestions
    if (temp >= 32) {
      suggestions.push({
        icon: '🧊',
        text: language === 'english' 
          ? 'It\'s very hot! Stay hydrated and try to remain in shaded or air-conditioned areas'
          : 'খুব গরম! পর্যাপ্ত পানি পান করুন এবং ছায়া বা এয়ার কন্ডিশনযুক্ত জায়গায় থাকার চেষ্টা করুন'
      });
    } else if (temp >= 27) {
      suggestions.push({
        icon: '🥤',
        text: language === 'english' 
          ? 'Warm weather - remember to drink plenty of water today'
          : 'গরম আবহাওয়া - আজ প্রচুর পানি পান করার কথা মনে রাখবেন'
      });
    } else if (temp <= 15) {
      suggestions.push({
        icon: '🧥',
        text: language === 'english' 
          ? 'It\'s quite cold today - wear warm clothes when going out'
          : 'আজ বেশ ঠান্ডা - বাইরে যাওয়ার সময় গরম কাপড় পরুন'
      });
    }
    
    // Condition-based suggestions
    if (condition.includes('rain') || condition.includes('drizzle') || rainChance > 60) {
      suggestions.push({
        icon: '☂️',
        text: language === 'english'
          ? 'Don\'t forget your umbrella or raincoat today'
          : 'আজ আপনার ছাতা বা রেইনকোট নিতে ভুলবেন না'
      });
    }
    
    if (condition.includes('sunny') || condition.includes('clear')) {
      if (uv >= 6) {
        suggestions.push({
          icon: '🧴',
          text: language === 'english'
            ? 'High UV levels today - use sunscreen and wear a hat'
            : 'আজ উচ্চ UV মাত্রা - সানস্ক্রিন ব্যবহার করুন এবং টুপি পরুন'
        });
      }
      
      suggestions.push({
        icon: '🚲',
        text: language === 'english'
          ? 'Perfect weather for outdoor activities like cycling or walking'
          : 'সাইকেল চালানো বা হাঁটার মতো বাইরের কার্যকলাপের জন্য নিখুঁত আবহাওয়া'
      });
    }
    
    if (condition.includes('fog') || condition.includes('mist')) {
      suggestions.push({
        icon: '🚗',
        text: language === 'english'
          ? 'Reduced visibility - drive carefully and use fog lights if needed'
          : 'দৃশ্যমানতা কম - সাবধানে গাড়ি চালান এবং প্রয়োজনে ফগ লাইট ব্যবহার করুন'
      });
    }
    
    if (wind > 20) {
      suggestions.push({
        icon: '💨',
        text: language === 'english'
          ? 'Strong winds today - secure loose objects outdoors'
          : 'আজ শক্তিশালী বাতাস - বাইরের আলগা জিনিসগুলি সুরক্ষিত করুন'
      });
    }
    
    if (humidity > 80) {
      suggestions.push({
        icon: '💧',
        text: language === 'english'
          ? 'High humidity - stay comfortable with lightweight clothing'
          : 'উচ্চ আর্দ্রতা - হালকা পোশাক পরে আরামদায়ক থাকুন'
      });
    }
    
    // Farming suggestions particularly for Bangladesh
    if (condition.includes('rain')) {
      suggestions.push({
        icon: '🌱',
        text: language === 'english'
          ? 'Good day for rice paddy maintenance and planting seedlings'
          : 'ধান ক্ষেত রক্ষণাবেক্ষণ এবং চারা রোপণের জন্য ভালো দিন'
      });
    }
    
    if (condition.includes('sunny') && temp > 28) {
      suggestions.push({
        icon: '🌾',
        text: language === 'english'
          ? 'Consider additional irrigation for crops due to high evaporation'
          : 'উচ্চ বাষ্পীভবনের কারণে ফসলের জন্য অতিরিক্ত সেচের কথা বিবেচনা করুন'
      });
    }
    
    // Cultural suggestions
    const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
    if (isWeekend && !condition.includes('rain') && temp > 22 && temp < 32) {
      suggestions.push({
        icon: '🏞️',
        text: language === 'english'
          ? 'Great weather for visiting local parks or historical sites'
          : 'স্থানীয় পার্ক বা ঐতিহাসিক স্থান পরিদর্শনের জন্য দুর্দান্ত আবহাওয়া'
      });
    }
    
    return suggestions.slice(0, 4); // Limit to 4 suggestions maximum
  };

  // Format time from ISO string
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city},bangladesh&days=3&aqi=no&alerts=no`
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

  // Color class based on temperature
  const getTemperatureColorClass = (temp) => {
    if (temp >= 35) return 'temp-very-hot';
    if (temp >= 30) return 'temp-hot';
    if (temp >= 25) return 'temp-warm';
    if (temp >= 20) return 'temp-mild';
    if (temp >= 10) return 'temp-cool';
    return 'temp-cold';
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

          {weatherLoading && (
            <div className="loading-container">
              <div className="weather-loading-spinner"></div>
              <p>{language === 'english' ? 'Loading weather data...' : 'আবহাওয়া ডেটা লোড হচ্ছে...'}</p>
            </div>
          )}
          
          {error && <div className="error-message">❌ {error}</div>}
          
          {!weatherLoading && !error && weatherData && (
            <div className="weather-container">
              {/* Current Weather Card */}
              <div className="weather-card current-weather">
                <div className="weather-main">
                  <div className="weather-header-info">
                    <h2 className="city-name">{weatherData.location.name}</h2>
                    <p className="date-info">{new Date(weatherData.location.localtime).toLocaleDateString(language === 'english' ? 'en-US' : 'bn-BD', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  
                  <div className="current-conditions">
                    <div className="weather-icon-large">
                      {getWeatherEmoji(weatherData.current.condition.text)}
                    </div>
                    <div className="weather-info">
                      <p className={`temperature ${getTemperatureColorClass(weatherData.current.temp_c)}`}>
                        {Math.round(weatherData.current.temp_c)}°C
                      </p>
                      <p className="weather-description">{weatherData.current.condition.text}</p>
                      <p className="feels-like">
                        {language === 'english' ? 'Feels like' : 'অনুভূত হচ্ছে'}: {Math.round(weatherData.current.feelslike_c)}°C
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="weather-details-grid">
                  <div className="detail-item">
                    <div className="detail-icon">💧</div>
                    <div className="detail-data">
                      <span className="detail-value">{weatherData.current.humidity}%</span>
                      <span className="detail-label">{language === 'english' ? 'Humidity' : 'আর্দ্রতা'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">💨</div>
                    <div className="detail-data">
                      <span className="detail-value">{weatherData.current.wind_kph} km/h</span>
                      <span className="detail-label">{language === 'english' ? 'Wind' : 'বাতাস'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">🧭</div>
                    <div className="detail-data">
                      <span className="detail-value">{weatherData.current.wind_dir}</span>
                      <span className="detail-label">{language === 'english' ? 'Direction' : 'দিক'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">👁️</div>
                    <div className="detail-data">
                      <span className="detail-value">{weatherData.current.vis_km} km</span>
                      <span className="detail-label">{language === 'english' ? 'Visibility' : 'দৃশ্যমানতা'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">☔</div>
                    <div className="detail-data">
                      <span className="detail-value">{weatherData.current.precip_mm} mm</span>
                      <span className="detail-label">{language === 'english' ? 'Precipitation' : 'বৃষ্টিপাত'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">☀️</div>
                    <div className="detail-data">
                      <span className="detail-value">{weatherData.current.uv}</span>
                      <span className="detail-label">{language === 'english' ? 'UV Index' : 'UV সূচক'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">🌅</div>
                    <div className="detail-data">
                      <span className="detail-value">{formatTime(weatherData.forecast.forecastday[0].astro.sunrise)}</span>
                      <span className="detail-label">{language === 'english' ? 'Sunrise' : 'সূর্যোদয়'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <div className="detail-icon">🌇</div>
                    <div className="detail-data">
                      <span className="detail-value">{formatTime(weatherData.forecast.forecastday[0].astro.sunset)}</span>
                      <span className="detail-label">{language === 'english' ? 'Sunset' : 'সূর্যাস্ত'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Weather Forecast Cards */}
              <div className="forecast-section">
                <h3 className="forecast-title">{language === 'english' ? '3-Day Forecast' : '৩-দিনের পূর্বাভাস'}</h3>
                <div className="forecast-cards">
                  {weatherData.forecast.forecastday.map((day, index) => (
                    <div className="forecast-card" key={index}>
                      <div className="forecast-day">
                        {index === 0 
                          ? (language === 'english' ? 'Today' : 'আজ')
                          : new Date(day.date).toLocaleDateString(language === 'english' ? 'en-US' : 'bn-BD', { weekday: 'short' })}
                      </div>
                      <div className="forecast-icon">{getWeatherEmoji(day.day.condition.text)}</div>
                      <div className="forecast-temp">
                        <span className="temp-high">{Math.round(day.day.maxtemp_c)}°</span>
                        <span className="temp-low">{Math.round(day.day.mintemp_c)}°</span>
                      </div>
                      <div className="forecast-condition">{day.day.condition.text}</div>
                      <div className="forecast-rain">
                        <span className="rain-icon">☔</span>
                        <span className="rain-chance">{day.day.daily_chance_of_rain}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Weather Suggestions */}
              <div className="suggestions-section">
                <h3 className="suggestions-title">
                  {language === 'english' ? '🌟 Today\'s Recommendations' : '🌟 আজকের পরামর্শ'}
                </h3>
                <div className="suggestions-container">
                  {getWeatherSuggestions(weatherData).map((suggestion, index) => (
                    <div className="suggestion-card" key={index}>
                      <div className="suggestion-icon">{suggestion.icon}</div>
                      <div className="suggestion-text">{suggestion.text}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="weather-footer">
                <p className="update-time">
                  {language === 'english' ? '🔄 Last updated:' : '🔄 সর্বশেষ আপডেট:'} {new Date(weatherData.current.last_updated).toLocaleString()}
                </p>
                <p className="data-source">
                  {language === 'english' ? 'Data provided by WeatherAPI.com' : 'WeatherAPI.com দ্বারা প্রদত্ত তথ্য'}
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