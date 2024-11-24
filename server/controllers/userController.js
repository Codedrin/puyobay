// import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import { generateAccessToken } from '../utils/jwtUtils.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import Property from '../models/addNewProperty.js';
import BookedProperty from '../models/bookedProperty.js';
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
      console.log('Email already exists:', email); // Log if the email already exists
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = Date.now() + 30 * 1000; 



    // Create user data object
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      otp, 
      otpExpiresAt, 
      accountType,
      approved: accountType === 'tenant' // Automatically approve tenants, but not landlords
    };

    // If the account type is landlord, add the landlord-specific details
    if (accountType === 'landlord') {
      userData.landlordDetails = {
        businessPermit: permitNumber,
        businessName,
        attachment: attachment ? {
          url: attachment,  // Cloudinary URL
          publicId: 'default',  // Placeholder for publicId
        } : undefined,
        additionalInfo,
      };

    }


    const user = new User(userData);
    const accessToken = generateAccessToken(user._id);
    user.accessToken = accessToken;


    // Save the user to the database
    await user.save();

    // Send the OTP to the user's email
    const message = `Your OTP for account verification is ${otp}. It will expire in 30 seconds.`;
    await sendEmail({
      email: user.email,
      subject: 'Account Verification - OTP',
      message,
    });

    
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        accountType: user.accountType,
        accessToken,
      }
    });


  } catch (error) {
    console.error('Error registering user:', error); // Log the error if it occurs
    res.status(500).send('Error registering user');
  }
};


//Signin
export const loginUser = async (req, res) => {
  try {
    const { email, password, accountType } = req.body; // Get accountType from request

    // Check if the login attempt is for an admin
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
          { id: 'admin' },
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

    // Check if the provided accountType matches the user's account type
    if (user.accountType !== accountType) {
      return res.status(403).json({ message: `This account is registered as a ${user.accountType}. Please log in with the correct account type.` });
    }

    // Check if the account type is landlord and if the account is approved
    if (user.accountType === 'landlord' && !user.approved) {
      return res.status(403).json({ message: 'Your account has not been approved. Please contact the admin.' });
    }

    // Generate a new token after successful login
    const token = jwt.sign(
      { id: user._id },
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


    // Updated response to include user id
    return res.status(200).json({ 
      token, 
      redirectURL, 
      id: user._id,  // Include the user id here
      email: user.email,  // You can also include this for consistency
      accountType: user.accountType
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};


// Generate and send OTP for Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and expiry time
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiresAt = Date.now() + 30 * 1000; // 30 seconds expiration

    // Store OTP and expiry in the user's document
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP to user's email
    const message = `Your OTP for password reset is ${otp}. This OTP is valid for 30 seconds.`;
    await sendEmail({
      email: user.email,
      subject: 'Password Reset - OTP',
      message,
    });

    // Return success with userId
    res.status(200).json({ message: 'OTP sent to email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;

  try {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
};


// Get all users
export const getUsersByType = async (req, res) => {
  try {
    const users = await User.find();

    const properties = await Property.find().populate('userId', 'firstName lastName');

    const bookedProperties = await BookedProperty.find().populate({
      path: 'property', // Populate the property details
      select: 'propertyName', // Select only the property name
    });

    const landlordProperties = properties.reduce((acc, property) => {
      if (property.userId && property.userId._id) { // Add null check for userId
        if (!acc[property.userId._id]) {
          acc[property.userId._id] = [];
        }
        acc[property.userId._id].push({
          propertyName: property.propertyName,
          propertyId: property._id,
        });
      }
      return acc;
    }, {});

    const propertyTenantCount = bookedProperties.reduce((acc, bookedProperty) => {
      if (bookedProperty.property && bookedProperty.property._id) { // Add null check for bookedProperty.property
        const uniqueTenantIds = new Set(bookedProperty.bookings.map(booking => booking.user.toString()));
        acc[bookedProperty.property._id] = uniqueTenantIds.size; // Count unique tenants
      }
      return acc;
    }, {});

    const landlords = users
      .filter(user => user.accountType === 'landlord')
      .map(landlord => {
        const properties = landlordProperties[landlord._id] || [];
        const totalTenants = properties.reduce(
          (sum, property) => sum + (propertyTenantCount[property.propertyId] || 0),
          0
        );

        return {
          _id: landlord._id,
          name: `${landlord.firstName} ${landlord.lastName}`,
          email: landlord.email,
          address: landlord.address,
          propertyNames: properties.map(prop => prop.propertyName),
          totalTenants,
          approved: landlord.approved,
          attachment: landlord.landlordDetails?.attachment || null,
        };
      });

    const totalLandlords = landlords.length;

    const tenants = users
      .filter(user => user.accountType === 'tenant')
      .map(tenant => ({
        _id: tenant._id,
        name: `${tenant.firstName} ${tenant.lastName}`,
        email: tenant.email,
        address: tenant.address,
      }));

    const totalTenants = tenants.length;

    res.status(200).json({ 
      landlords, 
      tenants, 
      totalLandlords, 
      totalTenants 
    });
  } catch (error) {
    console.error('Error in getUsersByType:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};




// Approve a landlord
export const approveLandlord = async (req, res) => {
  const { landlordId } = req.params;

  try {
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    // Update the landlord's approved status to true
    landlord.approved = true;
    await landlord.save();

    res.status(200).json({ message: 'Landlord approved successfully' });
  } catch (error) {
    console.error('Error approving landlord:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Deny a landlord
export const denyLandlord = async (req, res) => {
  const { landlordId } = req.params;

  try {
    const landlord = await User.findById(landlordId);  // Fetch landlord by ID
    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }


    // Use deleteOne to remove the document
    await landlord.deleteOne();

    res.status(200).json({ message: 'Landlord denied and removed successfully' });
  } catch (error) {
    console.error('Error denying landlord:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to toggle landlord approval status
export const toggleApprovalStatus = async (req, res) => {
  const { landlordId } = req.params;
  const { approved } = req.body;

  try {
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    landlord.approved = approved;
    await landlord.save();

    res.status(200).json({ message: `Landlord ${approved ? 'approved' : 'disapproved'} successfully`, landlord });
  } catch (error) {
    console.error('Error updating approval status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get landlord business details
export const getBusinessDetails = async (req, res) => {
  const { landlordId } = req.params;

  try {
    const landlord = await User.findById(landlordId);
    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    const businessDetails = {
      businessName: landlord.landlordDetails?.businessName || 'Not provided',
      businessPermit: landlord.landlordDetails?.businessPermit || 'Not provided',
      attachment: landlord.landlordDetails?.attachment || null,
    };

    res.status(200).json(businessDetails);
  } catch (error) {
    console.error('Error fetching business details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update landlord business details
export const updateBusinessDetails = async (req, res) => {
  const { landlordId } = req.params;
  const { businessName, businessPermit, attachment } = req.body;

  try {
    const landlord = await User.findById(landlordId);

    if (!landlord) {
      return res.status(404).json({ message: 'Landlord not found' });
    }

    landlord.landlordDetails = {
      ...landlord.landlordDetails,
      businessName: businessName || landlord.landlordDetails?.businessName,
      businessPermit: businessPermit || landlord.landlordDetails?.businessPermit,
      attachment: attachment || landlord.landlordDetails?.attachment,
    };

    await landlord.save();

    res.status(200).json({ message: 'Business details updated successfully', landlordDetails: landlord.landlordDetails });
  } catch (error) {
    console.error('Error updating business details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
