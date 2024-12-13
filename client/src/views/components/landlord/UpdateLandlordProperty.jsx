import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LandlordNavbar from '../../../constants/LandlordNavbar';

const UpdateLandlordProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    selectArea: '',
    address: '',
    type: 'House',
    rooms: [],
    roomArea: '',
    price: '',
    details: '',
    images: [],
  });

  // Fetch property data on component mount
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/property/${id}`);
        setPropertyData(response.data);
      } catch (error) {
        console.error('Error fetching property data:', error);
        alert('Failed to fetch property data.');
      }
    };
    fetchProperty();
  }, [id]);

  // Handle file selection for multiple images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setSelectedFiles(files);
  };

  // Upload multiple files to Cloudinary
  const uploadFilesToCloudinary = async (files) => {
    const uploadedImages = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'PuyobayAssets');
      formData.append('cloud_name', 'ddmgrfhwk');

      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/ddmgrfhwk/upload',
          formData
        );
        uploadedImages.push({
          url: response.data.secure_url,
          publicId: response.data.public_id,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }
    return uploadedImages;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let updatedImages = [...propertyData.images]; // Start with existing images

      // If new images are selected, upload them
      if (selectedFiles.length > 0) {
        const uploadedImages = await uploadFilesToCloudinary(selectedFiles);
        updatedImages = [...updatedImages, ...uploadedImages]; // Append new images
      }

      // Prepare updated data
      const updatedData = {
        ...propertyData,
        images: updatedImages, // Update images array
      };

      // Send update request
      await axios.put(`http://localhost:5000/api/users/update-property/${id}`, updatedData);
      setPropertyData(updatedData); // Update local state
      alert('Property updated successfully!');
      navigate('/manage-properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <LandlordNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Update House / Apartment</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Image Carousel and Upload Section */}
          <div className="flex flex-col items-center">
            {propertyData.images.length > 0 ? (
         <Carousel
         showThumbs={false} // Disable thumbnails
         infiniteLoop
         className="w-full h-auto"
         dynamicHeight={true} // Adjust height dynamically
       >
         {propertyData.images.map((image, index) => (
           <div key={index} className="h-60 w-full">
             <img
               src={image.url}
               alt={`Property Image ${index + 1}`}
               className="object-cover w-full h-full rounded-lg"
             />
           </div>
         ))}
       </Carousel>
       
            ) : (
              <p className="text-gray-600">No images available.</p>
            )}
            <label htmlFor="pictures" className="block text-gray-700 mt-4">Upload New Images</label>
            <input
              type="file"
              id="pictures"
              onChange={handleFileChange}
              multiple
              className="mb-4 p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Right Side - Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="propertyName" className="block text-gray-700">Property Name</label>
              <input
                type="text"
                id="propertyName"
                value={propertyData.propertyName}
                onChange={(e) => setPropertyData({ ...propertyData, propertyName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Select Area Dropdown */}
            <div>
              <label htmlFor="selectArea" className="block text-gray-700">Select Area</label>
              <select
                id="selectArea"
                value={propertyData.selectArea}
                onChange={(e) => setPropertyData({ ...propertyData, selectArea: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select Area</option>
                <option value="San Isidro">San Isidro</option>
                <option value="Del Carmen">Del Carmen</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                value={propertyData.address}
                onChange={(e) => setPropertyData({ ...propertyData, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Type Dropdown */}
            <div>
              <label htmlFor="type" className="block text-gray-700">Type</label>
              <select
                id="type"
                value={propertyData.type}
                onChange={(e) => setPropertyData({ ...propertyData, type: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            <div>
              <label htmlFor="roomArea" className="block text-gray-700">Room Area</label>
              <input
                type="text"
                id="roomArea"
                value={propertyData.roomArea}
                onChange={(e) => setPropertyData({ ...propertyData, roomArea: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-gray-700">Price</label>
              <input
                type="number"
                id="price"
                value={propertyData.price}
                onChange={(e) => setPropertyData({ ...propertyData, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-gray-700">Details</label>
              <textarea
                id="details"
                value={propertyData.details}
                onChange={(e) => setPropertyData({ ...propertyData, details: e.target.value })}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              ></textarea>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateLandlordProperty;
