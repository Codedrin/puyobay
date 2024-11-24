import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddmgrfhwk',
  api_key: process.env.CLOUDINARY_API_KEY || '731785262243572',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'tFGsTAxJkl0QtGClaNYKXErplNs',
});

const uploadToCloudinary = async (path, folder = 'PuyobayAssets') => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folder,
      resource_type: 'auto', // Allows all file types
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
};

export { cloudinary, uploadToCloudinary };
