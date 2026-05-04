
import mongoose from "mongoose";
import User from "./user.js";

const eventsSchema = new mongoose.Schema({
    title: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ["acc_verification", "event_booking"],
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        require: true
    }
}, { timestamps: true })
export default mongoose.model("Events", eventsSchema);