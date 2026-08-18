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
    source: body.source,
  };
}

function sameJobId(a, b) {
  return String(a) === String(b);
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
    if (req.body?.id === undefined || req.body?.id === null) {
      return fail(res, "Job id is required.", HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    if (user.savedJobs.some((job) => sameJobId(job.id, req.body.id))) {
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
    if (req.body?.id === undefined || req.body?.id === null) {
      return fail(res, "Job id is required.", HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    if (user.appliedJobs.some((job) => sameJobId(job.id, req.body.id))) {
      return success(res, { jobs: user.appliedJobs, message: "Already applied" });
    }

    user.appliedJobs.push({
      ...jobPayload(req.body),
      status: "applied",
      appliedAt: new Date(),
    });
    await user.save();
    return success(res, { jobs: user.appliedJobs }, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

function profileStrength(user) {
  let score = 0;
  if (user.name?.trim()) score += 20;
  if (user.email?.trim()) score += 20;
  if (user.phone?.trim()) score += 20;
  if (user.savedJobs?.length > 0) score += 15;
  if (user.appliedJobs?.length > 0) score += 15;
  if (user.password) score += 10;
  return Math.min(100, score);
}

function countByStatus(jobs, status) {
  return jobs.filter((job) => (job.status || "applied") === status).length;
}

export async function getDashboard(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    const applied = user.appliedJobs || [];
    const saved = user.savedJobs || [];

    const stats = {
      applications: applied.length,
      interviews: countByStatus(applied, "interview"),
      savedJobs: saved.length,
      offers: countByStatus(applied, "offer"),
      underReview: countByStatus(applied, "under_review"),
      rejected: countByStatus(applied, "rejected"),
      appliedOnly: countByStatus(applied, "applied"),
    };

    const recentApplications = [...applied]
      .reverse()
      .slice(0, 5)
      .map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        status: job.status || "applied",
        appliedAt: job.appliedAt,
      }));

    return success(res, {
      stats,
      recentApplications,
      savedJobs: saved.slice(-5).reverse(),
      profileStrength: profileStrength(user),
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      },
    });
  } catch (err) {
    next(err);
  }
}
