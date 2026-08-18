import { Router } from "express";
import { protect, allowRoles } from "../middleware/authMiddleware.js";
import { ROLES } from "../models/userModel.js";
import {
  createPostedJob,
  getMyPostedJobs,
  deletePostedJob,
} from "../controllers/postedJobController.js";

const router = Router();

router.use(protect);
router.use(allowRoles(ROLES.EMPLOYER));

router.get("/my-jobs", getMyPostedJobs);
router.post("/jobs", createPostedJob);
router.delete("/jobs/:id", deletePostedJob);

export default router;
