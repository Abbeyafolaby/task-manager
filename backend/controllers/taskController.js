const Task = require('../models/Task');

class TaskController {
	static async getTasks(req, res) {
		try {
			const userId = req.session.userId;
			const tasks = await Task.findByUserId(userId);
			return res.json(tasks);
		} catch (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async createTask(req, res) {
		try {
			const userId = req.session.userId;
			const task = await Task.create(req.body, userId);
			return res.status(201).json(task);
		} catch (err) {
			if (err.message === 'Title is required') {
				return res.status(400).json({ message: err.message });
			}
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async updateTask(req, res) {
		try {
			const { id } = req.params;
			const userId = req.session.userId;
			const updates = req.body;
			
			const task = await Task.update(id, updates, userId);
			return res.json(task);
		} catch (err) {
			if (err.message === 'Task not found') {
				return res.status(404).json({ message: err.message });
			}
			if (err.message === 'Invalid priority') {
				return res.status(400).json({ message: err.message });
			}
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async deleteTask(req, res) {
		try {
			const { id } = req.params;
			const userId = req.session.userId;
			
			const deletedTask = await Task.delete(id, userId);
			return res.json(deletedTask);
		} catch (err) {
			if (err.message === 'Task not found') {
				return res.status(404).json({ message: err.message });
			}
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
}

module.exports = TaskController;
