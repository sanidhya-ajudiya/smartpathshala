const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

// Items
router.get('/items', authMiddleware, permissionMiddleware('INVENTORY_VIEW'), inventoryController.getAllItems);
router.post('/items', authMiddleware, permissionMiddleware('INVENTORY_MANAGE'), inventoryController.createItem);
router.put('/items/:id', authMiddleware, permissionMiddleware('INVENTORY_MANAGE'), inventoryController.updateItem);
router.delete('/items/:id', authMiddleware, permissionMiddleware('INVENTORY_MANAGE'), inventoryController.deleteItem);

// Transactions
router.get('/transactions', authMiddleware, permissionMiddleware('INVENTORY_VIEW'), inventoryController.getTransactions);
router.post('/transactions', authMiddleware, permissionMiddleware('INVENTORY_MANAGE'), inventoryController.recordTransaction);

module.exports = router;
