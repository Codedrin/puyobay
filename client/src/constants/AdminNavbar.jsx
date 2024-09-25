import React from 'react';
import { NavLink } from 'react-router-dom';
import { logo } from '../assets';

const AdminNavbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-400 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <img src={logo} alt="Logo" className="h-full w-full object-cover" />
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg"
                : "text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-600"
            }
          >
            User Account
          </NavLink>
          {/* Add more links as needed */}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
