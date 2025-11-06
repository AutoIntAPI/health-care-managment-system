const jwt = require("jsonwebtoken");

const JWT_SECRET =
	process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

class AuthMiddleware {
	verifyToken(req, res, next) {
		try {
			const authHeader = req.headers.authorization;

			if (!authHeader || !authHeader.startsWith("Bearer ")) {
				return res.status(401).json({ error: "No token provided" });
			}

			const token = authHeader.substring(7);

			jwt.verify(token, JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json({ error: "Invalid or expired token" });
				}

				req.user = decoded;
				next();
			});
		} catch (error) {
			console.error("Token verification error:", error);
			res.status(401).json({ error: "Authentication failed" });
		}
	}

	checkRole(...allowedRoles) {
		return (req, res, next) => {
			if (!req.user) {
				return res.status(401).json({ error: "Not authenticated" });
			}

			if (!allowedRoles.includes(req.user.role)) {
				return res.status(403).json({ error: "Insufficient permissions" });
			}

			next();
		};
	}
}

module.exports = new AuthMiddleware();
