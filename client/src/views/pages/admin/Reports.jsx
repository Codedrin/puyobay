import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminPageNavbar from '../../../constants/AdminPageNavbar';

const Reports = () => {
  const [landlords, setLandlords] = useState([]); // State to store landlords' income data
  const [selectedMonth, setSelectedMonth] = useState(''); // State to store selected month
  const [months] = useState([
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]); // Month options

  useEffect(() => {
    if (selectedMonth) {
      fetchLandlordIncome();
    }
  }, [selectedMonth]);

  const fetchLandlordIncome = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/landlords/income?month=${selectedMonth}`); // Fetch income based on month
      setLandlords(response.data); // Set the response data to state
    } catch (error) {
      console.error('Error fetching landlords\' income:', error);
    }
  };

  // Function to calculate the net income after a 10% deduction
  const calculateNetIncome = (income) => {
    const deduction = income * 0.1; // 10% deduction
    return income - deduction;
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <AdminPageNavbar />
      <br />

      {/* Month Filter */}
      <div className="flex justify-between items-center mb-4 mx-4">
        <div className="flex items-center">
          <label htmlFor="month" className="mr-2">Select Month:</label>
          <select
            id="month"
            className="border p-1 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">-- Select Month --</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Print Button */}
        <button 
          onClick={handlePrint} 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Print
        </button>
      </div>

      <h2 className="text-lg md:text-xl font-semibold mb-4 mx-4">
        Landlord Income Report for {selectedMonth || 'All Months'}
      </h2>

      {/* Landlord Income Table */}
      <div className="overflow-x-auto mx-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Landlord ID</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Landlord Name</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Total Income (₱)</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Deduction (10%)</th>
              <th className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">Net Income (₱)</th>
            </tr>
          </thead>
          <tbody>
            {landlords.map((landlord) => (
              <tr key={landlord.landlordId}>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord.landlordId}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  {landlord.landlordName}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  ₱{landlord.totalIncome.toLocaleString('en-PH')}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  ₱{(landlord.totalIncome * 0.1).toLocaleString('en-PH')} {/* 10% deduction */}
                </td>
                <td className="py-2 px-2 md:px-4 border-b text-left text-xs md:text-sm">
                  ₱{calculateNetIncome(landlord.totalIncome).toLocaleString('en-PH')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;