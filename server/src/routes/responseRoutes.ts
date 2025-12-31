import { Router } from "express";
import { saveResponse, } from "../controllers/responseController";

const router = Router();

router.post('/', saveResponse);

export default router;
