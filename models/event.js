// Event model (without classes)
// This model handles event data validation and operations

import { db } from "../database/db.js";

// Validate event data
export function validateEvent(eventData) {
	const { title, description, date, location } = eventData;
	const errors = [];

	if (
		!title ||
		typeof title !== "string" ||
		title.trim().length === 0
	) {
		errors.push("Title is required");
	} else if (title.trim().length !== title.length) {
		errors.push("Title cannot have leading or trailing spaces");
	} else if (/^\s*$/.test(title)) {
		errors.push("Title cannot be only empty spaces");
	}

	if (description !== undefined) {
		if (typeof description !== "string") {
			errors.push("Description must be a string");
		} else if (description.trim().length === 0 && description.length > 0) {
			errors.push("Description cannot be only empty spaces");
		} else if (description && description.trim().length !== description.length) {
			errors.push("Description cannot have leading or trailing spaces");
		}
	}

	if (!date || typeof date !== "string" || date.trim().length === 0) {
		errors.push("Date is required");
	} else {
		// Basic date validation
		const dateObj = new Date(date);
		if (isNaN(dateObj.getTime())) {
			errors.push("Date must be a valid date");
		}
	}

	if (location !== undefined) {
		if (typeof location !== "string") {
			errors.push("Location must be a string");
		} else if (location.trim().length === 0 && location.length > 0) {
			errors.push("Location cannot be only empty spaces");
		} else if (location && location.trim().length !== location.length) {
			errors.push("Location cannot have leading or trailing spaces");
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

// Create an event in the database
export function createEvent(eventData) {
	const { title, description, date, location } = eventData;

	// Insert event into database
	const stmt = db.prepare("INSERT INTO events (title, description, date, location) VALUES (?, ?, ?, ?)");

	const normalizedTitle = title.trim();
	const normalizedDescription = description ? description.trim() : null;
	const normalizedDate = date.trim();
	const normalizedLocation = location ? location.trim() : null;

	try {
		const result = stmt.run(normalizedTitle, normalizedDescription, normalizedDate, normalizedLocation);

		// Return the created event
		return {
			id: result.lastInsertRowid,
			title: normalizedTitle,
			description: normalizedDescription,
			date: normalizedDate,
			location: normalizedLocation,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	} catch (error) {
		throw error;
	}
}

// Update an event in the database
export function updateEvent(id, updateData) {
	const { title, description, date, location } = updateData;

	// Build update query dynamically based on provided fields
	const updates = [];
	const values = [];

	if (title !== undefined) {
		updates.push("title = ?");
		values.push(title.trim());
	}
	if (description !== undefined) {
		updates.push("description = ?");
		values.push(description ? description.trim() : null);
	}
	if (date !== undefined) {
		updates.push("date = ?");
		values.push(date.trim());
	}
	if (location !== undefined) {
		updates.push("location = ?");
		values.push(location ? location.trim() : null);
	}

	if (updates.length === 0) {
		// No fields to update, return existing event
		return getEventById(id);
	}

	// Always update the updated_at timestamp
	updates.push("updated_at = ?");
	values.push(new Date().toISOString());
	values.push(id); // Add id for WHERE clause

	const stmt = db.prepare(`UPDATE events SET ${updates.join(", ")} WHERE id = ?`);

	try {
		stmt.run(...values);

		// Return the updated event
		return getEventById(id);
	} catch (error) {
		throw error;
	}
}

// Find event by id
export function getEventById(id) {
	const stmt = db.prepare("SELECT * FROM events WHERE id = ?");
	const event = stmt.get(id);

	if (!event) {
		return null;
	}

	// Return event object with camelCase properties
	return {
		id: event.id,
		title: event.title,
		description: event.description,
		date: event.date,
		location: event.location,
		createdAt: event.created_at,
		updatedAt: event.updated_at,
	};
}

// Get all events
export function getAllEvents() {
	const stmt = db.prepare("SELECT * FROM events");
	const events = stmt.all();
	return events.map((event) => ({
		id: event.id,
		title: event.title,
		description: event.description,
		date: event.date,
		location: event.location,
		createdAt: event.created_at,
		updatedAt: event.updated_at,
	}));
}

// Delete event by id
export function deleteEvent(id) {
	const stmt = db.prepare("DELETE FROM events WHERE id = ?");

	try {
		const result = stmt.run(id);
		return result.changes > 0;
	} catch (error) {
		throw error;
	}
}
