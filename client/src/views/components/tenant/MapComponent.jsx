import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const center = [9.8486, 126.0458]; // Default center for the map

// Create a custom marker using Font Awesome icon with red color
const houseIcon = new L.DivIcon({
  html: `<div style="font-size: 20px; color: #B8001F;"><i class="fas fa-home"></i></div>`,
  className: 'custom-icon',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

const RecenterMap = ({ center, zoomLevel = 18 }) => {
  const map = useMap();
  map.setView(center, zoomLevel);
  return null;
};

const MapComponent = () => {
  const [properties, setProperties] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [rating, setRating] = useState('');
  const [municipality, setMunicipality] = useState('');
  const navigate = useNavigate();

  // Fetch properties with latitude and longitude from the API
  const fetchProperties = async (queryParams = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/get-properties${queryParams}`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties(); // Fetch all properties on initial load
  }, []);

  // Handle search
  const handleSearch = () => {
    // Build query string based on search criteria
    const queryParams = new URLSearchParams({
      searchQuery,
      minPrice,
      maxPrice,
      rooms,
      rating,
      municipality,
    }).toString();

    // Fetch filtered properties from the backend
    fetchProperties(`?${queryParams}`);
  };

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
    <div className="flex flex-col items-center p-4">
      {/* Search Input */}
      <div className="my-4 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          placeholder="Search for a boarding house..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
        />
        <input
          type="number"
          className="border px-3 py-2 rounded w-full"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          placeholder="Municipality"
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:col-span-2"
        >
          Search
        </button>
      </div>

      {/* Map Heading */}
      <h2 className="text-3xl font-bold my-4 text-blue-500 text-center">Explore Our Locations</h2>

      {/* Map Container */}
      <div className="w-full max-w-7xl mx-auto shadow-md rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '400px', width: '100%' }}
        >
          {/* Recenter map when a property is searched */}
          <RecenterMap center={mapCenter} />

          {/* TileLayer for rendering the map */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Markers for each property */}
          {properties.map((property) => (
            <Marker
              key={property._id}
              position={[property.lat, property.lang]}
              icon={houseIcon}
              eventHandlers={{
                click: () => {
                  setMapCenter([property.lat, property.lang]);
                },
              }}
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
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
                    onClick={() => handleBookNow(property._id)}
                  >
                    Book Now
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;
