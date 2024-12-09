import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import { logo } from '../assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  const navLinks = [
    {
      id: "home",
      path: "/",
      title: "Home",
    },
    {
      id: "about",
      path: "/#About",  // Use hash to link to the About section
      title: "About",
    },
    {
      id: "properties",
      path: "/properties",
      title: "Properties",
    },
    {
      id: "admin",
      path: "/admin",
      title: "Admin",
    },
  ];

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

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-400 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <img src={logo} alt="Logo" className="h-full w-full object-cover" />
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)} className="text-white focus:outline-none">
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold px-3 py-2 rounded-lg bg-blue-700"
                  : "text-white font-semibold px-3 py-2 rounded-lg hover:bg-blue-600"
              }
            >
              {link.title}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end transition-all duration-300 ease-in-out">
          <div 
            ref={modalRef}
            className={`bg-gradient-to-r from-white-500 to-blue-400 w-full max-w-xs h-full shadow-lg p-6 relative transform ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out`}
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
                      ? "block text-white font-semibold text-xl px-3 py-2 rounded-lg bg-blue-700 w-full text-center"
                      : "block text-white font-semibold text-xl px-3 py-2 rounded-lg hover:bg-blue-600 focus:bg-blue-700 w-full text-center"
                  }
                  onClick={() => setIsOpen(false)} // Close menu after click
                >
                  {link.title}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
