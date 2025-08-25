const express = require('express');
const TaskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(requireAuth);

// GET /tasks - Get all tasks for the authenticated user
router.get('/', TaskController.getTasks);

// POST /tasks - Create a new task
router.post('/', TaskController.createTask);

// PUT /tasks/:id - Update a specific task
router.put('/:id', TaskController.updateTask);

// DELETE /tasks/:id - Delete a specific task
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
