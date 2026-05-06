import { Router } from "express";
import { cancelBooking, getMyBookings, confirmBooking, bookEvent, sendBookingOTP } from "../controller/bookingController.js"
import { protect, admin } from "../middleware/auth.js";
import { sendOtpEmail } from "../utils/email.js";
const router = Router();

router.post("/send-otp", protect, sendBookingOTP);  // frontend calls /bookings/send-otp
router.post("/", protect, bookEvent);               // frontend calls POST /bookings
router.get("/my", protect, getMyBookings);          // frontend calls /bookings/my
router.delete("/:id", protect, cancelBooking);      // frontend calls /bookings/:id
router.put("/:id/confirm", protect, admin, confirmBooking); // frontend calls /bookings/:id/confirm

export default router;