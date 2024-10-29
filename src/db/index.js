import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const {connection} = mongoose


const connectDB = async ()=>{
            try{
                const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
                console.log(`\n mongodb connected !! DB_host: ${connectionInstance.connection.host}`)
            }
            catch(error){
                console.log("Mongodb connection error",error)
                // process.exist(1)
            }
}

export default connectDB