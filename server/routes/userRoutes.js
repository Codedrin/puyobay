import express from 'express';
import upload from '../middleware/multerMiddleware.js';
import { registerUser, loginUser, forgotPassword, getUsersByType, toggleApprovalStatus, denyLandlord } from '../controllers/userController.js';
import { getUserProfileById, updateUserProfile } from '../controllers/LandlordProfileController.js';
import { addProperty, 
    getPropertiesByUser, 
    getRoomsByPropertyId, 
    updateRoomById, 
    removeRoomById,
    getPropertyById, 
    updateProperty, 
    deleteProperty } from '../controllers/landlordAddProperty.js';
import { getUserProfile, updateTenantUserProfile } from '../controllers/tenantProfileController.js';
import { getAllProperties, getPropertyCount } from '../controllers/getAllproperties.js';
import { getBookPropertyById, submitRating, getAverageRatings } from '../controllers/bookProperties.js';
import { processBooking, cancelBooking, getBookingsByUserId, getAllBookings } from '../controllers/processBooking.js';
import { getBookingsByLandlord, updateBookingStatus, getLandlordDashboardData} from '../controllers/LandlordViewBooking.js';
import { verifyOtp, resendOtp } from '../controllers/userOTPcontroller.js';
import { resetPassword, getBusinessDetails,updateBusinessDetails } from '../controllers/userController.js';
import { getLandlordIncomeByMonth } from '../controllers/processBooking.js';

const router = express.Router();

router.post('/register',  upload.single('file'), registerUser);
router.post('/login', loginUser );
router.post('/forgot', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/', getUsersByType);

// Admin
router.delete('/deny/:landlordId', denyLandlord);
router.get('/landlords/income', getLandlordIncomeByMonth);
router.get('/get-property-count', getPropertyCount)
router.get('/bookings/all', getAllBookings);

// Route to toggle approval status
router.put('/approve/:landlordId', toggleApprovalStatus);

//Landlord
router.get('/profile/:id', getUserProfileById);  
router.put('/profile/update/:id', updateUserProfile);  
router.post('/add-property/:id',  addProperty); 
router.get('/landlord-property/:id',  getPropertiesByUser); 
router.get('/:propertyId/rooms', getRoomsByPropertyId);
router.put('/:propertyId/rooms/:roomId', updateRoomById);
router.put('/terminate-booking/:bookingId');
router.delete('/:propertyId/rooms/:roomId', removeRoomById);
router.get('/property/:id',  getPropertyById);
router.get('/landlords/business-details/:landlordId', getBusinessDetails);
router.put('/update-property/:id',  updateProperty); 
router.put('/landlords/business-details/:landlordId', updateBusinessDetails);
router.get('/bookings/landlord/:landlordId', getBookingsByLandlord);
router.get('/landlord-dashboard/:landlordId', getLandlordDashboardData);
router.put('/bookings/status/:bookingId', updateBookingStatus);
router.put('/landlords/business-details/:landlordId', updateBusinessDetails);
router.delete('/delete-property/:id',  deleteProperty);

//Tenanat 
router.get('/profile/:id', getUserProfile);
router.put('/profile/update/:id', updateTenantUserProfile);
router.get('/get-properties', getAllProperties);
router.get('/get-propertiesId/:id', getBookPropertyById);
router.post('/submitrating/:id/rate', submitRating);
router.get('/get-average-ratings', getAverageRatings);
router.post('/process-booking', upload.single('receipt'), processBooking);
router.delete('/cancel-booking/:userId/:bookingId', cancelBooking);
router.get('/bookings/:userId', getBookingsByUserId);

//UserOTP
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp/:userId', resendOtp);

export default router;
