# Demo REST API

A simple RESTful API built with Express.js that supports both user authentication and event management. The API demonstrates secure JWT-based user login/registration as well as basic CRUD operations for events in a SQLite database.

## Features

-   ✅ **User registration (signup)**
-   ✅ **User login and JWT authentication**
-   ✅ **Password hashing with bcrypt**
-   ✅ **Event creation, update, deletion, and listing**
-   ✅ **Event image upload support**
-   ✅ **Event registration/unregistration system**
-   ✅ **Event ownership and authorization**
-   ✅ **Input validation for users and events**
-   ✅ **SQLite (better-sqlite3) database persistence**
-   ✅ **RESTful API structure**
-   ✅ **CORS support**

## Tech Stack

-   **Node.js** - JavaScript runtime
-   **Express.js** - Web framework
-   **SQLite** (better-sqlite3) - Lightweight database
-   **jsonwebtoken** - JWT token generation & verification
-   **bcryptjs** - Secure password hashing
-   **multer** - File upload handling
-   **cors** - Cross-Origin Resource Sharing
-   **nodemon** - Auto-reloading development server

## Prerequisites

-   Node.js v14 or higher
-   npm (comes with Node.js)

## Installation

1. Clone this repository and enter the project directory:

    ```bash
    git clone https://github.com/yourusername/demo-rest-api.git
    cd demo-rest-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

You can configure the API using environment variables by creating a `.env` file in the project root:

```env
PORT=3000
JWT_SECRET=your-strong-secret
```

-   `PORT`: Server port (default: 3000)
-   `JWT_SECRET`: Secret for JWT signing (default: "abctesttoken"; **change for production!**)

## Running the Application

### Development

```bash
npm run dev
```

Starts the server with auto-reload (nodemon).

### Production

```bash
node app.js
```

Starts the API in production mode.

The server runs at `http://localhost:3000` (or as specified by the `PORT` variable).

---

## API Endpoints

> **Note:** Most event endpoints require authentication via the `Authorization: Bearer <token>` header.

### 1. Health Check

**GET** `/`

Returns API status and available endpoints.

<details>
<summary>Response Example</summary>

```json
{
	"message": "REST API is running",
	"endpoints": {
		"signup": "POST /users/signup",
		"login": "POST /users/login"
	}
}
```

</details>

---

### 2. User Signup

**POST** `/users/signup`

Register a new user.

**Request:**

```json
{
	"email": "user@example.com",
	"password": "password123",
	"name": "John Doe"
}
```

**Validation:**

-   `email`: required, valid unique email
-   `password`: required, min. 6 chars
-   `name`: required, not empty

<details>
<summary>Success (201)</summary>

```json
{
	"success": true,
	"message": "User registered successfully",
	"user": {
		"id": 1,
		"email": "user@example.com",
		"name": "John Doe",
		"createdAt": "2024-01-01T00:00:00.000Z"
	},
	"token": "<jwt token>"
}
```

</details>

<details>
<summary>Error: Validation (400)</summary>

```json
{
	"success": false,
	"message": "Validation failed",
	"errors": ["Valid email is required", "Password must be at least 6 characters long"]
}
```

</details>

<details>
<summary>Error: Conflict (409)</summary>

```json
{
	"success": false,
	"message": "Email already exists"
}
```

</details>

---

### 3. User Login

**POST** `/users/login`

Authenticate and receive a JWT.

**Request:**

```json
{
	"email": "user@example.com",
	"password": "password123"
}
```

**Response:**

```json
{
	"success": true,
	"message": "Login successful",
	"user": {
		"id": 1,
		"email": "user@example.com",
		"name": "John Doe",
		"createdAt": "2024-01-01T00:00:00.000Z"
	},
	"token": "<jwt token>"
}
```

**Error:**

-   400 (validation)
-   401 (invalid credentials)

---

### 4. Event Management

All event write operations require a valid `Authorization` header. Only the event owner can edit or delete their events.

#### a. List Events

**GET** `/events`

_Returns all events (publicly accessible)._

<details>
<summary>Response Example</summary>

