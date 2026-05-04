import { Router } from "express";
import { cancelBooking, getMyBookings, confirmBooking, bookEvent, sendBookingOTP } from "../controller/bookingController.js"
import { protect, admin } from "../middleware/auth.js";
import { sendOtpEmail } from "../utils/email.js";
const router = Router();

router.post("/bookEvent", bookEvent);
router.post("/send_otp", protect, sendBookingOTP);
router.get("/myBooking", protect, getMyBookings);
router.delete("/:id/cancel", protect, cancelBooking);
router.put("/:id/confirmBooking", protect, admin, confirmBooking);

export default router;