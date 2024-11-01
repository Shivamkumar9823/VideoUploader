import { asyncHandler } from "../utils/asyncHandler.js" ;
import { ApiError } from "../utils/ApiError.js";
import { User }  from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"



const generateAccessAndRefreshTokens = async(userId)=>{
    try{
         const user = await User.findById(userId);
         const accessToken = user.generateAccessToken()
         const refreshToken = user.generateAccessToken()


         user.refreshToken = refreshToken; // assign refreshToken in DB;
         await user.save({ validateBeforeSave: false}); //  save without password required.

         return {accessToken, refreshToken}

    }
    catch( error ){
        throw new ApiError("500", "Something went wrong while generating refresh and access token")
    }
}

//this method will register the user
// const registerUser =  asyncHandler( async (req,res) =>{
//     res.status(200).json({
//         message :"chai aur code"
//     })
// })

const registerUser = asyncHandler( async (req, res) =>{
    console.log(req.files)
    
    //step1: taking data from frontend/Postman.
    const {fullname, username, email, password, } = req.body;
   
    //step2: check validation.
    
    // if(fullname === ""){
    //     throw new ApiError(400,"Fullname is required!")
    // } or

    if([fullname, email, username, password].some( field => 
          field?.trim() === "")  // ismese koi empty h??
    ){
        throw new ApiError(400, "All fields are required!")
    }

    
    // step3: checking user already exist??
    const existedUser = await User.findOne({
        $or:[{ username }, { email }]
    })
    if(existedUser){
        throw new ApiError( 409,"User with email or username already exist" )
    }

    //step4: check for images or check for the avatar.
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required!")
    }

    //step5: upload to cloudinary avatar.

    const avatar = await uploadOnCloudinary(avatarLocalPath)      /// recieving avatar url of cloudinary..
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log("Avatar console data:",avatar);

    if(!avatar){
        throw new ApiError(400, "Avatar files is required!")
    }

    // step6: create user object..
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()  //stores in lowercase.
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"  //vo fild jo nhi chahiye..
    )
     
    if(!createdUser){
        throw new ApiError(500, " Something went wrong while registering a user.")
    }

    return res.status(201).json(
        new ApiResponse(200 ,createdUser ,"User Registered Successfully!!")
    );



});


const loginUser = asyncHandler( async (req, res) =>{
    
    const { email, username, password } = req.body; //credentials 
    console.log(req.body)

    if(!(username || email)){
        throw new ApiError(400, "Username or email is required!")
    }

    //find user on the base of username or email..
    const user = await User.findOne({
        $or: [{username},{email}]  
     })  

     if(!user){
        throw new ApiError(404, "user not exist" )
     }

     const isPasswordvalid = await user.isPasswordCorrect(password);

     if(!isPasswordvalid){
        throw new ApiError(401, "Wrong Password!")
     }
    //  console.log("password is correct")

     //destructure 
     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//sending cookies
const options = {
    httpOnly: true,
    secure: true
}
//  console.log("accesToken  generated :", accessToken)
return res
.status(200)
.cookie("accessToken",accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse( 200,
        {
            user: loggedInUser
        },
        "User logged In Successfully"
    )
)
});


const logoutUser = asyncHandler(async(req, res)=>{
       await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refreshToken:undefined
                }
            },
            {
                new: true
            }
         )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json( new ApiResponse(200,{},"User logged Out"))

})

const refreshAccessToken = asyncHandler(async (req, res) =>{
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken;
   if(!incomingRefreshToken){
       throw new ApiError(401,"unauthorized request")
   }

  try {
     
     const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
  )
  
  const user = await User.findById(decodedToken?._id);
  if(!user){
      throw new ApiError(401,"Invalid refresh token")
  }
  
  if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401,"Refresh Token is expired or used")
  }
  
  const options = {
      httpOnly:true,
      secure:true
  }
  
  const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newrefreshToken,options)
  .json(
      new ApiError(200,
          {
              accessToken, refreshToken:newrefreshToken 
          },
          "Access token refreshed"
      )
  )
  } catch (error) {
      throw new ApiError(401,error?.message || "invalid refresh token")
  }

})

const changeCurrentPassword = asyncHandler( async(req, res)=>{
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password!")
    }
    
    user.password = newPassword;
    await user.save({ validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiError(200,{},"Password change successfully!"))
});

const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200, req.user, "current user fetched successfully!")
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {fullname, email} = req.body;

    if(!fullname || !email){
        throw new ApiError(400,"All fiels are requrired");
    }
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
           $set:{
            fullname: fullname,
            email: email
           }
        },
        {
            new:true
        }
    ).select("-password")


return res
.status(200)
.json(new ApiResponse(200, user, "Acount Details updated ! "))

});

//how to update files...
const updateUserAvatar = asyncHandler(async(req, res)=>{
     const avatarLocalPath = req.files?.path;

     if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
     }
     const avatar  = await uploadOnCloudinary(avatarLocalPath);
    
     if(!avatar.url){
           throw new ApiError(400, "Error while uploading on avatar");
     }
     
     const user = await User.findByIdAndUpdate(
        req.user?._id,
        { 
            $set:{
                avatar:avatar.url
            }

        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avater file is update successfully" )
    )


})
const updateUserCoverImage = asyncHandler(async(req, res)=>{
     const coverImageLocalPath = req.files?.path;

     if(!coverImageLocalPath){
        throw new ApiError(400, "coverImage file is missing")
     }
     const coverImage  = await uploadOnCloudinary(coverImageLocalPath);
    
     if(!coverImage.url){
           throw new ApiError(400, "Error while uploading coverImage");
     }
     
     const user = await User.findByIdAndUpdate(
        req.user?._id,
        { 
            $set:{
                 coverImage:coverImage.url
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover Image file is update successfully" )
    )


})



export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword, 
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage 

}