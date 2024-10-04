import React, { useState } from 'react';
import LandlordNavbar from '../../../constants/LandlordNavbar';

const UpdateLandlordProperty = () => {
  // State to manage the form data
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    selectArea: '',
    address: '',
    type: 'House', // Default value
    rooms: '',
    roomArea: '',
    price: '',
    details: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setPropertyData({ ...propertyData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, like calling an API
    console.log('Form Data:', propertyData);
  };

  return (
    <div>
      <LandlordNavbar />
      <div className="container mx-auto p-4">
        <br />
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Update House / Apartment</h1>
        <br />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Image Upload Section */}
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 w-80 h-60 flex items-center justify-center mb-4">
              <span className="text-gray-600 text-lg">500 x 300</span>
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="picture">
              Update Picture
            </label>
            <input type="file" id="picture" className="mb-4 p-2 border border-gray-300 rounded-lg" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Update Picture</button>
          </div>

          {/* Right Side - Form Section */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="propertyName">
                  Property Name:
                </label>
                <input
                  type="text"
                  id="propertyName"
                  value={propertyData.propertyName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Select Area Dropdown */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="selectArea">
                  Select Area:
                </label>
                <select
                  id="selectArea"
                  value={propertyData.selectArea}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Area</option>
                  <option value="Dapa">Dapa</option>
                  <option value="General Luna">General Luna</option>
                  <option value="Pilar">Pilar</option>
                  <option value="Del Carmen">Del Carmen</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address:
                </label>
                <input
                  type="text"
                  id="address"
                  value={propertyData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Type Dropdown */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                  Type:
                </label>
                <select
                  id="type"
                  value={propertyData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rooms">
                  Rooms:
                </label>
                <input
                  type="number"
                  id="rooms"
                  value={propertyData.rooms}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomArea">
                  Room Area:
                </label>
                <input
                  type="text"
                  id="roomArea"
                  value={propertyData.roomArea}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                  Price:
                </label>
                <input
                  type="number"
                  id="price"
                  value={propertyData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
                  Details:
                </label>
                <textarea
                  id="details"
                  value={propertyData.details}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLandlordProperty;
