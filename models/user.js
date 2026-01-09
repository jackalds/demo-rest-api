// User model (without classes)
// This model handles user data validation and operations

import { db } from "../database/db.js";
import bcrypt from "bcryptjs";

// Validate user registration data
export function validateSignup(userData) {
	const { email, password, name } = userData;
	const errors = [];

	// Improved email format validation using regex
	const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;

	// Check email: must be string, not empty/blank, and valid format
	if (!email || typeof email !== "string" || email.trim().length === 0 || !emailRegex.test(email.trim())) {
		errors.push("Valid email is required");
	} else {
		const normalizedEmail = email.toLowerCase().trim();
		const emailTaken = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail);
		if (emailTaken) {
			errors.push("Email is already in use");
		}
	}

	// Check password: must be string and not empty/blank
	if (!password || typeof password !== "string" || password.trim().length === 0 || password.length < 6) {
		if (!password || typeof password !== "string" || password.trim().length === 0) {
			errors.push("Password must not be empty");
		} else if (password.length < 6) {
			errors.push("Password must be at least 6 characters long");
		}
	}

	// Name validation (unchanged)
	if (!name || typeof name !== "string" || name.trim().length === 0) {
		errors.push("Name is required");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

// Validate user login data
export function validateLogin(userData) {
	const { email, password } = userData;
	const errors = [];

	if (!email || typeof email !== "string" || email.trim().length === 0) {
		errors.push("Email is required");
	}

	if (!password || typeof password !== "string" || password.trim().length === 0) {
		errors.push("Password is required");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

// Create a user in the database
export async function createUser(userData) {
	const { email, password, name } = userData;

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Insert user into database
	const stmt = db.prepare("INSERT INTO users (email, name, password) VALUES (?, ?, ?)");

	const normalizedEmail = email.toLowerCase().trim();
	const normalizedName = name.trim();

	try {
		const result = stmt.run(normalizedEmail, normalizedName, hashedPassword);

		// Return the created user (without password)
		return {
			id: result.lastInsertRowid,
			email: normalizedEmail,
			name: normalizedName,
			createdAt: new Date().toISOString(),
		};
	} catch (error) {
		// Handle unique constraint violation (duplicate email)
		if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
			throw new Error("Email already exists");
		}
		throw error;
	}
}

export async function verifyUserCredentials(email, plainPassword) {
	const user = findUserByEmail(email);

	if (!user) {
		return { success: false, message: "User not found" };
	}

	const passwordMatch = await comparePassword(plainPassword, user.password);

	if (!passwordMatch) {
		return { success: false, message: "Invalid credentials" };
	}

	// Exclude password from returned user object
	const { password, ...userWithoutPassword } = user;

	return { success: true, user: userWithoutPassword };
}

// Find user by email
export function findUserByEmail(email) {
	const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
	const user = stmt.get(email.toLowerCase().trim());

	if (!user) {
		return null;
	}

	// Return user object with camelCase properties
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		password: user.password,
		createdAt: user.created_at,
	};
}

// Compare password with hashed password
export async function comparePassword(plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword);
}
