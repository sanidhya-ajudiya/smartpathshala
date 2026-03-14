const db = require('../config/db');

/**
 * Log an administrative action to the database.
 * @param {number} userId - The ID of the user performing the action.
 * @param {string} action - The action type (CREATE, UPDATE, DELETE, etc.).
 * @param {string} module - The module name (STUDENT, TEACHER, etc.).
 * @param {string} description - A detailed description of what happened.
 * @param {string} ipAddress - The requester's IP address.
 */
const logAction = async (userId, action, module, description, ipAddress = '') => {
    try {
        await db.query(
            'INSERT INTO audit_logs (user_id, action, module, description, ip_address) VALUES (?, ?, ?, ?, ?)',
            [userId, action, module, description, ipAddress]
        );
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

module.exports = { logAction };
