import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SoilAnalyzerPage from './pages/SoilAnalyzerPage';
import CropsPage from './pages/CropsPage'; 
import WeatherPage from './pages/WeatherPage';
import SettingsPage from './pages/SettingsPage';
import SoilRecommendationPage from './pages/SoilRecommendationPage';
import CommunityPage from './pages/CommunityPage';
import MarketplacePage from './pages/MarketplacePage'; // Add this import
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* User routes */}
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
            <Route path="/soil-analysis/:id" element={<PrivateRoute><SoilRecommendationPage /></PrivateRoute>} />
            <Route path="/weather" element={<PrivateRoute><WeatherPage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/community" element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
            <Route path="/marketplace" element={<PrivateRoute><MarketplacePage /></PrivateRoute>} /> {/* Add this route */}
            
            {/* Admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            {/* Add more admin routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;