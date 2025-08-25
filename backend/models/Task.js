const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

class Task {
	static async ensureDataFilesExist() {
		await fs.mkdir(DATA_DIR, { recursive: true });
		try {
			await fs.access(TASKS_FILE);
		} catch (_) {
			await fs.writeFile(TASKS_FILE, JSON.stringify([], null, 2), 'utf8');
		}
	}

	static async readTasks() {
		await this.ensureDataFilesExist();
		const raw = await fs.readFile(TASKS_FILE, 'utf8');
		return JSON.parse(raw || '[]');
	}

	static async writeTasks(tasks) {
		const content = JSON.stringify(tasks, null, 2);
		await fs.writeFile(TASKS_FILE, content, 'utf8');
	}

	static async findByUserId(userId) {
		const tasks = await this.readTasks();
		return tasks.filter(t => t.userId === userId);
	}

	static async findById(id, userId) {
		const tasks = await this.readTasks();
		return tasks.find(t => t.id === id && t.userId === userId);
	}

	static async create(taskData, userId) {
		const { title, description = '', priority = 'Low' } = taskData;
		
		if (!title) {
			throw new Error('Title is required');
		}

		const allowed = ['Low', 'Medium', 'High'];
		const normalizedPriority = allowed.includes(priority) ? priority : 'Low';
		
		const tasks = await this.readTasks();
		const now = new Date().toISOString();
		
		const task = {
			id: uuidv4(),
			userId,
			title,
			description,
			priority: normalizedPriority,
			completed: false,
			createdAt: now,
			updatedAt: now
		};
		
		tasks.push(task);
		await this.writeTasks(tasks);
		return task;
	}

	static async update(id, updates, userId) {
		const tasks = await this.readTasks();
		const idx = tasks.findIndex(t => t.id === id && t.userId === userId);
		
		if (idx === -1) {
			throw new Error('Task not found');
		}

		const { title, description, priority, completed } = updates;
		const task = tasks[idx];
		
		if (typeof title !== 'undefined') task.title = title;
		if (typeof description !== 'undefined') task.description = description;
		if (typeof priority !== 'undefined') {
			const allowed = ['Low', 'Medium', 'High'];
			if (!allowed.includes(priority)) {
				throw new Error('Invalid priority');
			}
			task.priority = priority;
		}
		if (typeof completed !== 'undefined') task.completed = !!completed;
		
		task.updatedAt = new Date().toISOString();
		tasks[idx] = task;
		await this.writeTasks(tasks);
		return task;
	}

	static async delete(id, userId) {
		const tasks = await this.readTasks();
		const idx = tasks.findIndex(t => t.id === id && t.userId === userId);
		
		if (idx === -1) {
			throw new Error('Task not found');
		}
		
		const [removed] = tasks.splice(idx, 1);
		await this.writeTasks(tasks);
		return removed;
	}
}

module.exports = Task;
