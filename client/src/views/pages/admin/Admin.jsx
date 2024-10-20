import React, { useEffect, useState } from 'react';
import AdminPageNavbar from '../../../constants/AdminPageNavbar';
import axios from 'axios';

// Import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUsers, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

const Admin = () => {
  const [landlords, setLandlords] = useState([]);
  const [totalLandlords, setTotalLandlords] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  const [totalPayments, setTotalPayments] = useState(null); // Initialize as null

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setLandlords(response.data.landlords);
        setTotalLandlords(response.data.totalLandlords); // Fetch total landlords from the backend
        setTotalTenants(response.data.totalTenants); // Fetch total tenants from the backend
        setTotalPayments(response.data.totalPayments); // Assuming you have totalPayments in the response
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <AdminPageNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Admin Dashboard</h1>

        {/* Dashboard Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-500 text-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faHouse} className="text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Landlords</h3>
                <p className="text-2xl">{totalLandlords}</p>
              </div>
            </div>
            <a href="/admin/landlord" className="text-white underline">View List</a>
          </div>  

          <div className="bg-yellow-500 text-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faUsers} className="text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Tenants</h3>
                <p className="text-2xl">{totalTenants}</p>
              </div>
            </div>
            <a href="/admin/tenant" className="text-white underline">View List</a>
          </div>

          <div className="bg-green-500 text-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-3xl mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Payments This Month</h3>
                {/* Fix to handle totalPayments being undefined or null */}
                <p className="text-2xl">{totalPayments !== null && totalPayments !== undefined ? totalPayments.toFixed(2) : '0.00'}</p>
              </div>
            </div>
            <a href="/payments" className="text-white underline">View Payments</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
