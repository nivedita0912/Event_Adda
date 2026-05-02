import user from "../models/user.js";
import bcrypt from "bcryptjs"
import otp from "../models/otp.js";

async function registerUser(req, res) {
    const { username, password, email, role } = req.body;
    try {
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userFromDB = await user.findOne({ email });
        if (userFromDB) {
            return res.status(409).json({ message: "user exist already" });
        }
        const hasedPAssword = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            username,
            email,
            password: hasedPAssword,
            isVerified: false,
            role
        })
        const otp = Math.floor(1000000 + Math.random() * 9000000).toString();
        console.log(otp);
        await sendOtpEmail(email, otp, "acc_verification")
        await otp.create({
            email,
            otp,
            action:"acc_verification"
        })
        
        return res.status(201).json({
            newUser,
            otp,
            message: "user is register successfully .Please check the email to verifiy your account.."
        })
    } catch (err) {
        return res.status(500).json({ message: "somthing is worong with register " });
    }


}

async function loginUser() {

}

async function verifyOtp() {

}
export { registerUser, loginUser, verifyOtp };