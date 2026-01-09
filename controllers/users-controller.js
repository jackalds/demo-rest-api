// Users controller
// Links routes and model together

import { validateSignup, validateLogin, createUser, findUserByEmail, comparePassword, verifyUserCredentials } from "../models/user.js";
import { generateToken } from "../util/auth.js";

// Handle user signup
export async function signup(req, res) {
	try {
		const { email, password, name } = req.body;

		// Validate user data
		const validation = validateSignup({ email, password, name });

		if (!validation.isValid) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: validation.errors,
			});
		}

		// Create user in database
		const user = await createUser({ email, password, name });

		// Generate JWT token
		const token = generateToken({ id: user.id, email: user.email });

		// Return success response (user already doesn't have password)
		res.status(201).json({
			success: true,
			message: "User registered successfully",
			user: user,
			token: token,
		});
	} catch (error) {
		// Handle duplicate email error
		if (error.message === "Email already exists") {
			return res.status(409).json({
				success: false,
				message: "Email already exists",
			});
		}

		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}

// Handle user login
export async function login(req, res) {
	try {
		const { email, password } = req.body;

		// Validate user data
		const validation = validateLogin({ email, password });

		if (!validation.isValid) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: validation.errors,
			});
		}

		// Use verifyUserCredentials instead of manual lookup & check
		const result = await verifyUserCredentials(email, password);

		if (!result.success) {
			return res.status(401).json({
				success: false,
				message: result.message || "Invalid email or password",
			});
		}

		// Generate JWT token
		const token = generateToken({ id: result.user.id, email: result.user.email });

		// Return success response (user should not have password)
		res.status(200).json({
			success: true,
			message: "Login successful",
			user: result.user,
			token: token,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}
