import express from "express";
import {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  getMe,
  logoutUser,
  updateMe,
  changeMyPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.put("/change-password", protect, changeMyPassword);

export default router;