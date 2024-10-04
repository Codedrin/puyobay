import User from "../models/userModel.js";


// Get user profile by ID
export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Exclude sensitive information like password
    const { password, ...userData } = user._doc;

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update user profile
export const updateTenantUserProfile = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, address, profilePicture } = req.body;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the profile fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      user.address = address || user.address;
  
      // Update the profile picture if a new one is provided
      if (profilePicture) {
        user.profilePicture = profilePicture;
      }
  
      // Save the updated user profile
      await user.save();
  
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };
  