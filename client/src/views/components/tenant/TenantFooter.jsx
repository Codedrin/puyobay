import React from 'react';
import { h3, h2, h31, twoRoom } from '../../../assets';

const TenantFooter = () => {
  return (
    <div className=" py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Different Municipalities</h2>

        {/* Municipalities Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dapa */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={h3} alt="Dapa" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">Dapa</h3>
              <p>Vibrant life with modern amenities and local charm.</p>
            </div>
          </div>

          {/* General Luna */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={h2} alt="General Luna" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">General Luna</h3>
              <p>Popular for its stunning beaches and surfing spots.</p>
            </div>
          </div>

          {/* Pilar */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={h31} alt="Pilar" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">Pilar</h3>
              <p>Known for its serene atmosphere and local markets.</p>
            </div>
          </div>

          {/* Del Carmen */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
