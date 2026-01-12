import jwt from "jsonwebtoken";

// JWT secret key - use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || "abctesttoken";

/**
 * Generates a JWT token for a user
 * @param {Object} user - User object containing id and email
 * @param {number|string} user.id - User ID
 * @param {string} user.email - User email
 * @param {string} expiresIn - Token expiration time (default: "24h")
 * @returns {string} JWT token
 */
export function generateToken(user, expiresIn = "24h") {
	if (!user.id || !user.email) {
		throw new Error("User must have id and email to generate token");
	}

	const payload = {
		id: user.id,
		email: user.email,
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: expiresIn,
	});
}

/**
 * Verifies and decodes a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload containing id and email
 * @throws {Error} If token is invalid or expired
 */
export function verifyToken(token) {
	const decoded = jwt.verify(token, JWT_SECRET);
	return decoded;
}

export function authenticateToken(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	const decoded = verifyToken(token);
	req.user = decoded;
	next();
}
