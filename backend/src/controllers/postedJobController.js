import PostedJob from "../models/postedJobModel.js";
import { success, fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";

function toPublicJob(doc) {
  return {
    id: doc._id.toString(),
    _id: doc._id,
    title: doc.title,
    company: doc.company,
    location: doc.location,
    employment_type: doc.employment_type,
    jobType: doc.jobType,
    job_category: doc.job_category,
    salary: doc.salary,
    description: doc.description,
    source: "employer",
    postedBy: doc.postedBy,
    createdAt: doc.createdAt,
  };
}

export async function createPostedJob(req, res, next) {
  try {
    const {
      title,
      company,
      location,
      employment_type,
      jobType,
      job_category,
      salary,
      description,
    } = req.body;

    if (!title || !company || !location) {
      return fail(
        res,
        "Title, company and location are required.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const job = await PostedJob.create({
      title,
      company,
      location,
      employment_type: employment_type || "full-time",
      jobType: jobType || "Full Time",
      job_category: job_category || "General",
      salary: salary || "",
      description: description || "",
      postedBy: req.userId,
    });

    return success(res, { job: toPublicJob(job) }, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function getMyPostedJobs(req, res, next) {
  try {
    const jobs = await PostedJob.find({ postedBy: req.userId }).sort({
      createdAt: -1,
    });
    return success(res, { jobs: jobs.map(toPublicJob) });
  } catch (err) {
    next(err);
  }
}

export async function deletePostedJob(req, res, next) {
  try {
    const job = await PostedJob.findById(req.params.id);
    if (!job) {
      return fail(res, "Job not found.", HTTP_STATUS.NOT_FOUND);
    }
    if (job.postedBy.toString() !== String(req.userId)) {
      return fail(
        res,
        "You can only delete your own jobs.",
        HTTP_STATUS.FORBIDDEN
      );
    }
    await job.deleteOne();
    return success(res, { message: "Job deleted" });
  } catch (err) {
    next(err);
  }
}
