// client/src/pages/WeatherPage.js
import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';
import '../styles/WeatherPage.css';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Dhaka');
  
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
    const fetchWeatherData = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, apiKey]);

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

  return (
    <div className="page-content weather-page">
      <div className="weather-header">
        <h1 className="page-title">🌦️ Bangladesh Weather</h1>
        <div className="city-selector">
          <label htmlFor="city-select">Select City:</label>
          <select id="city-select" value={city} onChange={handleCityChange}>
            {bangladeshCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="loading-message">⏳ Loading weather data...</div>}
      
      {error && <div className="error-message">❌ {error}</div>}
      
      {!loading && !error && weatherData && (
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
              <span className="detail-label">🌡️ Feels like:</span>
              <span className="detail-value">{Math.round(weatherData.current.feelslike_c)}°C</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💧 Humidity:</span>
              <span className="detail-value">{weatherData.current.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">💨 Wind:</span>
              <span className="detail-value">{weatherData.current.wind_kph} km/h</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🧭 Wind Direction:</span>
              <span className="detail-value">{weatherData.current.wind_dir}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">👁️ Visibility:</span>
              <span className="detail-value">{weatherData.current.vis_km} km</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">☔ Precipitation:</span>
              <span className="detail-value">{weatherData.current.precip_mm} mm</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🌅 Sunrise:</span>
              <span className="detail-value">{formatTime(weatherData.forecast.forecastday[0].astro.sunrise)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">🌇 Sunset:</span>
              <span className="detail-value">{formatTime(weatherData.forecast.forecastday[0].astro.sunset)}</span>
            </div>
          </div>
          
          <div className="weather-forecast">
            <h3>📅 Last updated: {new Date(weatherData.current.last_updated).toLocaleString()}</h3>
            <p className="forecast-note">Local time in {weatherData.location.name}: {weatherData.location.localtime}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherPage;