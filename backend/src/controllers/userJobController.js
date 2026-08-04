import User from "../models/userModel.js";
import { success, fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";

function jobPayload(body) {
  return {
    id: body.id,
    title: body.title,
    company: body.company,
    location: body.location,
    salary: body.salary,
    employment_type: body.employment_type,
    jobType: body.jobType,
    job_category: body.job_category,
    url: body.url,
  };
}

export async function getSavedJobs(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);
    return success(res, { jobs: user.savedJobs });
  } catch (err) {
    next(err);
  }
}

export async function saveJob(req, res, next) {
  try {
    if (!req.body?.id) {
      return fail(res, "Job id is required.", HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    if (user.savedJobs.some((job) => job.id === req.body.id)) {
      return success(res, { jobs: user.savedJobs, message: "Already saved" });
    }

    user.savedJobs.push(jobPayload(req.body));
    await user.save();
    return success(res, { jobs: user.savedJobs }, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function getAppliedJobs(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);
    return success(res, { jobs: user.appliedJobs });
  } catch (err) {
    next(err);
  }
}

export async function applyJob(req, res, next) {
  try {
    if (!req.body?.id) {
      return fail(res, "Job id is required.", HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    if (user.appliedJobs.some((job) => job.id === req.body.id)) {
      return success(res, { jobs: user.appliedJobs, message: "Already applied" });
    }

    user.appliedJobs.push(jobPayload(req.body));
    await user.save();
    return success(res, { jobs: user.appliedJobs }, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}
