import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

const center = [9.8486, 126.0458];

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
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      const response = await fetch(`https://puyobay.onrender.com/api/users/get-properties`);
      const data = await response.json();
      // Add `actualRoomCount` dynamically to each property
      const enrichedData = data.map((property) => ({
        ...property,
        actualRoomCount: property.rooms ? property.rooms.length : 0,
      }));
      return enrichedData;
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllProperties = async () => {
      const allProperties = await fetchProperties();
      setProperties(allProperties);
    };
    fetchAllProperties();
  }, []);

  const handleSearch = async () => {
    const fetchedProperties = await fetchProperties();

    const filteredProperties = fetchedProperties.filter((property) => {
      const { propertyName, price, averageRating, area, actualRoomCount } = property;

      const priceMatch = price.toString() === searchQuery; // Exact price match
      const ratingMatch = searchQuery.split(',').some((query) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery.includes('-')) {
          const [min, max] = trimmedQuery.split('-').map(Number);
          return averageRating >= min && averageRating <= max;
        }
        return averageRating === Number(trimmedQuery);
      });
      const areaMatch = area.toLowerCase().includes(searchQuery.toLowerCase());
      const nameMatch = propertyName.toLowerCase().includes(searchQuery.toLowerCase());
      const roomsMatch = searchQuery.split(',').some((query) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery.includes('-')) {
          const [min, max] = trimmedQuery.split('-').map(Number);
          return actualRoomCount >= min && actualRoomCount <= max;
        }
        return actualRoomCount === Number(trimmedQuery);
      });

      return priceMatch || ratingMatch || areaMatch || nameMatch || roomsMatch;
    });

    if (filteredProperties.length === 0) {
      toast.error('No matching properties found.');
      return;
    }

    setProperties(filteredProperties);

    if (filteredProperties.length > 0) {
      setMapCenter([filteredProperties[0].lat, filteredProperties[0].lang]);
    }
  };

  const handleBookNow = (propertyId) => {
    navigate(`/book-property/${propertyId}`);
  };

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
      <div className="my-4 w-full flex justify-center">
        <input
          type="text"
          className="border px-2 py-1 rounded text-sm w-48"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm ml-2"
        >
          Search
        </button>
      </div>

      <h2 className="text-3xl font-bold my-4 text-blue-500 text-center">Explore Our Locations</h2>

      <div className="w-full max-w-7xl mx-auto shadow-md rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '400px', width: '100%' }}
        >
          <RecenterMap center={mapCenter} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
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
                  <p><strong>Rooms Available:</strong> {property.actualRoomCount}</p>
                  <p><strong>Area:</strong> {property.area} sq ft</p>
                  <p><strong>Location:</strong> {property.area}</p>
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
