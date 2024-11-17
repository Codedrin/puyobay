import React, { useState } from 'react';
import axios from 'axios';
import { bg } from '../../assets'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://puyobay-server.vercel.app/api/users/forgot', { email });
      setMessage(response.data.message);
      setLoading(false);
      
      // Redirect to the OTP page with userId after submitting email
      const userId = response.data.userId; 
      navigate(`/reset-otp/${userId}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending OTP');
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form 
        onSubmit={handleEmailSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold mb-6">Enter Your Email</h2>

        {/* Email Input Field */}
        <div className="relative mb-4">
          <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
          <input 
            type="email" 
            id="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
            required
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          disabled={loading}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Send OTP'}
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
