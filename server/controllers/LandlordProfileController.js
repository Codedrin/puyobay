import User from "../models/userModel.js";

// Controller to get user profile by id
export const getUserProfileById = async (req, res) => {
  const { id } = req.params;  // Get id from URL params

  try {
    const user = await User.findById(id);  // Find user by id

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile details
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

  

// Controller to update the landlord profile by id
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, address, email, profilePicture, password } = req.body;

  try {
    // Find user by id
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided in the request body
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phone || user.phoneNumber; 
    user.address = address || user.address;
    user.profilePicture = profilePicture || user.profilePicture; 

    // Check if a new password is provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);  // Use bcrypt to hash the password
      user.password = hashedPassword;
    }

    // Save the updated user data
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

