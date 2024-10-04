import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { logo } from '../assets';
import axios from 'axios';

const TenantNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); // Store the profile data
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear the user from localStorage
    navigate('/'); // Redirect to the login page
  };

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/profile/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);
  
  const profileImageUrl = profile?.profilePicture?.url || 'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png'; // Default image if no profile picture

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
            to="/tenant"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold"
                : "text-white hover:text-gray-200"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/properties"
            className={({ isActive }) =>
              isActive
                ? "text-white font-semibold"
                : "text-white hover:text-gray-200"
            }
          >
            Properties
          </NavLink>

          {/* User Icon with Dropdown */}
          <div className="relative">
          <img
              src={profileImageUrl} // Profile picture URL
              alt="Profile"
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => navigate('/tenant-profile')}
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

export default TenantNavbar;

