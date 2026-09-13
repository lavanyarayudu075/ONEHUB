const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Every authenticated request needs the same shape: JSON body, JSON
// response, and the token attached as a Bearer header. This wraps fetch
// once so every page/context calls the same thing instead of repeating
// header/error-handling boilerplate everywhere. Reads the token from the
// same localStorage key ProtectedRoute already checks.
async function apiRequest(path, { method = "GET", body, headers } = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // The backend always responds with JSON (even on errors), but guard
  // against a non-JSON response (e.g. the server being down entirely)
  // instead of throwing an unrelated "Unexpected token" parse error.
  const data = await response.json().catch(() => ({}));

  // A 401 on a request that actually sent a token means the session
  // itself is no longer valid (expired or the token was tampered with),
  // not a wrong-password-style rejection — login/register never send a
  // token, so this never fires for a normal failed login attempt.
  // Instead of leaving every page on-screen stuck showing a raw
  // "Couldn't load members from the server" banner forever, clear the
  // stale session and bounce back to the login screen.
  if (response.status === 401 && token) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = "/login";
    }

    throw new Error(data.message || "Your session has expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, body) => apiRequest(path, { method: "POST", body }),
  put: (path, body) => apiRequest(path, { method: "PUT", body }),
  delete: (path) => apiRequest(path, { method: "DELETE" }),
};