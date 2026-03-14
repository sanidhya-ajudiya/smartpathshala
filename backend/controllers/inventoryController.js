const db = require('../config/db');

// --- Inventory Items ---

// Get all inventory items
exports.getAllItems = async (req, res) => {
    try {
        const [items] = await db.query('SELECT * FROM inventory_items ORDER BY name ASC');
        res.json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error('Error fetching inventory items:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create new inventory item
exports.createItem = async (req, res) => {
    const { name, category, quantity, unit_price, supplier } = req.body;
    if (!name) {
        return res.status(400).json({ success: false, message: 'Item name is required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO inventory_items (name, category, quantity, unit_price, supplier) VALUES (?, ?, ?, ?, ?)',
            [name, category, quantity || 0, unit_price || 0, supplier]
        );
        res.status(201).json({ success: true, message: 'Item created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update inventory item
exports.updateItem = async (req, res) => {
    const { name, category, quantity, unit_price, supplier } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE inventory_items SET name = ?, category = ?, quantity = ?, unit_price = ?, supplier = ? WHERE id = ?',
            [name, category, quantity, unit_price, supplier, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete inventory item
exports.deleteItem = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM inventory_items WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Inventory Transactions ---

// Get all transactions
exports.getTransactions = async (req, res) => {
    try {
        const [transactions] = await db.query(`
            SELECT t.*, i.name as item_name 
            FROM inventory_transactions t
            JOIN inventory_items i ON t.item_id = i.id
            ORDER BY t.date DESC
        `);
        res.json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Record a transaction (IN/OUT)
exports.recordTransaction = async (req, res) => {
    const { item_id, type, quantity, remarks, date } = req.body;
    if (!item_id || !type || !quantity) {
        return res.status(400).json({ success: false, message: 'Please provide required fields' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Insert transaction
        await connection.query(
            'INSERT INTO inventory_transactions (item_id, type, quantity, date, remarks) VALUES (?, ?, ?, ?, ?)',
            [item_id, type, quantity, date || new Date(), remarks]
        );

        // 2. Update item quantity
        const updateQuery = type === 'IN'
            ? 'UPDATE inventory_items SET quantity = quantity + ? WHERE id = ?'
            : 'UPDATE inventory_items SET quantity = quantity - ? WHERE id = ?';

        await connection.query(updateQuery, [quantity, item_id]);

        await connection.commit();
        res.status(201).json({ success: true, message: 'Transaction recorded successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error recording transaction:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    } finally {
        if (connection) connection.release();
    }
};
