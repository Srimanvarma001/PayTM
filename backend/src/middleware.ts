import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "./config";

// Define interface for JWT payload
interface JWTPayload {
    userId: string;
}

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(403).json({
                message: "Invalid authentication"
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(403).json({
            message: "Invalid token"
        });
        return;
    }
};