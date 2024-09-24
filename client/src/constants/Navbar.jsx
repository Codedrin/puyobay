import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { logo } from '../assets';

const Navbar = () => {

  const navLinks = [
    {
      id: "home",
      path: "/",
      title: "Home",
    },
    {
      id: "about",
      path: "/about",
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

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-400 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 mr-4" />
        </div>
        <div className="flex space-x-8">
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
    </nav>
  );
};

export default Navbar;
