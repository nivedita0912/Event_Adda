import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import authRoutes from './routes/auth.js'
import connectToDB from "./utils/db.js"
const app = express();

configDotenv();

app.use(cors());
app.use(express.json());
connectToDB();
//Routes
app.use("/api/auth",authRoutes);


const Port = process.env.PORT || 5000;


app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});