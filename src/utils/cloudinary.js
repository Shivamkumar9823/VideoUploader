import {v2 as  cloudinary} from "cloudinary"
import fs from "fs"    //file system..

// cloudinary uploads the files from server to cloudinary server..


cloudinary.config({ 
    cloud_name: process.env.COUDINARY_CLOUD_NAME, 
    api_key: process.env.COUDINARY_API_KEY, 
    api_secret: process.env.COUDINARY_API_SECRET  // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary..
        const response = await cloudinary.uploader.upload(localFilePath, {
            resourse_type: "auto"
        })

        //file has been upload successfully..
        console.log("file is uploaded on cloudinary !!", response.url);
        return response;
    }
    catch(error){
         fs.unlinkSync(localFilePath)  //remove the local saved temporary file as the upload operation got failed

         return null;
    }
}


export {uploadOnCloudinary}