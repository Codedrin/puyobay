import sendEmail from "../utils/sendEmail.js";
import User from "../models/userModel.js";

export const verifyOtp = async (req, res) => {
  try {
    const { otp, userId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the OTP is correct and not expired
    if (user.otp === otp && user.otpExpiresAt > Date.now()) {
      // OTP is correct, update user to verified
      user.otpVerified = true;
      user.otp = undefined; // Clear OTP
      user.otpExpiresAt = undefined; // Clear OTP expiration
      await user.save();

      // Return success and the user's account type for redirect
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        user: {
          id: user._id,
          accountType: user.accountType,
          email: user.email,
        }
      });
    }

    // If OTP is invalid or expired
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


  export const resendOtp = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Generate a new OTP
      const otp = (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000).toString();
      user.otp = otp;
      user.otpExpiresAt = Date.now() + 30 * 1000; // 30 seconds expiration
      await user.save();
  
      // Send OTP via email
      const message = `Your OTP for account verification is ${otp}. It will expire in 30 seconds.`;
      await sendEmail({
        email: user.email,
        subject: 'Resent OTP for Account Verification',
        message,
      });
  
      res.status(200).json({ success: true, message: 'OTP resent successfully' });
    } catch (error) {
      console.error('Error resending OTP:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  