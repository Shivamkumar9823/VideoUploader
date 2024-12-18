import {v2 as  cloudinary} from "cloudinary"
import fs from "fs"    //file system..

// cloudinary uploads the files from server to cloudinary server..


cloudinary.config({ 
      // Click 'View API Keys' above to copy your API secret
    cloud_name:'drgvckvsg', 
    api_key: '876415275821887', 
    api_secret: 'v1s1FOpLfRaH92t2rn3xoCowa1I'
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    // api_key: process.env.CLOUDINARY_API_KEY, 
    // api_secret: process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary..
        const response = await cloudinary.uploader.upload(localFilePath, 
            {
            resourse_type: "auto"
        })

        //file has been upload successfully..
        console.log("file is uploaded on cloudinary !!", response.url);
        
        // fs.unlinkSync(localFilePath)
        return response;
    }
    catch(error){
        //  fs.unlinkSync(localFilePath)  //remove the local saved temporary file as the upload operation got failed

         return null;
    }
}


export {uploadOnCloudinary}

