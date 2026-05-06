import mongoose from "mongoose";

const eventsSchema = new mongoose.Schema({
    title: {
        type: String,  // ✅ String not Number
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {               // ✅ lowercase
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
    image: {             // ✅ image not imageUrl
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',     // ✅ string not imported model
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Events", eventsSchema);