import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";
dotenv.config();

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to handle single or multiple file uploads
export const uploadFileToCloudinary = async (files, folderName = "default") => {
  try {
    // Ensure files is always an array for uniform processing
    const fileArray = Array.isArray(files) ? files : [files];

    // Map each file to the upload function
    const uploadPromises = fileArray.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: `R2M/${folderName}`, // Specify dynamic folder path
      })
    );

    // Wait for all promises (uploads) to complete
    const uploadResults = await Promise.all(uploadPromises);

    // Map and return only the necessary details from the upload results
    return uploadResults.map((result) => ({
      // [{}]-> for one file, [{},{}]=> for multiple file
      secure_url: result.secure_url,
      public_id: result.public_id,
    }));
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
};

export const deleteFileFromCloudinary = async (files) => {
  console.log("filess sdjfsdjfskldjfdklsjf :", files);
  const publicIds = Array.isArray(files)
    ? files.map((file) => file.public_id) // Map public_id from the array
    : [files.public_id]; // If single object, wrap public_id in an array
  console.log("id ------------ - ", publicIds);
  try {
    // Delete multiple files from Cloudinary using async/await
    const deleteResults = await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          console.log(
            `File with public_id ${publicId} deleted from Cloudinary`
          );
          return { publicId, result }; // Return result for each file
        } catch (error) {
          console.error(
            `Error deleting file with public_id: ${publicId}:`,
            error
          );
          return { publicId, error: error.message || "Deletion failed" }; // Return error for each file
        }
      })
    );
    console.log("Deleted Result: ", deleteResults);
    // Check if there were any errors
    const failedDeletes = deleteResults.filter((res) => res.error); // response when deletion failed = {"result": "", "error": {}}
    if (failedDeletes.length > 0) {
      console.log("Failded deletes Response: ", failedDeletes);
      return {
        success: false,
        message: "Some files failed to delete",
        failedDeletes,
      };
    }

    return { success: true, result: deleteResults };
  } catch (error) {
    console.error("Error during Cloudinary deletion process:", error);
    return {
      success: false,
      message: "Error during Cloudinary deletion",
      error: error.message,
    };
  }
};

// Function to handle file upload stream
// export const uploadFileToCloudinary = async (files, folderName = "default") => {
//   console.log("files: ", files);
//   try {
//     // Ensure files is always an array for uniform processing
//     const fileArray = Array.isArray(files) ? files : [files];

//     // Function to upload a single file
//     const uploadSingleFile = (file) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: `R2M/${folderName}` },
//           (error, result) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve({
//                 secure_url: result.secure_url,
//                 public_id: result.public_id,
//               });
//             }
//           }
//         );

//         // Convert the file buffer into a readable stream and pipe it to Cloudinary
//         Readable.from(file.buffer).pipe(stream);
//       });
//     };

//     // Process all file uploads
//     const uploadResults = await Promise.all(fileArray.map(uploadSingleFile));
//     console.log(uploadResults);

//     return uploadResults;
//   } catch (error) {
//     throw new Error(`File upload failed: ${error.message}`);
//   }
// };

//Using upload_stream as data coming in buffer and we are not saving file to local disk
