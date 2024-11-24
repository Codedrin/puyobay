import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPageNavbar from '../../../constants/AdminPageNavbar';

const LandlordAdmin = () => {
  const [landlords, setLandlords] = useState([]);
  const [totalTenants, setTotalTenants] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLandlord, setSelectedLandlord] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://puyobay.onrender.com/api/users');
        setLandlords(response.data.landlords);
        setTotalTenants(response.data.totalTenants);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredLandlords = landlords.filter((landlord) =>
    landlord.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentLandlords = filteredLandlords.slice(indexOfFirstEntry, indexOfLastEntry);

  const totalPages = Math.ceil(filteredLandlords.length / entriesPerPage);

  const handlePrint = () => {
    window.print();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const fetchBusinessDetails = async (landlordId) => {
    try {
      const { data } = await axios.get(
        `https://puyobay.onrender.com/api/users/landlords/business-details/${landlordId}`
      );
      setSelectedLandlord(data);
      toggleModal();
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  };

  return (
    <div>
      <AdminPageNavbar />
      <br />
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
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Print
        </button>
      </div>
      <h2 className="text-lg md:text-xl font-semibold mb-4 mx-4">View All Landlords</h2>
      <div className="overflow-x-auto mx-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Property Names</th>
              <th className="py-2 px-4 border-b text-left">Address</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Total Tenants</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLandlords.map((landlord) => (
              <tr key={landlord._id}>
                <td className="py-2 px-4 border-b">{landlord._id}</td>
                <td className="py-2 px-4 border-b">{landlord.name}</td>
                <td className="py-2 px-4 border-b">{landlord.propertyNames.join(', ')}</td>
                <td className="py-2 px-4 border-b">{landlord.address}</td>
                <td className="py-2 px-4 border-b">{landlord.email}</td>
                <td className="py-2 px-4 border-b">{landlord.totalTenants}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => fetchBusinessDetails(landlord._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    View Business Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      {isModalOpen && selectedLandlord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Business Details</h2>
              <button
                onClick={toggleModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <p><strong>Business Name:</strong> {selectedLandlord.businessName}</p>
            <p><strong>Business Permit:</strong> {selectedLandlord.businessPermit}</p>
            {selectedLandlord.attachment && (
              <p>
                <strong>Attachment:</strong>{' '}
                <a
                  href={selectedLandlord.attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Attachment
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordAdmin;