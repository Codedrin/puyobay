import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from 'react-router-dom';
import { logo } from '../assets'; // Assuming you have a logo asset

const AdminPageNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Clear the admin token from localStorage
    navigate('/'); // Redirect to the login page
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { id: "manage-users", path: "/admin/manage-users", title: "Manage Users" },
  ];

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

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)} className="text-white focus:outline-none">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "bg-blue-600 text-white font-semibold px-3 py-2 rounded-lg"
                  : "text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-600"
              }
            >
              {link.title}
            </NavLink>
          ))}
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

      {/* Mobile Navigation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end transition-all duration-300 ease-in-out">
          <div
            ref={modalRef}
            className="bg-gradient-to-r from-white-500 to-blue-400 w-full max-w-xs h-full shadow-lg p-6 relative transform transition-transform duration-300 ease-in-out"
          >
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white focus:outline-none">
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <div className="flex flex-col items-center space-y-4 mt-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "block text-blue-700 font-semibold text-lg px-3 py-2 rounded-lg bg-white w-full text-center"
                      : "block text-white font-semibold text-lg px-3 py-2 rounded-lg hover:bg-blue-600 focus:bg-blue-700 w-full text-center"
                  }
                  onClick={() => setIsOpen(false)} // Close menu after click
                >
                  {link.title}
                </NavLink>
              ))}
              {/* Include Settings and Logout in Mobile Navigation */}
              <button
                className="block text-white font-semibold text-lg px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 w-full text-center"
                onClick={() => {
                  navigate('/admin/settings');
                  setIsOpen(false);
                }}
              >
                Settings
              </button>
              <button
                className="block text-white font-semibold text-lg px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 w-full text-center"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminPageNavbar;
