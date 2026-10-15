import User from "../models/userModel.js";
import PostedJob from "../models/postedJobModel.js";
import Application from "../models/applicationModel.js";
import { success } from "../utils/response.js";

export async function getAdminStats(_req, res, next) {
  try {
    const [users, jobs, seekers, recruiters, admins, applications] =
      await Promise.all([
        User.countDocuments(),
        PostedJob.countDocuments(),
        User.countDocuments({ role: "jobseeker" }),
        User.countDocuments({ role: "employer" }),
        User.countDocuments({ role: "admin" }),
        Application.countDocuments(),
      ]);

    return success(res, {
      stats: { users, jobs, seekers, recruiters, admins, applications },
    });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(_req, res, next) {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(100);
    return success(res, {
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        companyName: u.companyName,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function getAdminReports(_req, res, next) {
  try {
    const [statsBlock, recentUsers, recentJobs, recentApps, byStatus] =
      await Promise.all([
        Promise.all([
          User.countDocuments(),
          User.countDocuments({ role: "jobseeker" }),
          User.countDocuments({ role: "employer" }),
          User.countDocuments({ role: "admin" }),
          PostedJob.countDocuments(),
          PostedJob.countDocuments({ status: "open" }),
          PostedJob.countDocuments({ status: "closed" }),
          Application.countDocuments(),
        ]),
        User.find().select("-password").sort({ createdAt: -1 }).limit(8),
        PostedJob.find().sort({ createdAt: -1 }).limit(8),
        Application.find()
          .populate("seeker", "name email")
          .sort({ appliedAt: -1 })
          .limit(8),
        Application.aggregate([
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
      ]);

    const [
      users,
      seekers,
      recruiters,
      admins,
      jobs,
      openJobs,
      closedJobs,
      applications,
    ] = statsBlock;

    const statusCounts = {
      applied: 0,
      under_review: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    };
    byStatus.forEach((row) => {
      if (row._id) statusCounts[row._id] = row.count;
    });

    return success(res, {
      stats: {
        users,
        seekers,
        recruiters,
        admins,
        jobs,
        openJobs,
        closedJobs,
        applications,
      },
      statusCounts,
      recentUsers: recentUsers.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
      recentJobs: recentJobs.map((j) => ({
        id: j._id,
        title: j.title,
        company: j.company,
        status: j.status || "open",
        createdAt: j.createdAt,
      })),
      recentApplications: recentApps.map((a) => ({
        id: a._id,
        title: a.title,
        seeker: a.seeker?.name || "Applicant",
        status: a.status,
        appliedAt: a.appliedAt,
      })),
    });
  } catch (err) {
    next(err);
  }
}
