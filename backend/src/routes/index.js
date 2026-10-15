import { Router } from "express";
import { HTTP_STATUS, MESSAGES } from "../constants.js";
import { success } from "../utils/response.js";

const router = Router();

router.get("/", (_req, res) => {
  return success(res, { message: MESSAGES.API_RUNNING });
});

router.get("/api/health", (_req, res) => {
  return success(res, { status: "ok" });
});

export default router;
