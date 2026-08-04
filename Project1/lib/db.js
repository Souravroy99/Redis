import mongoose from "mongoose";

import dns from "node:dns";
dns.setServers(["8.8.8.8"]);

const connectDB = async() => {
    try {
        const MONGODB_URL = process.env.MONGODB_URL
        await mongoose.connect(MONGODB_URL)
        console.log("DB connected");
    } 
    catch (error) {
        console.log(`MongoDB connection error: ${error}`);    
    }
}

export default connectDB 