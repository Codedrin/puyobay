import jwt from 'jsonwebtoken';

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
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: '5h' });
  };
  

// Generate Refresh Token
export const generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
