import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPageNavbar from '../../../constants/AdminPageNavbar';

const LandlordAdmin = () => {
  const [landlords, setLandlords] = useState([]); // Initialize landlords state
  const [totalTenants, setTotalTenants] = useState(0);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [entriesPerPage, setEntriesPerPage] = useState(5); // State for entries per page
  const [currentPage, setCurrentPage] = useState(1); // State for pagination

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/users');
        setLandlords(response.data.landlords); // Fetch landlords from the backend
        setTotalTenants(response.data.totalTenants); // Fetch total tenants from the backend
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search filter
  const filteredLandlords = landlords.filter((landlord) =>
    landlord.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentLandlords = filteredLandlords.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredLandlords.length / entriesPerPage);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <AdminPageNavbar />
      <br />

      {/* Entries, Search and Print button section */}
      <div className="flex justify-between items-center mb-4 mx-4">
        <div className="flex items-center">
          <label htmlFor="entries" className="mr-2">Show</label>
          <select
            id="entries"
            className="border p-1 rounded"
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2">entries</span>
        </div>

        <div className="flex items-center">
          <label htmlFor="search" className="mr-2">Search:</label>
          <input
            id="search"
            type="text"
            className="border p-1 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Print Button */}
        <button 
          onClick={handlePrint} 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Print
        </button>
      </div>

      {/* Landlords Section */}
      <h2 className="text-lg md:text-xl font-semibold mb-4 mx-4">View All Landlords</h2>

      <div className="overflow-x-auto mx-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">ID</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Name</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Property Names</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Address</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Email</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Total Tenants</th>
            </tr>
          </thead>
          <tbody>
            {currentLandlords.map((landlord) => (
              <tr key={landlord._id}>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord._id}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord.name}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord.propertyNames.join(', ')}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord.address}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord.email}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord.totalTenants}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4 mx-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-gray-300 rounded disabled:bg-gray-200"
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-300 rounded disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LandlordAdmin;
