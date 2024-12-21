import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandlordNavbar from '../../../constants/LandlordNavbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

Modal.setAppElement('#root');

const LandlordManagedProperty = () => {
  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [editableRoom, setEditableRoom] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [loadingButton, setLoadingButton] = useState(null); // For button loading state
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`https://puyobay.onrender.com/api/users/landlord-property/${userId}`, {
          params: { userId },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to fetch properties');
      }
    };

    if (userId) fetchProperties();
  }, [userId]);

  const openRoomsModal = async (propertyId) => {
    setSelectedPropertyId(propertyId);

    try {
      const response = await axios.get(`https://puyobay.onrender.com/api/users/${propertyId}/rooms`);
      setRooms(response.data);
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
    setEditableRoom(null);
    setImageFiles([]);
  };

  const handleUpdate = (propertyId) => {
    navigate(`/update-properties/${propertyId}`);
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setLoadingButton(propertyId);
      try {
        await axios.delete(`https://puyobay.onrender.com/api/users/delete-property/${propertyId}`);
        toast.success('Property deleted successfully!');
        setProperties(properties.filter((property) => property._id !== propertyId));
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      } finally {
        setLoadingButton(null);
      }
    }
  };

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  const handleEditRoom = (room) => {
    setEditableRoom(room);
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setEditableRoom({ ...editableRoom, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const uploadImages = async () => {
    const uploadedImages = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'PuyobayAssets');
      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/ddmgrfhwk/upload', formData);
        uploadedImages.push({ url: response.data.secure_url, publicId: response.data.public_id });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
    return uploadedImages;
  };

  const handleSaveRoom = async () => {
    setLoadingButton(editableRoom._id);
    try {
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        uploadedImages = await uploadImages();
      }

      const updatedRoom = {
        ...editableRoom,
        images: [...editableRoom.images, ...uploadedImages],
      };

      const response = await axios.put(
        `https://puyobay.onrender.com/api/users/${selectedPropertyId}/rooms/${editableRoom._id}`,
        updatedRoom
      );

      toast.success('Room updated successfully!');
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room._id === editableRoom._id ? response.data : room))
      );
      setEditableRoom(null);
      setImageFiles([]);
    } catch (error) {
      console.error('Error updating room:', error);
      toast.error('Failed to update room');
    } finally {
      setLoadingButton(null);
    }
  };

  const handleRemoveRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to remove this room?')) {
      setLoadingButton(roomId);
      try {
        await axios.delete(`https://puyobay.onrender.com/api/users/${selectedPropertyId}/rooms/${roomId}`);
        toast.success('Room removed successfully!');
        setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      } catch (error) {
        console.error('Error removing room:', error);
        toast.error('Failed to remove room');
      } finally {
        setLoadingButton(null);
      }
    }
  };

  return (
    <div>
    <LandlordNavbar />
    <ToastContainer />
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Manage Properties</h1>
     
        <button
          onClick={handleAddProperty}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          + Add Property
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {properties.map((property) => (
          <div key={property._id} className="border rounded-lg p-3 sm:p-4 shadow-lg">
            {property.images.length > 0 ? (
              <Carousel
                showThumbs={false}
                infiniteLoop
                dynamicHeight
                className="mb-3 sm:mb-4"
                style={{ zIndex: 10 }}
              >
                {property.images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.url || 'https://via.placeholder.com/300'}
                      alt={`Property Image ${index + 1}`}
                      className="object-cover w-full h-40 sm:h-48 rounded-lg"
                    />
                  </div>
                ))}
              </Carousel>
            ) : (
              <img
                src="https://via.placeholder.com/300"
                alt="Placeholder"
                className="w-full h-40 sm:h-48 object-cover mb-3 sm:mb-4"
              />
            )}
            <h2 className="text-lg sm:text-xl text-gray-800 font-semibold">{property.propertyName}</h2>
            <p className="mb-2 sm:mb-3 text-sm sm:text-base">Location: {property.address}</p>
            <p>
              <span
                onClick={() => openRoomsModal(property._id)}
                className="text-blue-600 underline cursor-pointer text-sm sm:text-base"
              >
                View {property.rooms?.length || 0} {property.rooms?.length === 1 ? 'Room' : 'Rooms'}
              </span>
            </p>
            <div className="flex mt-3 sm:mt-4 space-x-2 sm:space-x-3">
              <button
                onClick={() => handleUpdate(property._id)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(property._id)}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base"
                disabled={loadingButton === property._id}
              >
                {loadingButton === property._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  
    <Modal
      isOpen={isRoomsModalOpen}
      onRequestClose={closeRoomsModal}
      contentLabel="Rooms Modal"
      className="bg-white w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 max-w-lg mx-auto my-10 p-4 sm:p-6 rounded-lg shadow-lg overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Rooms</h2>
        <button
          onClick={closeRoomsModal}
          className="text-gray-600 text-lg sm:text-xl font-bold"
        >
          X
        </button>
      </div>
      <hr className="border-gray-300 mb-4" />
      <div className="text-left">
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div key={index} className="mb-4 border-b pb-4">
              {editableRoom && editableRoom._id === room._id ? (
                <div>
                  <input
                    type="text"
                    name="roomName"
                    value={editableRoom.roomName}
                    onChange={handleRoomChange}
                    className="mb-2 p-2 border rounded-lg w-full text-sm sm:text-base"
                    placeholder="Room Name"
                  />
                  <input
                    type="number"
                    name="availablePersons"
                    value={editableRoom.availablePersons}
                    onChange={handleRoomChange}
                    className="mb-2 p-2 border rounded-lg w-full text-sm sm:text-base"
                    placeholder="Available Persons"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editableRoom.price}
                    onChange={handleRoomChange}
                    className="mb-2 p-2 border rounded-lg w-full text-sm sm:text-base"
                    placeholder="Price"
                  />
                  <textarea
                    name="description"
                    value={editableRoom.description}
                    onChange={handleRoomChange}
                    className="mb-2 p-2 border rounded-lg w-full text-sm sm:text-base"
                    placeholder="Description"
                  />
                  <label className="block text-gray-700 mb-2 text-sm sm:text-base">
                    Upload New Images
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    className="mb-4 p-2 border rounded-lg w-full text-sm sm:text-base"
                  />
                  <button
                    onClick={handleSaveRoom}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2 text-sm sm:text-base"
                    disabled={loadingButton === editableRoom._id}
                  >
                    {loadingButton === editableRoom._id ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditableRoom(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <Carousel showThumbs={false} infiniteLoop dynamicHeight className="mb-4">
                    {room.images.map((image, imgIndex) => (
                      <div key={imgIndex}>
                        <img
                          src={image.url || 'https://via.placeholder.com/300'}
                          alt={`Room Image ${imgIndex + 1}`}
                          className="object-cover w-full h-32 sm:h-40 rounded-lg"
                        />
                      </div>
                    ))}
                  </Carousel>
                  <p className="text-sm sm:text-base">
                    <strong>Name:</strong> {room.roomName}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Available Persons:</strong> {room.availablePersons}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Price:</strong> {room.price}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Description:</strong> {room.description}
                  </p>
                  <div className="flex mt-3 sm:mt-4 space-x-2 sm:space-x-3">
                    <button
                      onClick={() => handleEditRoom(room)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm sm:text-base"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveRoom(room._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm sm:text-base"
                      disabled={loadingButton === room._id}
                    >
                      {loadingButton === room._id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm sm:text-base">No rooms available for this property.</p>
        )}
      </div>
    </Modal>
  </div>
  );
};

export default LandlordManagedProperty;
