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
            <Route 
              path="/soil-analyzer" 
              element={
                <PrivateRoute>
                  <SoilAnalyzerPage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;