import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TenantNavbar from '../../../constants/TenantNabar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { qr } from '../../../assets'; 

const BookingForm = () => {
    const { propertyId } = useParams(); 
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

  const [paymentDetails, setPaymentDetails] = useState({
    referenceNumber: '',
    mobileNumberUsed: '',
    senderName: '',
    receipt: null, 
  });

  const [isQRCodeModalOpen, setQRCodeModalOpen] = useState(false); // QR code modal state
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'paymentMethod' && value === 'GCash') {
      setQRCodeModalOpen(true);
    } else {
      setQRCodeModalOpen(false);
    }
  };

  // Handle payment detail changes
  const handlePaymentDetailsChange = (e) => {
    const { name, value, files } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: files ? files[0] : value,
    }));
  };

  // This function is for uploading the file (receipt) to Cloudinary
  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'PuyobayAssets');
    formData.append('cloud_name', 'ddmgrfhwk');

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/ddmgrfhwk/upload', formData);
      return {
        url: response.data.secure_url,
        publicId: response.data.public_id,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Final form submission handler
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      let receiptData = {};
      if (formData.paymentMethod === 'GCash' && paymentDetails.receipt) {
        receiptData = await uploadFileToCloudinary(paymentDetails.receipt);
      }

      const bookingData = {
        ...formData,
        userId, 
        propertyId,
        paymentDetails: {
          referenceNumber: paymentDetails.referenceNumber,
          mobileNumberUsed: paymentDetails.mobileNumberUsed,
          senderName: paymentDetails.senderName,
          receipt: receiptData,
        },
      };

      const response = await axios.post('http://localhost:5000/api/users/process-booking', bookingData);

      if (response.status === 201) {
        toast.success('Booking processed successfully');
      } else {
        toast.error('Failed to process booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsConfirmationModalOpen(false); 
    }
  };


  return (
    <div>
      <TenantNavbar />
      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">House Rental Booking Form</h2>
        <form className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); setIsConfirmationModalOpen(true); }}>
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

      {/* Modal Popup for QR Code and Payment Details */}
      {isQRCodeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side - QR code */}
            <div className="flex flex-col items-center">
              <p className="text-red-500 font-semibold mb-4">
                Please scan the QR code below and pay the exact amount. You will receive an email confirmation within 24 hours.
              </p>
              <img src={qr} alt="QR Code for GCash" className="w-48 h-48 mb-4" />
            </div>

            {/* Right side - Input fields for payment details */}
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block font-semibold">Reference Number</label>
                <input
                  type="text"
                  name="referenceNumber"
                  className="w-full border px-3 py-2 rounded"
                  value={paymentDetails.referenceNumber}
                  onChange={handlePaymentDetailsChange}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Mobile Number Used</label>
                <input
                  type="tel"
                  name="mobileNumberUsed"
                  className="w-full border px-3 py-2 rounded"
                  value={paymentDetails.mobileNumberUsed}
                  onChange={handlePaymentDetailsChange}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Sender Name</label>
                <input
                  type="text"
                  name="senderName"
                  className="w-full border px-3 py-2 rounded"
                  value={paymentDetails.senderName}
                  onChange={handlePaymentDetailsChange}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold">Upload GCash Receipt</label>
                <input
                  type="file"
                  name="receipt"
                  className="w-full border px-3 py-2 rounded"
                  onChange={handlePaymentDetailsChange}
                  required
                />
              </div>

              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setQRCodeModalOpen(false)} // Close modal
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
      
        {/* Confirmation Modal */}
        {isConfirmationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Confirm Booking</h2>
            <p>Are you sure you want to confirm the booking?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                No
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                 {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookingForm;
