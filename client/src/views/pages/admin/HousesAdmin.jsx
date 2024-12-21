import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPageNavbar from '../../../constants/AdminPageNavbar';

const HousesAdmin = () => {
  const [properties, setProperties] = useState([]); // State to store properties
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [entriesPerPage, setEntriesPerPage] = useState(5); // State for entries per page
  const [currentPage, setCurrentPage] = useState(1); // State for pagination

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`https://puyobay.onrender.com/api/users/get-property-count`); // Fetch properties from your backend API
        setProperties(response.data.properties); // Set properties to state
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  // Handle search filter
  const filteredProperties = properties.filter((property) =>
    property.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredProperties.length / entriesPerPage);

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <AdminPageNavbar />
      <br />

      {/* Entries, Search, and Print button section */}
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

      {/* Properties Section */}
      <h2 className="text-lg md:text-xl font-semibold mb-4 mx-4">View All Properties</h2>

      <div className="overflow-x-auto mx-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">ID</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Name</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Price</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Rooms</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Municipality</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentProperties.map((property) => (
              <tr key={property._id}>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {property._id}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {property.propertyName}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                ₱ {property.price}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {property.availableRooms}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {property.municipality}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {property.averageRating || 'N/A'}
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

export default HousesAdmin;
