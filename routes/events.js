// Event routes
import express from "express";
import * as events from "../controllers/events-controller.js";
import { authenticateToken } from "../util/auth.js";

const router = express.Router();

// POST /events - Create a new event
router.post("/", authenticateToken, events.create);

// PUT /events/:id - Update an event by id
router.put("/:id", authenticateToken, events.edit);

// DELETE /events/:id - Delete an event by id
router.delete("/:id", authenticateToken, events.deleteItem);

// GET /events - Get all events
router.get("/", events.getAll);

// GET /events/:id - Get a single event by id
router.get("/:id", events.getSingle);

export default router;