```json
{
	"success": true,
	"message": "Events retrieved successfully",
	"events": [
		{
			"id": 1,
			"title": "My Event",
			"description": "Description goes here",
			"date": "2024-12-01T14:00:00Z",
			"location": "Conference Room",
			"image": "1234567890-image.jpg",
			"user_id": 1,
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

</details>

#### b. Get Single Event

**GET** `/events/:id`

_Returns a single event by ID (public)._

<details>
<summary>Response Example</summary>

```json
{
	"success": true,
	"message": "Event retrieved successfully",
	"event": {
		"id": 1,
		"title": "My Event",
		"description": "Description goes here",
		"date": "2024-12-01T14:00:00Z",
		"location": "Conference Room",
		"image": "1234567890-image.jpg",
		"user_id": 1,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

</details>

#### c. Create Event

**POST** `/events`  
_Requires: Authorization: Bearer `<jwt>`_

**Request Body (multipart/form-data):**

-   `title` (required): Event title
-   `description` (optional): Event description
-   `date` (required): Event date (ISO 8601 format)
-   `location` (optional): Event location
-   `image` (optional): Image file to upload

**Note:** This endpoint accepts `multipart/form-data` for file uploads. You can also send JSON without an image.

**Validation:**

-   `title`: required, non-empty, trimmed, not only spaces
-   `date`: required, valid date
-   `description`, `location`: optional, must be strings if provided
-   `image`: optional, string (filename) if provided

<details>
<summary>Success (201)</summary>

```json
{
	"success": true,
	"message": "Event created successfully",
	"event": {
		"id": 1,
		"title": "My Event",
		"description": "Description goes here",
		"date": "2024-12-01T14:00:00Z",
		"location": "Conference Room",
		"image": "1234567890-image.jpg",
		"user_id": 1,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

</details>

<details>
<summary>Error: Unauthorized (401)</summary>

```json
{
	"message": "Unauthorized"
}
```

</details>

#### d. Edit Event

**PUT** `/events/:id`  
_Requires: Authorization_

**Request Body (multipart/form-data):**

Same as create event. Only the event owner can edit their events.

<details>
<summary>Success (200)</summary>

```json
{
	"success": true,
	"message": "Event updated successfully",
	"event": {
		"id": 1,
		"title": "Updated Event",
		"description": "Updated description",
		"date": "2024-12-01T14:00:00Z",
		"location": "New Location",
		"image": "1234567890-new-image.jpg",
		"user_id": 1,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-02T00:00:00.000Z"
	}
}
```

</details>

<details>
<summary>Error: Forbidden (403)</summary>

```json
{
	"success": false,
	"message": "You are not authorized to edit this event"
}
```

</details>

#### e. Delete Event

**DELETE** `/events/:id`  
_Requires: Authorization_

Only the event owner can delete their events.

<details>
<summary>Success (200)</summary>

```json
{
	"success": true,
	"message": "Event deleted successfully"
}
```

</details>

<details>
<summary>Error: Forbidden (403)</summary>

```json
{
	"success": false,
	"message": "You are not authorized to delete this event"
}
```

</details>

#### f. Register for Event

**POST** `/events/:id/register`  
_Requires: Authorization: Bearer `<jwt>`_

Register the authenticated user for an event.

<details>
<summary>Success (200)</summary>

```json
{
	"success": true,
	"message": "Registered for event successfully"
}
```

</details>

<details>
<summary>Error: Not Found (404)</summary>

```json
{
	"success": false,
	"message": "Event not found"
}
```

</details>

#### g. Unregister from Event

**DELETE** `/events/:id/unregister`  
_Requires: Authorization: Bearer `<jwt>`_

Unregister the authenticated user from an event.

<details>
<summary>Success (200)</summary>

```json
{
	"success": true,
	"message": "Unregistered from event successfully"
}
```

</details>

<details>
<summary>Error: Not Found (404)</summary>

```json
{
	"success": false,
	"message": "Event not found"
}
```

</details>

---

## Authentication

For all protected endpoints, add the JWT token from signup/login to requests:

```
Authorization: Bearer <your-token-here>
```

---

## Usage Examples

### Using cURL

**Signup:**

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
```

**Login:**

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Create Event (with image):**

```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer <your-token>" \
  -F "title=Sample Event" \
  -F "date=2024-12-01" \
  -F "description=Event description" \
  -F "location=Conference Room" \
  -F "image=@/path/to/image.jpg"
```

**Create Event (without image, JSON):**

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"Sample Event","date":"2024-12-01","description":"...","location":"Room 101"}'
```

**Register for Event:**

```bash
curl -X POST http://localhost:3000/events/1/register \
  -H "Authorization: Bearer <your-token>"
```

**Unregister from Event:**

```bash
curl -X DELETE http://localhost:3000/events/1/unregister \
  -H "Authorization: Bearer <your-token>"
```

**Get Events:**

```bash
curl http://localhost:3000/events
```

### Using JavaScript (Fetch API)

**Create Event (with image):**

```javascript
// Signup or Login first to obtain token, then:

const formData = new FormData();
formData.append("title", "My Event");
formData.append("date", "2024-12-01");
formData.append("description", "Optional description");
formData.append("location", "Room 101");
formData.append("image", fileInput.files[0]); // File from input element

fetch("http://localhost:3000/events", {
	method: "POST",
	headers: {
		Authorization: "Bearer <your-token>",
		// Don't set Content-Type header - browser will set it with boundary
	},
	body: formData,
})
	.then((res) => res.json())
	.then(console.log);
```

**Create Event (without image, JSON):**

```javascript
fetch("http://localhost:3000/events", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer <your-token>",
	},
	body: JSON.stringify({
		title: "My Event",
		date: "2024-12-01",
		description: "Optional description",
		location: "Room 101",
	}),
})
	.then((res) => res.json())
	.then(console.log);
