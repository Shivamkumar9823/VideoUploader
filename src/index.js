import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

dotenv.config();
connectDB()
   .then(()=>{
        app.listen(8000, ()=>{
            console.log(`server is running on port 8000`)
        })
       
   })
   .catch((err)=>{
    console.log("connction error", err)
   })