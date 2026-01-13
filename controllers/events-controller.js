// Events controller
// Links routes and model together

import { validateEvent, createEvent, updateEvent, getEventById, deleteEvent, getAllEvents } from "../models/event.js";

// Handle event creation
export function create(req, res) {
	try {
		const { title, description, date, location } = req.body;

		// Validate event data
		const validation = validateEvent({ title, description, date, location });

		if (!validation.isValid) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: validation.errors,
			});
		}

		// Create event in database
		const event = createEvent({ title, description, date, location, user_id: req.user.id });

		res.status(201).json({
			success: true,
			message: "Event created successfully",
			event: event,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}

// Handle event update
export function edit(req, res) {
	try {
		const { id } = req.params;
		const { title, description, date, location } = req.body;

		// Check if event exists
		const existingEvent = getEventById(id);

		if (!existingEvent) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Check if the authenticated user is the owner of the event
		if (!req.user || !existingEvent.user_id || Number(existingEvent.user_id) !== Number(req.user.id)) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to edit this event",
			});
		}

		// Validate update data (merge with existing data for validation)
		const updateData = { title, description, date, location };
		const validation = validateEvent({ ...existingEvent, ...updateData });

		if (!validation.isValid) {
			return res.status(400).json({
				success: false,
				message: "Validation failed",
				errors: validation.errors,
			});
		}

		// Update event in database
		const updatedEvent = updateEvent(id, updateData);

		res.status(200).json({
			success: true,
			message: "Event updated successfully",
			event: updatedEvent,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}

// Handle event deletion
export function deleteItem(req, res) {
	try {
		const { id } = req.params;

		// Check if event exists
		const existingEvent = getEventById(id);

		if (!existingEvent) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		// Check if the authenticated user is the owner of the event
		if (!req.user || !existingEvent.user_id || Number(existingEvent.user_id) !== Number(req.user.id)) {
			return res.status(403).json({
				success: false,
				message: "You are not authorized to delete this event",
			});
		}

		// Delete event from database
		const deleted = deleteEvent(id);

		if (!deleted) {
			return res.status(500).json({
				success: false,
				message: "Failed to delete event",
			});
		}

		res.status(200).json({
			success: true,
			message: "Event deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}

// Handle getting all events
export function getAll(req, res) {
	try {
		const events = getAllEvents();

		res.status(200).json({
			success: true,
			message: "Events retrieved successfully",
			events: events,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}

// Handle getting event by id
export function getSingle(req, res) {
	try {
		const { id } = req.params;

		const event = getEventById(id);

		if (!event) {
			return res.status(404).json({
				success: false,
				message: "Event not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Event retrieved successfully",
			event: event,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
}
