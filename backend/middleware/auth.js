const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.error('Invalid or expired token', 403);
            }

            req.user = user;
            next();
        });
    } else {
        res.error('Authorization token missing', 401);
    }
};

// Middleware to check for specific permissions
const permissionMiddleware = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.role_id) {
                return res.error('User role not found', 403);
            }

            const roleId = req.user.role_id;

            // Super Admin bypass (optional, but good for dev)
            // If role 1 is Super Admin
            if (roleId === 1) {
                return next();
            }

            const [rows] = await db.execute(
                `SELECT p.name 
         FROM permissions p 
         JOIN role_permissions rp ON p.id = rp.permission_id 
         WHERE rp.role_id = ? AND p.name = ?`,
                [roleId, requiredPermission]
            );

            if (rows.length > 0) {
                next();
            } else {
                res.error('Access denied: Insufficient permissions', 403);
            }
        } catch (error) {
            console.error('Permission check error:', error);
            res.error('Server error during permission check', 500, [error.message]);
        }
    };
};

module.exports = { authMiddleware, permissionMiddleware };
