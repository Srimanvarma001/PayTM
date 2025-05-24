import { NextFunction } from "express";
import { JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

 export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{

    //@ts-ignore
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
          //@ts-ignore

        return res.status(403).json({});
    }

    const token = authHeader.split('')[1];

    try{
        const decoded = jwt.verify(token,JWT_SECRET);
            //@ts-ignore
        if(decoded.userId){
                        //@ts-ignore

            req.userId = decoded.userId;
            next();
        }else{
                        //@ts-ignore

            return res.status(403).json({});

        }
    }catch(err){
            //@ts-ignore

        return res.status(403).json({});
    }
}