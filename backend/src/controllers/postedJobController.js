import PostedJob from "../models/postedJobModel.js";
import Application from "../models/applicationModel.js";
import User from "../models/userModel.js";
import { success, fail } from "../utils/response.js";
import { sendStatusEmail } from "../utils/mailer.js";
import { HTTP_STATUS } from "../constants.js";
import { mapPosted } from "./jobController.js";

function toPublicJob(doc, extra = {}) {
  return {
    ...mapPosted(doc),
    _id: doc._id,
    postedBy: doc.postedBy,
    createdAt: doc.createdAt,
    ...extra,
  };
}

async function assertOwnJob(req, res) {
  const job = await PostedJob.findById(req.params.id);
  if (!job) {
    fail(res, "Job not found.", HTTP_STATUS.NOT_FOUND);
    return null;
  }
  if (job.postedBy.toString() !== String(req.userId)) {
    fail(res, "You can only manage your own jobs.", HTTP_STATUS.FORBIDDEN);
    return null;
  }
  return job;
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
    const ids = jobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { postedJob: { $in: ids } } },
      { $group: { _id: "$postedJob", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      counts.map((c) => [String(c._id), c.count])
    );

    return success(res, {
      jobs: jobs.map((job) =>
        toPublicJob(job, { applicantCount: countMap[String(job._id)] || 0 })
      ),
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePostedJob(req, res, next) {
  try {
    const job = await assertOwnJob(req, res);
    if (!job) return;

    const fields = [
      "title",
      "company",
      "location",
      "employment_type",
      "jobType",
      "job_category",
      "salary",
      "description",
      "status",
    ];
    for (const field of fields) {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    }
    if (job.status && !["open", "closed"].includes(job.status)) {
      return fail(res, "Status must be open or closed.", HTTP_STATUS.BAD_REQUEST);
    }
    await job.save();
    return success(res, { job: toPublicJob(job), message: "Job updated" });
  } catch (err) {
    next(err);
  }
}

export async function deletePostedJob(req, res, next) {
  try {
    const job = await assertOwnJob(req, res);
    if (!job) return;
    await job.deleteOne();
    return success(res, { message: "Job deleted" });
  } catch (err) {
    next(err);
  }
}

export async function getEmployerDashboard(req, res, next) {
  try {
    const jobs = await PostedJob.find({ postedBy: req.userId }).sort({
      createdAt: -1,
    });
    const jobIds = jobs.map((j) => j._id);

    const [totalApplicants, interviews, hired, recent] = await Promise.all([
      Application.countDocuments({ employer: req.userId }),
      Application.countDocuments({ employer: req.userId, status: "interview" }),
      Application.countDocuments({ employer: req.userId, status: "offer" }),
      Application.find({ employer: req.userId })
        .populate("seeker", "name email resumeUrl")
        .sort({ appliedAt: -1 })
        .limit(5),
    ]);

    const counts = await Application.aggregate([
      { $match: { postedJob: { $in: jobIds } } },
      { $group: { _id: "$postedJob", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(
      counts.map((c) => [String(c._id), c.count])
    );

    return success(res, {
      stats: {
        activeJobs: jobs.filter((j) => j.status !== "closed").length,
        totalApplicants,
        interviews,
        hired,
      },
      recentApplicants: recent.map((app) => ({
        id: app._id,
        jobId: app.jobId,
        title: app.title,
        name: app.seeker?.name || "Applicant",
        email: app.seeker?.email || "",
        status: app.status,
        appliedAt: app.appliedAt,
      })),
      jobs: jobs.slice(0, 8).map((job) =>
        toPublicJob(job, { applicantCount: countMap[String(job._id)] || 0 })
      ),
    });
  } catch (err) {
    next(err);
  }
}

export async function getJobApplications(req, res, next) {
  try {
    const job = await assertOwnJob(req, res);
    if (!job) return;

    const apps = await Application.find({ postedJob: job._id })
      .populate("seeker", "name email phone resumeUrl location experience skills bio")
      .sort({ appliedAt: -1 });

    return success(res, {
      job: toPublicJob(job),
      applications: apps.map((app) => ({
        id: app._id,
        status: app.status,
        coverLetter: app.coverLetter || "",
        appliedAt: app.appliedAt,
        seeker: {
          id: app.seeker?._id,
          name: app.seeker?.name || "Applicant",
          email: app.seeker?.email || "",
          phone: app.seeker?.phone || "",
          location: app.seeker?.location || "",
          experience: app.seeker?.experience || "",
          bio: app.seeker?.bio || "",
          skills: app.seeker?.skills || [],
          resumeUrl: app.seeker?.resumeUrl || "",
        },
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ["applied", "under_review", "interview", "offer", "rejected"];
    if (!allowed.includes(status)) {
      return fail(res, "Invalid status.", HTTP_STATUS.BAD_REQUEST);
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return fail(res, "Application not found.", HTTP_STATUS.NOT_FOUND);
    }
    if (String(application.employer) !== String(req.userId)) {
      return fail(res, "You can only update your own applicants.", HTTP_STATUS.FORBIDDEN);
    }

    application.status = status;
    await application.save();

    const seeker = await User.findById(application.seeker);
    const snap = seeker?.appliedJobs.find(
      (j) => String(j.id) === String(application.jobId)
    );
    if (snap) {
      snap.status = application.status;
      await seeker.save();
    }

    sendStatusEmail({
      to: seeker?.email,
      name: seeker?.name,
      title: application.title,
      status: application.status,
    }).catch((err) => console.warn("Status email failed:", err.message));

    return success(res, { application, message: "Status updated" });
  } catch (err) {
    next(err);
  }
}
