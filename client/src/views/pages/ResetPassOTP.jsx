import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassOTP = () => {
  const { userId } = useParams(); // Retrieve userId from URL
  const [otp, setOtp] = useState(new Array(6).fill("")); // For a 6-digit OTP
  const [timeLeft, setTimeLeft] = useState(30); // Timer for 30 seconds
  const [canResend, setCanResend] = useState(false); // To enable/disable resend button
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Handle OTP input change for each box
  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  // Handle Backspace key press to move to the previous box
  const handleKeyDown = (element, index) => {
    if (element.key === "Backspace" && element.target.previousSibling) {
      element.target.previousSibling.focus();
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    try {
      setOtp(new Array(6).fill("")); // Reset OTP input
      setTimeLeft(30); // Reset the timer
      setCanResend(false); // Disable resend button
      setErrorMessage(''); // Clear previous error message

      // Resend OTP via API call
      await axios.post(`https://puyobay.onrender.com/api/users/resend-otp/${userId}`);
    } catch (error) {
      console.error('Error resending OTP:', error);
      setErrorMessage('Error resending OTP');
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const otpValue = otp.join(""); // Convert OTP array into a single string

    try {
      const response = await axios.post(`https://puyobay.onrender.com/api/users/verify-otp`, { otp: otpValue, userId });
      setMessage(response.data.message);
      setLoading(false);

      // Redirect to new password page after successful OTP verification
      if (response.data.success) {
        navigate(`/reset-password/${userId}`);
      } else {
        setErrorMessage('Invalid OTP');
      }
    } catch (error) {
      setErrorMessage('Error verifying OTP');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl font-semibold mb-4">Verify with OTP</h2>
      <p className="text-gray-600 mb-6">Please enter the OTP sent to your email</p>

      <div className="flex justify-center space-x-2 mb-4">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={data}
            onChange={(e) => handleOtpChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white py-2 px-6 rounded-md w-full max-w-xs mb-4 hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </button>

      {canResend ? (
        <button onClick={handleResendOTP} className="text-blue-600 underline">
          Resend OTP
        </button>
      ) : (
        <p className="text-gray-600">
          Didn't receive OTP? Resend in <span className="text-blue-600">{timeLeft}s</span>
        </p>
      )}
    </div>
  );
};

export default ResetPassOTP;
