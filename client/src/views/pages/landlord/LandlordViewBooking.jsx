import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandlordNavbar from '../../../constants/LandlordNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShowPaymentModal from '../../components/landlord/ShowPaymentModal';

const LandlordViewBooking = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isShowPaymentModal, setIsShowPaymentModal] = useState(false);

  // Get the landlordId from local storage
  const user = JSON.parse(localStorage.getItem('user'));
  const landlordId = user?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/bookings/landlord/${landlordId}`);
        const bookings = response.data.bookings;

        // Separate bookings into pending and confirmed based on the boolean status
        const pending = bookings.filter(booking => booking.status === false);
        const confirmed = bookings.filter(booking => booking.status === true);

        setPendingBookings(pending);
        setConfirmedBookings(confirmed);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Error fetching bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [landlordId]);

  const handleUpdateStatus = async (bookingId, status, tenantEmail, tenantName) => {
    try {
      // Send 'Confirmed' or 'Rejected' as status strings to the backend
      await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/bookings/status/${bookingId}`, { status, tenantEmail, tenantName });
      toast.success(`Booking ${status === 'Confirmed' ? 'approved' : 'rejected'} successfully!`);

      // Update the booking state locally after status change
      setPendingBookings(prev => prev.filter(booking => booking.bookingId !== bookingId));
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Error updating booking status');
    }
  };

  const handlePayment = (bookingId) => {
    const booking = [...pendingBookings, ...confirmedBookings].find(b => b.bookingId === bookingId);
    if (booking) {
      setSelectedBooking(booking);
      setIsShowPaymentModal(true);
    }
  };

  const closeModal = () => {
    setIsShowPaymentModal(false); // Close the modal
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }


  return (
    <div>
      <LandlordNavbar />

      <ToastContainer />

      {profile ? (
                    <div className="bg-gray-400 flex items-start justify-center p-4 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 justify-center md:justify-start">
                {/* Profile Image */}
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

                {/* Landlord Name and Role */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                    {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-white text-lg md:text-xl">{profile.accountType}</p>

                {/* Edit Profile Button */}
                <button
                    className="px-4 py-2 mt-4 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200"
                    onClick={toggleModal}
                >
                    Edit Profile
                </button>
                </div>
            </div>
            </div>
      ) : (
        <div>Loading profile...</div>
      )}

      {profile && (
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <table className="table-auto w-full text-left border-collapse border border-gray-200">
            <tbody>
              <tr>
                <td className="border border-gray-200 p-2 font-semibold">Full Name</td>
                <td className="border border-gray-200 p-2">
                  {profile.firstName} {profile.lastName}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2 font-semibold">Email</td>
                <td className="border border-gray-200 p-2">{profile.email}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2 font-semibold">Phone Number</td>
                <td className="border border-gray-200 p-2">{profile.phoneNumber}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2 font-semibold">Address</td>
                <td className="border border-gray-200 p-2">{profile.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
       {/* Bookings Section */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
        <p className="mb-2">Last updated: September 5, 2024</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleViewBookings(userId)}
        >
          View Bookings ({pendingCount} pending, {confirmedCount} confirmed)
        </button>
      </div>

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
                            disabled={loading} // Disable button while loading
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
      

      <BookingAndProperty />

    </div>
  );
};

export default LandlordViewProfile;

