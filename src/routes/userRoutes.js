import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import {validatePhoneOtp} from "../middlewares/inputValidator.js";
import {
  deleteUserProfile,
  getAllUserProfile,
  getUserProfileByID,
  logoutUserProfile,
  refreshAccessToken,
  sendOtpForAuth,
  updateUserProfile,
  verifyOtp,
} from "../controllers/userprofileController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/",validatePhoneOtp, sendOtpForAuth);
router.post("/verifyOtp",validatePhoneOtp, verifyOtp);
router.post("/logout",verifyToken,logoutUserProfile);
router.get("/", getAllUserProfile);
router.get("/:id", getUserProfileByID);
router.put("/",verifyToken,updateUserProfile);
router.delete("/:id",verifyToken, deleteUserProfile);
router.post("/refresh-token",refreshAccessToken);

// router.post("/user", validateUser, createUser);
// router.get("/user", getAllUsers);
// router.get("/user/:id", getUserById);
// router.put("/user/:id", validateUser, updateUser);
// router.delete("/user/:id", deleteUser);

export default router;
