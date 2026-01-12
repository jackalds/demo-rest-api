# Demo REST API

A simple RESTful API built with Express.js that supports both user authentication and event management. The API demonstrates secure JWT-based user login/registration as well as basic CRUD operations for events in a SQLite database.

## Features

-   ✅ **User registration (signup)**
-   ✅ **User login and JWT authentication**
-   ✅ **Password hashing with bcrypt**
-   ✅ **Event creation, update, deletion, and listing**
-   ✅ **Input validation for users and events**
-   ✅ **SQLite (better-sqlite3) database persistence**
-   ✅ **RESTful API structure**

## Tech Stack

-   **Node.js** - JavaScript runtime
-   **Express.js** - Web framework
-   **SQLite** (better-sqlite3) - Lightweight database
-   **jsonwebtoken** - JWT token generation & verification
-   **bcryptjs** - Secure password hashing
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
		"login": "POST /users/login",
		"events": {
			"list": "GET /events",
			"detail": "GET /events/:id",
			"create": "POST /events",
			"edit": "PUT /events/:id",
			"delete": "DELETE /events/:id"
		}
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

All event write operations require a valid `Authorization` header.

#### a. List Events

**GET** `/events`

_Returns all events (publicly accessible)._

#### b. Get Single Event

**GET** `/events/:id`

_Returns a single event by ID (public)._

#### c. Create Event

**POST** `/events`  
_Requires: Authorization: Bearer `<jwt>`_

**Request:**

```json
{
	"title": "My Event",
	"description": "Description goes here",
	"date": "2024-12-01T14:00:00Z",
	"location": "Conference Room"
}
```

**Validation:**

-   `title`: required, non-empty, trimmed, not only spaces
-   `date`: required, valid date
-   `description`, `location`: optional

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
		"createdAt": "...",
		"updatedAt": "..."
	}
}
```

</details>

#### d. Edit Event

**PUT** `/events/:id`  
_Requires: Authorization_

(Same body/validation as create.)

#### e. Delete Event

**DELETE** `/events/:id`  
_Requires: Authorization_

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

**Create Event:**

```bash
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"title":"Sample Event","date":"2024-12-01","description":"..."}'
```

**Get Events:**

```bash
curl http://localhost:3000/events
```

### Using JavaScript (Fetch API)

```javascript
// Signup or Login first to obtain token, then:

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

---

## Project Structure

```
demo-rest-api/
├── app.js                 # Application entry point
├── package.json           # Project dependencies and scripts
├── database.sqlite        # SQLite DB (created automatically)
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
│   └── db.js
└── util/
    └── auth.js            # JWT token utilities
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
| created_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP  |
| updated_at  | DATETIME | DEFAULT CURRENT_TIMESTAMP  |

---

## Security Features

-   **bcrypt password hashing**
-   **JWT token-based authentication**
-   **Server-side input validation (users/events)**
-   **Unique user email constraint**
-   **Passwords are never exposed in API responses**

## Development

-   `npm run dev` — Start development server with nodemon

**Note:** Database initializes on first server start. SQLite file: `database.sqlite`.

---

## Additional Notes

-   JWT tokens expire after **24 hours** by default
-   Use a **secure, unique JWT secret** for production environments
-   Passwords must be at least **6 characters**
-   Emails are lowercased and trimmed

## Author

Paul Ferreira

## License

ISC
