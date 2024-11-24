import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
  const { userId } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility of password

  const navigate = useNavigate();

  // Password validation regex (at least one uppercase letter, one number, and one special character)
  const passwordValidationRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle the visibility state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (!passwordValidationRegex.test(newPassword)) {
      setMessage('Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://puyobay.onrender.com/api/users/reset-password', {
        userId,
        newPassword,
        confirmPassword,
      });
      setMessage(response.data.message);
      setLoading(false);
      if (response.data.success) {
        navigate('/signin'); // Redirect to login page after successful reset
      }
    } catch (error) {
      setMessage('Error resetting password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6">Reset Your Password</h2>

        {/* New Password Field with Show/Hide Toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="pl-4 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
            onClick={toggleShowPassword} 
          />
        </div>

        {/* Confirm Password Field with Show/Hide Toggle */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="pl-4 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
            onClick={toggleShowPassword} 
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
