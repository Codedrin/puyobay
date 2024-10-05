import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const BookingAndProperty = () => {
  const [property, setProperty] = useState({
    propertyName: '', 
    description: '',
    address: '',  
    price: '',
    availableRooms: '',
    area: '',
  });
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state

  const user = JSON.parse(localStorage.getItem('user')); 
  const userId = user?.id; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      toast.error('User not logged in');
      return;
    }
  
    setLoading(true); // Start loading spinner
  
    try {
      let uploadedImages = [];
  
      if (selectedFiles) {
        // Upload all selected files to Cloudinary and get their URLs
        const uploadPromises = Array.from(selectedFiles).map((file) =>
          uploadFileToCloudinary(file)
        );
        uploadedImages = await Promise.all(uploadPromises);
      }
  
      // Create property data object with image URLs
      const propertyData = {
        propertyName: property.propertyName,
        description: property.description,
        address: property.address,
        price: property.price,
        availableRooms: property.availableRooms,
        area: property.area,
        images: uploadedImages, // Send the Cloudinary image URLs
        userId: userId, // Include userId from localStorage
      };
  
      // Make a POST request to your backend to save the property
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/users/add-property/${userId}`, propertyData);
  
      toast.success('Property added successfully');
      setProperty({
        propertyName: '', // Reset the form fields
        description: '',
        address: '',
        price: '',
        availableRooms: '',
        area: '',
      });
      setSelectedFiles(null);
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      
      {/* Add New Property Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add New Property</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Property Name</label>
            <input
              type="text"
              name="propertyName" // Use the correct name field
              className="w-full px-3 py-2 border rounded-lg"
              value={property.propertyName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border rounded-lg"
              value={property.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-3 py-2 border rounded-lg"
              value={property.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="text"
              name="price"
              className="w-full px-3 py-2 border rounded-lg"
              value={property.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Available Rooms</label>
            <input
              type="text"
              name="availableRooms"
              className="w-full px-3 py-2 border rounded-lg"
              value={property.availableRooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Area (sq. ft.)</label>
            <input
              type="text"
              name="area"
              className="w-full px-3 py-2 border rounded-lg"
              value={property.area}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
              ) : (
                'Add Property'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingAndProperty;
