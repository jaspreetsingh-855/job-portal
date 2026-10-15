import jwt from "jsonwebtoken";
import { fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";
import User from "../models/userModel.js";

function readToken(req) {
  if (req.cookies?.token) return req.cookies.token;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.split(" ")[1];
  return null;
}

export async function protect(req, res, next) {
  const token = readToken(req);
  if (!token) {
    return fail(res, "Not authorized. Please login.", HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jobportal-dev-secret"
    );
    req.userId = decoded.id;
    req.userRole = decoded.role;

    if (!req.userRole) {
      const user = await User.findById(decoded.id).select("role");
      req.userRole = user?.role || "jobseeker";
    }

    next();
  } catch {
    return fail(
      res,
      "Invalid or expired token. Please login again.",
      HTTP_STATUS.UNAUTHORIZED
    );
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return fail(
        res,
        "You do not have permission for this action.",
        HTTP_STATUS.FORBIDDEN
      );
    }
    next();
  };
}
