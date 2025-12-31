import { Router } from "express";
import { getPrivacyStatement, updatePrivacyStatement } from "../controllers/resourceController";
import { authenticateJWT, authorizeAdmin } from "../middleware/authMiddleware";

const router = Router();

// Public route to get the privacy statement
router.get("/privacy-statement", getPrivacyStatement);

// Admin-only route to update the privacy statement
router.put("/privacy-statement", authenticateJWT, updatePrivacyStatement);

export default router;
