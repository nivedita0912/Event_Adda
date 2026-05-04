import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function protect(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token" });
        }

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        req.user = user;

        next();

    } catch (err) {
        console.log(err);

        return res.status(401).json({
            message: "Unauthorized - Invalid or expired token"
        });
    }
}

export function admin (req,res,next){
    if(req.user && req.user.role === "admin"){
        next();
    }
    else{
        return res.status(403).json({
            message:"Forbidden , admin access only.."
        })
    }
}