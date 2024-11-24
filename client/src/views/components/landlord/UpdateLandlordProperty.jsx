import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LandlordNavbar from '../../../constants/LandlordNavbar';

const UpdateLandlordProperty = () => {
  const { id } = useParams(); // Get property ID from URL params
  const navigate = useNavigate(); // For navigation after update
  const [isLoading, setIsLoading] = useState(false); // Loading state for spinner
  const [imageFile, setImageFile] = useState(null); // State for image file
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    selectArea: '',
    address: '',
    type: 'House', // Default value
    rooms: '',
    roomArea: '',
    price: '',
    details: '',
    images: [], // Array of images, initially empty
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setPropertyData({ ...propertyData, [id]: value });
  };

  // Handle file selection and image preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // Show image preview
  };

  // Upload image to Cloudinary
  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'PuyobayAssets');
    formData.append('cloud_name', 'ddmgrfhwk');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/ddmgrfhwk/upload',
        formData
      );
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading spinner

    try {
      let imageData = {};
      // If a new image is selected, upload it
      if (imageFile) {
        imageData = await uploadFileToCloudinary(imageFile);
      }

      // Prepare data to send to the server (images array)
      const updatedData = {
        ...propertyData,
        ...(imageData.url && { images: [{ url: imageData.url, publicId: imageData.publicId }] }), // Include image array if available
      };

      // Send update request
      const response = await axios.put(`https://puyobay.onrender.com/api/users/update-property/${id}`, updatedData);
      console.log('Property updated:', response.data);
      setIsLoading(false); // Hide loading spinner
      alert('Property updated successfully!');
      navigate('/manage-properties'); // Redirect after successful update
    } catch (error) {
      console.error('Error updating property:', error);
      setIsLoading(false); // Hide loading spinner
      alert('Failed to update property. Please try again.');
    }
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
              {/* Image preview if selected */}
              {imagePreview ? (
                <img src={imagePreview} alt="Selected" className="object-cover w-full h-full" />
              ) : (
                <span className="text-gray-600 text-lg">500 x 300</span>
              )}
            </div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="picture">
              Update Picture
            </label>
            <input type="file" id="picture" onChange={handleFileChange} className="mb-4 p-2 border border-gray-300 rounded-lg" />
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
                  required
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
                  required
                >
                  <option value="">Select Area</option>
                  <option value="San Isidro">San Isidro</option>
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
              </div>

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                {isLoading ? (
                  <FontAwesomeIcon icon={faSpinner} spin /> // Show spinner when loading
                ) : (
                  'Update'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLandlordProperty;
