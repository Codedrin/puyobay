import React, { useState } from 'react';
import TenantNavbar from '../../../constants/TenantNabar';
import { qr } from '../../../assets'; // Adjust the path for your QR code image

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phoneNumber: '',
    checkInDate: '',
    checkOutDate: '',
    persons: '',
    paymentMethod: '',
  });

  const [isQRCodeModalOpen, setQRCodeModalOpen] = useState(false); // QR code modal state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'paymentMethod' && value === 'GCash') {
      setQRCodeModalOpen(true); // Open the QR code modal when GCash is selected
    } else {
      setQRCodeModalOpen(false); // Close the modal if GCash is not selected
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div>
      <TenantNavbar />
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">House Rental Booking Form</h2>
        <form className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              name="name"
              className="w-full border px-3 py-2 rounded"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Check-In Date</label>
            <input
              type="date"
              name="checkInDate"
              className="w-full border px-3 py-2 rounded"
              value={formData.checkInDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Age</label>
            <input
              type="number"
              name="age"
              className="w-full border px-3 py-2 rounded"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Check-Out Date</label>
            <input
              type="date"
              name="checkOutDate"
              className="w-full border px-3 py-2 rounded"
              value={formData.checkOutDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="gender"
              className="w-full border px-3 py-2 rounded"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Good For How Many Persons</label>
            <input
              type="number"
              name="persons"
              className="w-full border px-3 py-2 rounded"
              value={formData.persons}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="w-full border px-3 py-2 rounded"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Payment Method</label>
            <select
              name="paymentMethod"
              className="w-full border px-3 py-2 rounded"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="GCash">GCash</option>
              <option value="CreditCard">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <button
            type="submit"
            className="col-span-1 md:col-span-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </form>
      </div>
      <br />
               {/* Footer Section */}
        <div className="text-center mt-10">
          <p className="text-gray-600">&copy; 2024 PUYOBAY. All rights reserved.</p>
        </div>
        <br />
      {/* Modal Popup for QR Code */}
      {isQRCodeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-red-500 font-semibold mb-4">
              Please scan the QR code below and pay the exact amount. You will receive an email confirmation within 24 hours.
            </p>
            <img src={qr} alt="QR Code for GCash" className="w-48 h-48 mx-auto mb-4" />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setQRCodeModalOpen(false)} // Close modal
            >
              Close
            </button>
          </div>
        </div>
      )}
      
    </div>
    
  );
};

export default BookingForm;
