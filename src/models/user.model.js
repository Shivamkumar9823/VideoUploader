import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
        index:true  // helps in searching or it optimise
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required: true,
        trim: true,
        index:true
    },
    avatar:{
        type:String, // cloudnary url
        required: true
    },
    coverImage:{
        type:String, // cloudnary url
        required: true
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Videos"
        }
    ],

    password:{
        type:String,
        required:[true, 'Password is required']
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

// This is a pre-save middleware in Mongoose.
userSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = bcrypt.hash(this.password , 10);  //encrypt the password...  The second argument 10 is the salt rounds which defines the complexity of the hashing process.
        next();
    }
} )

//This is a custom methods added to the userSchema model.
userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password, this.password)
   //password (likely the one entered by the user during login) compare with the hashed password stored in the database (this.password).
}



//generate the access token.....
userSchema.methods.generateAccessToken = function(){
    //jwt has a sign method that generate the token...
   return jwt.sign(
      {  //payload
        _id: this._id,
        email: this.email,
        username: this.username,
        fullname: this.fullname  
//fullname is the name of payload and this.fullname comes from the database.
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    
    )

 }


//generating refresh token 
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        
        {  //payload
          _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        
        {
          expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
      
      )
 }









export const user = mongoose.model("User", userSchema)