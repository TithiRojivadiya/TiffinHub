import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async function(localFilePath){

    try{

        if(!localFilePath){
            console.log("no local file path 🙅‍♂️");
            return null
        }

        const response = await cloudinary.v2.uploader.upload(localFilePath, {resource_type: "image"})

        console.log("file uploaded on cloudinary successfully 🗃️");

        return response

    }
    catch(error){

        // remove file
        fs.unlinkSync(localFilePath);
        console.log("Failed to upload file in cloudinary 😩");

    }
}

export { uploadOnCloudinary }