```

**Register for Event:**

```javascript
fetch("http://localhost:3000/events/1/register", {
	method: "POST",
	headers: {
		Authorization: "Bearer <your-token>",
	},
})
	.then((res) => res.json())
	.then(console.log);
```

**Unregister from Event:**

```javascript
fetch("http://localhost:3000/events/1/unregister", {
	method: "DELETE",
	headers: {
		Authorization: "Bearer <your-token>",
	},
})
	.then((res) => res.json())
	.then(console.log);
```

---

## Project Structure

```
demo-rest-api/
├── app.js                 # Application entry point
├── package.json           # Project dependencies and scripts
├── database.sqlite        # SQLite DB (created automatically)
├── public/
│   └── images/            # Uploaded event images (created automatically)
├── controllers/
│   ├── users-controller.js
│   └── events-controller.js
├── models/
│   ├── user.js
│   └── event.js
├── routes/
│   ├── users.js
│   └── events.js
├── database/
│   └── db.js              # Database connection and initialization
└── util/
    ├── auth.js            # JWT token utilities
    └── upload.js          # Multer file upload configuration
```

## Database Schema

### Users Table

| Column     | Type     | Constraints                |
| ---------- | -------- | -------------------------- |
| id         | INTEGER  | PRIMARY KEY, AUTOINCREMENT |
| email      | TEXT     | UNIQUE, NOT NULL           |
| name       | TEXT     | NOT NULL                   |
| password   | TEXT     | NOT NULL (hashed)          |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP  |

### Events Table

| Column      | Type     | Constraints                |
| ----------- | -------- | -------------------------- |
| id          | INTEGER  | PRIMARY KEY, AUTOINCREMENT |
| title       | TEXT     | NOT NULL                   |
| description | TEXT     |                            |
| date        | TEXT     | NOT NULL                   |
| location    | TEXT     |                            |
| image       | TEXT     |                            |
| user_id     | INTEGER  | NOT NULL, FOREIGN KEY      |
| created_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP  |
| updated_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP  |

### Registrations Table

| Column   | Type    | Constraints                |
| -------- | ------- | -------------------------- |
| id       | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| event_id | INTEGER | NOT NULL, FOREIGN KEY      |
| user_id  | INTEGER | NOT NULL, FOREIGN KEY      |

---

## Security Features

-   **bcrypt password hashing**
-   **JWT token-based authentication**
-   **Server-side input validation (users/events)**
-   **Unique user email constraint**
-   **Passwords are never exposed in API responses**
-   **Event ownership authorization** (only owners can edit/delete their events)
-   **File upload validation** (images stored securely in public/images directory)

## Development

-   `npm run dev` — Start development server with nodemon

**Note:**

-   Database initializes on first server start. SQLite file: `database.sqlite`.
-   Uploaded images are stored in `public/images/` directory (created automatically).
-   Make sure the `public/images/` directory exists or has write permissions.

---

## Additional Notes

-   JWT tokens expire after **24 hours** by default
-   Use a **secure, unique JWT secret** for production environments
-   Passwords must be at least **6 characters**
-   Emails are lowercased and trimmed
-   Event images are uploaded to `public/images/` with timestamped filenames
-   Only event owners can edit or delete their events
-   Users can register/unregister for any event (requires authentication)
-   Event creation automatically associates the event with the authenticated user

## Author

Paul Ferreira

## License

ISC
