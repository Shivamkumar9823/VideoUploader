import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const {connection} = mongoose


const connectDB = async ()=>{
            try{
                const connectionInstance = await mongoose.connect("mongodb+srv://shivamkumarsinghsk2020:7905325583@cluster0.un7sc.mongodb.net/videotube")
                console.log(`\n  mongodb connected !! DB_host: ${connectionInstance.connection.host}`)

            }
            catch(error){
                console.log("Mongodb connection error",error)
                // process.exist(1)
            }

}

export default connectDB