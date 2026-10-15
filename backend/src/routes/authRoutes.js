import { Router } from "express";
import {
  signup,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
  saveResume,
} from "../controllers/authController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { ROLES } from "../models/userModel.js";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.post(
  "/resume",
  protect,
  allowRoles(ROLES.JOBSEEKER),
  (req, res, next) => {
    uploadResume(req, res, (err) => {
      if (err) return res.status(400).json({ message: err.message });
      next();
    });
  },
  saveResume
);

export default router;
