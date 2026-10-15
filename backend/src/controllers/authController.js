import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { ROLES } from "../models/userModel.js";
import { success, fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "jobportal-dev-secret",
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role || ROLES.JOBSEEKER,
    companyName: user.companyName || "",
    location: user.location || "",
    experience: user.experience || "",
    bio: user.bio || "",
    skills: user.skills || [],
    resumeUrl: user.resumeUrl || "",
  };
}

function passwordOk(password) {
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@#$%^&*!?\-_+=.,;:'"<>()[\]{}|\\/~`]/.test(password);
  return password.length >= 8 && hasNumber && hasSpecial;
}

export function homePathForRole(role) {
  if (role === ROLES.EMPLOYER) return "/employer/dashboard";
  if (role === ROLES.ADMIN) return "/admin/dashboard";
  return "/dashboard";
}

function normalizeRole(role) {
  if (role === "recruiter" || role === ROLES.EMPLOYER) return ROLES.EMPLOYER;
  if (role === ROLES.ADMIN) return ROLES.ADMIN;
  return ROLES.JOBSEEKER;
}

export async function signup(req, res, next) {
  try {
    const { name, email, password, role, companyName, phone } = req.body;
    if (!name || !email || !password) {
      return fail(
        res,
        "Name, email and password are required.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    if (!passwordOk(password)) {
      return fail(
        res,
        "Password must be at least 8 characters and include a number and a special character (@, #, etc.).",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const selectedRole = normalizeRole(role);

    if (selectedRole === ROLES.EMPLOYER && !companyName?.trim()) {
      return fail(
        res,
        "Company name is required for recruiter accounts.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return fail(res, "Email already registered.", HTTP_STATUS.BAD_REQUEST);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone: phone?.trim() || "",
      role: selectedRole,
      companyName:
        selectedRole === ROLES.EMPLOYER ? companyName.trim() : "",
    });

    const token = createToken(user);
    setAuthCookie(res, token);
    return success(
      res,
      {
        user: publicUser(user),
        redirectTo: homePathForRole(user.role),
      },
      HTTP_STATUS.CREATED
    );
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return fail(
        res,
        "Email and password are required.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return fail(res, "Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return fail(res, "Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.role) {
      user.role = ROLES.JOBSEEKER;
      await user.save();
    }

    const token = createToken(user);
    setAuthCookie(res, token);
    return success(res, {
      user: publicUser(user),
      redirectTo: homePathForRole(user.role),
    });
  } catch (err) {
    next(err);
  }
}

export function logout(_req, res) {
  clearAuthCookie(res);
  return success(res, { message: "Logged out" });
}

export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    const { name, phone, location, experience, bio, skills, companyName } =
      req.body;
    if (name !== undefined) user.name = String(name).trim();
    if (phone !== undefined) user.phone = String(phone).trim();
    if (location !== undefined) user.location = String(location).trim();
    if (experience !== undefined) user.experience = String(experience).trim();
    if (bio !== undefined) user.bio = String(bio).trim();
    if (companyName !== undefined && user.role === ROLES.EMPLOYER) {
      user.companyName = String(companyName).trim();
    }
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills.map((s) => String(s).trim()).filter(Boolean)
        : String(skills)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    await user.save();
    return success(res, { user: publicUser(user), message: "Profile saved" });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return fail(
        res,
        "Current and new password are required.",
        HTTP_STATUS.BAD_REQUEST
      );
    }
    if (!passwordOk(newPassword)) {
      return fail(
        res,
        "Password must be at least 8 characters and include a number and a special character (@, #, etc.).",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return fail(res, "Current password is incorrect.", HTTP_STATUS.UNAUTHORIZED);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return success(res, { message: "Password updated" });
  } catch (err) {
    next(err);
  }
}

export async function saveResume(req, res, next) {
  try {
    if (!req.file) {
      return fail(res, "Resume file is required.", HTTP_STATUS.BAD_REQUEST);
    }
    const user = await User.findById(req.userId);
    if (!user) return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);
    user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    await user.save();
    return success(res, {
      user: publicUser(user),
      message: "Resume uploaded",
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return fail(res, "User not found.", HTTP_STATUS.NOT_FOUND);
    }
    return success(res, {
      user: publicUser(user),
      redirectTo: homePathForRole(user.role),
    });
  } catch (err) {
    next(err);
  }
}
