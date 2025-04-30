// client/src/pages/SoilAnalyzerPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';
import '../styles/soilanalyzer.css';
import Sidebar from '../components/Sidebar';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SoilAnalyzerPage = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('english'); // Default language
  const navigate = useNavigate();
  
  // Soil analysis states
  const [soilType, setSoilType] = useState('');
  const [phLevel, setPhLevel] = useState(7);
  const [moistureLevel, setMoistureLevel] = useState(50);
  const [nitrogenLevel, setNitrogenLevel] = useState(0);
  const [phosphorusLevel, setPhosphorusLevel] = useState(0);
  const [potassiumLevel, setPotassiumLevel] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [location, setLocation] = useState('');
  const [analysisCount, setAnalysisCount] = useState(0);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  
  // New features states
  const [organicMatter, setOrganicMatter] = useState(5);
  const [soilTemp, setSoilTemp] = useState(25);
  const [soilColor, setSoilColor] = useState('#8B4513'); // Default brown
  const [soilDepth, setSoilDepth] = useState(20);
  const [weatherCondition, setWeatherCondition] = useState('sunny');
  const [notes, setNotes] = useState('');
  const [filterByType, setFilterByType] = useState('all');
  const [filterByDate, setFilterByDate] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showCharts, setShowCharts] = useState(false);
  
  // Multi-selection for batch deletion
  const [selectedItems, setSelectedItems] = useState([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First check if user data is already available in AuthContext
        if (user && user.token) {  
          setUserData(user);
          
          // Fetch soil analysis history from the API
          await fetchSoilData(user.token);
          
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
    
        // Parse localStorage data
        const parsedInfo = JSON.parse(userInfo);
        const token = parsedInfo.token;
    
        // Fetch fresh user profile from backend
        const res = await axios.get(`http://localhost:5000/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    
        setUserData(res.data);
        
        // Fetch soil analysis history from the API
        await fetchSoilData(token);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, user]);

  const fetchSoilData = async (token) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/soil-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAnalysisHistory(data.soilData);
      setAnalysisCount(data.analysisCount);
    } catch (error) {
      console.error('Error fetching soil data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'bengali' : 'english');
  };

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  // const toggleCharts = () => {
  //   setShowCharts(!showCharts);
  // };

  const handleSoilTypeChange = (e) => {
    const type = e.target.value;
    setSoilType(type);
    
    // Adjust default values based on soil type
    if (type === 'sandy') {
      setPhLevel(6.0);
      setMoistureLevel(30);
      setSoilColor('#d2b48c'); // Tan color for sandy soil
      setOrganicMatter(3);
    } else if (type === 'clay') {
      setPhLevel(7.5);
      setMoistureLevel(60);
      setSoilColor('#8b4513'); // Brown color for clay soil
      setOrganicMatter(7);
    } else if (type === 'loamy') {
      setPhLevel(6.5);
      setMoistureLevel(45);
      setSoilColor('#654321'); // Dark brown for loamy soil
      setOrganicMatter(5);
    } else if (type === 'silty') {
      setPhLevel(6.8);
      setMoistureLevel(55);
      setSoilColor('#a0522d'); // Sienna color for silty soil
      setOrganicMatter(4);
    }
  };

  const analyzeSoil = async () => {
    if (!soilType) {
      setSaveError(language === 'english' ? 'Please select a soil type' : 'দয়া করে মাটির ধরন নির্বাচন করুন');
      return;
    }
    
    setSaveError('');
    setSaveMessage('');
    
    // Save soil data to database
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      if (!token) {
        setSaveError(language === 'english' ? 'Authentication error' : 'অনুমোদন ত্রুটি');
        return;
      }
      
      const soilData = {
        soilType,
        phLevel,
        moistureLevel,
        nitrogen: nitrogenLevel,
        phosphorus: phosphorusLevel,
        potassium: potassiumLevel,
        location,
        // New fields
        organicMatter,
        soilTemp,
        soilColor,
        soilDepth,
        weatherCondition,
        notes
      };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/soil-data',
        soilData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the analysis count
      setAnalysisCount(data.analysisCount);
      
      // Fetch updated soil data
      await fetchSoilData(token);
      
      setSaveMessage(language === 'english' ? 'Soil data saved successfully!' : 'মাটির তথ্য সফলভাবে সংরক্ষিত হয়েছে!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
      
      // Reset form if needed
      // resetForm();
      
    } catch (error) {
      console.error('Error saving soil data:', error);
      setSaveError(language === 'english' ? 'Error saving soil data' : 'মাটির তথ্য সংরক্ষণ করতে ত্রুটি');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Filter and sort analysis history
  const getFilteredAndSortedHistory = () => {
    let filtered = [...analysisHistory];
    
    // Apply type filter
    if (filterByType !== 'all') {
      filtered = filtered.filter(item => item.soilType === filterByType);
    }
    
    // Apply date filter
    if (filterByDate === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(item => new Date(item.createdAt) >= today);
    } else if (filterByDate === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(item => new Date(item.createdAt) >= weekAgo);
    } else if (filterByDate === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(item => new Date(item.createdAt) >= monthAgo);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'ph') {
        return sortOrder === 'asc' ? a.phLevel - b.phLevel : b.phLevel - a.phLevel;
      } else if (sortBy === 'moisture') {
        return sortOrder === 'asc' ? a.moistureLevel - b.moistureLevel : b.moistureLevel - a.moistureLevel;
      }
      return 0;
    });
    
    return filtered;
  };
  
  // Pagination
  const filteredHistory = getFilteredAndSortedHistory();
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const currentItems = filteredHistory.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  // Handle pagination
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  // Toggle select item for batch operation
  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Select/deselect all items on current page
  const toggleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(item => item._id));
    }
  };
  
  // Delete multiple selected items
  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      // Create an array of promises for each delete operation
      const deletePromises = selectedItems.map(id => 
        axios.delete(`http://localhost:5000/api/soil-data/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      );
      
      // Wait for all deletes to complete
      await Promise.all(deletePromises);
      
      // Refresh data
      await fetchSoilData(token);
      setSelectedItems([]);
      
      setSaveMessage(language === 'english' 
        ? `${selectedItems.length} records deleted successfully!` 
        : `${selectedItems.length} রেকর্ড সফলভাবে মুছে ফেলা হয়েছে!`);
      
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting selected items:', error);
      setSaveError(language === 'english' 
        ? 'Error deleting selected items' 
        : 'নির্বাচিত আইটেম মুছতে ত্রুটি');
    }
  };
  
  // Export data to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Soil Type', 'pH', 'Moisture', 'N', 'P', 'K', 'Location', 'Notes'];
    
    const csvData = filteredHistory.map(item => [
      formatDate(item.createdAt),
      item.soilType,
      item.phLevel,
      item.moistureLevel,
      item.nutrients?.nitrogen || 0,
      item.nutrients?.phosphorus || 0,
      item.nutrients?.potassium || 0,
      item.location || '',
      item.notes || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `soil_analysis_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    // Sort by date ascending for chart
    const sortedData = [...analysisHistory].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Last 10 entries at most
    const recentData = sortedData.slice(-10);
    
    const labels = recentData.map(item => formatDate(item.createdAt));
    
    const phData = {
      labels,
      datasets: [
        {
          label: 'pH Level',
          data: recentData.map(item => item.phLevel),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1
        }
      ]
    };
    
    const moistureData = {
      labels,
      datasets: [
        {
          label: 'Moisture Level (%)',
          data: recentData.map(item => item.moistureLevel),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.1
        }
      ]
    };
    
    const nutrientData = {
      labels,
      datasets: [
        {
          label: 'Nitrogen (N)',
          data: recentData.map(item => item.nutrients?.nitrogen || 0),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1
        },
        {
          label: 'Phosphorus (P)',
          data: recentData.map(item => item.nutrients?.phosphorus || 0),
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          tension: 0.1
        },
        {
          label: 'Potassium (K)',
          data: recentData.map(item => item.nutrients?.potassium || 0),
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          tension: 0.1
        }
      ]
    };
    
    return { phData, moistureData, nutrientData };
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Soil Parameters Over Time',
      },
    },
  };

  // Determine soil health status
  const getSoilHealthStatus = () => {
    // This is just a simplified example
    if (!soilType) return { status: 'unknown', color: '#ccc' };
    
    // Calculate average health based on multiple factors
    let healthScore = 0;
    
    // pH optimality (6.0 - 7.0 is ideal for most crops)
    const phOptimality = phLevel >= 6.0 && phLevel <= 7.0 ? 100 : 
                          phLevel > 7.0 && phLevel <= 7.5 ? 80 :
                          phLevel > 5.5 && phLevel < 6.0 ? 80 :
                          phLevel > 7.5 && phLevel <= 8.0 ? 60 :
                          phLevel > 5.0 && phLevel <= 5.5 ? 60 : 40;
    
    // Moisture optimality (40-60% is ideal for most soils)
    const moistureOptimality = moistureLevel >= 40 && moistureLevel <= 60 ? 100 :
                              moistureLevel >= 30 && moistureLevel < 40 ? 80 :
                              moistureLevel > 60 && moistureLevel <= 70 ? 80 :
                              moistureLevel >= 20 && moistureLevel < 30 ? 60 :
                              moistureLevel > 70 && moistureLevel <= 80 ? 60 : 40;
    
    // NPK levels (simplified)
    const nutrientOptimality = (nitrogenLevel + phosphorusLevel + potassiumLevel) / 3;
    
    // Organic matter (4-6% is ideal)
    const organicOptimality = organicMatter >= 4 && organicMatter <= 6 ? 100 :
                            organicMatter >= 3 && organicMatter < 4 ? 80 :
                            organicMatter > 6 && organicMatter <= 8 ? 80 :
                            organicMatter >= 2 && organicMatter < 3 ? 60 :
                            organicMatter > 8 && organicMatter <= 10 ? 60 : 40;
    
    // Calculate overall health score
    healthScore = (phOptimality + moistureOptimality + nutrientOptimality + organicOptimality) / 4;
    
    // Determine status based on health score
    if (healthScore >= 80) {
      return { status: language === 'english' ? 'Excellent' : 'অতি উত্তম', color: '#4CAF50' };
    } else if (healthScore >= 60) {
      return { status: language === 'english' ? 'Good' : 'ভাল', color: '#8BC34A' };
    } else if (healthScore >= 40) {
      return { status: language === 'english' ? 'Fair' : 'মোটামুটি', color: '#FFC107' };
    } else {
      return { status: language === 'english' ? 'Poor' : 'দুর্বল', color: '#F44336' };
    }
  };
  
  const soilHealth = getSoilHealthStatus();

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="loader"></div>
        <div className="text-xl ml-4">Loading soil analyzer...</div>
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
            <span className="breadcrumb-item active">{language === 'english' ? 'Soil Analyzer' : 'মাটি বিশ্লেষক'}</span>
          </div>
          <div className="user-controls">
            <button onClick={toggleLanguage} className="language-toggle">
              {language === 'english' ? 'বাংলা' : 'English'}
            </button>
            <div className="notification-icon">🔔</div>
            <div className="avatar">
              {userData && userData.profileImage ? (
                <img src={userData.profileImage} alt={userData.name} />
              ) : (
                userData && userData.name ? userData.name.charAt(0).toUpperCase() : 'U'
              )}
            </div>
          </div>
        </nav>

        {/* Soil Analyzer Content */}
        <div className="dashboard-content">
          <div className="soil-analyzer-header">
            <h1 className="page-title">
              {language === 'english' ? '🌱 Soil Analyzer' : '🌱 মাটি বিশ্লেষক'}
            </h1>
            <p className="page-subtitle">
              {language === 'english' 
                ? `Analyze your soil parameters (${analysisCount} analysis performed)` 
                : `আপনার মাটির পরামিতি বিশ্লেষণ করুন (${analysisCount} বিশ্লেষণ সম্পন্ন হয়েছে)`}
            </p>
          </div>

          <div className="soil-analyzer-content">
            {/* Soil Health Status Card */}
            {/* <div className="soil-health-card">
              <div className="card-header">
                <h2>{language === 'english' ? '🌿 Soil Health Status' : '🌿 মাটির স্বাস্থ্যের অবস্থা'}</h2>
              </div>
              <div className="soil-health-content">
                <div className="soil-health-gauge" style={{ background: `conic-gradient(${soilHealth.color} 0%, ${soilHealth.color} 100%)` }}>
                  <div className="soil-health-gauge-inner">
                    <span className="soil-health-status" style={{ color: soilHealth.color }}>
                      {soilHealth.status}
                    </span>
                  </div>
                </div>
                <div className="soil-health-details">
                  <div className="soil-health-detail">
                    <span className="detail-label">{language === 'english' ? 'Soil Type' : 'মাটির ধরন'}</span>
                    <span className="detail-value">
                      {soilType ? (language === 'english' 
                        ? soilType.charAt(0).toUpperCase() + soilType.slice(1) 
                        : soilType === 'sandy' 
                          ? 'বালিময়' 
                          : soilType === 'clay' 
                            ? 'এঁটেল' 
                            : soilType === 'loamy' 
                              ? 'দোআঁশ' 
                              : 'পলিময়') : '-'}
                    </span>
                  </div>
                  <div className="soil-health-detail">
                    <span className="detail-label">{language === 'english' ? 'pH Level' : 'পিএইচ মাত্রা'}</span>
                    <span className="detail-value">{phLevel}</span>
                  </div>
                  <div className="soil-health-detail">
                    <span className="detail-label">{language === 'english' ? 'Moisture' : 'আর্দ্রতা'}</span>
                    <span className="detail-value">{moistureLevel}%</span>
                  </div>
                  <div className="soil-health-detail">
                    <span className="detail-label">{language === 'english' ? 'Organic Matter' : 'জৈব পদার্থ'}</span>
                    <span className="detail-value">{organicMatter}%</span>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="soil-input-card full-width">
              <div className="card-header">
                <h2>{language === 'english' ? '📊 Soil Parameters' : '📊 মাটির পরামিতি'}</h2>
              </div>
              <div className="soil-input-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>{language === 'english' ? 'Soil Type' : 'মাটির ধরন'}</label>
                    <select 
                      value={soilType} 
                      onChange={handleSoilTypeChange}
                      className="soil-select"
                    >
                      <option value="">{language === 'english' ? 'Select Soil Type' : 'মাটির ধরন নির্বাচন করুন'}</option>
                      <option value="sandy">{language === 'english' ? 'Sandy' : 'বালিময়'}</option>
                      <option value="clay">{language === 'english' ? 'Clay' : 'এঁটেল'}</option>
                      <option value="loamy">{language === 'english' ? 'Loamy' : 'দোআঁশ'}</option>
                      <option value="silty">{language === 'english' ? 'Silty' : 'পলিময়'}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{language === 'english' ? 'Location (Optional)' : 'অবস্থান (ঐচ্ছিক)'}</label>
                    <input 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={language === 'english' ? 'e.g. North field' : 'যেমন উত্তর ক্ষেত্র'}
                      className="location-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      {language === 'english' ? 'pH Level' : 'পিএইচ মাত্রা'}: {phLevel}
                    </label>
                    <div className="slider-container">
                      <span className="slider-min">4.0</span>
                      <input 
                        type="range" 
                        min="4.0" 
                        max="10.0" 
                        step="0.1" 
                        value={phLevel} 
                        onChange={(e) => setPhLevel(parseFloat(e.target.value))}
                        className="range-slider"
                      />
                      <span className="slider-max">10.0</span>
                    </div>
                    <div className="ph-scale">
                      <div className="ph-marker acidic">{language === 'english' ? 'Acidic' : 'অম্লীয়'}</div>
                      <div className="ph-marker neutral">{language === 'english' ? 'Neutral' : 'নিরপেক্ষ'}</div>
                      <div className="ph-marker alkaline">{language === 'english' ? 'Alkaline' : 'ক্ষারীয়'}</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      {language === 'english' ? 'Moisture Level' : 'আর্দ্রতার মাত্রা'}: {moistureLevel}%
                    </label>
                    <div className="slider-container">
                      <span className="slider-min">0%</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={moistureLevel} 
                        onChange={(e) => setMoistureLevel(parseInt(e.target.value))}
                        className="range-slider moisture-slider"
                      />
                      <span className="slider-max">100%</span>
                    </div>
                  </div>
                </div>

                {/* New field: Soil Color with color picker */}
                <div className="form-row">
                  <div className="form-group">
                    <label>{language === 'english' ? 'Soil Color' : 'মাটির রঙ'}</label>
                    <div className="color-picker-container">
                      <input 
                        type="color" 
                        value={soilColor} 
                        onChange={(e) => setSoilColor(e.target.value)}
                        className="color-picker"
                      />
                      <span className="color-value">{soilColor}</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      {language === 'english' ? 'Soil Temperature (°C)' : 'মাটির তাপমাত্রা (°C)'}: {soilTemp}°C
                    </label>
                    <div className="slider-container">
                      <span className="slider-min">0°C</span>
                      <input 
                        type="range"
                        min="0" 
                        max="50" 
                        value={soilTemp} 
                        onChange={(e) => setSoilTemp(parseInt(e.target.value))}
                        className="range-slider"
                      />
                      <span className="slider-max">50°C</span>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      {language === 'english' ? 'Soil Depth (cm)' : 'মাটির গভীরতা (সেমি)'}: {soilDepth} cm
                    </label>
                    <div className="slider-container">
                      <span className="slider-min">5</span>
                      <input 
                        type="range" 
                        min="5" 
                        max="100" 
                        value={soilDepth} 
                        onChange={(e) => setSoilDepth(parseInt(e.target.value))}
                        className="range-slider"
                      />
                      <span className="slider-max">100</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>{language === 'english' ? 'Weather Condition' : 'আবহাওয়ার অবস্থা'}</label>
                    <select 
                      value={weatherCondition} 
                      onChange={(e) => setWeatherCondition(e.target.value)}
                      className="soil-select"
                    >
                      <option value="sunny">{language === 'english' ? 'Sunny' : 'রৌদ্রোজ্জ্বল'}</option>
                      <option value="cloudy">{language === 'english' ? 'Cloudy' : 'মেঘলা'}</option>
                      <option value="rainy">{language === 'english' ? 'Rainy' : 'বৃষ্টিপাত'}</option>
                      <option value="dry">{language === 'english' ? 'Dry' : 'শুষ্ক'}</option>
                      <option value="humid">{language === 'english' ? 'Humid' : 'আর্দ্র'}</option>
                    </select>
                  </div>
                </div>

                <div className="advanced-toggle">
                  <button type="button" onClick={toggleAdvancedOptions} className="toggle-button">
                    {showAdvancedOptions ? '▼' : '►'} {language === 'english' ? 'Advanced Nutrient Options' : 'উন্নত পুষ্টি বিকল্প'}
                  </button>
                </div>

                {showAdvancedOptions && (
                  <div className="advanced-options">
                    <div className="nutrient-sliders">
                      <div className="form-group">
                        <label>
                          {language === 'english' ? 'Nitrogen (N) Level' : 'নাইট্রোজেন (N) মাত্রা'}: {nitrogenLevel}%
                        </label>
                        <div className="slider-container">
                          <span className="slider-min">0%</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={nitrogenLevel} 
                            onChange={(e) => setNitrogenLevel(parseInt(e.target.value))}
                            className="range-slider nitrogen-slider"
                          />
                          <span className="slider-max">100%</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          {language === 'english' ? 'Phosphorus (P) Level' : 'ফসফরাস (P) মাত্রা'}: {phosphorusLevel}%
                        </label>
                        <div className="slider-container">
                          <span className="slider-min">0%</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={phosphorusLevel} 
                            onChange={(e) => setPhosphorusLevel(parseInt(e.target.value))}
                            className="range-slider phosphorus-slider"
                          />
                          <span className="slider-max">100%</span>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          {language === 'english' ? 'Potassium (K) Level' : 'পটাসিয়াম (K) মাত্রা'}: {potassiumLevel}%
                        </label>
                        <div className="slider-container">
                          <span className="slider-min">0%</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={potassiumLevel} 
                            onChange={(e) => setPotassiumLevel(parseInt(e.target.value))}
                            className="range-slider potassium-slider"
                          />
                          <span className="slider-max">100%</span>
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>
                          {language === 'english' ? 'Organic Matter' : 'জৈব পদার্থ'}: {organicMatter}%
                        </label>
                        <div className="slider-container">
                          <span className="slider-min">0%</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="15" 
                            value={organicMatter} 
                            onChange={(e) => setOrganicMatter(parseInt(e.target.value))}
                            className="range-slider"
                          />
                          <span className="slider-max">15%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>{language === 'english' ? 'Notes' : 'নোট'}</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={language === 'english' ? 'Add any observations or notes about this soil sample...' : 'এই মাটির নমুনা সম্পর্কে যেকোনো পর্যবেক্ষণ বা নোট যোগ করুন...'}
                        className="notes-textarea"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Success/Error Messages */}
                {saveMessage && (
                  <div className="success-message">{saveMessage}</div>
                )}
                {saveError && (
                  <div className="error-message">{saveError}</div>
                )}

                <div className="analyze-button-container">
                  <button 
                    onClick={analyzeSoil} 
                    className="analyze-button"
                  >
                    {language === 'english' ? '🔍 Analyze Soil' : '🔍 মাটি বিশ্লেষণ করুন'}
                  </button>
                </div>
              </div>
            </div>

            {/* Soil Recommendations Card */}
            {/* <div className="recommendations-card">
              <div className="card-header">
                <h2>{language === 'english' ? '🌾 Crop & Treatment Recommendations' : '🌾 ফসল এবং চিকিৎসার সুপারিশ'}</h2>
              </div>
              <div className="recommendation-content">
                {!soilType ? (
                  <div className="no-data-message">
                    {language === 'english' 
                      ? 'Please select a soil type and analyze to get recommendations' 
                      : 'সুপারিশ পেতে একটি মাটির ধরন নির্বাচন করুন এবং বিশ্লেষণ করুন'}
                  </div>
                ) : (
                  <>
                    <div className="recommendation-section">
                      <h3>{language === 'english' ? 'Suitable Crops' : 'উপযুক্ত ফসল'}</h3>
                      <ul className="recommendation-list">
                        {soilType === 'sandy' && (
                          <>
                            <li>{language === 'english' ? 'Carrots' : 'গাজর'}</li>
                            <li>{language === 'english' ? 'Potatoes' : 'আলু'}</li>
                            <li>{language === 'english' ? 'Radishes' : 'মূলা'}</li>
                            <li>{language === 'english' ? 'Lettuce' : 'লেটুস'}</li>
                          </>
                        )}
                        {soilType === 'clay' && (
                          <>
                            <li>{language === 'english' ? 'Cabbage' : 'বাঁধাকপি'}</li>
                            <li>{language === 'english' ? 'Broccoli' : 'ব্রোকলি'}</li>
                            <li>{language === 'english' ? 'Cauliflower' : 'ফুলকপি'}</li>
                            <li>{language === 'english' ? 'Beans' : 'শিম'}</li>
                          </>
                        )}
                        {soilType === 'loamy' && (
                          <>
                            <li>{language === 'english' ? 'Corn' : 'ভুট্টা'}</li>
                            <li>{language === 'english' ? 'Tomatoes' : 'টমেটো'}</li>
                            <li>{language === 'english' ? 'Peppers' : 'মরিচ'}</li>
                            <li>{language === 'english' ? 'Cucumber' : 'শসা'}</li>
                          </>
                        )}
                        {soilType === 'silty' && (
                          <>
                            <li>{language === 'english' ? 'Pumpkins' : 'কুমড়া'}</li>
                            <li>{language === 'english' ? 'Squash' : 'স্কোয়াশ'}</li>
                            <li>{language === 'english' ? 'Eggplant' : 'বেগুন'}</li>
                            <li>{language === 'english' ? 'Rice' : 'চাল'}</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="recommendation-section">
                      <h3>{language === 'english' ? 'Soil Treatment' : 'মাটির চিকিৎসা'}</h3>
                      <ul className="recommendation-list">
                        {phLevel < 6.0 && (
                          <li>{language === 'english' ? 'Add lime to increase pH level' : 'পিএইচ মাত্রা বাড়াতে চুন যোগ করুন'}</li>
                        )}
                        {phLevel > 7.5 && (
                          <li>{language === 'english' ? 'Add sulfur to decrease pH level' : 'পিএইচ মাত্রা কমাতে সালফার যোগ করুন'}</li>
                        )}
                        {moistureLevel < 30 && (
                          <li>{language === 'english' ? 'Increase irrigation frequency' : 'সেচের পরিমাণ বাড়ান'}</li>
                        )}
                        {moistureLevel > 70 && (
                          <li>{language === 'english' ? 'Improve drainage system' : 'জল নিষ্কাশন ব্যবস্থা উন্নত করুন'}</li>
                        )}
                        {organicMatter < 3 && (
                          <li>{language === 'english' ? 'Add compost or organic matter' : 'কম্পোস্ট বা জৈব পদার্থ যোগ করুন'}</li>
                        )}
                        {nitrogenLevel < 30 && (
                          <li>{language === 'english' ? 'Add nitrogen-rich fertilizer' : 'নাইট্রোজেন সমৃদ্ধ সার যোগ করুন'}</li>
                        )}
                        {phosphorusLevel < 30 && (
                          <li>{language === 'english' ? 'Add phosphate fertilizer' : 'ফসফেট সার যোগ করুন'}</li>
                        )}
                        {potassiumLevel < 30 && (
                          <li>{language === 'english' ? 'Add potassium-rich fertilizer' : 'পটাসিয়াম সমৃদ্ধ সার যোগ করুন'}</li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div> */}

            {/* Analysis History and Charts */}
            <div className="history-card">
              <div className="card-header">
                <h2>{language === 'english' ? '📜 Analysis History' : '📜 বিশ্লেষণ ইতিহাস'}</h2>
                <div className="card-actions">
                  {/* <button className="toggle-button" onClick={toggleCharts}>
                    {showCharts 
                      ? (language === 'english' ? 'Hide Charts' : 'চার্ট লুকান') 
                      : (language === 'english' ? 'Show Charts' : 'চার্ট দেখান')}
                  </button> */}
                </div>
              </div>
              
              {/* Charts Section */}
              {showCharts && analysisHistory.length > 0 && (
                <div className="charts-section">
                  {(() => {
                    const { phData, moistureData, nutrientData } = prepareChartData();
                    return (
                      <>
                        <div className="chart-container">
                          <h3>{language === 'english' ? 'pH Level Trends' : 'পিএইচ মাত্রার প্রবণতা'}</h3>
                          <Line options={chartOptions} data={phData} />
                        </div>
                        <div className="chart-container">
                          <h3>{language === 'english' ? 'Moisture Level Trends' : 'আর্দ্রতার মাত্রার প্রবণতা'}</h3>
                          <Line options={chartOptions} data={moistureData} />
                        </div>
                        <div className="chart-container">
                          <h3>{language === 'english' ? 'Nutrient Level Trends' : 'পুষ্টির মাত্রার প্রবণতা'}</h3>
                          <Line options={chartOptions} data={nutrientData} />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
              
              <div className="history-content">
                {/* Filter and export options */}
                <div className="history-controls">
                  <div className="filter-options">
                    <select 
                      value={filterByType} 
                      onChange={(e) => setFilterByType(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">{language === 'english' ? 'All Soil Types' : 'সব মাটির ধরন'}</option>
                      <option value="sandy">{language === 'english' ? 'Sandy' : 'বালিময়'}</option>
                      <option value="clay">{language === 'english' ? 'Clay' : 'এঁটেল'}</option>
                      <option value="loamy">{language === 'english' ? 'Loamy' : 'দোআঁশ'}</option>
                      <option value="silty">{language === 'english' ? 'Silty' : 'পলিময়'}</option>
                    </select>
                    
                    <select 
                      value={filterByDate} 
                      onChange={(e) => setFilterByDate(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">{language === 'english' ? 'All Dates' : 'সব তারিখ'}</option>
                      <option value="today">{language === 'english' ? 'Today' : 'আজ'}</option>
                      <option value="week">{language === 'english' ? 'Last 7 Days' : 'গত ৭ দিন'}</option>
                      <option value="month">{language === 'english' ? 'Last 30 Days' : 'গত ৩০ দিন'}</option>
                    </select>
                    
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="filter-select"
                    >
                      <option value="date">{language === 'english' ? 'Sort by Date' : 'তারিখ অনুসারে সাজান'}</option>
                      <option value="ph">{language === 'english' ? 'Sort by pH' : 'পিএইচ অনুসারে সাজান'}</option>
                      <option value="moisture">{language === 'english' ? 'Sort by Moisture' : 'আর্দ্রতা অনুসারে সাজান'}</option>
                    </select>
                    
                    <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="sort-order-button">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                  
                  <div className="action-buttons">
                    <button onClick={exportToCSV} className="export-button">
                      {language === 'english' ? 'Export CSV' : 'CSV এক্সপোর্ট করুন'}
                    </button>
                    
                    {selectedItems.length > 0 && (
                      <button onClick={deleteSelectedItems} className="delete-selected-button">
                        {language === 'english' 
                          ? `Delete (${selectedItems.length})` 
                          : `মুছুন (${selectedItems.length})`}
                      </button>
                    )}
                  </div>
                </div>

                {filteredHistory.length === 0 ? (
                  <div className="no-data-message">
                    {language === 'english' 
                      ? 'No soil analysis history found' 
                      : 'কোন মাটি বিশ্লেষণের ইতিহাস পাওয়া যায়নি'}
                  </div>
                ) : (
                  <>
                    <div className="history-table-container">
                      <table className="history-table">
                        <thead>
                          <tr>
                            <th>
                              <input 
                                type="checkbox" 
                                checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                                onChange={toggleSelectAll}
                              />
                            </th>
                            <th>{language === 'english' ? 'Date' : 'তারিখ'}</th>
                            <th>{language === 'english' ? 'Soil Type' : 'মাটির ধরন'}</th>
                            <th>{language === 'english' ? 'pH' : 'পিএইচ'}</th>
                            <th>{language === 'english' ? 'Moisture' : 'আর্দ্রতা'}</th>
                            <th>N-P-K</th>
                            <th>{language === 'english' ? 'Location' : 'অবস্থান'}</th>
                            <th>{language === 'english' ? 'Actions' : 'কার্যক্রম'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map(item => (
                            <tr key={item._id}>
                              <td>
                                <input 
                                  type="checkbox"
                                  checked={selectedItems.includes(item._id)}
                                  onChange={() => toggleSelectItem(item._id)}
                                />
                              </td>
                              <td>{formatDate(item.createdAt)}</td>
                              <td>
                                {language === 'english' 
                                  ? item.soilType.charAt(0).toUpperCase() + item.soilType.slice(1)
                                  : item.soilType === 'sandy' 
                                    ? 'বালিময়' 
                                    : item.soilType === 'clay' 
                                      ? 'এঁটেল' 
                                      : item.soilType === 'loamy' 
                                        ? 'দোআঁশ' 
                                        : 'পলিময়'}
                              </td>
                              <td>{item.phLevel}</td>
                              <td>{item.moistureLevel}%</td>
                              <td>
                                {item.nutrients?.nitrogen || 0}-
                                {item.nutrients?.phosphorus || 0}-
                                {item.nutrients?.potassium || 0}
                              </td>
                              <td>{item.location || '-'}</td>
                              <td>
                                <button 
                                  className="view-details-button"
                                  onClick={() => navigate(`/soil-analysis/${item._id}`)}
                                >
                                  {language === 'english' ? 'View' : 'দেখুন'}
                                </button>
                                <button 
                                  className="delete-button"
                                  onClick={async () => {
                                    try {
                                      const token = user?.token || JSON.parse(localStorage.getItem('userInfo'))?.token;
                                      await axios.delete(`http://localhost:5000/api/soil-data/${item._id}`, {
                                        headers: { Authorization: `Bearer ${token}` }
                                      });
                                      await fetchSoilData(token);
                                      setSaveMessage(language === 'english' ? 'Analysis deleted' : 'বিশ্লেষণ মুছে ফেলা হয়েছে');
                                      setTimeout(() => setSaveMessage(''), 3000);
                                    } catch (error) {
                                      console.error('Error deleting analysis:', error);
                                      setSaveError(language === 'english' ? 'Error deleting' : 'মুছতে ত্রুটি');
                                    }
                                  }}
                                >
                                  {language === 'english' ? 'Delete' : 'মুছুন'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button 
                          onClick={() => goToPage(1)} 
                          disabled={page === 1}
                          className="pagination-button"
                        >
                          &laquo;
                        </button>
                        <button 
                          onClick={() => goToPage(page - 1)} 
                          disabled={page === 1}
                          className="pagination-button"
                        >
                          &lsaquo;
                        </button>
                        
                        <span className="pagination-info">
                          {language === 'english' 
                            ? `Page ${page} of ${totalPages}` 
                            : `পৃষ্ঠা ${page} / ${totalPages}`}
                        </span>
                        
                        <button 
                          onClick={() => goToPage(page + 1)} 
                          disabled={page === totalPages}
                          className="pagination-button"
                        >
                          &rsaquo;
                        </button>
                        <button 
                          onClick={() => goToPage(totalPages)} 
                          disabled={page === totalPages}
                          className="pagination-button"
                        >
                          &raquo;
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilAnalyzerPage;