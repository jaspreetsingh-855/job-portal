import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { ROLES } from "../models/userModel.js";
import {
  getAdminStats,
  listUsers,
  getAdminReports,
} from "../controllers/adminController.js";

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.ADMIN));

router.get("/stats", getAdminStats);
router.get("/users", listUsers);
router.get("/reports", getAdminReports);

export default router;
