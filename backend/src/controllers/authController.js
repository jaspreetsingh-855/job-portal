import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { ROLES } from "../models/userModel.js";
import { success, fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";

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
  };
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
 console.log(req.body);
    if (!name || !email || !password) {
      return fail(
        res,
        "Name, email and password are required.",
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@#$%^&*!?\-_+=.,;:'"<>()[\]{}|\\/~`]/.test(password);
    if (password.length < 8 || !hasNumber || !hasSpecial) {
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
    return success(
      res,
      {
        token,
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
    return success(res, {
      token,
      user: publicUser(user),
      redirectTo: homePathForRole(user.role),
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
