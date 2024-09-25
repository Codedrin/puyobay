import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFile, faBuilding, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const LandlordSignupModal = ({ isOpen, onClose, onSubmit, onChange, setAttachment }) => {
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
       <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 md:w-96 md:p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">House Rental Business Permit Information</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} className="text-gray-600"/>
          </button>
        </div>
        <form className="mt-4">
          <div className="mb-4">
            <label htmlFor="permitNumber" className="sr-only">Business Permit Number</label>
            <div className="relative">
              <FontAwesomeIcon icon={faFile} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                id="permitNumber"
                name="permitNumber"
                onChange={onChange}
                placeholder="Business Permit Number"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="businessName" className="sr-only">Business Name</label>
            <div className="relative">
              <FontAwesomeIcon icon={faBuilding} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input
                type="text"
                id="businessName"
                name="businessName"
                onChange={onChange}
                placeholder="Business Name"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="permitImage" className="sr-only">Attach Permit Image</label>
            <div className="relative">
              <FontAwesomeIcon icon={faFile} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <input
                type="file"
                id="permitImage"
                onChange={handleFileChange}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="additionalInfo" className="sr-only">Additional Business Details</label>
            <div className="relative">
              <FontAwesomeIcon icon={faInfoCircle} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                onChange={onChange}
                placeholder="Additional Business Details"
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandlordSignupModal;
