import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LandlordNavbar from '../../../constants/LandlordNavbar'; 

const LandlordDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    tenants: [],
    checkInOut: { checkIns: 0, checkOuts: 0 },
    payments: { paid: 0, pending: 0 }
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

  return (
    <div>
      <LandlordNavbar />

      <div className="container mx-auto p-4">
        {/* Tenants Section */}
        <h2 className="text-2xl font-semibold mb-4">Tenants</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">User ID</th>
                <th className="border border-gray-200 p-2">Name</th>
                <th className="border border-gray-200 p-2">Address</th>
                <th className="border border-gray-200 p-2">Phone Number</th>
                <th className="border border-gray-200 p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.tenants.map((tenant, index) => (
                <tr key={tenant.userId}>
                  <td className="border border-gray-200 p-2">{tenant.userId}</td>
                  <td className="border border-gray-200 p-2">{tenant.name}</td>
                  <td className="border border-gray-200 p-2">{tenant.address}</td>
                  <td className="border border-gray-200 p-2">{tenant.phoneNumber}</td>
                  <td className="border border-gray-200 p-2">{tenant.email}</td>
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
                <th className="border border-gray-200 p-2">ID</th>
                <th className="border border-gray-200 p-2">Date</th>
                <th className="border border-gray-200 p-2">Type</th>
                <th className="border border-gray-200 p-2">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 p-2">1</td>
                <td className="border border-gray-200 p-2">{new Date().toLocaleDateString()}</td>
                <td className="border border-gray-200 p-2">Check-In</td>
                <td className="border border-gray-200 p-2">{dashboardData.checkInOut.checkIns}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">2</td>
                <td className="border border-gray-200 p-2">{new Date().toLocaleDateString()}</td>
                <td className="border border-gray-200 p-2">Check-Out</td>
                <td className="border border-gray-200 p-2">{dashboardData.checkInOut.checkOuts}</td>
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
                <td className="border border-gray-200 p-2">{dashboardData.payments.paid}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 p-2">2</td>
                <td className="border border-gray-200 p-2">Pending</td>
                <td className="border border-gray-200 p-2">{dashboardData.payments.pending}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
