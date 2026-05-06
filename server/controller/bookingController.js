import Booking from '../models/booking.js';
import Events from '../models/events.js';
import OTP from '../models/otp.js';
import { sendBookingEmail, sendOtpEmail } from '../utils/email.js';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function sendBookingOTP(req, res) {
    try {
        const otp = generateOTP();
        await OTP.findOneAndDelete({ email: req.user.email, action: 'event_booking' });
        await OTP.create({ email: req.user.email, otp, action: 'event_booking' });
        await sendOtpEmail(req.user.email, otp, 'event_booking');
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

export async function bookEvent(req, res) {
    try {
        const { eventId, otp, quantity = 1 } = req.body; // ✅ add quantity

        const validOTP = await OTP.findOne({ email: req.user.email, otp: Number(otp), action: 'event_booking' });
        if (!validOTP) return res.status(400).json({ message: 'Invalid or expired OTP for booking' });

        const event = await Events.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats < quantity) return res.status(400).json({ message: 'Not enough seats available' });

        const existingBooking = await Booking.findOne({ userId: req.user.id, eventId });
        if (existingBooking && existingBooking.status !== 'cancelled') {
            return res.status(400).json({ message: 'Already booked or pending' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            quantity,                          // ✅ save quantity
            status: 'pending',
            paymentStatus: 'not_paid',
            amount: event.ticketPrice * quantity // ✅ multiply by quantity
        });

        await OTP.deleteOne({ _id: validOTP._id });
        res.status(201).json({ message: 'Booking request submitted', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export async function confirmBooking(req, res) {
    try {
        const { paymentStatus } = req.body;
        const booking = await Booking.findById(req.params.id).populate('userId').populate('eventId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.status === 'confirmed') return res.status(400).json({ message: 'Booking is already confirmed' });

        const event = await Events.findById(booking.eventId._id);
        const quantity = booking.quantity || 1;

        if (event.availableSeats < quantity) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        booking.status = 'confirmed';
        if (paymentStatus) booking.paymentStatus = paymentStatus;
        await booking.save();

        event.availableSeats -= quantity; // ✅ deduct on confirmation
        await event.save();

        await sendBookingEmail(booking.userId.email, booking.userId.username, booking.eventId.title); // ✅ username not name

        res.json({ message: 'Booking confirmed successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
export async function getMyBookings(req, res) {
    try {
        console.log('getMyBookings called, user:', req.user); // ✅ add this
        const bookings = req.user.role === 'admin'
            ? await Booking.find().populate('eventId').populate('userId', 'username email').sort({ createdAt: -1 })
            : await Booking.find({ userId: req.user.id }).populate('eventId').sort({ createdAt: -1 });
        console.log('bookings found:', bookings); // ✅ add this
        res.json(bookings);
    } catch (error) {
        console.log('getMyBookings error:', error); // ✅ add this
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
}

export async function cancelBooking(req, res) {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const wasConfirmed = booking.status === 'confirmed';

        booking.status = 'cancelled';
        await booking.save();

        // Only restore the seat if it was actually confirmed and deducted
        if (wasConfirmed) {
            const event = await Events.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};