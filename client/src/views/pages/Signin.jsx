import React, { useState, useEffect } from 'react';
import Navbar from '../../constants/Navbar';
import { bg } from '../../assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setStoredUser(storedUser);  // Access the user object from storage
    }
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
  
      if (!accountType) {
        toast.error("Please select an account type.");
        setLoading(false);
        return;
      }
  
      // Send login request with email, password, and accountType
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
        accountType,
      });
  
      // Handle "Remember Me" functionality
      if (rememberMe) {
        localStorage.setItem('rememberMe', email);
        localStorage.setItem('userPassword', btoa(password)); // Base64 encode password
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('userPassword');
      }
  
      // Store user and token in localStorage
      const { accessToken, redirectURL } = response.data;
      localStorage.setItem('user', JSON.stringify({
        accessToken: accessToken,
        email,
        accountType,
        id: response.data.id,
      }));
  
      // Redirect to appropriate page
      window.location.href = redirectURL;
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message || 'Login failed');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div>
      <Navbar />
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 sm:mx-8">
          <div className="text-center mb-6">
            <p className="text-gray-600">Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a></p>
            <h1 className="text-2xl font-bold">Log In</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
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
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-blue-600"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="ml-2 text-gray-600">Show Password</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="accountType" className="sr-only">Account Type</label>
              <select 
                id="accountType" 
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Account Type</option>
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin /> // Display spinner icon when loading
              ) : (
                'Signin'
              )}
            </button>
          </form>
          <div className="flex justify-between items-center mt-4">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox text-blue-600" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-gray-600">Remember Me</span>
            </label>
            <a href="/forgot" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* Include the ToastContainer to show toasts */}
    </div>
  );
};

export default Login;
