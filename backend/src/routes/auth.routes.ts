import { Router } from "express";
import {
  login,
  logout,
  register,
  me,
  updateProfile,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.get("/me", protect, me);
router.put("/update-profile", protect, updateProfile);

export default router;
