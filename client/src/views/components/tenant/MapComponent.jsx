import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Map center coordinates
const center = [9.8486, 126.0458];

// List of boarding houses with coordinates and names
const boardingHouses = [
  { name: 'Melba Boarding House', lat: 9.871556045663597, lng: 125.96840777495305 },
  { name: 'Jesusista Donoso Boarding House', lat: 9.867977442524644, lng: 125.96899401633834 },
  { name: 'Escanan Boarding House', lat: 9.870783774798033, lng: 125.9689527059449 },
  { name: 'Yangnix Boarding House', lat: 9.870503669264352, lng: 125.96833043349633 },
  { name: 'Janna Boarding House', lat: 9.87102160005603, lng: 125.96960716496217 },
  { name: 'Auroras Boarding House', lat: 9.870712188019088, lng: 125.97008693457232 },
  { name: 'Lupian Boarding House', lat: 9.8698296625441, lng: 125.96943909041296 },
  { name: 'Wilgin Boarding House', lat: 9.86788327981544, lng: 125.97303551767476 },
  { name: 'Maucesa Boarding House', lat: 9.87333331481584, lng: 125.970289838383 },
  { name: 'Condevera Boarding House', lat: 9.880910066613378, lng: 125.96785552400392 },
  { name: 'Liacel Boarding House', lat: 9.872556322711675, lng: 125.97022238025855 },
];

// Create a custom marker using Font Awesome icon with red color
const houseIcon = new L.DivIcon({
  html: `<div style="font-size: 20px; color: #B8001F;"><i class="fas fa-home"></i></div>`,
  className: 'custom-icon',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

// Helper component to update map center
const RecenterMap = ({ center, zoomLevel = 18 }) => {
    const map = useMap();
    map.setView(center, zoomLevel);
    return null;
  };
  

const MapComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoardingHouse, setSelectedBoardingHouse] = useState(null);
  const [mapCenter, setMapCenter] = useState(center);

  // Search function for the boarding houses
  const handleSearch = () => {
    const foundHouse = boardingHouses.find(house => 
      house.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (foundHouse) {
      setMapCenter([foundHouse.lat, foundHouse.lng]);
      setSelectedBoardingHouse(foundHouse);
    } else {
      alert("Boarding house not found");
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Search Input */}
      <div className="my-4">
        <input 
          type="text" 
          className="border px-3 py-2 rounded" 
          placeholder="Search for a boarding house..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          onClick={handleSearch} 
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
          Search
        </button>
      </div>

      {/* Map Heading */}
      <h2 className="text-3xl font-bold my-4 text-blue-500">Explore Our Locations</h2>

      {/* Map Container */}
      <div className="w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '400px', width: '100%' }}
        >
          {/* Recenter map when a house is searched */}
          <RecenterMap center={mapCenter} />

          {/* TileLayer for rendering the map */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Markers for each boarding house */}
          {boardingHouses.map((house, index) => (
            <Marker
              key={index}
              position={[house.lat, house.lng]}
              icon={houseIcon}
              eventHandlers={{
                click: () => {
                  setSelectedBoardingHouse(house);
                  setMapCenter([house.lat, house.lng]); // Recenter on click
                },
              }}
            >
              <Popup>
                <div>
                  <h2>{house.name}</h2>
                  <p>Latitude: {house.lat}, Longitude: {house.lng}</p>
                  <a href={`https://yourwebsite.com/booking/${house.name.replace(/\s+/g, '-').toLowerCase()}`}>
                    <button className="book-btn">Book Now</button>
                  </a>
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
