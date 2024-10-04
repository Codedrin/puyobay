import React, { useState, useEffect } from 'react';
import TenantNavbar from '../../../constants/TenantNabar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
const TenantViewProfile = () => {
  const [profile, setProfile] = useState({});
  const [expandedIndex, setExpandedIndex] = useState(null); // Manage which reservation is expanded
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;



  // Static reservations data
  const reservations = [
    {
      propertyName: 'Beautiful Family Home',
      checkIn: 'June 15, 2024',
      checkOut: 'June 20, 2024',
      numberOfGuests: 4,
      totalPrice: 8500,
      status: 'Confirmed',
    },
    {
      propertyName: 'Cozy Cottage',
      checkIn: 'July 5, 2024',
      checkOut: 'July 10, 2024',
      numberOfGuests: 2,
      totalPrice: 5000,
      status: 'Pending',
    },
  ];


  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/profile/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  // Function to handle modal open/close
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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

  // Function to handle form submission for updating profile
  const handleUpdateProfile = async (event) => {
    event.preventDefault();
      setLoading(true)

    let profilePictureData = profile.profilePicture;

    // If the user selected a new profile picture, upload it to Cloudinary
    if (profileImage) {
      try {
        profilePictureData = await uploadFileToCloudinary(profileImage);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture');
        setLoading(false);
        return;
      }
    }

    try {
      const updatedProfile = {
        ...profile,
        profilePicture: profilePictureData // Update the profile picture with the new one (if uploaded)
      };

      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/profile/update/${userId}`, updatedProfile);
      setProfile(response.data.user); // Update the state with the updated profile
      toggleModal(); // Close the modal
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };



  // Function to handle click and toggle the visibility of reservation details
  const toggleReservation = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // Collapse if clicked again
    } else {
      setExpandedIndex(index); // Expand if not already expanded
    }
  };



  return (
    <div>
      <TenantNavbar />

      {/* Profile Section */}
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 border-b border-blue-700">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
            {/* Profile Image */}
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-700">
            <img
                    src={
                    profile.profilePicture?.url ||
                    'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png'
                    }
                    alt="Landlord Profile"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Profile Information */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-semibold text-blue-700">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-gray-700 text-lg">Email: {profile.email}</p>
              <p className="text-gray-700 text-lg">Phone: {profile.phoneNumber}</p>
              <p className="text-gray-700 text-lg">Address: {profile.address}</p>
              <button
                onClick={toggleModal}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="block text-gray-700">Profile Picture</label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border rounded-lg"
                  onChange={(e) => setProfileImage(e.target.files[0])} // Set the selected profile image
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={profile.phoneNumber || ''}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Reservations Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Previous Reservations</h2>
        <div className="space-y-4">
          {reservations.map((reservation, index) => (
            <div key={index} className="bg-white rounded-lg border">
              <button
                className={`w-full text-left bg-white text-blue-700 px-4 py-2 flex justify-between items-center transition-all duration-300 ease-in-out ${expandedIndex === index ? 'border border-blue-500' : ''}`}
                onClick={() => toggleReservation(index)}
              >
                <span className="font-semibold text-lg">{reservation.propertyName}</span>
                <span>{expandedIndex === index ? '⌄' : '⌃'}</span>
              </button>

              {/* Conditionally render the details with smooth transition */}
              <div
                className={`transition-max-height duration-500 ease-in-out overflow-hidden ${expandedIndex === index ? 'max-h-96' : 'max-h-0'}`}
              >
                {expandedIndex === index && (
                  <div className="px-4 py-4 border border-blue-500">
                    <p><strong>Check-in:</strong> {reservation.checkIn}</p>
                    <p><strong>Check-out:</strong> {reservation.checkOut}</p>
                    <p><strong>Number of Guests:</strong> {reservation.numberOfGuests}</p>
                    <p><strong>Total Price:</strong> ₱{reservation.totalPrice}</p>
                    <p><strong>Status:</strong> {reservation.status}</p>
                    <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Houses Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Upcoming New Houses</h2>
        <p>No upcoming houses at the moment. Check back later for updates!</p>
      </div>

      {/* Favorite Properties Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Favorite Properties</h2>
        <p>View and manage your favorite properties here.</p>
      </div>
    </div>
  );
};

export default TenantViewProfile;