// client/src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const navigate = useNavigate();

  // Step 1: Find user by email
  const findUserByEmail = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/users/reset-password/find', { email });
      setSecurityQuestions(res.data.securityQuestions);
      setMessage('Please answer one of the security questions to verify your identity.');
      setStep(2);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify security answer
  const verifySecurityAnswer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/users/reset-password/verify', {
        email,
        securityQuestion,
        securityAnswer
      });
      setMessage('Security answer verified. Please set your new password.');
      setStep(3);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Incorrect answer. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/users/reset-password/reset', {
        email,
        securityQuestion,
        securityAnswer,
        newPassword
      });
      
      setMessage('Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h1>Reset Password</h1>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      {step === 1 && (
        <form onSubmit={findUserByEmail}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Find Account'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={verifySecurityAnswer}>
          <div className="form-group">
            <label htmlFor="securityQuestion">Security Question</label>
            <select
              id="securityQuestion"
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
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
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Answer'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={resetPassword}>
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
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <p>
        Remember your password? <Link to="/login">Login</Link>
      </p>

      <style jsx>{`
        .reset-password-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
          text-align: center;
          color: #2e7d32;
          margin-bottom: 20px;
        }
        
        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .success-message {
          color: #2e7d32;
          background-color: #e8f5e9;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #424242;
        }
        
        input, select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: #2e7d32;
          box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
        }
        
        button {
          background-color: #2e7d32;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s;
          width: 100%;
        }
        
        button:hover {
          background-color: #1b5e20;
        }
        
        button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
        }
        
        p {
          text-align: center;
          margin-top: 20px;
        }
        
        a {
          color: #2e7d32;
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;