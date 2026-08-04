import jwt from "jsonwebtoken";
import { fail } from "../utils/response.js";
import { HTTP_STATUS } from "../constants.js";

export function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return fail(res, "Not authorized. Please login.", HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "jobportal-dev-secret");
    req.userId = decoded.id;
    next();
  } catch {
    return fail(res, "Invalid or expired token. Please login again.", HTTP_STATUS.UNAUTHORIZED);
  }
}
