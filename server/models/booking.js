import mongoose from "mongoose";
import user from "./user.js";

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'not_paid'],
        default: 'not_paid'
    },
    amount: {
        type: Number,
        required: true
    },

    bookedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);