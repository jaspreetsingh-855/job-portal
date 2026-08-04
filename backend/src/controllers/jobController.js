import { findJobById, getAllJobs } from "../models/jobModel.js";
import { HTTP_STATUS, MESSAGES } from "../constants.js";
import { fail, success } from "../utils/response.js";

export async function getJobs(_req, res) {
  const jobs = await getAllJobs();
  return success(res, jobs);
}

export async function getJobById(req, res) {
  const job = await findJobById(req.params.id);

  if (!job) {
    return fail(res, MESSAGES.JOB_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  return success(res, job);
}
