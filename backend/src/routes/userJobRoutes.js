import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { ROLES } from "../models/userModel.js";
import {
  getSavedJobs,
  saveJob,
  getAppliedJobs,
  applyJob,
  getDashboard,
} from "../controllers/userJobController.js";

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.JOBSEEKER));

router.get("/dashboard", getDashboard);
router.get("/saved", getSavedJobs);
router.post("/saved", saveJob);
router.get("/applied", getAppliedJobs);
router.post("/applied", applyJob);

export default router;
