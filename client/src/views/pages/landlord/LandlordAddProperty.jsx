import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import LandlordNavbar from '../../../constants/LandlordNavbar'; // Import LandlordNavbar

const LandlordAddProperty = () => {
  const [property, setProperty] = useState({
    propertyName: '', 
    description: '',
    address: '',  
    price: '', 
    availableRooms: '', 
    area: '',
    longitude: '',
    latitude: '',
    propertyType: '', 
    propertyArea: '', 
  });
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [gcashQr, setGcashQr] = useState(null); 
  const [loading, setLoading] = useState(false);

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

  const handleGcashQrChange = (e) => {
    setGcashQr(e.target.files[0]);
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
  
    setLoading(true);
  
    try {
      let uploadedImages = [];
      let gcashQrUploadData = {}; // Object to store both url and publicId
  
      // Upload property images
      if (selectedFiles) {
        const uploadPromises = Array.from(selectedFiles).map((file) =>
          uploadFileToCloudinary(file)
        );
        uploadedImages = await Promise.all(uploadPromises);
      }
  
      // Upload GCash QR Code
      if (gcashQr) {
        const gcashUpload = await uploadFileToCloudinary(gcashQr);
        // Store both URL and publicId
        gcashQrUploadData = {
          url: gcashUpload.url,
          publicId: gcashUpload.publicId,
        };
      }
  
      const propertyData = {
        propertyName: property.propertyName,
        description: property.description,
        address: property.address,
        price: property.price,
        availableRooms: property.availableRooms,
        area: property.area,
        longitude: property.longitude,
        latitude: property.latitude,
        propertyType: property.propertyType,
        propertyArea: property.propertyArea,
        images: uploadedImages, // Array of image URLs and publicIds
        gcashQr: gcashQrUploadData, // Send both url and publicId for GCash QR Code
        userId: userId,
      };
  
      await axios.post(`https://puyobay.onrender.com/api/users/add-property/${userId}`, propertyData);
  
      toast.success('Property added successfully');
      setProperty({
        propertyName: '',
        description: '',
        address: '',
        price: '',
        availableRooms: '',
        area: '',
        longitude: '',
        latitude: '',
        propertyType: '',
        propertyArea: '',
      });
      setSelectedFiles(null);
      setGcashQr(null);
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <div>
    <LandlordNavbar />
    <div className="container mx-auto p-4">
      <ToastContainer />
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add New Property</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          
          {['propertyName', 'description', 'address', 'price', 'availableRooms', 'area', 'longitude', 'latitude'].map((field, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="text"
                name={field}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                value={property[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-gray-700">Select Area:</label>
            <select
              name="propertyArea"
              className="w-full px-3 py-2 border rounded-lg"
              value={property.propertyArea}
              onChange={handleChange}
              required
            >
              <option value="">Select Area</option>
              <option value="San Isidro">San Isidro</option>
              <option value="Del Carmen">Del Carmen</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Type:</label>
            <select
              name="propertyType"
              className="w-full px-3 py-2 border rounded-lg"
              value={property.propertyType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
            </select>
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

          <div className="mb-4">
            <label className="block text-gray-700">Upload GCash QR Code</label>
            <input
              type="file"
              onChange={handleGcashQrChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end col-span-full">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              disabled={loading} 
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
  </div>
);
};

export default LandlordAddProperty;