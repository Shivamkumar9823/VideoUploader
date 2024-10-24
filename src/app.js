import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

app.use(cors());
app.use(express.json());  //TO configure form data;

app.use(express.urlencoded()) //when data comes from url;
app.use(express.static("public")) // to store file, folders, photoes on server in public folder.
app.use(cookieParser())  //to access & set the user's cookie from our server;


// import routes 
import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter)
// http://localhost:8000/api/v1/users/login






export { app }