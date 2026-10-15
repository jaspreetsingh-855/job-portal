import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { ROLES } from "../models/userModel.js";
import {
  createPostedJob,
  getMyPostedJobs,
  updatePostedJob,
  deletePostedJob,
  getEmployerDashboard,
  getJobApplications,
  updateApplicationStatus,
} from "../controllers/postedJobController.js";

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.EMPLOYER));

router.get("/dashboard", getEmployerDashboard);
router.get("/my-jobs", getMyPostedJobs);
router.post("/jobs", createPostedJob);
router.put("/jobs/:id", updatePostedJob);
router.delete("/jobs/:id", deletePostedJob);
router.get("/jobs/:id/applications", getJobApplications);
router.patch("/applications/:id", updateApplicationStatus);

export default router;
