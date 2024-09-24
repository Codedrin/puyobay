import User from '../models/userModel.js';

// Register user controller
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, accountType, businessPermit, businessName, attachment, additionalInfo } = req.body;

    const userData = {
      firstName,
      lastName,
      email,
      password, // Hash the password before saving (use bcrypt or similar)
      phoneNumber,
      accountType,
    };

    // If the account type is landlord, add the landlord-specific details
    if (accountType === 'landlord') {
      userData.landlordDetails = {
        businessPermit,
        businessName,
        attachment,
        additionalInfo,
      };
    }

    const user = new User(userData);
    await user.save();

    res.redirect('/'); // Redirect or send success response
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
};
