import express from 'express';
import upload from '../middleware/multerMiddleware.js';
import { registerUser, loginUser, forgotPassword, getUsersByType, toggleApprovalStatus, denyLandlord } from '../controllers/userController.js';
// import { protect } from '../utils/jwtUtils.js';

const router = express.Router();

router.post('/register',  upload.single('file'), registerUser);
router.post('/login', loginUser );
router.post('/forgot', forgotPassword);
router.get('/', getUsersByType);
// Admin
// router.put('/approve/:landlordId', approveLandlord);
router.delete('/deny/:landlordId', denyLandlord);
// Route to toggle approval status
router.put('/approve/:landlordId', toggleApprovalStatus);


export default router;
