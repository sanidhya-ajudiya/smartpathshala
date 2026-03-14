const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, permissionMiddleware('USER_MANAGE'), staffController.getAllStaff);
router.get('/:id', authMiddleware, permissionMiddleware('USER_MANAGE'), staffController.getStaffById);
router.post('/', authMiddleware, permissionMiddleware('USER_MANAGE'), staffController.createStaff);
router.put('/:id', authMiddleware, permissionMiddleware('USER_MANAGE'), staffController.updateStaff);
router.delete('/:id', authMiddleware, permissionMiddleware('USER_MANAGE'), staffController.deleteStaff);

module.exports = router;
