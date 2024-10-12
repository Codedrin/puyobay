import React from 'react'

const ShowPaymentModal  = ({ isOpen, onClose, paymentMethod, paymentDetails }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-4 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Payment Details</h2>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          {paymentMethod === 'GCash' && (
            <>
              <p><strong>Reference Number:</strong> {paymentDetails.referenceNumber}</p>
              <p><strong>Mobile Number:</strong> {paymentDetails.mobileNumberUsed}</p>
              <p><strong>Sender Name:</strong> {paymentDetails.senderName}</p>
              <img src={paymentDetails.receipt.url} alt="Receipt" className="w-full h-auto mt-4" />
            </>
          )}
          <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Close</button>
        </div>
      </div>
    );
  };
  
export default ShowPaymentModal