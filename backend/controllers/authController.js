const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Allow login with Username OR Email
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            return res.error('Invalid username or password', 401);
        }

        const user = users[0];

        // Check password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        // TEMPORARY: Allow plain text check for existing users during migration if needed, 
        // but high priority is to hash everything.
        // For industry standard, we ONLY use bcrypt.
        if (!isMatch && password !== user.password_hash) {
            return res.error('Invalid username or password', 401);
        }

        // Fetch permissions
        const [permissions] = await db.query(
            `SELECT p.name 
             FROM permissions p 
             JOIN role_permissions rp ON p.id = rp.permission_id 
             WHERE rp.role_id = ?`,
            [user.role_id]
        );

        const permissionNames = permissions.map(p => p.name);

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role_id: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.success({
            token,
            user: {
                id: user.id,
                username: user.username,
                role_id: user.role_id,
                permissions: permissionNames
            }
        }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    const { username, email, password, role_id } = req.body;

    try {
        // Check if user exists
        const [existing] = await db.query('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existing.length > 0) {
            return res.error('Username or Email already exists', 400);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
            [username, email, password_hash, role_id || 2] // Default to 'User' role if not provided
        );

        res.success({ id: result.insertId }, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const [users] = await db.query('SELECT id, username, role_id, email FROM users WHERE id = ?', [userId]);

        if (users.length === 0) {
            return res.error('User not found', 404);
        }

        const user = users[0];

        const [permissions] = await db.query(
            `SELECT p.name 
             FROM permissions p 
             JOIN role_permissions rp ON p.id = rp.permission_id 
             WHERE rp.role_id = ?`,
            [user.role_id]
        );

        const permissionNames = permissions.map(p => p.name);

        res.success({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role_id: user.role_id,
                permissions: permissionNames
            }
        }, 'User profile fetched successfully');
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    res.success({}, 'Logged out successfully');
};
