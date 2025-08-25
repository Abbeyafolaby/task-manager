const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(express.json());

// Enable CORS for local development if needed; allow credentials
app.use(cors({
	origin: true,
	credentials: true
}));

// Session configuration
app.use(
	session({
		secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			sameSite: 'lax',
			secure: false
		}
	})
);

// Serve frontend statically so same-origin cookies work
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR));

// API Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Legacy route support for backward compatibility
app.post('/signup', (req, res) => {
	// Redirect to new auth route
	req.url = '/auth/signup';
	app._router.handle(req, res);
});

app.post('/login', (req, res) => {
	// Redirect to new auth route
	req.url = '/auth/login';
	app._router.handle(req, res);
});

app.post('/logout', (req, res) => {
	// Redirect to new auth route
	req.url = '/auth/logout';
	app._router.handle(req, res);
});

// Fallback to serve dashboard after login
app.get('/dashboard', (req, res) => {
	res.sendFile(path.join(FRONTEND_DIR, 'dashboard.html'));
});

module.exports = app;


