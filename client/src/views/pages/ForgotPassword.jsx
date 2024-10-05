import React, { useState } from 'react';
import axios from 'axios';
import { bg } from '../../assets'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/forgot`, {
        email,
        newPassword,
        confirmPassword,
      });
      setMessage(response.data.message);
      setLoading(false);
      navigate('/'); // Redirect to the login page after success
    } catch (error) {
      setMessage(error.response.data.message || 'Error updating password');
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>

        {/* Email Field */}
        <div className="relative mb-4">
          <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
          />
        </div>

        {/* New Password Field */}
        <div className="relative mb-4">
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            onClick={toggleShowPassword} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          />
          <input 
            type={showPassword ? "text" : "password"} 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            placeholder="New Password"
            className="pl-4 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Confirm Password Field */}
        <div className="relative mb-6">
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            onClick={toggleShowPassword} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          />
          <input 
            type={showPassword ? "text" : "password"} 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm Password"
            className="pl-4 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          disabled={loading}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Reset Password'}
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
