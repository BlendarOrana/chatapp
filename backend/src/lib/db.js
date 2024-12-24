import mongoose from "mongoose";


export const connectDb = async()=>{


    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("mongo connection error:",error);
    }
};