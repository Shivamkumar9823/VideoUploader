import mongoose, { Schema } from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new mongoose.Schema(
    {
    videoFile:{
        type:String,  // cloudnary url
        required:true
    },
    thumbnail:{
        type:String,
        required: true
    },
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    duration:{
        type:Number,  // cloudinary url
        required: true
    },
    views:{
        type:Number,
        default: 0
    },
    isPublished:{
        type:Boolean
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:""
    }





   }
,{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("video", videoSchema)