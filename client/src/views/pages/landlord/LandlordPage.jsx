import React from 'react';
import LandlordNavbar from '../../../constants/LandlordNavbar'; 
import { dash } from '../../../assets'; 

const LandlordPage = () => {
  return (
    <div>
      {/* Include the LandlordNavbar at the top */}
      <LandlordNavbar />

      {/* Hero section with image and text overlay */}
      <div className="relative w-full h-96">
        {/* Background Image */}
        <img
          src={dash} // Use the dash image
          alt="Dashboard"
          className="absolute w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Text on top of the image */}
        <div className="relative z-10 flex justify-center items-center h-full">
          <h1 className="text-white text-5xl font-bold">Welcome to Your Dashboard</h1>
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto p-4">
        <p>This is the landlord's dashboard or landing page. </p>
      </div>
    </div>
  );
};

export default LandlordPage;
