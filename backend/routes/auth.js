const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// POST /signup - Register new user
router.post('/signup', AuthController.signup);

// POST /login - Authenticate user and start session
router.post('/login', AuthController.login);

// POST /logout - End session
router.post('/logout', AuthController.logout);

module.exports = router;
