
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

export default async function connectToDB() {
    try {
      await  mongoose.connect(process.env.MONGODB_URI);
     console.log("DB is connected..");
    }
    catch (error) {
        console.log(`DB can be connected cause : ${error}`);
         process.exit(1);
    }
}