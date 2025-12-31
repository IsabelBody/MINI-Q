import { Router } from "express";
import { 
    getAllResponses, 
    getAllActionedResponses, 
    searchResponses, 
    getPatientResponseByNHI, 
    getPatientResponseWithoutNHI, 
    getPatientResponseByDateOfBirth, 
    updateResponseToActioned, 
    deletePatientResponse, 
    loginClinician, 
} from "../controllers/clinicianController";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/login", loginClinician);

// Protected routes (jwt applied!)
router.get("/get-all-responses", authenticateJWT, getAllResponses);
router.get("/search", authenticateJWT, searchResponses);
router.get("/get-patient-data-with-nhi/:nhi", authenticateJWT, getPatientResponseByNHI);
router.get("/get-patient-data-without-nhi", authenticateJWT, getPatientResponseWithoutNHI);
router.get("/get-patient-data-by-dob/:dateOfBirth", authenticateJWT, getPatientResponseByDateOfBirth);
router.get("/get-actioned-responses", authenticateJWT, getAllActionedResponses);

// Uncomment and protect when needed
// router.delete("/patients/responses/:nhi", authenticateJWT, deletePatientResponse);

router.patch("/responses/actioned", authenticateJWT, updateResponseToActioned);

export default router;
