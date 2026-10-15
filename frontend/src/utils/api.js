export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SERVER_BASE = API_BASE.replace(/\/api\/?$/, "");

export const ROLES = {
  JOBSEEKER: "jobseeker",
  EMPLOYER: "employer",
  ADMIN: "admin",
};

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true" && !!getLoggedInUser();
}

export function getToken() {
  return isLoggedIn();
}

export function getLoggedInUser() {
  try {
    return JSON.parse(localStorage.getItem("loggedInUser") || "null");
  } catch {
    return null;
  }
}

export function getUserRole() {
  return getLoggedInUser()?.role || ROLES.JOBSEEKER;
}

export function homePathForRole(role) {
  if (role === ROLES.EMPLOYER) return "/employer/dashboard";
  if (role === ROLES.ADMIN) return "/admin/dashboard";
  return "/dashboard";
}

export function setAuth(user) {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.removeItem("token");
}

export function updateStoredUser(user) {
  if (user) setAuth(user);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");
}

export async function logout() {
  try {
    await api("/auth/logout", { method: "POST" });
  } catch {
    // still clear local session
  }
  clearAuth();
}

export function fileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SERVER_BASE}${path}`;
}

export function jobsFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.jobs)) return data.jobs;
  return [];
}

export async function api(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
