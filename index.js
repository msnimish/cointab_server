import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connection from "./config/db.js";
import user from "./routes/user.routes.js";


dotenv.config();
connection();

let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", user);




app.listen(8000, ()=>{
    console.log("Server is running on port 8000 @ http://localhost:8000");
})