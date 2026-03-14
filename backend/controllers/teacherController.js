const db = require('../config/db');
const { logAction } = require('../utils/auditLogger');

// Get all teachers with department names
exports.getAllTeachers = async (req, res, next) => {
    try {
        const [teachers] = await db.query(`
            SELECT t.*, d.name as department_name 
            FROM teachers t
            LEFT JOIN departments d ON t.department_id = d.id
            ORDER BY t.created_at DESC
        `);
        res.success(teachers, 'Teachers fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Get single teacher by ID
exports.getTeacherById = async (req, res, next) => {
    try {
        const [teacher] = await db.query('SELECT * FROM teachers WHERE id = ?', [req.params.id]);
        if (teacher.length === 0) {
            return res.error('Teacher not found', 404);
        }
        res.success(teacher[0], 'Teacher details fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Create new teacher
exports.createTeacher = async (req, res, next) => {
    const {
        first_name, last_name, department_id, qualification,
        joining_date, phone, address
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO teachers (
                first_name, last_name, department_id, qualification, 
                joining_date, phone, address
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name, last_name, department_id, qualification,
                joining_date || new Date().toISOString().slice(0, 10), phone, address
            ]
        );

        // Audit Log
        await logAction(
            req.user.id,
            'CREATE',
            'TEACHER',
            `Registered new faculty member: ${first_name} ${last_name}`,
            req.ip
        );

        res.success({ id: result.insertId }, 'Teacher created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Update teacher
exports.updateTeacher = async (req, res, next) => {
    const {
        first_name, last_name, department_id, qualification,
        joining_date, phone, address
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE teachers SET 
                first_name = ?, last_name = ?, department_id = ?, qualification = ?, 
                joining_date = ?, phone = ?, address = ?
            WHERE id = ?`,
            [
                first_name, last_name, department_id, qualification,
                joining_date, phone, address, req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.error('Teacher not found', 404);
        }

        // Audit Log
        await logAction(
            req.user.id,
            'UPDATE',
            'TEACHER',
            `Updated teacher profile ID ${req.params.id}: ${first_name}`,
            req.ip
        );

        res.success({}, 'Teacher updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete teacher
exports.deleteTeacher = async (req, res, next) => {
    try {
        const [result] = await db.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.error('Teacher not found', 404);
        }

        // Audit Log
        await logAction(
            req.user.id,
            'DELETE',
            'TEACHER',
            `Removed teacher record ID ${req.params.id}`,
            req.ip
        );

        res.success({}, 'Teacher deleted successfully');
    } catch (error) {
        next(error);
    }
};
