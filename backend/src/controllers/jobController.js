import { findJobById, getAllJobs } from "../models/jobModel.js";
import PostedJob from "../models/postedJobModel.js";
import { HTTP_STATUS, MESSAGES } from "../constants.js";
import { fail, success } from "../utils/response.js";

export function mapPosted(doc) {
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
    status: doc.status || "open",
    source: "employer",
  };
}

function matchesFilters(job, { search, location, jobType }) {
  const q = (search || "").toLowerCase().trim();
  if (q) {
    const hay = `${job.title || ""} ${job.company || ""} ${job.job_category || ""}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }

  if (location && location !== "All") {
    const loc = (job.location || "").toLowerCase();
    if (location === "Remote") {
      if (
        !loc.includes("remote") &&
        job.is_remote_work !== 1 &&
        job.is_remote_work !== true
      ) {
        return false;
      }
    } else if (!loc.includes(location.toLowerCase())) {
      return false;
    }
  }

  if (jobType && jobType !== "All") {
    const type = (job.employment_type || job.jobType || "").toLowerCase();
    const map = {
      "Full Time": "full-time",
      "Part Time": "part-time",
      Internship: "intern",
      Remote: "remote",
      Contract: "contract",
      Freelance: "freelance",
    };
    const needle = map[jobType] || jobType.toLowerCase();
    if (jobType === "Remote" && (job.is_remote_work === 1 || job.is_remote_work === true)) {
      return true;
    }
    if (!type.includes(needle)) return false;
  }

  return true;
}

export async function getJobs(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const filters = {
      search: req.query.search || "",
      location: req.query.location || "All",
      jobType: req.query.jobType || "All",
    };

    const [remoteJobs, posted] = await Promise.all([
      getAllJobs(),
      PostedJob.find({ status: { $ne: "closed" } }).sort({ createdAt: -1 }),
    ]);

    const all = [...posted.map(mapPosted), ...remoteJobs].filter((job) =>
      matchesFilters(job, filters)
    );

    const total = all.length;
    const start = (page - 1) * limit;
    const jobs = all.slice(start, start + limit);

    return success(res, {
      jobs,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    next(err);
  }
}

export async function getJobById(req, res, next) {
  try {
    const posted = await PostedJob.findById(req.params.id).catch(() => null);
    if (posted) return success(res, mapPosted(posted));

    const job = await findJobById(req.params.id);
    if (!job) {
      return fail(res, MESSAGES.JOB_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }
    return success(res, job);
  } catch (err) {
    next(err);
  }
}
