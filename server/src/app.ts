import express from "express";
import cors from "cors";
import responseRoutes from "./routes/responseRoutes";
import clinicianRoutes from "./routes/clinicianRoutes";
import emailRoutes from "./routes/emailRoutes";
import { errorHandler } from "./middleware/errorMiddleware";
import registrationRoutes from './routes/registrationRoutes';
import rateLimit from "express-rate-limit";
import resourceRoutes from "./routes/resourceRoutes"; 



const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json({limit: 52428800})); // to allow requests containg PDF DataURI


// limit each IP to 500 requests per 15 minutes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }); 
app.use(limiter);


// Routes
app.use("/api/responses", responseRoutes);
app.use("/api/clinician", clinicianRoutes);
app.use("/api/email", emailRoutes);
app.use("/api", registrationRoutes);
app.use("/api/resources", resourceRoutes); 



// Error handling middleware
app.use(errorHandler);

export default app;
