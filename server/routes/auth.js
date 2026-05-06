import { Router } from "express";
import { registerUser, loginUser, getMe, verifyOtp } from "../controller/authController.js"


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verifyOtp', verifyOtp);
router.get('/me', getMe);
export default router;