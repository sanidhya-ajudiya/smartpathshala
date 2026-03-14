const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

// Fee Payments
router.get('/payments', authMiddleware, permissionMiddleware('FEE_VIEW'), feeController.getAllPayments);
router.get('/payments/:id', authMiddleware, permissionMiddleware('FEE_VIEW'), feeController.getPaymentById);
router.post('/payments', authMiddleware, permissionMiddleware('FEE_COLLECT'), feeController.createPayment);
router.put('/payments/:id', authMiddleware, permissionMiddleware('FEE_COLLECT'), feeController.updatePayment);
router.delete('/payments/:id', authMiddleware, permissionMiddleware('FEE_COLLECT'), feeController.deletePayment);

// Helper for Dropdown
router.get('/structures', authMiddleware, permissionMiddleware('FEE_VIEW'), feeController.getFeeStructures);

module.exports = router;
