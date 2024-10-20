import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import axios from 'axios'; // Added axios import
import AdminPageNavbar from '../../../constants/AdminPageNavbar';

const TenantAdmin = () => {
  const [tenants, setTenants] = useState([]); // State to store tenants

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users`);
        setTenants(response.data.tenants); // Assuming tenants data is in response.data.tenants
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <AdminPageNavbar />
      <br />
      <h2 className="text-lg md:text-xl font-semibold mb-2">View All Tenants</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border-b text-left">ID</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Name</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Email</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant._id}>
                <td className="py-2 px-2 md:px-4 border-b text-left">{tenant._id}</td>
                <td className="py-2 px-2 md:px-4 border-b text-left">{tenant.name}</td>
                <td className="py-2 px-2 md:px-4 border-b text-left">{tenant.email}</td>
                <td className="py-2 px-2 md:px-4 border-b text-left">{tenant.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantAdmin;
