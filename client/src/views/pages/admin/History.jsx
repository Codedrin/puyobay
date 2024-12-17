import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPageNavbar from '../../../constants/AdminPageNavbar';
import { useParams } from 'react-router-dom';

const History = () => {
  const { tenantId } = useParams(); // Extract tenantId from URL
  const [canceledBookings, setCanceledBookings] = useState([]); // Default empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCanceledBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/bookings/all`);
  
        console.log('API Response:', response.data); // Debug API response
  
        // Filter canceled bookings directly from response
        const filteredBookings = response.data.bookings
          .filter((booking) => booking.cancellations && booking.cancellations.length > 0)
          .map((booking) => ({
            propertyName: booking.propertyName || 'N/A',
            tenantName: booking.tenantName || 'N/A',
            canceledAt: booking.cancellations[0]?.canceledAt || 'N/A',
            cancellationReason: booking.cancellations[0]?.cancellationReason || 'No Reason Provided',
          }));
  
        setCanceledBookings(filteredBookings);
      } catch (err) {
        console.error('Error fetching canceled bookings:', err.message);
        setError('Failed to fetch canceled bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCanceledBookings();
  }, []);

  

  return (
    <div>
      <AdminPageNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Canceled Bookings</h1>

        {/* Loading State */}
        {loading && <p>Loading...</p>}

        {/* Error State */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Table to Display Data */}
        {!loading && !error && canceledBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Property Name</th>
                  <th className="border px-4 py-2">Tenant Name</th>
                  <th className="border px-4 py-2">Canceled At</th>
                  <th className="border px-4 py-2">Cancellation Reason</th>
                </tr>
              </thead>
              <tbody>
                {canceledBookings.map((booking, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{booking.propertyName}</td>
                    <td className="border px-4 py-2">{booking.tenantName}</td>
                    <td className="border px-4 py-2">
                      {booking.canceledAt
                        ? new Date(booking.canceledAt).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="border px-4 py-2">
                      {booking.cancellationReason || 'No Reason Provided'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !loading && <p>No canceled bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default History;
