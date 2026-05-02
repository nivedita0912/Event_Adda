import mongoose from "mongoose";

const UserSchema  = new mongoose.Schema({
 username:{
    type:String,
    required:true
 },
  email:{
    type:String,
    unique:true,
    required:true
 },
 password:{
    type:String,
    required:true
 },
 role:{
    type:String,
    required:true,
    enum:["user","admin"],
    default:"user"
 },
  isVerified:{
    type:Boolean,
    default:false,
    required:true
}

})

export  default mongoose.model("User", UserSchema);