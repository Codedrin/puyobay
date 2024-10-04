import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

import { siaa } from '../../../assets'; // Ensure the image path is correct

const center = [9.8486, 126.0458];

// Delcarmen
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
  // SanIsidro
  { name: 'Severino’s Place', lat: 9.936014022572124, lng: 126.08465716210299 },
  { name: 'Pacifico Surf Bayay', lat: 9.947067290790516, lng: 126.10019616496328 },
  { name: 'Common Ground', lat: 9.945665856598678, lng: 126.10231496121611 },
  { name: 'Katre Hostel', lat: 9.947609724748585, lng: 126.1016585757804 },
  { name: 'Weeroona Huts Homestay', lat: 9.94953203090756, lng: 126.09946187252713 },
  { name: 'Sailfishbay Surf and Big Fishing Lodge', lat: 9.947497661744242, lng: 126.1018773709223 },
  { name: 'Hightide Eco Villas', lat: 9.949221704227009, lng: 126.0990374099468 },
  { name: 'Yapak Beach Villas', lat: 9.95089944720905, lng: 126.09893074488053 },
  { name: 'Trogon’s Pearch Resort', lat: 9.954829569219624, lng: 126.09785003733364 },
  { name: 'Filoli Surf Homestay', lat: 9.947692176331783, lng: 126.1010031394071 },
  { name: 'Kubo ni Klay', lat: 9.946696996148003, lng: 126.1001102637902 },
  { name: 'Tikman Homestay', lat: 9.93502200940722, lng: 126.09039239539615 },
  { name: 'Typhoon Blues Homestay', lat: 9.944743088061207, lng: 126.10275495559203 },
  { name: 'Gina’s Homestay', lat: 9.93729349005937, lng: 126.08856863761535 },
  { name: 'La Freyah’s Homestay', lat: 9.936658950984931, lng: 126.08883463027293 },
];

// Create a custom marker using Font Awesome icon
const houseIcon = new L.DivIcon({
  html: `<div style="font-size: 20px; color: #B8001F;"><i class="fas fa-home"></i></div>`,
  className: 'custom-icon', // Optional, add a class if you want to style it with CSS
  iconSize: [25, 25],
  iconAnchor: [12, 12], // Adjust to properly align the icon
  popupAnchor: [0, -10], // Adjust the position of the popup
});

const Map = () => {
  const [selectedBoardingHouse, setSelectedBoardingHouse] = useState(null);

  return (
    <div className="flex flex-col items-center">
      {/* Map Heading */}
      <h2 className="text-3xl font-bold my-4">Explore Our Locations</h2>

      {/* Map Container */}
      <div className="w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '400px', width: '100%' }}
        >
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
              icon={houseIcon} // Use the custom house icon
              eventHandlers={{
                click: () => {
                  setSelectedBoardingHouse(house);
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

      {/* Two-Column Layout for Description and Image */}
      <div className="w-full max-w-4xl mt-8 p-4 flex flex-col md:flex-row items-center">
        {/* Text Column */}
        <div className="md:w-1/2 p-4">
          <p className="text-gray-700">
            Siargao Island, located in the Philippines, is renowned for its pristine beaches,
            crystal-clear waters, and lush landscapes. Often referred to as the "Surfing Capital
            of the Philippines," Siargao offers a perfect blend of natural beauty and vibrant local
            culture. The island is a popular destination for surfing enthusiasts, adventure seekers,
            and those looking to experience the laid-back island lifestyle. With its numerous
            attractions, including the famous Cloud 9 surf break and stunning island-hopping
            opportunities, Siargao promises an unforgettable experience for every visitor.
          </p>
        </div>
        {/* Image Column */}
        <div className="md:w-2/3 p-4">
          <img
            src={siaa}
            alt="Siargao Island"
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Map;
