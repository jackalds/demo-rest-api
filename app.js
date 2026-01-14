import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import { initDatabase } from "./database/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files from the public directory
app.use(express.static("public"));

// Routes
app.use("/users", userRoutes);
app.use("/events", eventRoutes);

// Basic route
app.get("/", (req, res) => {
	res.json({
		message: "REST API is running",
		endpoints: {
			signup: "POST /users/signup",
			login: "POST /users/login",
		},
	});
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	// Initialize database
	try {
		initDatabase();
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Failed to initialize database:", error.message);
		process.exit(1);
	}
});
