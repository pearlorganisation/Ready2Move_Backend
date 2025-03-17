import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables (for storing Cloudinary credentials securely)
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Replace with your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,        // Replace with your API key
  api_secret: process.env.CLOUDINARY_API_SECRET   // Replace with your API secret
});

export const uploadImageToCloudinary = async (imageBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      {
        folder: "R2M/blog_images", 
        resource_type: "auto",     
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          reject(new Error('Error uploading image to Cloudinary'));
        } else {
          resolve(result); 
        }
      }
    ).end(imageBuffer); 
  });
};


