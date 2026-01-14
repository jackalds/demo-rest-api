// Event routes
import express from "express";
import * as events from "../controllers/events-controller.js";
import { authenticateToken } from "../util/auth.js";
import { upload } from "../util/upload.js";

const router = express.Router();

// Create a new event
router.post("/", authenticateToken, upload.single("image"), events.create);

// Update an event by id
router.put("/:id", authenticateToken, upload.single("image"), events.edit);

// Delete an event by id
router.delete("/:id", authenticateToken, events.deleteItem);

// Get all events
router.get("/", events.getAll);

// Get a single event by id
router.get("/:id", events.getSingle);

// Register for an event
router.post("/:id/register", authenticateToken, events.register);

// Unregister from an event
router.delete("/:id/unregister", authenticateToken, events.unregister);

export default router;
