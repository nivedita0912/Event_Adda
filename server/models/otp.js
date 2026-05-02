
import mongoose  from "mongoose";

const otpSchema =new mongoose.Schema({
   otp:{
    type:Number,
    required:true
   },
   email:{
    type:String,
    required:true
   },
   action:{
    type:String,
    enum:["acc_verification","event_booking"],
    required:true
   },
   createdAt:{
   type:Date,
   default:Date.now(),
   expiresIn:300
   }
})
export default  mongoose.model("OTP",otpSchema);