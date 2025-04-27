// client/src/pages/RegisterPage.js
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    division: '',
    district: '',
    farmSize: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    securityQuestion3: '',
    securityAnswer3: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Bangladesh divisions and districts mapping
  const divisionsWithDistricts = {
    'Dhaka': [
      'Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Narsingdi', 
      'Munshiganj', 'Manikganj', 'Faridpur', 'Madaripur', 'Shariatpur',
      'Rajbari', 'Gopalganj', 'Kishoreganj'
    ],
    'Chittagong': [
      'Chittagong', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari',
      'Feni', 'Lakshmipur', 'Comilla', 'Noakhali', 'Chandpur', 'Brahmanbaria'
    ],
    'Rajshahi': [
      'Rajshahi', 'Chapainawabganj', 'Naogaon', 'Natore', 'Pabna',
      'Bogra', 'Sirajganj', 'Joypurhat'
    ],
    'Khulna': [
      'Khulna', 'Bagerhat', 'Satkhira', 'Jessore', 'Magura',
      'Jhenaidah', 'Narail', 'Kushtia', 'Chuadanga', 'Meherpur'
    ],
    'Barisal': [
      'Barisal', 'Bhola', 'Patuakhali', 'Pirojpur', 'Jhalokati', 'Barguna'
    ],
    'Sylhet': [
      'Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'
    ],
    'Rangpur': [
      'Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Nilphamari',
      'Panchagarh', 'Thakurgaon', 'Lalmonirhat'
    ],
    'Mymensingh': [
      'Mymensingh', 'Jamalpur', 'Sherpur', 'Netrokona'
    ]
  };

  // List of security questions
  const securityQuestions = [
    'What was the name of your first pet?',
    'What is your mother\'s maiden name?',
    'What was the name of your primary school?',
    'In which city were you born?',
    'What was your childhood nickname?',
    'What is the name of your favorite childhood friend?',
    'What was your favorite food as a child?',
    'What was the make of your first car?',
    'What is your favorite movie?'
  ];

  const { 
    name, email, password, confirmPassword, phone, address, division, district, farmSize,
    securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2, securityQuestion3, securityAnswer3
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validImageTypes.includes(selectedFile.type)) {
        setError('Please select a valid image file (JPEG, PNG)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setProfileImage(selectedFile);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      
      setError('');
    }
  };

  const onDivisionChange = (e) => {
    const selectedDivision = e.target.value;
    setFormData({ 
      ...formData, 
      division: selectedDivision,
      district: '' // Reset district when division changes
    });
  };

  const validateStep1 = () => {
    if (!name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    // These are optional fields, so we don't need strict validation
    if (phone && !/^(\+?880|0)1[3456789]\d{8}$/.test(phone)) {
      setError('Please enter a valid Bangladeshi phone number');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!securityQuestion1 || !securityAnswer1.trim()) {
      setError('Please select and answer the first security question');
      return false;
    }
    if (!securityQuestion2 || !securityAnswer2.trim()) {
      setError('Please select and answer the second security question');
      return false;
    }
    if (!securityQuestion3 || !securityAnswer3.trim()) {
      setError('Please select and answer the third security question');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      setError('');
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
      setError('');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Create FormData object to handle file upload
      const formDataObject = new FormData();
      
      // Append text data
      formDataObject.append('name', name);
      formDataObject.append('email', email);
      formDataObject.append('password', password);
      formDataObject.append('phone', phone);
      formDataObject.append('address', address);
      formDataObject.append('division', division);
      formDataObject.append('district', district);
      formDataObject.append('farmSize', farmSize);
      
      // Security questions
      formDataObject.append('securityQuestion1', securityQuestion1);
      formDataObject.append('securityAnswer1', securityAnswer1);
      formDataObject.append('securityQuestion2', securityQuestion2);
      formDataObject.append('securityAnswer2', securityAnswer2);
      formDataObject.append('securityQuestion3', securityQuestion3);
      formDataObject.append('securityAnswer3', securityAnswer3);
      
      // Append profile image if exists
      if (profileImage) {
        formDataObject.append('profileImage', profileImage);
      }
      
      const response = await api.post('/users', formDataObject, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      login(response.data);
      navigate('/dashboard');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onChange}
          required
          minLength="6"
        />
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          required
          minLength="6"
        />
      </div>
      <button type="button" onClick={handleNextStep} className="next-button">
        Next
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="form-group">
        <label htmlFor="phone">Phone (Optional)</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={phone}
          onChange={onChange}
          placeholder="e.g., 01712345678"
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address (Optional)</label>
        <textarea
          id="address"
          name="address"
          value={address}
          onChange={onChange}
          rows="2"
          placeholder="Your full address"
        ></textarea>
      </div>
      <div className="form-group">
        <label htmlFor="division">Division (Optional)</label>
        <select
          id="division"
          name="division"
          value={division}
          onChange={onDivisionChange}
        >
          <option value="">Select Division</option>
          {Object.keys(divisionsWithDistricts).map((div) => (
            <option key={div} value={div}>{div}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="district">District (Optional)</label>
        <select
          id="district"
          name="district"
          value={district}
          onChange={onChange}
          disabled={!division}
        >
          <option value="">Select District</option>
          {division && divisionsWithDistricts[division].map((dist) => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="farmSize">Farm Size (acres) (Optional)</label>
        <input
          type="number"
          id="farmSize"
          name="farmSize"
          value={farmSize}
          onChange={onChange}
          min="0"
          step="0.1"
          placeholder="e.g., 2.5"
        />
      </div>
      <div className="form-group">
        <label htmlFor="profileImage">Profile Picture (Optional)</label>
        <div className="profile-upload">
          {profileImagePreview && (
            <div className="profile-preview">
              <img src={profileImagePreview} alt="Profile Preview" />
            </div>
          )}
          <input
            type="file"
            id="profileImage"
            ref={fileInputRef}
            onChange={onProfileImageChange}
            accept="image/png, image/jpeg"
            style={{ display: 'none' }}
          />
          <button 
            type="button" 
            className="upload-button"
            onClick={() => fileInputRef.current.click()}
          >
            {profileImagePreview ? 'Change Picture' : 'Upload Picture'}
          </button>
          {profileImagePreview && (
            <button 
              type="button" 
              className="remove-button"
              onClick={() => {
                setProfileImage(null);
                setProfileImagePreview(null);
                fileInputRef.current.value = '';
              }}
            >
              Remove
            </button>
          )}
        </div>
        <small>Max file size: 5MB. Formats: JPG, PNG</small>
      </div>
      <div className="button-group">
        <button type="button" onClick={handlePrevStep} className="back-button">
          Back
        </button>
        <button type="button" onClick={handleNextStep} className="next-button">
          Next
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="security-questions-intro">
        <p>Please select and answer three security questions. These will be used to verify your identity if you need to reset your password.</p>
      </div>
      <div className="form-group">
        <label htmlFor="securityQuestion1">Security Question 1 *</label>
        <select
          id="securityQuestion1"
          name="securityQuestion1"
          value={securityQuestion1}
          onChange={onChange}
          required
        >
          <option value="">Select a security question</option>
          {securityQuestions.map((question, index) => (
            <option 
              key={index} 
              value={question}
              disabled={question === securityQuestion2 || question === securityQuestion3}
            >
              {question}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="securityAnswer1">Answer 1 *</label>
        <input
          type="text"
          id="securityAnswer1"
          name="securityAnswer1"
          value={securityAnswer1}
          onChange={onChange}
          required
          disabled={!securityQuestion1}
        />
      </div>
      <div className="form-group">
        <label htmlFor="securityQuestion2">Security Question 2 *</label>
        <select
          id="securityQuestion2"
          name="securityQuestion2"
          value={securityQuestion2}
          onChange={onChange}
          required
        >
          <option value="">Select a security question</option>
          {securityQuestions.map((question, index) => (
            <option 
              key={index} 
              value={question}
              disabled={question === securityQuestion1 || question === securityQuestion3}
            >
              {question}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="securityAnswer2">Answer 2 *</label>
        <input
          type="text"
          id="securityAnswer2"
          name="securityAnswer2"
          value={securityAnswer2}
          onChange={onChange}
          required
          disabled={!securityQuestion2}
        />
      </div>
      <div className="form-group">
        <label htmlFor="securityQuestion3">Security Question 3 *</label>
        <select
          id="securityQuestion3"
          name="securityQuestion3"
          value={securityQuestion3}
          onChange={onChange}
          required
        >
          <option value="">Select a security question</option>
          {securityQuestions.map((question, index) => (
            <option 
              key={index} 
              value={question}
              disabled={question === securityQuestion1 || question === securityQuestion2}
            >
              {question}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="securityAnswer3">Answer 3 *</label>
        <input
          type="text"
          id="securityAnswer3"
          name="securityAnswer3"
          value={securityAnswer3}
          onChange={onChange}
          required
          disabled={!securityQuestion3}
        />
      </div>
      <div className="button-group">
        <button type="button" onClick={handlePrevStep} className="back-button">
          Back
        </button>
        <button type="submit" disabled={isLoading} className="register-button">
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </>
  );

  return (
    <div className="register-container">
      <h1>Agro Expert - Register</h1>
      <div className="steps-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-title">Account</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-title">Profile</div>
        </div>
        <div className="step-connector"></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-title">Security</div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={onSubmit}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </form>
      
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      <style jsx>{`
        .register-container {
          max-width: 600px;
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
        
        .steps-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 0 20px;
        }
        
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #757575;
        }
        
        .step.active {
          color: #2e7d32;
        }
        
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .step.active .step-number {
          background-color: #2e7d32;
          color: white;
        }
        
        .step-connector {
          flex-grow: 1;
          height: 2px;
          background-color: #e0e0e0;
          margin: 0 15px;
        }
        
        .error-message {
          color: #d32f2f;
          background-color: #ffebee;
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
        
        input, select, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        input:focus, select:focus, textarea:focus {
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
        
        .button-group {
          display: flex;
          gap: 10px;
        }
        
        .back-button {
          background-color: #757575;
        }
        
        .back-button:hover {
          background-color: #616161;
        }
        
        .security-questions-intro {
          margin-bottom: 20px;
          color: #616161;
          font-size: 14px;
        }
        
        .profile-upload {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 5px;
        }
        
        .profile-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .profile-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .upload-button {
          background-color: #2e7d32;
          padding: 8px 16px;
        }
        
        .remove-button {
          background-color: #d32f2f;
          padding: 8px 16px;
        }
        
        small {
          display: block;
          margin-top: 5px;
          color: #757575;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;