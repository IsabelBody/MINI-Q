import express from 'express';
import { registerClinician } from '../controllers/registrationController';


const router = express.Router();

router.post('/register', registerClinician);

export default router;
