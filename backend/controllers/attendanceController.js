const db = require('../config/db');

// Get all attendance records (with student details)
exports.getAllAttendance = async (req, res) => {
    try {
        const [attendance] = await db.query(`
            SELECT a.*, s.first_name, s.last_name, s.roll_no, 
                   c.name as class_name, sec.name as section_name 
            FROM attendance a
            LEFT JOIN students s ON a.student_id = s.id
            LEFT JOIN classes c ON s.class_id = c.id
            LEFT JOIN sections sec ON s.section_id = sec.id
            ORDER BY a.date DESC, a.created_at DESC
        `);
        res.json({ success: true, count: attendance.length, data: attendance });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get single attendance record by ID
exports.getAttendanceById = async (req, res) => {
    try {
        const [record] = await db.query('SELECT * FROM attendance WHERE id = ?', [req.params.id]);
        if (record.length === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }
        res.json({ success: true, data: record[0] });
    } catch (error) {
        console.error('Error fetching attendance record:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Mark (Create) attendance
exports.markAttendance = async (req, res) => {
    const { student_id, date, status, remarks } = req.body;

    // Basic Validation
    if (!student_id || !date || !status) {
        return res.status(400).json({ success: false, message: 'Please provide required fields (Student, Date, Status)' });
    }

    try {
        // Check if attendance already exists for this student on this date
        const [existing] = await db.query(
            'SELECT id FROM attendance WHERE student_id = ? AND date = ?',
            [student_id, date]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Attendance already marked for this student on this date.' });
        }

        const [result] = await db.query(
            `INSERT INTO attendance (student_id, date, status, remarks) VALUES (?, ?, ?, ?)`,
            [student_id, date, status, remarks || null]
        );

        res.status(201).json({
            success: true,
            message: 'Attendance marked successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
    const { student_id, date, status, remarks } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE attendance SET 
                student_id = ?, date = ?, status = ?, remarks = ?
            WHERE id = ?`,
            [student_id, date, status, remarks || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }

        res.json({ success: true, message: 'Attendance updated successfully' });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }

        res.json({ success: true, message: 'Attendance deleted successfully' });
    } catch (error) {
        console.error('Error deleting attendance:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
