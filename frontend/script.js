const api = {
	login: async (username, password) => {
		const res = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ username, password })
		});
		if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
		return res.json();
	},
	signup: async (username, password) => {
		const res = await fetch('/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({ username, password })
		});
		if (!res.ok) throw new Error((await res.json()).message || 'Signup failed');
		return res.json();
	},
	logout: async () => {
		await fetch('/logout', { method: 'POST', credentials: 'include' });
	},
	getTasks: async () => {
		const res = await fetch('/tasks', { credentials: 'include' });
		if (res.status === 401) return [];
		if (!res.ok) throw new Error('Failed to load tasks');
		return res.json();
	},
	addTask: async (task) => {
		const res = await fetch('/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(task)
		});
		if (!res.ok) throw new Error('Failed to add task');
		return res.json();
	},
	updateTask: async (id, updates) => {
		const res = await fetch(`/tasks/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(updates)
		});
		if (!res.ok) throw new Error('Failed to update task');
		return res.json();
	},
	deleteTask: async (id) => {
		const res = await fetch(`/tasks/${id}`, { method: 'DELETE', credentials: 'include' });
		if (!res.ok) throw new Error('Failed to delete task');
		return res.json();
	}
};

function onIndex() {
	const form = document.getElementById('loginForm');
	const message = document.getElementById('message');
	const signupLink = document.getElementById('signupLink');
	let signupMode = false;

	function setMessage(text) { message.textContent = text || ''; }

	signupLink?.addEventListener('click', (e) => {
		e.preventDefault();
		signupMode = !signupMode;
		document.querySelector('.card h2').textContent = signupMode ? 'Sign Up' : 'Login';
		signupLink.textContent = signupMode ? 'Back to login' : 'Create an account';
		setMessage('');
	});

	form?.addEventListener('submit', async (e) => {
		e.preventDefault();
		const username = document.getElementById('username').value.trim();
		const password = document.getElementById('password').value.trim();
		if (!username || !password) return setMessage('Both fields required');
		try {
			if (signupMode) {
				await api.signup(username, password);
				setMessage('Account created successfully! You can now log in.');
				signupMode = false;
				document.querySelector('.card h2').textContent = 'Login';
				signupLink.textContent = 'Create an account';
				return;
			}
			await api.login(username, password);
			window.location.href = '/dashboard';
		} catch (err) {
			setMessage(err.message || 'Request failed');
		}
	});
}

function priorityClass(p) {
	const m = { Low: 'low', Medium: 'medium', High: 'high' };
	return m[p] || 'low';
}

function renderTasks(listEl, tasks) {
	listEl.innerHTML = '';
	
	if (!tasks.length) {
		listEl.innerHTML = `
			<li class="task" style="text-align: center; color: var(--muted);">
				<div style="font-size: 1.2rem; margin-bottom: 8px;">📝</div>
				<div>No tasks yet. Create your first task above!</div>
			</li>
		`;
		return;
	}

	tasks.forEach(task => {
		const li = document.createElement('li');
		li.className = `task ${priorityClass(task.priority)} ${task.completed ? 'completed' : ''}`;
		
		li.innerHTML = `
			<div class="task-title">${task.title}</div>
			${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
			<div class="task-meta">
				<span class="priority-badge">${task.priority}</span>
				<span>•</span>
				<span>${task.completed ? '✅ Completed' : '⏳ Pending'}</span>
				<span>•</span>
				<span>${new Date(task.createdAt).toLocaleDateString()}</span>
			</div>
			<div class="task-actions">
				<button data-action="toggle" title="${task.completed ? 'Mark as pending' : 'Mark as completed'}">
					${task.completed ? '🔄 Mark Pending' : '✅ Mark Done'}
				</button>
				<button data-action="edit" title="Edit task">✏️ Edit</button>
				<button data-action="delete" title="Delete task">🗑️ Delete</button>
			</div>
		`;

		// Add event listeners
		li.querySelector('[data-action="toggle"]').addEventListener('click', async () => {
			try {
				await api.updateTask(task.id, { completed: !task.completed });
				await loadTasks();
			} catch (err) {
				alert('Failed to update task: ' + err.message);
			}
		});

		li.querySelector('[data-action="edit"]').addEventListener('click', async () => {
			const title = prompt('Task title:', task.title);
			if (title === null) return;
			
			const description = prompt('Description (optional):', task.description || '');
			if (description === null) return;
			
			const priority = prompt('Priority (Low, Medium, High):', task.priority);
			if (priority === null) return;
			
			try {
				await api.updateTask(task.id, { title, description, priority });
				await loadTasks();
			} catch (err) {
				alert('Failed to update task: ' + err.message);
			}
		});

		li.querySelector('[data-action="delete"]').addEventListener('click', async () => {
			if (!confirm(`Are you sure you want to delete "${task.title}"?`)) return;
			
			try {
				await api.deleteTask(task.id);
				await loadTasks();
			} catch (err) {
				alert('Failed to delete task: ' + err.message);
			}
		});

		listEl.appendChild(li);
	});
}

async function onDashboard() {
	const welcome = document.getElementById('welcome');
	const taskForm = document.getElementById('taskForm');
	const tasksEl = document.getElementById('tasks');
	const logoutBtn = document.getElementById('logoutBtn');

	async function addTask(e) {
		e.preventDefault();
		const title = document.getElementById('title').value.trim();
		const description = document.getElementById('description').value.trim();
		const priority = document.getElementById('priority').value;
		
		if (!title) return;
		
		try {
			await api.addTask({ title, description, priority });
			taskForm.reset();
			await loadTasks();
		} catch (err) {
			alert('Failed to add task: ' + err.message);
		}
	}

	logoutBtn?.addEventListener('click', async () => {
		try {
			await api.logout();
			window.location.href = '/';
		} catch (err) {
			console.error('Logout error:', err);
			window.location.href = '/';
		}
	});

	async function loadTasks() {
		try {
			const tasks = await api.getTasks();
			renderTasks(tasksEl, tasks);
		} catch (err) {
			console.error('Failed to load tasks:', err);
			tasksEl.innerHTML = `
				<li class="task" style="text-align: center; color: var(--muted);">
					<div>❌ Failed to load tasks</div>
					<div style="font-size: 0.9rem;">${err.message}</div>
				</li>
			`;
		}
	}

	taskForm?.addEventListener('submit', addTask);
	welcome.textContent = 'Welcome to your Task Manager!';
	await loadTasks();
}

document.addEventListener('DOMContentLoaded', () => {
	if (document.getElementById('loginForm')) onIndex();
	if (document.getElementById('taskForm')) onDashboard();
});


