import { findJobById, getAllJobs } from "../models/jobModel.js";
import PostedJob from "../models/postedJobModel.js";
import { HTTP_STATUS, MESSAGES } from "../constants.js";
import { fail, success } from "../utils/response.js";

function mapPosted(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    company: doc.company,
    location: doc.location,
    employment_type: doc.employment_type,
    jobType: doc.jobType,
    job_category: doc.job_category,
    salary: doc.salary,
    description: doc.description,
    source: "employer",
  };
}

export async function getJobs(_req, res) {
  const [remoteJobs, posted] = await Promise.all([
    getAllJobs(),
    PostedJob.find().sort({ createdAt: -1 }),
  ]);
  return success(res, [...posted.map(mapPosted), ...remoteJobs]);
}

export async function getJobById(req, res) {
  const posted = await PostedJob.findById(req.params.id).catch(() => null);
  if (posted) return success(res, mapPosted(posted));

  const job = await findJobById(req.params.id);
  if (!job) {
    return fail(res, MESSAGES.JOB_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  return success(res, job);
}
