import React from 'react';
import { h3, h2, h31, twoRoom } from '../../../assets';

const TenantFooter = () => {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Different Municipalities</h2>

        {/* Municipalities Section */}
        <div className="flex flex-col md:flex-row justify-center md:space-x-20 space-y-6 md:space-y-0">
          {/* San Isidro */}
          <div className="bg-white shadow-md rounded-lg w-full md:w-96 overflow-hidden">
            <img src={h3} alt="San Isidro" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">San Isidro</h3>
              <p>Vibrant life with modern amenities and local charm.</p>
            </div>
          </div>

          {/* Del Carmen */}
          <div className="bg-white shadow-md rounded-lg w-full md:w-96 overflow-hidden">
            <img src={twoRoom} alt="Del Carmen" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">Del Carmen</h3>
              <p>Home to the famous mangrove forest and peaceful surroundings.</p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="text-center mt-10">
          <p className="text-gray-600">&copy; 2024 PUYOBAY. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TenantFooter;
