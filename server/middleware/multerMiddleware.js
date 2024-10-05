import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import pkg from 'cloudinary';

const { v2: cloudinary } = pkg;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'PuyobayAssets', 
    allowedFormats: ['jpg', 'png', 'pdf', 'doc', 'docx'],
  },
});

const upload = multer({ storage: storage });

export default upload;
