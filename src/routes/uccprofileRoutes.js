import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allData, uccProfileCreate, uccRegister } from '../controllers/uccprofileController.js';
import { validateuccProfile } from '../middlewares/inputValidator.js';

const router = express.Router();

router.post("/",verifyToken,validateuccProfile,uccProfileCreate);
router.get("/",verifyToken,allData);

router.post("/uccregister",verifyToken,uccRegister)

export default router;