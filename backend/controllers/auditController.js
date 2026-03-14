const db = require('../config/db');

// Get all audit logs
exports.getAllLogs = async (req, res, next) => {
    try {
        const { module, action, user_id, limit = 100, offset = 0 } = req.query;
        let query = `
            SELECT al.*, u.username 
            FROM audit_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (module) {
            query += ' AND al.module = ?';
            params.push(module);
        }
        if (action) {
            query += ' AND al.action = ?';
            params.push(action);
        }
        if (user_id) {
            query += ' AND al.user_id = ?';
            params.push(user_id);
        }

        query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [logs] = await db.query(query, params);
        res.success(logs, 'Audit logs fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Create an audit log entry (usually called from other controllers)
exports.createLog = async (data) => {
    const { user_id, action, module, description, ip_address } = data;
    try {
        await db.query(
            'INSERT INTO audit_logs (user_id, action, module, description, ip_address) VALUES (?, ?, ?, ?, ?)',
            [user_id, action, module, description, ip_address]
        );
    } catch (error) {
        console.error('Failed to create audit log:', error);
    }
};
