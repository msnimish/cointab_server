import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connection = () =>{

    mongoose.set("strictQuery",false);
    mongoose.connect(process.env.DB_URL);
    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    })

    mongoose.connection.on("disconnected", () => {
        console.log("Database disconnected");
    })
    

    mongoose.connection.on("error", (err) => {
        console.log("Error while connecting to DB", err);
    })
}

export default connection;