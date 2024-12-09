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
  const [rooms, setRooms] = useState([]);
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({}); // To track current image index for each room
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/landlord-property/${userId}`, {
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

  const openRoomsModal = async (propertyId) => {
    setSelectedPropertyId(propertyId);

    try {
      const response = await axios.get(`http://localhost:5000/api/users/${propertyId}/rooms`);
      setRooms(response.data);

      // Initialize the current image index for each room
      const initialIndexes = {};
      response.data.forEach((_, idx) => {
        initialIndexes[idx] = 0;
      });
      setCurrentImageIndex(initialIndexes);

      setIsRoomsModalOpen(true);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
    }
  };

  const closeRoomsModal = () => {
    setIsRoomsModalOpen(false);
    setSelectedPropertyId(null);
    setRooms([]);
    setCurrentImageIndex({});
  };

  const handleUpdate = (propertyId) => {
    navigate(`/update-properties/${propertyId}`);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/delete-property/${propertyId}`);
        toast.success('Property deleted successfully!');
        setProperties(properties.filter(property => property._id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  const nextImage = (roomIndex) => {
    setCurrentImageIndex((prevIndexes) => ({
      ...prevIndexes,
      [roomIndex]: (prevIndexes[roomIndex] + 1) % rooms[roomIndex].images.length, // Loop back to the first image
    }));
  };

  const previousImage = (roomIndex) => {
    setCurrentImageIndex((prevIndexes) => ({
      ...prevIndexes,
      [roomIndex]:
        (prevIndexes[roomIndex] - 1 + rooms[roomIndex].images.length) %
        rooms[roomIndex].images.length, // Loop back to the last image
    }));
  };

  return (
    <div>
      <LandlordNavbar />
      <ToastContainer />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Properties</h1>
          <button
            onClick={handleAddProperty}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            + Add Property
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="border rounded-lg p-4 shadow-lg">
              <img
                src={property.images[0]?.url || 'https://via.placeholder.com/300'}
                alt={property.propertyName}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="text-2xl text-gray-800 font-semibold">{property.propertyName}</h2>
              <p className="mb-3">Location: {property.address}</p>
              <p>
                <span
                  onClick={() => openRoomsModal(property._id)}
                  className="text-blue-600 underline cursor-pointer"
                >
                  View Rooms
                </span>
              </p>
              <div className="flex mt-4 space-x-3">
                <button
                  onClick={() => handleUpdate(property._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rooms Modal */}
      <Modal
        isOpen={isRoomsModalOpen}
        onRequestClose={closeRoomsModal}
        contentLabel="Rooms Modal"
        className="bg-white w-full sm:w-11/12 md:w-3/4 lg:w-1/2 max-w-lg mx-auto my-10 p-6 rounded-lg shadow-lg overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Rooms</h2>
          <button onClick={closeRoomsModal} className="text-gray-600 text-xl font-bold">X</button>
        </div>

        <hr className="border-gray-300 mb-4" />

        <div className="text-left">
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <div key={index} className="mb-4 border-b pb-4">
                {/* Carousel for Room Images */}
                <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                  <button
                    onClick={() => previousImage(index)}
                    className="absolute left-0 p-2 bg-black text-white rounded-full"
                  >
                    &lt;
                  </button>
                  <img
                    src={room.images[currentImageIndex[index]]?.url || 'https://via.placeholder.com/300'}
                    alt={`Room Image ${currentImageIndex[index] + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => nextImage(index)}
                    className="absolute right-0 p-2 bg-black text-white rounded-full"
                  >
                    &gt;
                  </button>
                </div>

                <p><strong>Name:</strong> {room.roomName}</p>
                <p><strong>Available Persons:</strong> {room.availablePersons}</p>
                <p><strong>Price:</strong> {room.price}</p>
                <p><strong>Description:</strong> {room.description}</p>
                <p><strong>Room Area:</strong> {room.roomArea}</p>
              </div>
            ))
          ) : (
            <p>No rooms available for this property.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LandlordManagedProperty;
