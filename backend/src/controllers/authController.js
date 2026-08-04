import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { success, fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";

function createToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "jobportal-dev-secret",
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return fail(res, "Name, email and password are required.", HTTP_STATUS.BAD_REQUEST);
    }

    if (password.length < 6) {
      return fail(res, "Password must be at least 6 characters.", HTTP_STATUS.BAD_REQUEST);
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
    });

    const token = createToken(user._id);
    return success(
      res,
      { token, user: publicUser(user) },
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
      return fail(res, "Email and password are required.", HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return fail(res, "Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return fail(res, "Invalid email or password.", HTTP_STATUS.UNAUTHORIZED);
    }

    const token = createToken(user._id);
    return success(res, { token, user: publicUser(user) });
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
    return success(res, { user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}
