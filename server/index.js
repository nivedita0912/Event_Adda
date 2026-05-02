import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import authRoutes from './routes/auth.js'
const app = express();

configDotenv();

app.use(cors());
app.use(express.json());
 

//Routes
app.use("/api/auth",authRoutes);


const Port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB is connected");
    }).catch((error) => {
        console.log("Error : ", error);
    });

app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});