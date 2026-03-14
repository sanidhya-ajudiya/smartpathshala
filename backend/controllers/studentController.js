const db = require('../config/db');
const { logAction } = require('../utils/auditLogger');

// Get all students with class and section names
exports.getAllStudents = async (req, res, next) => {
    try {
        const [students] = await db.query(`
            SELECT s.*, c.name as class_name, sec.name as section_name 
            FROM students s
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN sections sec ON s.section_id = sec.id
            ORDER BY s.created_at DESC
        `);
        res.success(students, 'Students fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Get single student by ID
exports.getStudentById = async (req, res, next) => {
    try {
        const [student] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (student.length === 0) {
            return res.error('Student not found', 404);
        }
        res.success(student[0], 'Student details fetched successfully');
    } catch (error) {
        next(error);
    }
};

// Create new student
exports.createStudent = async (req, res, next) => {
    const {
        first_name, last_name, roll_no, class_id, section_id,
        dob, gender, address, phone, guardian_name, guardian_phone,
        admission_date
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO students (
                first_name, last_name, roll_no, class_id, section_id, 
                dob, gender, address, phone, guardian_name, guardian_phone, 
                admission_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name, last_name, roll_no, class_id, section_id,
                dob, gender, address, phone, guardian_name, guardian_phone,
                admission_date || new Date().toISOString().slice(0, 10)
            ]
        );

        // Audit Log
        await logAction(
            req.user.id, 
            'CREATE', 
            'STUDENT', 
            `Enrolled new student: ${first_name} ${last_name} (Roll: ${roll_no})`, 
            req.ip
        );

        res.success({ id: result.insertId }, 'Student created successfully', 201);
    } catch (error) {
        next(error);
    }
};

// Update student
exports.updateStudent = async (req, res, next) => {
    const {
        first_name, last_name, roll_no, class_id, section_id,
        dob, gender, address, phone, guardian_name, guardian_phone,
        admission_date
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE students SET 
                first_name = ?, last_name = ?, roll_no = ?, class_id = ?, section_id = ?, 
                dob = ?, gender = ?, address = ?, phone = ?, guardian_name = ?, guardian_phone = ?, 
                admission_date = ?
            WHERE id = ?`,
            [
                first_name, last_name, roll_no, class_id, section_id,
                dob, gender, address, phone, guardian_name, guardian_phone,
                admission_date, req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.error('Student not found', 404);
        }

        // Audit Log
        await logAction(
            req.user.id,
            'UPDATE',
            'STUDENT',
            `Updated student ID ${req.params.id}: ${first_name} ${last_name}`,
            req.ip
        );

        res.success({}, 'Student updated successfully');
    } catch (error) {
        next(error);
    }
};

// Delete student
exports.deleteStudent = async (req, res, next) => {
    try {
        const [result] = await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.error('Student not found', 404);
        }

        // Audit Log
        await logAction(
            req.user.id,
            'DELETE',
            'STUDENT',
            `Deleted student profile with ID ${req.params.id}`,
            req.ip
        );

        res.success({}, 'Student deleted successfully');
    } catch (error) {
        next(error);
    }
};
