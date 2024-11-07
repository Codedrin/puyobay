import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LandlordNavbar from '../../../constants/LandlordNavbar';

const LandlordDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    tenants: [],
    dailyCheckIns: 0,
    dailyCheckOuts: 0,
    weeklyCheckIns: 0,
    weeklyCheckOuts: 0,
    monthlyCheckIns: 0,
    monthlyCheckOuts: 0,
    dailyIncome: 0,
    weeklyIncome: 0,
    monthlyIncome: 0,
    payments: { paid: 0, pending: 0 },
    cancellations: [], // Include cancellations here
  });
  const [loading, setLoading] = useState(true);

  // Get landlordId from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const landlordId = user?.id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/landlord-dashboard/${landlordId}`);
        setDashboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (landlordId) {
      fetchDashboardData();
    }
  }, [landlordId]);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  const { payments = { paid: 0, pending: 0 }, cancellations = [] } = dashboardData;

  // Function to handle the print action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <LandlordNavbar />

      <div className="container mx-auto p-4">
        {/* Add the Print button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Print Report
          </button>
        </div>

        {/* Tenants Section */}
        <h2 className="text-2xl font-semibold mb-4">Tenants</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">User ID</th>
                <th className="border border-gray-200 p-2">Name</th>
                <th className="border border-gray-200 p-2">Check-In Date</th>
                <th className="border border-gray-200 p-2">Check-Out Date</th>
                <th className="border border-gray-200 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.tenants.map((tenant) => (
                <tr key={tenant.userId}>
                  <td className="border border-gray-200 p-2">{tenant.userId}</td>
                  <td className="border border-gray-200 p-2">{tenant.name}</td>
                  <td className="border border-gray-200 p-2">{new Date(tenant.checkInDate).toLocaleDateString()}</td>
                  <td className="border border-gray-200 p-2">{new Date(tenant.checkOutDate).toLocaleDateString()}</td>
                  <td className="border border-gray-200 p-2">{tenant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cancellations Section */}
        <h2 className="text-2xl font-semibold mb-4 mt-8">Cancellations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Booking ID</th>
                <th className="border border-gray-200 p-2">Reason</th>
                <th className="border border-gray-200 p-2">Canceled At</th>
              </tr>
            </thead>
            <tbody>
              {cancellations.map((cancellation, index) => (
                <tr key={index}>
                  <td className="border border-gray-200 p-2">{cancellation.bookingId}</td>
                  <td className="border border-gray-200 p-2">{cancellation.cancellationReason}</td>
                  <td className="border border-gray-200 p-2">{new Date(cancellation.canceledAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bookings Section */}
        <h2 className="text-2xl font-semibold mb-4 mt-8">Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Check-Ins Today</th>
                <th className="border border-gray-200 p-2">Check-Outs Today</th>
                <th className="border border-gray-200 p-2">Weekly Check-Ins</th>
                <th className="border border-gray-200 p-2">Weekly Check-Outs</th>
                <th className="border border-gray-200 p-2">Monthly Check-Ins</th>
                <th className="border border-gray-200 p-2">Monthly Check-Outs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-2">{dashboardData.dailyCheckIns}</td>
                <td className="border border-gray-200 p-2">{dashboardData.dailyCheckOuts}</td>
                <td className="border border-gray-200 p-2">{dashboardData.weeklyCheckIns}</td>
                <td className="border border-gray-200 p-2">{dashboardData.weeklyCheckOuts}</td>
                <td className="border border-gray-200 p-2">{dashboardData.monthlyCheckIns}</td>
                <td className="border border-gray-200 p-2">{dashboardData.monthlyCheckOuts}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Income Section */}
        <h2 className="text-2xl font-semibold mb-4 mt-8">Income</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Daily Income</th>
                <th className="border border-gray-200 p-2">Weekly Income</th>
                <th className="border border-gray-200 p-2">Monthly Income</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-2">₱{dashboardData.dailyIncome}</td>
                <td className="border border-gray-200 p-2">₱{dashboardData.weeklyIncome}</td>
                <td className="border border-gray-200 p-2">₱{dashboardData.monthlyIncome}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payments Section */}
        <h2 className="text-2xl font-semibold mb-4 mt-8">Payments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">ID</th>
                <th className="border border-gray-200 p-2">Status</th>
                <th className="border border-gray-200 p-2">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-2">1</td>
                <td className="border border-gray-200 p-2">Paid</td>
                <td className="border border-gray-200 p-2">{payments.paid}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">2</td>
                <td className="border border-gray-200 p-2">Pending</td>
                <td className="border border-gray-200 p-2">{payments.pending}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
