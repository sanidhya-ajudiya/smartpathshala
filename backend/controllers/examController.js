const db = require('../config/db');

// Get all exams with class names
exports.getAllExams = async (req, res) => {
    try {
        const [exams] = await db.query(`
            SELECT e.*, c.name as class_name 
            FROM exams e
            LEFT JOIN classes c ON e.class_id = c.id
            ORDER BY e.start_date DESC
        `);
        res.json({ success: true, count: exams.length, data: exams });
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get single exam by ID
exports.getExamById = async (req, res) => {
    try {
        const [exam] = await db.query('SELECT * FROM exams WHERE id = ?', [req.params.id]);
        if (exam.length === 0) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }
        res.json({ success: true, data: exam[0] });
    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create new exam
exports.createExam = async (req, res) => {
    const { name, start_date, end_date, class_id } = req.body;

    // Basic Validation
    if (!name || !class_id) {
        return res.status(400).json({ success: false, message: 'Please provide required fields (Name, Class)' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO exams (name, start_date, end_date, class_id) VALUES (?, ?, ?, ?)`,
            [name, start_date, end_date, class_id]
        );

        res.status(201).json({
            success: true,
            message: 'Exam created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error creating exam:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update exam
exports.updateExam = async (req, res) => {
    const { name, start_date, end_date, class_id } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE exams SET name = ?, start_date = ?, end_date = ?, class_id = ? WHERE id = ?`,
            [name, start_date, end_date, class_id, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        res.json({ success: true, message: 'Exam updated successfully' });
    } catch (error) {
        console.error('Error updating exam:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete exam
exports.deleteExam = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM exams WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Exam not found' });
        }

        res.json({ success: true, message: 'Exam deleted successfully' });
    } catch (error) {
        console.error('Error deleting exam:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
