const db = require('../config/db');

// Get all fee payments (with student and structure details)
exports.getAllPayments = async (req, res) => {
    try {
        const [payments] = await db.query(`
            SELECT sf.*, 
                   s.first_name, s.last_name, s.roll_no, 
                   fs.category as fee_category, fs.amount as total_amount, 
                   c.name as class_name
            FROM student_fees sf
            LEFT JOIN students s ON sf.student_id = s.id
            LEFT JOIN fee_structure fs ON sf.fee_structure_id = fs.id
            LEFT JOIN classes c ON s.class_id = c.id
            ORDER BY sf.payment_date DESC, sf.id DESC
        `);
        res.json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get single payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const [payment] = await db.query('SELECT * FROM student_fees WHERE id = ?', [req.params.id]);
        if (payment.length === 0) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }
        res.json({ success: true, data: payment[0] });
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create new fee payment
exports.createPayment = async (req, res) => {
    const {
        student_id, fee_structure_id, amount_paid, payment_date,
        payment_method, transaction_id, status
    } = req.body;

    // Basic Validation
    if (!student_id || !amount_paid || !payment_date) {
        return res.status(400).json({ success: false, message: 'Please provide required fields (Student, Amount, Date)' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO student_fees (
                student_id, fee_structure_id, amount_paid, due_amount, 
                payment_date, payment_method, transaction_id, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                student_id, fee_structure_id || null, amount_paid, 0.00, // Assuming due_amount calculation is complex, setting 0 for now or handled elsewhere
                payment_date, payment_method, transaction_id, status || 'Pending'
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update payment
exports.updatePayment = async (req, res) => {
    const {
        student_id, fee_structure_id, amount_paid, payment_date,
        payment_method, transaction_id, status
    } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE student_fees SET 
                student_id = ?, fee_structure_id = ?, amount_paid = ?, 
                payment_date = ?, payment_method = ?, transaction_id = ?, status = ?
            WHERE id = ?`,
            [
                student_id, fee_structure_id || null, amount_paid,
                payment_date, payment_method, transaction_id, status, req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }

        res.json({ success: true, message: 'Payment updated successfully' });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete payment
exports.deletePayment = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM student_fees WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Payment record not found' });
        }

        res.json({ success: true, message: 'Payment deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Helper: Get Fee Structures
exports.getFeeStructures = async (req, res) => {
    try {
        const [structures] = await db.query(`
            SELECT fs.*, c.name as class_name 
            FROM fee_structure fs
            LEFT JOIN classes c ON fs.class_id = c.id
        `);
        res.json({ success: true, data: structures });
    } catch (error) {
        console.error('Error fetching fee structures:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
