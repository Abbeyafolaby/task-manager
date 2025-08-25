const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

class User {
	static async ensureDataFilesExist() {
		await fs.mkdir(DATA_DIR, { recursive: true });
		try {
			await fs.access(USERS_FILE);
		} catch (_) {
			await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
		}
	}

	static async readUsers() {
		await this.ensureDataFilesExist();
		const raw = await fs.readFile(USERS_FILE, 'utf8');
		return JSON.parse(raw || '[]');
	}

	static async writeUsers(users) {
		const content = JSON.stringify(users, null, 2);
		await fs.writeFile(USERS_FILE, content, 'utf8');
	}

	static async findByUsername(username) {
		const users = await this.readUsers();
		return users.find(u => u.username === username);
	}

	static async findById(id) {
		const users = await this.readUsers();
		return users.find(u => u.id === id);
	}

	static async create(username, password) {
		const users = await this.readUsers();
		const exists = users.find(u => u.username === username);
		if (exists) {
			throw new Error('User already exists');
		}
		
		const user = {
			id: uuidv4(),
			username,
			password,
			createdAt: new Date().toISOString()
		};
		
		users.push(user);
		await this.writeUsers(users);
		return user;
	}

	static async validateCredentials(username, password) {
		const user = await this.findByUsername(username);
		if (!user || user.password !== password) {
			return null;
		}
		return user;
	}
}

module.exports = User;
