import React, { useState } from 'react';
import Navbar from '../../constants/Navbar';
import { bg } from '../../assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <p className="text-gray-600">Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a></p>
            <h1 className="text-2xl font-bold">Log In</h1>
          </div>
          <form>
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">Username or Email</label>
              <div className="relative">
                <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                <input 
                  type="text" 
                  id="username" 
                  placeholder="Username or Email" 
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
                className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option>Account Type</option>
                <option>Tenant</option>
                <option>Landlord</option>
                <option>Admin</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign In
            </button>
          </form>
          <div className="flex justify-between items-center mt-4">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-600" />
              <span className="ml-2 text-gray-600">Remember Me</span>
            </label>
            <a href="/forgot-password" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
