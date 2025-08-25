const User = require('../models/User');

class AuthController {
	static async signup(req, res) {
		try {
			const { username, password } = req.body;
			
			if (!username || !password) {
				return res.status(400).json({ 
					message: 'Username and password are required' 
				});
			}

			const user = await User.create(username, password);
			
			return res.status(201).json({ 
				message: 'User created successfully',
				userId: user.id 
			});
		} catch (err) {
			if (err.message === 'User already exists') {
				return res.status(409).json({ message: err.message });
			}
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async login(req, res) {
		try {
			const { username, password } = req.body;
			
			if (!username || !password) {
				return res.status(400).json({ 
					message: 'Username and password are required' 
				});
			}

			const user = await User.validateCredentials(username, password);
			
			if (!user) {
				return res.status(401).json({ 
					message: 'Invalid credentials' 
				});
			}

			req.session.userId = user.id;
			req.session.username = user.username;
			
			return res.json({ 
				message: 'Logged in successfully', 
				username: user.username 
			});
		} catch (err) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	}

	static async logout(req, res) {
		if (req.session) {
			req.session.destroy((err) => {
				if (err) {
					return res.status(500).json({ message: 'Error during logout' });
				}
				return res.json({ message: 'Logged out successfully' });
			});
		} else {
			return res.json({ message: 'Already logged out' });
		}
	}
}

module.exports = AuthController;
