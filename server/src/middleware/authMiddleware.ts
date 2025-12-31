// authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);
        if (decoded) {
            req.body.clinician = decoded;
            next();
        } else {
            return res.status(403).json({ error: "Invalid or expired token." });
        }
    } else {
        return res.status(401).json({ error: "Authorization token required." });
    }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { clinician } = req.body;
    
    if (clinician.is_admin) {
        return next();
    } else {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
};
