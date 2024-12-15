import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import LandlordNavbar from '../../../constants/LandlordNavbar';

const LandlordAddProperty = () => {
  const [property, setProperty] = useState({
    propertyName: '',
    description: '',
    address: '',
    price: '',
    area: 'San Isidro', // Default value
    lang: '',
    lat: '',
    propertyType: '',
    propertyArea: '', // Add propertyArea to the form
  });

  const [rooms, setRooms] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [gcashQr, setGcashQr] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleGcashQrChange = (e) => {
    setGcashQr(e.target.files[0]);
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const handleRoomImageChange = async (index, files) => {
    try {
      const uploadPromises = Array.from(files).map((file) => uploadFileToCloudinary(file));
      const uploadedImages = await Promise.all(uploadPromises);
  
      const updatedRooms = [...rooms];
      updatedRooms[index].images = uploadedImages;
      setRooms(updatedRooms);
    } catch (error) {
      console.error('Error uploading room image:', error);
      toast.error('Failed to upload one or more room images.');
    }
  };
  
  
  
  const addRoom = () => {
    setRooms([
      ...rooms,
      { roomName: '', availablePersons: '', price: '', description: '', roomArea: '', images: [] },
    ]);
  };
  
  const removeRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
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
        publicId: response.data.public_id,
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
      let gcashQrUploadData = {};

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
        gcashQrUploadData = {
          url: gcashUpload.url,
          publicId: gcashUpload.publicId,
        };
      }
      if (!rooms.every((room) => room.images && room.images.length > 0)) {
        toast.error('Each room must have at least one image.');
        setLoading(false);
        return;
      }
      
      const propertyData = {
        ...property,
        rooms,
        images: uploadedImages,
        gcashQr: gcashQrUploadData,
        userId,
      };

      await axios.post(`http://localhost:5000/api/users/add-property/${userId}`, propertyData);

      toast.success('Property added successfully');
      setProperty({
        propertyName: '',
        description: '',
        address: '',
        price: '',
        area: 'San Isidro', // Reset to default
        lang: '',
        lat: '',
        propertyType: '',
        propertyArea: '',
      });
      setRooms([]);
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
          {['propertyName', 'description', 'address', 'price', 'lang', 'lat'].map((field, index) => (
              <div className="mb-4" key={index}>
                <label className="block text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="text"
                  name={field}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                  value={property[field]}
                  onChange={handleChange}
                  placeholder={
                    field === 'lang'
                      ? '125.96840777495305'
                      : field === 'lat'
                      ? '9.871556045663597'
                      : ''
                  }
                  required
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-gray-700">Select Area:</label>
              <select
                name="area"
                className="w-full px-3 py-2 border rounded-lg"
                value={property.area}
                onChange={handleChange}
                required
              >
                <option value="San Isidro">San Isidro</option>
                <option value="Del Carmen">Del Carmen</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Room Area:</label>
              <input
                type="text"
                name="propertyArea"
                className="w-full px-3 py-2 border rounded-lg"
                value={property.propertyArea}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Property Type:</label>
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

            <div className="col-span-full">
              <h3 className="text-lg font-semibold mb-4">Add Room Details</h3>
              {rooms.map((room, index) => (
                <div key={index} className="border p-4 rounded-lg mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Room Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={room.roomName}
                      onChange={(e) => handleRoomChange(index, 'roomName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Available Persons</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={room.availablePersons}
                      onChange={(e) => handleRoomChange(index, 'availablePersons', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Room Area</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={room.roomArea}
                      onChange={(e) => handleRoomChange(index, 'roomArea', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Price</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-lg"
                      value={room.price}
                      onChange={(e) => handleRoomChange(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-lg"
                      value={room.description}
                      onChange={(e) => handleRoomChange(index, 'description', e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700">Room Images</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleRoomImageChange(index, e.target.files)}
                      className="w-full px-3 py-2 border rounded-lg"
                      accept="image/*"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                      onClick={() => removeRoom(index)}
                    >
                      Remove Room
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={addRoom}
              >
                Add Room
              </button>
            </div>

            <div className="flex justify-end col-span-full">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                disabled={loading}
              >
                {loading ? <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandlordAddProperty;
