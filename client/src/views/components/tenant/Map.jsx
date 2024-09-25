import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { siaa } from '../../../assets'; // Ensure the image path is correct

const containerStyle = {
  width: '100%',
  height: '400px',
};

// Correct coordinates for Siargao Island
const center = {
  lat: 9.8486,  // Latitude for Siargao Island
  lng: 126.0458, // Longitude for Siargao Island
};

const Map = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Map Heading */}
      <h2 className="text-3xl font-bold my-4">Explore Our Locations</h2>

      {/* Map Container */}
      <div className="w-full max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12} // Adjusted zoom level for better visibility of Siargao Island
          >
            {/* Additional markers or map elements can be added here */}
          </GoogleMap>
        </LoadScript>
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
