// Event routes
import express from "express";
import * as events from "../controllers/events-controller.js";
import { authenticateToken } from "../util/auth.js";

const router = express.Router();

// Create a new event
router.post("/", authenticateToken, events.create);

// Update an event by id
router.put("/:id", authenticateToken, events.edit);

// Delete an event by id
router.delete("/:id", authenticateToken, events.deleteItem);

// Get all events
router.get("/", events.getAll);

// Get a single event by id
router.get("/:id", events.getSingle);

router.post("/:id/register", authenticateToken, events.register);

router.delete("/:id/unregister", authenticateToken, events.unregister);

export default router;
