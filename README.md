# Demo REST API

A simple REST API built with Express.js for user authentication. This project demonstrates user registration and login functionality with JWT token-based authentication.

## Features

-   ✅ User registration (signup)
-   ✅ User login with authentication
-   ✅ JWT token generation and verification
-   ✅ Password hashing with bcrypt
-   ✅ Input validation
-   ✅ SQLite database for data persistence
-   ✅ RESTful API design

## Tech Stack

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **SQLite** (better-sqlite3) - Database
-   **JWT** (jsonwebtoken) - Authentication tokens
-   **bcryptjs** - Password hashing
-   **nodemon** - Development server with auto-reload

## Prerequisites

-   Node.js (v14 or higher)
-   npm or yarn

## Installation

1. Clone the repository or navigate to the project directory:

```bash
cd demo-rest-api
```

2. Install dependencies:

```bash
npm install
```

## Configuration

The API uses environment variables for configuration. Create a `.env` file in the root directory (optional):

```env
PORT=3000
JWT_SECRET=your-secret-key-here
```

If not provided, the defaults are:

-   `PORT`: 3000
-   `JWT_SECRET`: "abctesttoken" (⚠️ **Change this in production!**)

## Running the Application

### Development Mode

Run the server with auto-reload:

```bash
npm run dev
```

### Production Mode

Run the server directly:

```bash
node app.js
```

The server will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

## API Endpoints

### Base URL

```
http://localhost:3000
```

### Endpoints

#### 1. Health Check

**GET** `/`

Returns API status and available endpoints.

**Response:**

```json
{
	"message": "REST API is running",
	"endpoints": {
		"signup": "POST /users/signup",
		"login": "POST /users/login"
	}
}
```

#### 2. User Signup

**POST** `/users/signup`

Register a new user account.

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "password123",
	"name": "John Doe"
}
```

**Validation Rules:**

-   `email`: Required, must be a valid email format, must be unique
-   `password`: Required, minimum 6 characters
-   `name`: Required, must not be empty

**Success Response (201):**

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
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

-   **400 Bad Request** - Validation failed

```json
{
	"success": false,
	"message": "Validation failed",
	"errors": ["Valid email is required", "Password must be at least 6 characters long"]
}
```

-   **409 Conflict** - Email already exists

```json
{
	"success": false,
	"message": "Email already exists"
}
```

#### 3. User Login

**POST** `/users/login`

Authenticate an existing user and receive a JWT token.

**Request Body:**

```json
{
	"email": "user@example.com",
	"password": "password123"
}
```

**Validation Rules:**

-   `email`: Required
-   `password`: Required

**Success Response (200):**

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
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

-   **400 Bad Request** - Validation failed

```json
{
	"success": false,
	"message": "Validation failed",
	"errors": ["Email is required", "Password is required"]
}
```

-   **401 Unauthorized** - Invalid credentials

```json
{
	"success": false,
	"message": "Invalid email or password"
}
```

## Usage Examples

### Using cURL

**Signup:**

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Using JavaScript (Fetch API)

**Signup:**

```javascript
const response = await fetch("http://localhost:3000/users/signup", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		email: "user@example.com",
		password: "password123",
		name: "John Doe",
	}),
});

const data = await response.json();
console.log(data);
```

**Login:**

```javascript
const response = await fetch("http://localhost:3000/users/login", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		email: "user@example.com",
		password: "password123",
	}),
});

const data = await response.json();
console.log(data);
// Store the token for authenticated requests
localStorage.setItem("token", data.token);
```

## Project Structure

```
demo-rest-api/
├── app.js                 # Main application entry point
├── package.json           # Project dependencies and scripts
├── database.sqlite        # SQLite database file (auto-generated)
├── controllers/           # Request handlers
│   └── users-controller.js
├── models/                # Data models and business logic
│   └── user.js
├── routes/                # API route definitions
│   └── users.js
├── database/              # Database configuration
│   └── db.js
└── util/                  # Utility functions
    └── auth.js            # JWT token generation and verification
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

## Security Features

-   **Password Hashing**: Passwords are hashed using bcrypt before storage
-   **JWT Tokens**: Secure token-based authentication
-   **Input Validation**: Server-side validation for all user inputs
-   **Email Uniqueness**: Database constraint ensures unique email addresses
-   **Password Exclusion**: Passwords are never returned in API responses

## Development

### Scripts

-   `npm run dev` - Start development server with nodemon (auto-reload on file changes)

### Database

The database is automatically initialized when the server starts. The SQLite database file (`database.sqlite`) is created in the root directory.

## Notes

-   JWT tokens expire after 24 hours by default
-   The default JWT secret is for development only. **Always use a strong, unique secret in production.**
-   Passwords must be at least 6 characters long
-   Email addresses are normalized (lowercased and trimmed) before storage

## Author

Paul Ferreira

## License

ISC
