import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    mongoose.connect(process.env.DB_URL)
        .then(() => console.log('Database connected successfully'))
        .catch(err => console.log('Database connection failed: ' + err));
}