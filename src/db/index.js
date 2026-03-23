import mongoose from "mongoose";
import { DB_NAME } from "../constants/constant.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}?appName=node_backend`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance?.collections}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB