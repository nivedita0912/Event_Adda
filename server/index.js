import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import authRoutes from './routes/auth.js'
// import bookingRoutes from "./routes/booking.js";
import eventsRoutes from "./routes/events.js";
import connectToDB from "./utils/db.js"
const app = express();

configDotenv();

app.use(cors());
app.use(express.json());
connectToDB();
//Routes
app.get("/", (req, res) => {
    res.send("Server is running"); 
});
app.use("/api/auth",authRoutes);
app.use("/api/events",eventsRoutes);
// app.use("/api/bookings",bookingRoutes)

const Port = process.env.PORT || 5000;


app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});