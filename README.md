# Task Manager

A comprehensive task management API with full CRUD operations, designed to help teams and individuals organize, track, and manage their tasks efficiently.

## Description

Task Manager is a robust RESTful API built for modern task management needs. It provides complete Create, Read, Update, and Delete operations for tasks.

## Features

- **Task Management**
  - Create, read, update, and delete tasks
  - Task title, description, and detailed notes
  - Multiple task status levels (Todo, In Progress, Review, Done)
  - Priority levels (Low, Medium, High, Critical)
  - Due date


- **API Features**
  - RESTful API design principles
  - Comprehensive input validation
  - Error handling and logging
  - API rate limiting
  - Swagger documentation

## Installation & Usage

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_jwt_secret_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Usage
The API will be available at `http://localhost:3000`

#### Main API Endpoints

**Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

**Tasks**
- `GET /api/tasks` - Get all tasks (with filtering)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get specific task details
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id/priority` - Update task priority


## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with bcrypt
- **Validation**: Joi or express-validator
- **Documentation**: Swagger
- **Testing**: Jest
- **Security**: Helmet, CORS, express-rate-limit

## Author

**Name**
- Name: Abiodun Afolabi
- GitHub: [@Abbeyafolaby](https://github.com/Abbeyafolaby)
