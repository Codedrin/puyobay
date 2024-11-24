import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const TenantFooterProperty = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 9; // Display 9 properties per page
  const navigate = useNavigate(); 

  // Fetch properties with average ratings from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://puyobay.onrender.com/api/users/get-average-ratings'); // Fetch with average ratings
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Calculate the properties to display for the current page
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Render star ratings
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

  const handleNextPage = () => {
    if (currentPage < Math.ceil(properties.length / propertiesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleBook = (propertyId) => {
    navigate(`/book-property/${propertyId}`); // Navigate using useNavigate
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">Different Municipalities</h2>

        {/* Properties Section */}
        <div className="flex flex-wrap justify-center gap-6">
          {currentProperties.map((property) => (
            <div key={property._id} className="bg-white shadow-md rounded-lg w-full md:w-96 overflow-hidden">
              <img src={property.images[0]?.url} alt={property.propertyName} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold text-blue-600">{property.propertyName}</h3>
                <div className="flex items-center">
                  {renderStars(property.averageRating || 0)}
                </div>
                <p className="mt-2">{property.description}</p>
                <p>
              <strong>Available Rooms:</strong> {property.availableRooms > 0 ? property.availableRooms : 'No available rooms'}
            </p>
                <p><strong>Price:</strong> ₱{property.price}</p> 
                <p><strong>Area:</strong> {property.area} sq ft</p>
                <button 
                  className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 
                              ${property.availableRooms === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                  onClick={() => handleBook(property._id)}
                  disabled={property.availableRooms === 0}
                >
                   View
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            disabled={currentPage === Math.ceil(properties.length / propertiesPerPage)}
          >
            Next
          </button>
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
