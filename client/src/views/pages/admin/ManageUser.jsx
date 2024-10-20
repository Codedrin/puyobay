import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminManageUserNav from '../../../constants/AdminManageUserNav';

const ManageUser = () => {
  const [landlords, setLandlords] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users`);
        const { landlords, tenants } = response.data;
  
        // Update the state with the fetched users
        setLandlords(landlords);
        setTenants(tenants);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error fetching users');
      }
    };
  
    // Fetch the latest users when the component loads
    fetchUsers();
  }, []); // <-- Ensure fetchUsers runs only when the component loads
  
  // When you toggle approval, update the state and save the change to the database
  const handleToggleApproval = async (landlordId, currentStatus) => {
    try {
      // Send a PUT request to toggle the approval status in the backend
      const response = await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/approve/${landlordId}`, { approved: !currentStatus });
    
      const updatedLandlord = response.data.landlord;
  
      // Display a success message
      toast.success(`Landlord ${currentStatus ? 'disapproved' : 'approved'} successfully`);
  
      // Update the local state to reflect the change immediately
      setLandlords((prevLandlords) =>
        prevLandlords.map((landlord) =>
          landlord._id === landlordId ? { ...landlord, approved: updatedLandlord.approved } : landlord
        )
      );
    } catch (error) {
      console.error('Error toggling landlord approval:', error);
      toast.error(`Error ${currentStatus ? 'disapproving' : 'approving'} landlord`);
    }
  };
  
  
  

  const handleDeny = async (landlordId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users/deny/${landlordId}`);
      toast.success('Landlord denied and removed successfully');
      setLandlords(landlords.filter(landlord => landlord._id !== landlordId)); // Remove from local state

    } catch (error) {
      console.error('Error denying landlord:', error);
      toast.error('Error denying landlord');
    }
  };
  
  
  

  const handleViewCertificate = (url) => {
    if (url) {
      window.open(url, '_blank'); // Open the certificate in a new tab
    } else {
      toast.error('No certificate available for this landlord.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <AdminManageUserNav />

      {/* Main Content Area */}
      <div className="p-4 md:p-8">
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Manage Users</h1>

        {/* Landlords Section */}
        <div className="mb-6 md:mb-10 overflow-x-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Landlords</h2>
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 md:px-4 border">ID</th>
                <th className="py-2 px-2 md:px-4 border">Name</th>
                <th className="py-2 px-2 md:px-4 border">Email</th>
                <th className="py-2 px-2 md:px-4 border">Certificate</th>
                <th className="py-2 px-2 md:px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {landlords.map((landlord) => (
                <tr key={landlord._id}>
                  <td className="py-2 px-2 md:px-4 border text-center">{landlord._id}</td>
                  <td className="py-2 px-2 md:px-4 border text-center">{landlord.name}</td>
                  <td className="py-2 px-2 md:px-4 border text-center">{landlord.email}</td>
                  <td className="py-2 px-2 md:px-4 border text-center">
                    <button
                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                        onClick={() => handleViewCertificate(landlord.attachment?.url)}
                    >
                        {landlord.attachment?.url ? 'Check Certificate' : 'No Certificate'}
                    </button>
                    </td>

                    <td className="py-2 px-2 md:px-4 border text-center">
                        {landlord.approved ? (
                            // Only show Disapprove button when approved is true
                            <button
                            className="bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded"
                            onClick={() => handleToggleApproval(landlord._id, landlord.approved)}
                            >
                            Disapprove
                            </button>
                        ) : (
                            // Show both Approve and Deny buttons when approved is false
                            <div className="flex flex-col md:flex-row justify-center items-center">
                            <button
                                className="bg-green-500 text-white px-2 py-1 md:px-4 md:py-2 rounded mb-1 md:mb-0 md:mr-2"
                                onClick={() => handleToggleApproval(landlord._id, landlord.approved)}
                            >
                                Approve
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded"
                                onClick={() => handleDeny(landlord._id)}
                            >
                                Deny
                            </button>
                            </div>
                        )}
                  </td>



                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tenants Section */}
        <div className="overflow-x-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Tenants</h2>
          <table className="min-w-full bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-2 md:px-4 border">ID</th>
                <th className="py-2 px-2 md:px-4 border">Name</th>
                <th className="py-2 px-2 md:px-4 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant._id}>
                  <td className="py-2 px-2 md:px-4 border text-center">{tenant._id}</td>
                  <td className="py-2 px-2 md:px-4 border text-center">{tenant.name}</td>
                  <td className="py-2 px-2 md:px-4 border text-center">{tenant.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ManageUser;
