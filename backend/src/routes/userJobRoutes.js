import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getSavedJobs,
  saveJob,
  getAppliedJobs,
  applyJob,
} from "../controllers/userJobController.js";

const router = Router();

router.use(protect);

router.get("/saved", getSavedJobs);
router.post("/saved", saveJob);
router.get("/applied", getAppliedJobs);
router.post("/applied", applyJob);

export default router;
