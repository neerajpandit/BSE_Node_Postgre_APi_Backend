import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { addNominee, deleteNominee, getAllNominee, getNomineeById, updateNomineeById } from '../controllers/nomineeController.js';
import { validateNominee } from '../middlewares/inputValidator.js';

const router = express.Router();

router.post("/",verifyToken,validateNominee,addNominee)
router.get("/",verifyToken,getAllNominee)
router.get("/:id",verifyToken,getNomineeById)
router.put("/:id",verifyToken,updateNomineeById)
router.delete("/:id",verifyToken,deleteNominee)

export default router;