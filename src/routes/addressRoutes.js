import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { createAddress } from '../controllers/addressController.js';
import { validateAddress } from '../middlewares/inputValidator.js';

const router = express.Router();

router.post("/",verifyToken,validateAddress,createAddress)

export default router;