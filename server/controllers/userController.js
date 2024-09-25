// import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { generateAccessToken } from '../utils/jwtUtils.js';
dotenv.config();

// Register user controller
export const registerUser = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber, 
      accountType, 
      permitNumber, 
      businessName, 
      attachment, 
      additionalInfo,
      
    } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10); 
    // Create user data object
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      accountType,

    };

    // If the account type is landlord, add the landlord-specific details
    if (accountType === 'landlord') {
      userData.landlordDetails = {
        businessPermit: permitNumber,
        businessName,
        attachment: attachment ? {
          url: attachment,  // Cloudinary URL
          publicId: 'default',  // Placeholder for publicId, you can replace this if you have a real publicId
        } : undefined,
        additionalInfo,
      };
    }

    // Hash the password before saving


 
    const user = new User(userData);

    const accessToken = generateAccessToken(user._id);

    user.accessToken = accessToken;

    // Save the user to the database

    await user.save();
    

    //return the data
    res.status(201).json({

      user: [{
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        accessToken,
      }]
    });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
};



//Signin

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if the login attempt is for an admin
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        // Generate a token for the admin
        const token = jwt.sign(
          { id: 'admin' }, // Admin doesn't have a userId, so we can use 'admin' or any identifier
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({ token, redirectURL: '/admin-page' });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    // Regular user login
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a new token after successful login
    const token = jwt.sign(
      { id: user._id },  // Include the userId in the token payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Determine the redirect URL based on the account type
    let redirectURL = '';
    if (user.accountType === 'landlord') {
      redirectURL = '/landlord';
    } else if (user.accountType === 'tenant') {
      redirectURL = '/tenant';
    } else {
      return res.status(400).json({ message: 'Account type not recognized' });
    }

    return res.status(200).json({ token, redirectURL });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};


//forgotPassword

export const forgotPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//Get All Users
export const getUsersByType = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users

    // Separate users by account type and include necessary fields
    const landlords = users
      .filter(user => user.accountType === 'landlord')
      .map(landlord => ({
        _id: landlord._id,
        name: landlord.name || landlord.firstName + ' ' + landlord.lastName,
        propertyName: landlord.propertyName || '',
        address: landlord.address || '',
        email: landlord.email,
        totalTenants: landlord.tenants ? landlord.tenants.length : 0,
      }));

    const tenants = users
      .filter(user => user.accountType === 'tenant')
      .map(tenant => ({
        _id: tenant._id,
        name: tenant.name || tenant.firstName + ' ' + tenant.lastName,
        address: tenant.address || '',
        email: tenant.email,
      }));

    res.status(200).json({ landlords, tenants });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};
