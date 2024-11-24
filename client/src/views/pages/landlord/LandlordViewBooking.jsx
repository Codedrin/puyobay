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
      <div className="container mx-auto p-4">
        {/* Pending Bookings */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pending Bookings</h2>
          {pendingBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Booking ID</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Property Name</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Tenant Name</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Booking Date</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Status</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Payment</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td className="border p-2">{booking.bookingId}</td>
                      <td className="border p-2">{booking.propertyName}</td>
                      <td className="border p-2">{booking.tenantName}</td>
                      <td className="border p-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td className="border p-2">{booking.status ? 'Paid' : 'Not Paid'}</td>
                      <td className="border p-2 text-center">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded w-full sm:w-auto"
                          onClick={() => handlePayment(booking.bookingId)}
                        >
                          Payment
                        </button>
                      </td>
                      <td className="border p-2 text-center">
                        <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
                          <button
                            className="bg-green-500 text-white p-2 rounded w-full sm:w-auto"
                            onClick={() => handleUpdateStatus(booking.bookingId, 'Confirmed', booking.tenantEmail, booking.tenantName)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white p-2 rounded w-full sm:w-auto"
                            onClick={() => handleUpdateStatus(booking.bookingId, 'Rejected', booking.tenantEmail, booking.tenantName)}
                          >
                            Reject
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No pending bookings</p>
          )}
        </div>

        {/* Confirmed Bookings */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Confirmed Bookings</h2>
          {confirmedBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Booking ID</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Property Name</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Tenant Name</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Booking Date</th>
                    <th className="border p-2 text-xs sm:text-sm md:text-base">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedBookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td className="border p-2">{booking.bookingId}</td>
                      <td className="border p-2">{booking.propertyName}</td>
                      <td className="border p-2">{booking.tenantName}</td>
                      <td className="border p-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                      <td className="border p-2">{booking.status ? 'Paid' : 'Not Paid'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No confirmed bookings</p>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedBooking && (
        <ShowPaymentModal
          isOpen={isShowPaymentModal}
          onClose={closeModal}
          paymentMethod={selectedBooking.paymentMethod}
          paymentDetails={selectedBooking.paymentDetails}
        />
      )}
    </div>
  );
};

export default LandlordViewBooking;
