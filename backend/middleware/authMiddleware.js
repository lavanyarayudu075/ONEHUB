const jwt = require("jsonwebtoken");

// Verifies the JWT issued at login and attaches the decoded payload
// (userId, organizationId, role) to req.user, so every controller below
// can scope its queries to the right organisation without ever trusting
// an organisation id the client might send in the request body.
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      organizationId: decoded.organizationId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = authMiddleware;