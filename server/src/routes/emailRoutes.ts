import { Router } from "express";
import { sendEmail, sendInvitationEmail } from "../controllers/emailController";

const router = Router();

router.post('/', sendEmail);
router.post('/invite', sendInvitationEmail);


export default router;