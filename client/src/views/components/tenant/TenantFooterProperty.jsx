import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'; // Import half-star icon
import { h2, h31, h3, twoRoom } from '../../../assets'; // Update this path as per your project structure

const TenantFooterProperty = () => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500" />);
      } else if (i < rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="text-yellow-500" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="py-10">
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
              <div className="flex items-center">
                {renderStars(4)} {/* 4-star rating */}
              </div>
              <p className="mt-2">Vibrant life with modern amenities and local charm.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">View</button>
            </div>
          </div>

          {/* General Luna */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={h2} alt="General Luna" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">General Luna</h3>
              <div className="flex items-center">
                {renderStars(5)} {/* 5-star rating */}
              </div>
              <p className="mt-2">Popular for its stunning beaches and surfing spots.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">View</button>
            </div>
          </div>

          {/* Pilar */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={h31} alt="Pilar" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">Pilar</h3>
              <div className="flex items-center">
                {renderStars(3)} {/* 3-star rating */}
              </div>
              <p className="mt-2">Known for its serene atmosphere and local markets.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">View</button>
            </div>
          </div>

          {/* Del Carmen */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img src={twoRoom} alt="Del Carmen" className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold text-blue-600">Del Carmen</h3>
              <div className="flex items-center">
                {renderStars(4.5)} {/* 4.5-star rating */}
              </div>
              <p className="mt-2">Home to the famous mangrove forest and peaceful surroundings.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">View</button>
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

export default TenantFooterProperty;
