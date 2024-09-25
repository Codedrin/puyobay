import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { logo } from '../assets';

const AdminPageNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Clear the admin token from localStorage
    navigate('/'); // Redirect to the login page
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-400 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Manage Users and User Icon */}
        <div className="flex items-center space-x-4">
          <NavLink
            to="/admin/manage-users"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg"
                : "text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-600"
            }
          >
            Manage Users
          </NavLink>
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
                  onClick={() => navigate('/admin/settings')}
                >
                  Settings
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

export default AdminPageNavbar;
