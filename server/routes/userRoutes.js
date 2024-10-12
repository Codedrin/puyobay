import express from 'express';
import upload from '../middleware/multerMiddleware.js';
import { registerUser, loginUser, forgotPassword, getUsersByType, toggleApprovalStatus, denyLandlord } from '../controllers/userController.js';
import { getUserProfileById, updateUserProfile } from '../controllers/LandlordProfileController.js';
import { addProperty, getPropertiesByUser, getPropertyById, updateProperty, deleteProperty } from '../controllers/landlordAddProperty.js';
import { getUserProfile, updateTenantUserProfile } from '../controllers/tenantProfileController.js';
import { getAllProperties } from '../controllers/getAllproperties.js';
import { getBookPropertyById, submitRating, getAverageRatings } from '../controllers/bookProperties.js';
import { processBooking, deleteBooking, getBookingsByUserId  } from '../controllers/processBooking.js';
import { getBookingsByLandlord, updateBookingStatus } from '../controllers/LandlordViewBooking.js';
import { verifyOtp, resendOtp } from '../controllers/userOTPcontroller.js';
const router = express.Router();

router.post('/register',  upload.single('file'), registerUser);
router.post('/login', loginUser );
router.post('/forgot', forgotPassword);
router.get('/', getUsersByType);
// Admin
router.delete('/deny/:landlordId', denyLandlord);
// Route to toggle approval status
router.put('/approve/:landlordId', toggleApprovalStatus);

//Landlord
router.get('/profile/:id', getUserProfileById);  
router.put('/profile/update/:id', updateUserProfile);  
router.post('/add-property/:id',  addProperty); 
router.get('/landlord-property/:id',  getPropertiesByUser); 
router.get('/property/:id',  getPropertyById);
router.put('/update-property/:id',  updateProperty); 
router.get('/bookings/landlord/:landlordId', getBookingsByLandlord);
router.put('/bookings/status/:bookingId', updateBookingStatus);
router.delete('/delete-property/:id',  deleteProperty);

//Tenanat 
router.get('/profile/:id', getUserProfile);
router.put('/profile/update/:id', updateTenantUserProfile);
router.get('/get-properties', getAllProperties);
router.get('/get-propertiesId/:id', getBookPropertyById);
router.post('/submitrating/:id/rate', submitRating);
router.get('/get-average-ratings', getAverageRatings);
router.post('/process-booking', upload.single('receipt'), processBooking);
router.delete('/delete-booking/:userId/:bookingId', deleteBooking);
router.get('/bookings/:userId', getBookingsByUserId);

//UserOTP
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp/:userId', resendOtp);

export default router;
