import { Navigate } from "react-router-dom";

// Decodes just the JWT payload (no signature check — verifying the
// signature is the server's job, this is purely a client-side head start)
// to read the "exp" claim, so an expired token gets caught immediately on
// page load instead of waiting for the first API call to fail with a
// 401. A malformed/unreadable token is treated the same as an expired
// one — better to bounce to login than try to render a dashboard page
// with no real session behind it.
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;