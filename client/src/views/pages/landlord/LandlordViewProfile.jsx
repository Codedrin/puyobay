import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandlordNavbar from '../../../constants/LandlordNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Cloudinary file upload function
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

const LandlordViewProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    businessPermit: '',
    attachment: null,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id || null;

  const navigate = useNavigate();

  // Toggle the profile edit modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Toggle the business details modal
  const toggleBusinessModal = () => {
    setIsBusinessModalOpen(!isBusinessModalOpen);
    if (!isBusinessModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`https://puyobay.onrender.com/api/users/profile/${userId}`);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to fetch profile data. Please refresh the page.');
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  // Fetch business details
  const fetchBusinessDetails = async () => {
    try {
      const { data } = await axios.get(`https://puyobay.onrender.com/api/users/landlords/business-details/${userId}`);
      setBusinessDetails(data);
      toggleBusinessModal();
    } catch (error) {
      console.error('Error fetching business details:', error);
      toast.error('Could not fetch business details. Please try again.');
    }
  };

  // Fetch bookings count
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://puyobay.onrender.com/api/users/bookings/landlord/${userId}`);
        const bookings = response.data.bookings;

        const pending = bookings.filter(booking => booking.status === false).length;
        const confirmed = bookings.filter(booking => booking.status === true).length;

        setPendingCount(pending);
        setConfirmedCount(confirmed);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Could not fetch bookings data.');
      }
    };

    if (userId) fetchBookings();
  }, [userId]);

  // Handle business form input changes
  const handleBusinessChange = (e) => {
    const { name, value, files } = e.target;
    setBusinessForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle file changes for profile image
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle profile form input changes
  const handleChange = (e) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [e.target.name]: e.target.value,
    }));
  };

  // Update profile details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      let profilePictureData = profile.profilePicture;

      if (selectedFile) {
        profilePictureData = await uploadFileToCloudinary(selectedFile);
      }

      const updatedProfile = {
        ...profile,
        ...(newPassword && { password: newPassword }),
        profilePicture: profilePictureData,
      };

      await axios.put(`https://puyobay.onrender.com/api/users/profile/update/${userId}`, updatedProfile);
      toast.success('Profile updated successfully');
      toggleModal();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle updating business details
  const handleUpdateBusiness = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let attachmentData = businessDetails.attachment;

      if (businessForm.attachment) {
        attachmentData = await uploadFileToCloudinary(businessForm.attachment);
      }

      const updatedBusinessDetails = {
        businessName: businessForm.businessName || businessDetails.businessName,
        businessPermit: businessForm.businessPermit || businessDetails.businessPermit,
        attachment: attachmentData,
      };

      await axios.put(
        `https://puyobay.onrender.com/api/users/landlords/business-details/${userId}`,
        updatedBusinessDetails
      );
      toast.success('Business details updated successfully');
      fetchBusinessDetails(); // Refresh business details after update
      toggleBusinessModal();
    } catch (error) {
      console.error('Error updating business details:', error);
      toast.error('Failed to update business details.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookings = () => {
    navigate(`/view-bookings/${userId}`);
  };

  return (
    <div>
      <LandlordNavbar />
      <ToastContainer />
      {/* Profile Section */}
      {profile ? (
        <div className="bg-gray-400 flex flex-col items-center p-4 md:p-10">
          <div className="h-32 w-32 rounded-full overflow-hidden border border-gray-200">
            <img
              src={
                profile.profilePicture?.url ||
                'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png'
              }
              alt="Landlord Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mt-4">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-white text-lg md:text-xl">{profile.accountType}</p>
          <div className="flex space-x-4 mt-4">
            <button
              className="px-4 py-2 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200"
              onClick={toggleModal}
            >
              Edit Profile
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
              onClick={fetchBusinessDetails}
            >
              Business Details
            </button>
          </div>
        </div>
      ) : (
        <div>Loading profile...</div>
      )}

      {/* Business Modal */}
      {isBusinessModalOpen && businessDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Business Details</h2>
              <button
                onClick={toggleBusinessModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* View Business Details */}
            <div>
              <p><strong>Business Name:</strong> {businessDetails.businessName}</p>
              <p><strong>Business Permit:</strong> {businessDetails.businessPermit}</p>
              {businessDetails.attachment && (
                <div>
                  <p><strong>Attachment:</strong></p>
                  <a
                    href={businessDetails.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Attachment
                  </a>
                  <button
                    onClick={() => setIsUpdating(true)}
                    className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>

            {/* Update Business Form */}
            {isUpdating && (
              <form onSubmit={handleUpdateBusiness} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={businessForm.businessName}
                    onChange={handleBusinessChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter new business name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Business Permit</label>
                  <input
                    type="text"
                    name="businessPermit"
                    value={businessForm.businessPermit}
                    onChange={handleBusinessChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Enter new business permit"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Attachment</label>
                  <input
                    type="file"
                    name="attachment"
                    onChange={handleBusinessChange}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsUpdating(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {loading ? (
                      <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}


      {/* Profile Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 md:mx-0 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Profile Photo</label>
                <input
                  type="file"
                  className="w-full px-3 py-2 border rounded-lg"
                  onChange={handleFileChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={profile.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={profile.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  value={profile.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={profile.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col-reverse md:flex-row md:justify-between">
                <button
                  type="button"
                  className="mt-2 md:mt-0 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 w-full md:w-auto"
                  onClick={toggleModal}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full md:w-auto flex justify-center items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
            <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleViewBookings}
        >
          View Bookings ({pendingCount} pending, {confirmedCount} confirmed)
        </button>
      </div>
    </div>
  );
};

export default LandlordViewProfile;
