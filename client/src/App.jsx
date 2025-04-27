// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SoilAnalyzerPage from './pages/SoilAnalyzerPage';
import './App.css';
import CropsPage from './pages/CropsPage'; 
import WeatherPage from './pages/WeatherPage';
import RecommendationsPage from './pages/RecommendationsPage';
import SettingsPage from './pages/SettingsPage';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route path="/crops" element={<PrivateRoute><CropsPage /></PrivateRoute>} />
<Route path="/soil-analyzer" element={<PrivateRoute><SoilAnalyzerPage /></PrivateRoute>} />
<Route path="/weather" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
<Route path="/recommendations" element={<PrivateRoute><RecommendationsPage /></PrivateRoute>} />
<Route path="/settings" element={<PrivateRoute> <SettingsPage /> </PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;