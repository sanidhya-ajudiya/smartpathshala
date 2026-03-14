const db = require('../config/db');
const { logAction } = require('../utils/auditLogger');

// Get all staff with department names
exports.getAllStaff = async (req, res, next) => {
    try {
        const [staff] = await db.query(`
            SELECT s.*, d.name as department_name 
            FROM staff s
            LEFT JOIN departments d ON s.department_id = d.id
            ORDER BY s.id DESC
        `);
        res.success(staff, 'Staff records fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Get single staff member by ID
exports.getStaffById = async (req, res, next) => {
    try {
        const [staffMember] = await db.query('SELECT * FROM staff WHERE id = ?', [req.params.id]);
        if (staffMember.length === 0) {
            return res.error('Staff member not found', 404);
        }
        res.success(staffMember[0], 'Staff details fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Create new staff member
exports.createStaff = async (req, res, next) => {
    const {
        first_name, last_name, position, department_id,
        joining_date, phone, salary
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO staff (
                first_name, last_name, position, department_id, 
                joining_date, phone, salary
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name, last_name, position, department_id || null,
                joining_date || new Date().toISOString().slice(0, 10), phone, salary || 0.00
            ]
        );

        // Audit Log
        await logAction(
            req.user.id,
            'CREATE',
            'STAFF',
            `Added new staff member: ${first_name} ${last_name} (${position})`,
            req.ip
        );

        res.success({ id: result.insertId }, 'Staff member created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Update staff member
exports.updateStaff = async (req, res, next) => {
    const {
        first_name, last_name, position, department_id,
        joining_date, phone, salary
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE staff SET 
                first_name = ?, last_name = ?, position = ?, department_id = ?, 
                joining_date = ?, phone = ?, salary = ?
            WHERE id = ?`,
            [
                first_name, last_name, position, department_id || null,
                joining_date, phone, salary, req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.error('Staff member not found', 404);
        }

        // Audit Log
        await logAction(
            req.user.id,
            'UPDATE',
            'STAFF',
            `Updated staff ID ${req.params.id}: ${first_name} (${position})`,
            req.ip
        );

        res.success({}, 'Staff member updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete staff member
exports.deleteStaff = async (req, res, next) => {
    try {
        const [result] = await db.query('DELETE FROM staff WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.error('Staff member not found', 404);
        }

        // Audit Log
        await logAction(
            req.user.id,
            'DELETE',
            'STAFF',
            `Removed staff member ID ${req.params.id}`,
            req.ip
        );

        res.success({}, 'Staff member deleted successfully');
    } catch (error) {
        next(error);
    }
};
