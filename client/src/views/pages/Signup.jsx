  import React, { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios'
  import Navbar from '../../constants/Navbar';
  import { bg } from '../../assets'; 
  import LandlordSignupModal from './LandlordSignupModal';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faUser, faEnvelope, faLock, faPhone, faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  
  const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accountType, setAccountType] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      permitNumber: '',
      businessName: '',
      additionalInfo: '',
      accountType: '',
    });
  
    const uploadFileToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'PuyobayAssets'); 
      formData.append('cloud_name', 'ddmgrfhwk'); 
    
      try {
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/ddmgrfhwk/auto/upload',
          formData
        );
        return response.data.url;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    };
  
    // Password validation function
    const validatePassword = (password) => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/;
      return passwordRegex.test(password);
    };
  
    const handleSignUpClicked = (e) => {
      e.preventDefault();
  
      if (!validatePassword(formData.password)) {
        toast.error('Password must be at least 6 characters long and include an uppercase letter, a number, and a symbol.', {
        });
        return;
      }
  
      if (formData.accountType === 'landlord') {
        setIsModalOpen(true);
      } else {
        handleRegularSignUp();
      }
    };
  
    const handleRegularSignUp = async () => {
      try {
        setLoading(true); 
        const response =  await axios.post(`https://puyobay.onrender.com/api/users/register`, {
          ...formData,
          attachment: null,
        });
        
        const userId = response.data.user.id;
        navigate(`/otp/${userId}`);
      } catch (error) {
        console.error('Error registering user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const handleModalSubmit = async () => {
      try {
        setLoading(true);
        let attachmentUrl = null;
  
        if (attachment) {
          attachmentUrl = await uploadFileToCloudinary(attachment);
        }
  
        const response =  await axios.post(`https://puyobay.onrender.com/api/users/register`, {
          ...formData,
          attachment: attachmentUrl,
        });
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        const userId = response.data.user.id;
        navigate(`/otp/${userId}`);
        setLoading(false);
        setIsModalOpen(false);
      } catch (error) {
        setLoading(false);
        console.error('Error registering landlord:', error);
      }
    };
  
    const handleChange = (e) => {
      const { id, value, name } = e.target;
      setFormData((prev) => ({ ...prev, [name || id]: value }));
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div
          className="flex-grow flex items-center justify-center"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4 sm:mx-8">
            <div className="text-center mb-6">
              <p className="text-gray-600">Have an account? <a href="/" className="text-blue-600 hover:underline">Login</a></p>
              <h1 className="text-2xl font-bold">Sign Up</h1>
            </div>
            <form onSubmit={handleSignUpClicked}>
              <div className="mb-4">
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">Email</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required  
                />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                <div className="relative">
                  <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  
                  />
                </div>
              </div>
            <div className="mb-4">
              <label htmlFor="accountType" className="sr-only">Account Type</label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
               className="pl-4 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>Account Type</option>
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
              </select>
            </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                disabled={loading}
              >
              {loading ? (
      <FontAwesomeIcon icon={faSpinner} spin /> // Display spinner icon when loading
    ) : (
      'Sign Up'
    )}
              </button>
            </form>
          </div>
        </div>

        {/* Modal component */}
         <LandlordSignupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        onChange={handleChange}
        setAttachment={setAttachment}
      />
         <ToastContainer /> 
      </div>
    );
  };

  export default Signup;
