// client/src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const findUser = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.post('/users/reset-password/find', { email });
      setSecurityQuestions(res.data.securityQuestions);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  const verifyAnswer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await api.post('/users/reset-password/verify', {
        email,
        securityQuestion: selectedQuestion,
        securityAnswer
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect answer');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await api.post('/users/reset-password/reset', {
        email,
        securityQuestion: selectedQuestion,
        securityAnswer,
        newPassword
      });
      
      // Show success and redirect to login
      alert('Password reset successful. Please login with your new password.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  // Render functions for each step
  const renderStep1 = () => (
    <form onSubmit={findUser}>
      <h2>Reset Password</h2>
      <p>Enter your email address to find your account</p>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Searching...' : 'Find Account'}
      </button>
      
      <p className="form-footer">
        <Link to="/login">Back to Login</Link>
      </p>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={verifyAnswer}>
      <h2>Security Verification</h2>
      <p>Please answer one of your security questions</p>
      
      <div className="form-group">
        <label htmlFor="securityQuestion">Security Question</label>
        <select
          id="securityQuestion"
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          required
        >
          <option value="">Select a security question</option>
          {securityQuestions.map((question, index) => (
            <option key={index} value={question}>{question}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="securityAnswer">Your Answer</label>
        <input
          type="text"
          id="securityAnswer"
          value={securityAnswer}
          onChange={(e) => setSecurityAnswer(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Verifying...' : 'Verify Answer'}
      </button>
      
      <p className="form-footer">
        <a href="#" onClick={() => setStep(1)}>Back to Email Entry</a>
      </p>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={resetPassword}>
      <h2>Create New Password</h2>
      <p>Please enter your new password</p>
      
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength="6"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="reset-password-container">
      {error && <div className="error-message">{error}</div>}
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};

export default ResetPasswordPage;