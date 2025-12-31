import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 

export const generateToken = (clinicianId: number): string => {
    return jwt.sign({ id: clinicianId }, JWT_SECRET, { expiresIn: "1h" }); 
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
