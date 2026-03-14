const db = require('../config/db');

// Get all roles with their permissions
exports.getAllRoles = async (req, res) => {
    try {
        const [roles] = await db.query('SELECT * FROM roles');
        const [permissions] = await db.query('SELECT * FROM permissions');
        const [rolePermissions] = await db.query('SELECT * FROM role_permissions');

        // Map permissions to roles
        const data = roles.map(role => {
            const rolePerms = rolePermissions
                .filter(rp => rp.role_id === role.id)
                .map(rp => rp.permission_id);
            return {
                ...role,
                permission_ids: rolePerms
            };
        });

        res.json({ success: true, roles: data, allPermissions: permissions });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create a new role
exports.createRole = async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Role name is required' });

    try {
        const [result] = await db.query('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
        res.json({ success: true, message: 'Role created successfully', roleId: result.insertId });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete a role
exports.deleteRole = async (req, res) => {
    const { roleId } = req.params;

    // Prevent deleting Super Admin (1) or Admin (2) - safety check
    if (roleId == 1 || roleId == 2) {
        return res.status(400).json({ success: false, message: 'Cannot delete system default roles (Super Admin / Admin)' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Check if users are assigned to this role
        const [users] = await connection.query('SELECT count(*) as count FROM users WHERE role_id = ?', [roleId]);
        if (users[0].count > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: `Cannot delete role. It is assigned to ${users[0].count} users. Reassign them first.`
            });
        }

        // 2. Delete role permissions
        await connection.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);

        // 3. Delete role
        await connection.query('DELETE FROM roles WHERE id = ?', [roleId]);

        await connection.commit();
        res.json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting role:', error);

        // Final fallback: If foreign key failure still happens, try basic error message OR force handling
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ success: false, message: 'Cannot delete role: It is referenced by other records (e.g., users, payroll, logs).' });
        }

        res.status(500).json({ success: false, message: 'Server Error: ' + error.message });
    } finally {
        connection.release();
    }
};

// Update permissions for a role
exports.updateRolePermissions = async (req, res) => {
    const { roleId } = req.params;
    const { permissionIds } = req.body; // Array of permission IDs

    if (!Array.isArray(permissionIds)) {
        return res.status(400).json({ success: false, message: 'Invalid permissions format' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Clear existing permissions for this role
        await connection.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId]);

        // 2. Insert new permissions provided
        if (permissionIds.length > 0) {
            const values = permissionIds.map(permId => [roleId, permId]);
            await connection.query('INSERT INTO role_permissions (role_id, permission_id) VALUES ?', [values]);
        }

        await connection.commit();
        res.json({ success: true, message: 'Role permissions updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating role permissions:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    } finally {
        connection.release();
    }
};

// Search users to assign roles
exports.searchUsers = async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ success: true, users: [] });

    try {
        const [users] = await db.query(
            `SELECT id, username, first_name, last_name, role_id 
             FROM users 
             WHERE username LIKE ? OR first_name LIKE ? OR last_name LIKE ? 
             LIMIT 10`,
            [`%${query}%`, `%${query}%`, `%${query}%`]
        );
        res.json({ success: true, users });
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update user role (e.g. Promote to Super Admin)
exports.updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { roleId } = req.body;

    try {
        await db.query('UPDATE users SET role_id = ? WHERE id = ?', [roleId, userId]);
        res.json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
