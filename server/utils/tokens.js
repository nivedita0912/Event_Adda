import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

export  function GenerateToken(role,id){
//    const {id, role}  = req.body;

   const token = jwt.sign(
    {id:id,
        role:role
    },
    process.env.JWT_SECRET,
    {expiresIn:"7d"}
)
 return token;
}


export function DecodedToken(token){
try{
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
    return decodedToken;
}catch(err){
    return "the decode gives problem";
}

}
