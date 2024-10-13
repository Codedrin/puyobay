import React, { useEffect, useState } from 'react';
import AdminPageNavbar from '../../../constants/AdminPageNavbar';
import axios from 'axios';

const Admin = () => {
  const [landlords, setLandlords] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users`); // Adjust URL if needed
=======
        const response = await axios.get('http://localhost:5000/api/users'); 
>>>>>>> master
        setLandlords(response.data.landlords);
        setTenants(response.data.tenants);
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
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Users Overview</h1>

        {/* Landlords Section */}
        <h2 className="text-lg md:text-xl font-semibold mb-2">View All Landlords</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-2 md:px-4 border-b text-left">ID</th>
                <th className="py-2 px-2 md:px-4 border-b text-left">Name</th>
                <th className="py-2 px-2 md:px-4 border-b text-left">Property Names</th> {/* Updated to Property Names */}
                <th className="py-2 px-2 md:px-4 border-b text-left">Address</th>
                <th className="py-2 px-2 md:px-4 border-b text-left">Email</th>
                <th className="py-2 px-2 md:px-4 border-b text-left">Total Tenants</th>
              </tr>
            </thead>

                    <tbody>
          {landlords.map((landlord) => (
            <tr key={landlord._id}>
              <td className="py-2 px-2 md:px-4 border-b text-left">{landlord._id}</td>
              <td className="py-2 px-2 md:px-4 border-b text-left">{landlord.name}</td>
              <td className="py-2 px-2 md:px-4 border-b text-left">
                {landlord.propertyNames.join(', ')} 
              </td>
              <td className="py-2 px-2 md:px-4 border-b text-left">{landlord.address}</td>
              <td className="py-2 px-2 md:px-4 border-b text-left">{landlord.email}</td>
              <td className="py-2 px-2 md:px-4 border-b text-left">{landlord.totalTenants}</td>
            </tr>
          ))}
        </tbody>

          </table>
        </div>

        {/* Tenants Section */}
        <h2 className="text-lg md:text-xl font-semibold mt-8 mb-2">View All Tenants</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-2 md:px-4 border-b text-left">ID</th>
                <th className="py-2 px-2 md:px-4 border-b text-left">Name</th>
                <th className="py-2 px-2 md:px-4 border-b text-left">Address</th>
                <th className="py-2 px-2 md:px-4 border-b text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant._id}>
                  <td className="py-2 px-2 md:px-4 border-b text-left">{tenant._id}</td>
                  <td className="py-2 px-2 md:px-4 border-b text-left">{tenant.name}</td>
                  <td className="py-2 px-2 md:px-4 border-b text-left">{tenant.address}</td>
                  <td className="py-2 px-2 md:px-4 border-b text-left">{tenant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
