import User from "../models/userModel.js";


// Controller to get user profile by email
export const getUserProfileByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({
        firstName: user.firstName,
        lastName: user.lastName,
        accountType: user.accountType,
        profilePicture: user.profilePicture || 'https://res.cloudinary.com/dzxzc7kwb/image/upload/v1725974053/DefaultProfile/qgtsyl571c1neuls9evd.png',
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  };
  
  //Controller to update the landlord profile
  export const updateUserProfile = async (req, res) => {
    const { email } = req.params; // Get email from URL params
    const { firstName, lastName, phone, address, profilePictureUrl, profilePicturePublicId } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update fields if provided in the request body
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phoneNumber = phone || user.phoneNumber; // Make sure this is 'phoneNumber' as per your schema
      user.address = address || user.address;
  
      // Ensure profilePicture exists before updating
      if (!user.profilePicture) {
        user.profilePicture = {}; // Initialize if undefined
      }
  
      // Update profilePicture (both publicId and url) only if provided
      if (profilePictureUrl && profilePicturePublicId) {
        user.profilePicture.url = profilePictureUrl;
        user.profilePicture.publicId = profilePicturePublicId;
      }
  
      // Save updated user data
      const updatedUser = await user.save();
  
      // Return updated user data
      res.json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };
  