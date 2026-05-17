import { Router } from "express";
import {
  register,
  login,
  logout,
  me,
  updateProfile,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  changePassword,
  guestLogin,
  convertGuestToUser,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/guest-login", guestLogin);
router.post("/convert-guest", protect, convertGuestToUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/change-password", protect, changePassword);
router.get("/me", protect, me);
router.put("/update-profile", protect, updateProfile);

export default router;

