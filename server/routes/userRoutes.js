import express from 'express';
import upload from '../middleware/multerMiddleware.js';
import { registerUser, loginUser, forgotPassword, getUsersByType} from '../controllers/userController.js';
// import { protect } from '../utils/jwtUtils.js';

const router = express.Router();

router.post('/register',  upload.single('file'), registerUser);
router.post('/login', loginUser );
router.post('/forgot', forgotPassword);
router.get('/', getUsersByType);
export default router;
