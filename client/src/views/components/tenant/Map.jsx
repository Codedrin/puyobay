import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Create a custom marker using Font Awesome icon
const houseIcon = new L.DivIcon({
  html: `<div style="font-size: 20px; color: #B8001F;"><i class="fas fa-home"></i></div>`,
  className: 'custom-icon',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

const MapComponent = () => {
  const [properties, setProperties] = useState([]); // State to hold properties data
  const navigate = useNavigate(); // Hook to navigate between routes

  // Fetch properties with average ratings from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`https://puyobay.onrender.com/api/users/get-properties`); // Use your API endpoint
        const data = await response.json();
        setProperties(data); // Set properties data with lat/lng from backend
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Handle Book Now navigation
  const handleBookNow = (propertyId) => {
    navigate(`/book-property/${propertyId}`); // Navigate using the property ID
  };

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Map Heading */}
      <h2 className="text-3xl font-bold my-4">Explore Our Locations</h2>

      {/* Map Container */}
      <div className="w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden">
        <MapContainer
          center={[9.8486, 126.0458]} // Default center of Siargao Island
          zoom={12}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Markers for each property */}
          {properties.map((property) => {
            if (property.lat && property.lang) {
              return (
                <Marker
                  key={property._id}
                  position={[property.lat, property.lang]} // Use lat and lng from the fetched property data
                  icon={houseIcon}
                >
                  <Popup>
                    <div>
                      <h2>{property.propertyName}</h2>
                      <img
                        src={property.images[0]?.url}
                        alt={property.propertyName}
                        className="w-full h-24 object-cover mb-2"
                      />
                      <p>{property.description}</p>
                      <p><strong>Price:</strong> ₱{property.price}</p>
                      <p><strong>Rooms Available:</strong> {property.availableRooms}</p>
                      <p><strong>Area:</strong> {property.area} sq ft</p>
                      <div className="flex mb-2">
                        {renderStars(property.averageRating || 0)}
                      </div>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        onClick={() => handleBookNow(property._id)}
                      >
                        Book Now
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
