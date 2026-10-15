import { HTTP_STATUS, MESSAGES } from "../constants.js";
import { fail } from "../utils/response.js";

export function notFound(_req, res) {
  return fail(res, MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);
  return fail(
    res,
    err.message || "Internal server error",
    err.status || HTTP_STATUS.SERVER_ERROR
  );
}
