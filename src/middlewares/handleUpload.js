import multer from "multer";

const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      console.log("Multer error:", err);
      if (err instanceof multer.MulterError) {
        let message = "File upload error.";

        switch (err.code) {
          case "LIMIT_UNEXPECTED_FILE":
            message =
              "Unexpected field. Please upload images using the 'imageGallery' field only.";
            break;
          case "LIMIT_FILE_COUNT":
            message = "You can upload a maximum of 8 images.";
            break;
          case "LIMIT_FILE_SIZE":
            message = "One or more images exceed the allowed file size limit.";
            break;
        }

        return res.status(400).json({
          success: false,
          message,
        });
      } else if (err) {
        // Handle general errors
        return res.status(500).json({
          success: false,
          message: "Something went wrong during file upload.",
          error: err.message,
        });
      }
      // No error? Pass to next middleware/controller
      next();
    });
  };
};

export default handleUpload;
