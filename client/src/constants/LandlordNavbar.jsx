import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { logo } from '../assets';

const LandlordNavbar  = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem('user'); // Clear the user from localStorage
      navigate('/'); // Redirect to the login page
    };
  
    return (
      <nav className="bg-gradient-to-r from-blue-500 to-blue-400 p-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <img src={logo} alt="Logo" className="h-full w-full object-cover" />
            </div>
          </div>
  
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <NavLink
              to="/landlord"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold"
                  : "text-white hover:text-gray-200"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/manage-properties"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold"
                  : "text-white hover:text-gray-200"
              }
            >
              Manage Properties
            </NavLink>
  
            {/* User Icon with Dropdown */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faUser}
                className="text-white text-2xl cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => navigate('/landlord-profile')}
                  >
                    View Profile
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  };

export default LandlordNavbar