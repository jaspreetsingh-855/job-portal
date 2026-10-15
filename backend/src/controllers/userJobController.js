import User from "../models/userModel.js";
import PostedJob from "../models/postedJobModel.js";
import Application from "../models/applicationModel.js";
import { success, fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";
import mongoose from "mongoose";

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

function mapApplication(doc) {
  return {
    id: doc.jobId,
    applicationId: doc._id,
    title: doc.title,
    company: doc.company,
    location: doc.location,
    salary: doc.salary,
    employment_type: doc.employment_type,
    jobType: doc.jobType,
    job_category: doc.job_category,
    url: doc.url,
    source: doc.source,
    coverLetter: doc.coverLetter || "",
    status: doc.status || "applied",
    appliedAt: doc.appliedAt,
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
    return success(res, { jobs: user.savedJobs, message: "Job saved" }, HTTP_STATUS.CREATED);
  } catch (err) {
    next(err);
  }
}

export async function unsaveJob(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    user.savedJobs = user.savedJobs.filter((job) => !sameJobId(job.id, req.params.id));
    await user.save();
    return success(res, { jobs: user.savedJobs, message: "Job removed from saved" });
  } catch (err) {
    next(err);
  }
}

export async function getAppliedJobs(req, res, next) {
  try {
    const apps = await Application.find({ seeker: req.userId }).sort({
      appliedAt: -1,
    });
    if (apps.length) {
      return success(res, { jobs: apps.map(mapApplication) });
    }

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

    const existing = await Application.findOne({
      seeker: req.userId,
      jobId: String(req.body.id),
    });
    if (existing || user.appliedJobs.some((job) => sameJobId(job.id, req.body.id))) {
      return success(res, { message: "Already applied" });
    }

    let posted = null;
    if (mongoose.isValidObjectId(req.body.id)) {
      posted = await PostedJob.findById(req.body.id);
    }
    if (posted?.status === "closed") {
      return fail(res, "This job is closed.", HTTP_STATUS.BAD_REQUEST);
    }

    const payload = jobPayload(req.body);
    const application = await Application.create({
      jobId: String(req.body.id),
      postedJob: posted?._id,
      seeker: req.userId,
      employer: posted?.postedBy,
      ...payload,
      coverLetter: (req.body.coverLetter || "").trim(),
      status: "applied",
      appliedAt: new Date(),
    });

    user.appliedJobs.push({
      ...payload,
      status: "applied",
      appliedAt: new Date(),
    });
    await user.save();

    return success(
      res,
      { job: mapApplication(application), message: "Applied successfully" },
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    if (err.code === 11000) {
      return success(res, { message: "Already applied" });
    }
    next(err);
  }
}

function profileStrength(user, appliedCount) {
  let score = 0;
  if (user.name?.trim()) score += 15;
  if (user.email?.trim()) score += 15;
  if (user.phone?.trim()) score += 15;
  if (user.location?.trim()) score += 10;
  if (user.bio?.trim()) score += 10;
  if (user.skills?.length) score += 10;
  if (user.resumeUrl) score += 10;
  if (user.savedJobs?.length > 0) score += 5;
  if (appliedCount > 0) score += 10;
  return Math.min(100, score);
}

function countByStatus(jobs, status) {
  return jobs.filter((job) => (job.status || "applied") === status).length;
}

export async function getDashboard(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    let applied = await Application.find({ seeker: req.userId }).sort({
      appliedAt: -1,
    });
    applied = applied.length ? applied.map(mapApplication) : user.appliedJobs || [];
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

    return success(res, {
      stats,
      recentApplications: applied.slice(0, 5),
      savedJobs: saved.slice(-5).reverse(),
      profileStrength: profileStrength(user, applied.length),
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        location: user.location || "",
        experience: user.experience || "",
        bio: user.bio || "",
        skills: user.skills || [],
        resumeUrl: user.resumeUrl || "",
      },
    });
  } catch (err) {
    next(err);
  }
}
