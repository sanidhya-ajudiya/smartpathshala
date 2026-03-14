const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const pool = require('../config/db');

const seedDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database...');

        // 1. Seed Roles
        const roles = [
            { name: 'Super Admin', description: 'Full access to everything' },
            { name: 'Admin', description: 'Administrative access' },
            { name: 'Teacher', description: 'Access to academic modules' },
            { name: 'Student', description: 'Access to student portal' },
            { name: 'Parent', description: 'Access to ward details' },
            { name: 'Accountant', description: 'Access to fees and payroll' },
            { name: 'Librarian', description: 'Access to library' },
            { name: 'Transport Manager', description: 'Access to transport' },
            { name: 'HR', description: 'Access to payroll and staff' },
            { name: 'Staff', description: 'General staff access' },
        ];

        console.log('Seeding Roles...');
        for (const role of roles) {
            const [existing] = await connection.query('SELECT * FROM roles WHERE name = ?', [role.name]);
            if (existing.length === 0) {
                await connection.query('INSERT INTO roles (name, description) VALUES (?, ?)', [role.name, role.description]);
                console.log(`Role ${role.name} added.`);
            } else {
                console.log(`Role ${role.name} already exists.`);
            }
        }

        // 2. Seed Permissions (Example list - add more as needed)
        const permissions = [
            // Student
            'STUDENT_VIEW', 'STUDENT_CREATE', 'STUDENT_EDIT', 'STUDENT_DELETE',
            // Teacher
            'TEACHER_VIEW', 'TEACHER_CREATE', 'TEACHER_EDIT', 'TEACHER_DELETE',
            // Staff
            'STAFF_VIEW', 'STAFF_CREATE', 'STAFF_EDIT', 'STAFF_DELETE',
            // Attendance
            'ATTENDANCE_VIEW', 'ATTENDANCE_MARK', 'ATTENDANCE_EDIT', 'ATTENDANCE_DELETE',
            // Fees
            'FEE_VIEW', 'FEE_COLLECT', 'FEE_CREATE', 'FEE_EDIT', 'FEE_DELETE',
            // Exam
            'EXAM_VIEW', 'EXAM_CREATE', 'EXAM_EDIT', 'EXAM_DELETE',
            // Transport
            'TRANSPORT_VIEW', 'TRANSPORT_CREATE', 'TRANSPORT_EDIT', 'TRANSPORT_DELETE',
            // Inventory
            'INVENTORY_VIEW', 'INVENTORY_CREATE', 'INVENTORY_EDIT', 'INVENTORY_DELETE',
            // Roles/Settings
            'ROLE_MANAGE', 'USER_MANAGE'
        ];

        console.log('Seeding Permissions...');
        for (const perm of permissions) {
            const [existing] = await connection.query('SELECT * FROM permissions WHERE name = ?', [perm]);
            if (existing.length === 0) {
                await connection.query('INSERT INTO permissions (name, description) VALUES (?, ?)', [perm, `Permission for ${perm}`]);
                console.log(`Permission ${perm} added.`);
            } else {
                console.log(`Permission ${perm} already exists.`);
            }
        }

        // 3. Create Super Admin User
        const superAdminUsername = 'superadmin';
        const superAdminEmail = 'superadmin@school.com';
        const superAdminPassword = 'admin123'; // Change in production!

        // Get Super Admin Role ID
        const [roleResult] = await connection.query('SELECT id FROM roles WHERE name = ?', ['Super Admin']);
        if (roleResult.length > 0) {
            const roleId = roleResult[0].id;

            const [existingUser] = await connection.query('SELECT * FROM users WHERE username = ?', [superAdminUsername]);

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(superAdminPassword, salt);

            if (existingUser.length === 0) {
                await connection.query(
                    'INSERT INTO users (username, email, password_hash, role_id, status) VALUES (?, ?, ?, ?, ?)',
                    [superAdminUsername, superAdminEmail, password_hash, roleId, 'active']
                );
                console.log(`Super Admin user created: ${superAdminUsername} / ${superAdminPassword}`);
            } else {
                // Update password if exists
                await connection.query('UPDATE users SET password_hash = ? WHERE username = ?', [password_hash, superAdminUsername]);
                console.log('Super Admin user updated/exists with hashed password.');
            }
            // Assign ALL permissions to Super Admin role
            // First, get all permission IDs
            const [allPermissions] = await connection.query('SELECT id FROM permissions');

            for (const p of allPermissions) {
                // Check if role has permission
                const [rpExists] = await connection.query('SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?', [roleId, p.id]);
                if (rpExists.length === 0) {
                    await connection.query('INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)', [roleId, p.id]);
                }
            }
            console.log('Assigned all permissions to Super Admin role.');

        } else {
            console.error('Super Admin Role not found! Skipping user creation.');
        }

        connection.release();
        console.log('Database seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
