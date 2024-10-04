import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandlordNavbar from '../../../constants/LandlordNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported

Modal.setAppElement('#root');

const LandlordManagedProperty = () => {
  const [properties, setProperties] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/landlord-property/${userId}`, {
          params: { userId }
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to fetch properties');
      }
    };

    if (userId) {
      fetchProperties();
    }
  }, [userId]);

  const openViewModal = (property) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProperty(null);
  };

  const handleUpdate = (propertyId) => {
    // Navigate to the update page with the selected property ID
    navigate(`/update-properties/${propertyId}`);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/delete-property/${propertyId}`);
        toast.success("Property deleted successfully!");
        setProperties(properties.filter(property => property._id !== propertyId)); // Remove from UI
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };


  return (
    <div>
      <LandlordNavbar />
      <ToastContainer />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Manage Properties</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="border rounded-lg p-4 shadow-lg">
              <img
                src={property.images[0]?.url || 'https://via.placeholder.com/300'}
                alt={property.propertyName}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-2xl text-gray-800 font-semibold">{property.propertyName}</h2>
              <p className='mb-3'>Location: {property.address}</p>
              <p>Bedrooms: {property.availableRooms}</p>
              <div className="flex mt-4 space-x-3">
                <button
                  onClick={() => openViewModal(property)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  View
                </button>
                <button
                  onClick={() => handleUpdate(property._id)} // Properly invoke the function here
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
                  <button
                  onClick={() => handleDelete(property._id)} // Delete property
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Property Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Property Modal"
        className="bg-white w-full sm:w-11/12 md:w-3/4 lg:w-1/2 max-w-lg mx-auto my-10 p-6 rounded-lg shadow-lg overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">View Property</h2>
          <button onClick={closeViewModal} className="text-gray-600 text-xl font-bold">X</button>
        </div>

        <hr className="border-gray-300 mb-4" />

        <div className="text-left mb-4">
          <h3 className="text-lg font-semibold mb-2">Property Details</h3>
          <p className="mb-2"><strong>Name:</strong> {selectedProperty?.propertyName}</p>
          <p className="mb-2"><strong>Location:</strong> {selectedProperty?.address}</p>
          <p className="mb-2"><strong>Bedrooms:</strong> {selectedProperty?.availableRooms}</p>
        </div>

        <div className="w-full max-h-96 overflow-hidden">
          <img
            src={selectedProperty?.images[0]?.url || 'https://via.placeholder.com/300'}
            alt={selectedProperty?.propertyName}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

      </Modal>
    </div>
  );
};

export default LandlordManagedProperty;
