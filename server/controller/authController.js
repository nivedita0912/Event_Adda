import User from "../models/user.js";
import bcrypt from "bcryptjs";
import OtpModel from "../models/otp.js";
import { sendOtpEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import {GenerateToken, DecodedToken } from "../utils/tokens.js"
configDotenv();

export async function registerUser(req, res) {
    const { username, password, email, role } = req.body;
    try {
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userFromDB = await User.findOne({ email });
        if (userFromDB) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            role
        });

        const createdOtp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(createdOtp);

        await sendOtpEmail(email, createdOtp, "acc_verification");

        await OtpModel.create({
            email,
            otp: createdOtp,  // ✅ was "Createotp" which is wrong key
            action: "acc_verification"
        });

        return res.status(201).json({
            message: "User registered successfully. Please check your email to verify your account."
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong with register" });
    }
}

export async function loginUser(req, res) {
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const getUser = await User.findOne({ email });
        if (!getUser) {
            return res.status(404).json({ message: "No user found" });
        }

        if (!getUser.isVerified) {
            return res.status(403).json({ message: "Please verify your account before login" });
        }

        const isMatch = await bcrypt.compare(password, getUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
const token  = GenerateToken( getUser.role,getUser._id);

res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const decode = DecodedToken(token);

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: getUser._id,
                username: getUser.username,
                email: getUser.email,
                role: getUser.role,
                token,
                decode
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong with login" });
    }
}

export async function verifyOtp(req, res) {
    try {
        const { email, otp: bodyOtp } = req.body;

        if (!email || !bodyOtp) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const otpRecord = await OtpModel.findOne({
            email,
            otp: bodyOtp,
            action: "acc_verification"
        });

        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        await OtpModel.deleteMany({ email, action: "acc_verification" });

        const token = jwt.sign(
            { role: updatedUser.role, id: updatedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            token,
            message: "Account verified successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong with OTP verification" });
    }
}