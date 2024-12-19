import express from "express";
import {
  createBankDetails,
  deleteBankDetails,
  getBankDetails,
  updateBankDetails,
} from "../controllers/bankDetailsController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { validateBank } from "../middlewares/inputValidator.js";

const router = express.Router();

router.post("/", verifyToken,validateBank, createBankDetails);
router.get("/", verifyToken, getBankDetails);
router.delete("/:id", verifyToken, deleteBankDetails);
router.put("/:id",verifyToken,updateBankDetails);

export default router;
