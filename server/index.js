import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import authRoutes from './routes/auth.js'
import bookingRoutes from "./routes/booking.js";
import eventsRoutes from "./routes/events.js";
import connectToDB from "./utils/db.js";
import cookieParser from "cookie-parser";
const app = express();

configDotenv();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
connectToDB();
//Routes
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/bookings", bookingRoutes)
app.post("/api/auth/test", (req, res) => res.json({ message: "works" }));
const Port = process.env.PORT || 5000;


app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});