# Task Manager Backend

A Node.js + Express backend for the Task Manager application with organized MVC structure.

## Project Structure

```
backend/
├── models/           # Data models and business logic
│   ├── User.js      # User model with authentication methods
│   └── Task.js      # Task model with CRUD operations
├── controllers/      # Request handlers and business logic
│   ├── authController.js    # Authentication operations
│   └── taskController.js    # Task CRUD operations
├── routes/           # API route definitions
│   ├── auth.js      # Authentication routes
│   └── tasks.js     # Task management routes
├── middleware/       # Custom middleware functions
│   └── auth.js      # Authentication middleware
├── data/            # JSON storage files (auto-created)
│   ├── users.json   # User data storage
│   └── tasks.json   # Task data storage
├── app.js           # Express app configuration
├── server.js        # Server entry point
└── package.json     # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Authenticate user and start session
- `POST /auth/logout` - End session

### Tasks (Protected Routes)
- `GET /tasks` - Get all tasks for authenticated user
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update existing task
- `DELETE /tasks/:id` - Delete task

### Legacy Support
The following endpoints are still supported for backward compatibility:
- `POST /signup` → redirects to `/auth/signup`
- `POST /login` → redirects to `/auth/login`
- `POST /logout` → redirects to `/auth/logout`

## Features

- **Session-based authentication** using express-session
- **JSON file storage** for users and tasks
- **Priority levels**: Low (green), Medium (orange), High (red)
- **User isolation**: Users can only access their own tasks
- **Input validation** and error handling
- **CORS support** for development

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. For development with auto-restart:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3000` by default.

## Data Storage

Data is stored in JSON files within the `data/` directory:
- `users.json` - User accounts and credentials
- `tasks.json` - Task data with user associations

**Note**: This is a development setup. For production, consider using a proper database and implementing password hashing.
