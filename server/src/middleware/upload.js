import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Setup Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Storage Engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determine folder based on file type
        let folderName = 'evidence/others';
        if (file.mimetype.startsWith('image')) folderName = 'evidence/images';
        if (file.mimetype.startsWith('video')) folderName = 'evidence/videos';
        if (file.mimetype.startsWith('audio')) folderName = 'evidence/audio';

        return {
            folder: folderName,
            resource_type: 'auto', // Important: 'auto' allows video/audio/images
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

// 3. Create Multer Instance
export const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});
