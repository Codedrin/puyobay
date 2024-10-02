import express from 'express';
import upload from '../middleware/multerMiddleware.js';
import { registerUser, loginUser, forgotPassword, getUsersByType, toggleApprovalStatus, denyLandlord } from '../controllers/userController.js';
import { getUserProfileById, updateUserProfile } from '../controllers/LandlordProfileController.js';
import { addProperty, getPropertiesByUser, getPropertyById, updateProperty, deleteProperty } from '../controllers/landlordAddProperty.js';
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
//Landlord routes
router.get('/profile/:id', getUserProfileById);  
router.put('/profile/update/:id', updateUserProfile);  
router.post('/add-property/:id',  addProperty); // Add new property (Protected Route)
router.get('/landlord-property',  getPropertiesByUser); // Get all properties by user
router.get('/property/:id',  getPropertyById); // Get single property by ID
router.put('/update-property/:id',  updateProperty); // Update property (Protected Route)
router.delete('/delete-property/:id',  deleteProperty); // Delete property (Protected Route)
export default router;
