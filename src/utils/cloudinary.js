import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

const uploadOnCloudinary = async (localFilePath, options = {}) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'my_uploads', // Optional folder in Cloudinary
      resource_type: 'auto', // Auto-detect image/video/raw
      ...options
    });

        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return result;

    } catch (error) {
        console.log(error);
        
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}