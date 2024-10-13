import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinates for different boarding houses
const boardingHousesCoordinates = {
  'Melba Boarding House': { lat: 9.871556045663597, lng: 125.96840777495305 },
  'Jesusista Donoso Boarding House': { lat: 9.867977442524644, lng: 125.96899401633834 },
  'Escanan Boarding House': { lat: 9.870783774798033, lng: 125.9689527059449 },
  'Yangnix Boarding House': { lat: 9.870503669264352, lng: 125.96833043349633 },
  'Janna Boarding House': { lat: 9.87102160005603, lng: 125.96960716496217 },
  'Auroras Boarding House': { lat: 9.870712188019088, lng: 125.97008693457232 },
  'Lupian Boarding House': { lat: 9.8698296625441, lng: 125.96943909041296 },
  'Wilgin Boarding House': { lat: 9.86788327981544, lng: 125.97303551767476 },
  'Maucesa Boarding House': { lat: 9.87333331481584, lng: 125.970289838383 },
  'Condevera Boarding House': { lat: 9.880910066613378, lng: 125.96785552400392 },
  'Liacel Boarding House': { lat: 9.872556322711675, lng: 125.97022238025855 },
  'Severino’s Place': { lat: 9.936014022572124, lng: 126.08465716210299 },
  'Pacifico Surf Bayay': { lat: 9.947067290790516, lng: 126.10019616496328 },
  'Common Ground': { lat: 9.945665856598678, lng: 126.10231496121611 },
  'Katre Hostel': { lat: 9.947609724748585, lng: 126.1016585757804 },
  'Weeroona Huts Homestay': { lat: 9.94953203090756, lng: 126.09946187252713 },
  'Sailfishbay Surf and Big Fishing Lodge': { lat: 9.947497661744242, lng: 126.1018773709223 },
  'Hightide Eco Villas': { lat: 9.949221704227009, lng: 126.0990374099468 },
  'Yapak Beach Villas': { lat: 9.95089944720905, lng: 126.09893074488053 },
  'Trogon’s Pearch Resort': { lat: 9.954829569219624, lng: 126.09785003733364 },
  'Filoli Surf Homestay': { lat: 9.947692176331783, lng: 126.1010031394071 },
  'Kubo ni Klay': { lat: 9.946696996148003, lng: 126.1001102637902 },
  'Tikman Homestay': { lat: 9.93502200940722, lng: 126.09039239539615 },
  'Typhoon Blues Homestay': { lat: 9.944743088061207, lng: 126.10275495559203 },
  'Gina’s Homestay': { lat: 9.93729349005937, lng: 126.08856863761535 },
  'La Freyah’s Homestay': { lat: 9.936658950984931, lng: 126.08883463027293 }
};

// Create a custom marker using Font Awesome icon
const houseIcon = new L.DivIcon({
  html: `<div style="font-size: 20px; color: #B8001F;"><i class="fas fa-home"></i></div>`,
  className: 'custom-icon',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

const MapComponent = () => {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate(); // Hook to navigate between routes

  // Fetch properties with average ratings from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/get-average-ratings'); 
        const data = await response.json();
        setProperties(data);
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
          center={[9.8486, 126.0458]} // Center of Siargao Island
          zoom={12}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Markers for each property */}
          {properties.map((property) => {
            const coordinates = boardingHousesCoordinates[property.propertyName]; // Match property name to coordinates
            if (coordinates) {
              return (
                <Marker
                  key={property._id}
                  position={[coordinates.lat, coordinates.lng]} // Use lat/lng values from boardingHousesCoordinates
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
