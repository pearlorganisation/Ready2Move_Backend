import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// Function to get file extension safely
const getFileExtension = (filename) => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() : "";
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const date = Date.now();
    const ext = getFileExtension(file.originalname);
    const fileName = file.originalname.replace(`.${ext}`, ""); // Remove original extension
    cb(null, `${fileName}-${date}.${ext}`);
  },
});

// Alternative: Store files in memory (useful for Cloudinary)
const memoryStorage = multer.memoryStorage();

// Multer Upload Configuration
export const upload = multer({
  storage, // Change to `memoryStorage` if using Cloudinary
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."), false);
    }
  },
});
