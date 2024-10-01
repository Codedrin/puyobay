import express from 'express';
import upload from '../middleware/multerMiddleware.js';
import { registerUser, loginUser, forgotPassword, getUsersByType, toggleApprovalStatus, denyLandlord } from '../controllers/userController.js';
import { getUserProfileByEmail, updateUserProfile } from '../controllers/LandlordProfileController.js';

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
router.get('/profile/:email', getUserProfileByEmail);
router.put('/profile/update/:email', updateUserProfile);

export default router;
