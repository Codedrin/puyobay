import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to protect routes and verify token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new Error('User not found');
      } 

      next();
  } catch (error) {
      console.error('Token verification failed:', error.message); 
      return res.status(401).json({
        message: 'Not authorized, token failed',
        error: error.message
      });
    }
  } else {
    // No token provided
    return res.status(401).json({
      message: 'Not authorized, no token'
    });
  }
};



export default protect;