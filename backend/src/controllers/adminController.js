import User from "../models/userModel.js";
import PostedJob from "../models/postedJobModel.js";
import { success } from "../utils/response.js";

export async function getAdminStats(_req, res, next) {
  try {
    const [users, jobs, seekers, recruiters, admins] = await Promise.all([
      User.countDocuments(),
      PostedJob.countDocuments(),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "employer" }),
      User.countDocuments({ role: "admin" }),
    ]);

    return success(res, {
      stats: { users, jobs, seekers, recruiters, admins },
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
