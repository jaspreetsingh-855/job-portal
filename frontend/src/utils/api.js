const API_BASE = "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setAuth(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("loggedInUser");
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
