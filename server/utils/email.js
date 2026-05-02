import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendBookingEmail(userEmail, userName, eventTitle) {
    const mailOptions = {
        from: `Event Adda Team <${process.env.EMAIL}>`,
        to: userEmail,
        subject: `Booking Confirmed: ${eventTitle}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
            
            <!-- Header -->
            <div style="background: #4F46E5; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Event Adda</h1>
                <p style="color: #C7D2FE; margin: 6px 0 0; font-size: 14px;">Your Event Experience Starts Here</p>
            </div>

            <!-- Body -->
            <div style="padding: 32px;">
                <p style="color: #111827; font-size: 16px; margin: 0 0 8px;">Hi ${userName} 👋,</p>
                <p style="color: #6B7280; font-size: 15px;">Your booking has been <strong style="color: #16A34A;">successfully confirmed!</strong></p>

                <!-- Event Box -->
                <div style="background: #EEF2FF; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
                    <p style="color: #6B7280; font-size: 13px; margin: 0 0 8px;">You're booked for</p>
                    <h2 style="color: #4F46E5; margin: 0; font-size: 22px;">${eventTitle}</h2>
                </div>

                <div style="background: #F0FDF4; border-left: 4px solid #16A34A; padding: 12px 16px; border-radius: 4px;">
                    <p style="color: #166534; font-size: 13px; margin: 0;">✅ Your spot is reserved. We look forward to seeing you there!</p>
                </div>

                <p style="color: #9CA3AF; font-size: 13px; margin-top: 24px;">If this wasn't you, please contact our support immediately.</p>
            </div>

            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">© 2025 Event Adda. All rights reserved.</p>
            </div>
        </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Booking email sent:", info.messageId);
        return { success: true };
    } catch (err) {
        console.error("Error sending booking email:", err);
        return { success: false, error: err.message };
    }
}

export async function sendOtpEmail(userEmail, otp, type) {
    const isVerification = type === "account_verification";

    const title = isVerification
        ? "Verify your Event Adda Account"
        : "Event Adda Booking Verification";

    const msg = isVerification
        ? "Please use the following OTP to verify your new Event Adda account."
        : "Please use the following OTP to verify and confirm your event booking.";

    const mailOptions = {
        from: `Event Adda Team <${process.env.EMAIL}>`,
        to: userEmail,
        subject: title,
        text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

            <!-- Header -->
            <div style="background: #4F46E5; padding: 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Event Adda</h1>
                <p style="color: #C7D2FE; margin: 6px 0 0; font-size: 14px;">Your Event Experience Starts Here</p>
            </div>

            <!-- Body -->
            <div style="padding: 32px;">
                <p style="color: #111827; font-size: 16px; margin: 0 0 8px;">Hi there 👋,</p>
                <p style="color: #6B7280; font-size: 15px; margin: 0 0 24px;">${msg}</p>

                <!-- OTP Box -->
                <div style="text-align: center; margin: 24px 0;">
                    <p style="color: #6B7280; font-size: 13px; margin-bottom: 10px;">Your One-Time Password</p>
                    <span style="
                        font-size: 40px;
                        font-weight: bold;
                        letter-spacing: 12px;
                        color: #4F46E5;
                        background: #EEF2FF;
                        padding: 16px 32px;
                        border-radius: 10px;
                        display: inline-block;
                    ">${otp}</span>
                    <p style="color: #EF4444; font-size: 13px; margin-top: 12px;">⏱ Valid for 10 minutes only</p>
                </div>

                <div style="background: #FFF7ED; border-left: 4px solid #F97316; padding: 12px 16px; border-radius: 4px;">
                    <p style="color: #92400E; font-size: 13px; margin: 0;">⚠️ Never share this OTP with anyone. Event Adda will never ask for your OTP.</p>
                </div>

                <p style="color: #9CA3AF; font-size: 13px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
            </div>

            <!-- Footer -->
            <div style="background: #F9FAFB; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">© 2025 Event Adda. All rights reserved.</p>
            </div>
        </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("OTP email sent:", info.messageId);
        return { success: true };
    } catch (err) {
        console.error("Error sending OTP email:", err);
        return { success: false, error: err.message };
    }
}