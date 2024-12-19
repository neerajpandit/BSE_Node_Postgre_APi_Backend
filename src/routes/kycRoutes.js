import { verifyToken } from "../middlewares/authMiddleware.js";
import express from "express";
import { createKycDetails } from "../controllers/kycController.js";
import { validatePan } from "../middlewares/inputValidator.js";

const router = express.Router();

router.post("/",verifyToken,validatePan,createKycDetails);


export default router;