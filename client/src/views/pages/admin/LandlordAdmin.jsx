import React, { useState, useEffect } from 'react'; // Added missing imports
import axios from 'axios'; // Added axios import
import AdminPageNavbar from '../../../constants/AdminPageNavbar';

const LandlordAdmin = () => {
  const [landlords, setLandlords] = useState([]); // Initialize landlords state
  const [totalTenants, setTotalTenants] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setLandlords(response.data.landlords); // Fetch landlords from the backend
        setTotalTenants(response.data.totalTenants); // Fetch total tenants from the backend
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

      {/* Landlords Section */}
      <h2 className="text-lg md:text-xl font-semibold mb-2">View All Landlords</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border-b text-left">ID</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Name</th>
              <th className="py-2 px-2 md:px-4 border-b text-left">Property Names</th>
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
    </div>
  );
};

export default LandlordAdmin;
