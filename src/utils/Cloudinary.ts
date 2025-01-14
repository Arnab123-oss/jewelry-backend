import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// cloudinary.config({
//   cloud_name: 'moemorable',
//   api_key: '361131984758527',
//   api_secret: 'JNncguTobV5hD7J7fKlyoeAecXQ',
// });


  const fuck =cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRRET,
});


const uploadToCloudinary = async (
  localFilePaths: string[]
) => {
  try {
  console.log("config",fuck,process.env.PORT);
  
    const uploadPromises = localFilePaths.map(async (filePath) => {
      try {
        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
          resource_type: "auto",
        });

        // Remove local file after successful upload
        fs.unlinkSync(filePath);
        return response;
      } catch (error) {
        console.error(`Error uploading file ${filePath}:`, error);
        fs.unlinkSync(filePath); // Cleanup even on failure
        throw new Error(`Failed to upload file: ${filePath}`);
      }
    });

    const responses = await Promise.all(uploadPromises);
    // return Array.isArray(localFilePaths) ? responses : responses[0];
    return responses
  } catch (error) {
    console.error("Error during file uploads:", error);
    return null;
  }
}

const deleteImageFromCloudinary = async (publicUrl: string): Promise<any | null> => {
  try {
    // Extract the publicId from the publicUrl
    const publicId = publicUrl.split(".")[2].split("/").slice(5).join("/");

    // Call the Cloudinary API to delete the resource
    const result = await cloudinary.api.delete_resources([publicId]);
    return result;
  } catch (error) {
    console.log(`🔴☁️ Error while deleting files: ${error}`);
    return null;
  }
};

export { uploadToCloudinary, deleteImageFromCloudinary };