import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
// import Quotation from '../models/quotationModel.js';
// import {text} from 'express';

// Generate JWT Token
export const generateToken = (id) => {
    return jwt.sign({
        id
    }, process.env.JWT_SECRET, {expiresIn: '1h'});
};

// Middleware to protect routes and verify token
export const protect = async(req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req
                .headers
                .authorization
                .split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Assuming the token contains the user's ID
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            res
                .status(401)
                .json({message: 'Not authorized, token failed', error: error.message});
        }
    } else {
        res
            .status(401)
            .json({message: 'Not authorized, no token'});
    }
};
// Generate Access Token
export const generateAccessToken = (id) => {
  return jwt.sign({ _id: id  }, process.env.JWT_SECRET, { expiresIn: '5h' });
};

// Generate Refresh Token
export const generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// // Refresh Token Controller
// export const refreshToken = async (req, res) => {
//   const { refreshToken } = req.body;

//   if (!refreshToken) {
//     return res.status(401).json({ message: 'Refresh Token is required' });
//   }

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

//     const user = await User.findById(decoded._id);

//     if (!user || !user.refreshToken.includes(refreshToken)) {
//       return res.status(403).json({ message: 'Invalid refresh token' });
//     }

//     // Generate a new access token
//     const newAccessToken = generateAccessToken(user._id);

//     res.status(200).json({
//       accessToken: newAccessToken,
//     });
//   } catch (error) {
//     res.status(403).json({ message: 'Invalid or expired refresh token', error });
//   }
// };
