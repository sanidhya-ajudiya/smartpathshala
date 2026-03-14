const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, permissionMiddleware('ATTENDANCE_VIEW'), attendanceController.getAllAttendance);
router.get('/:id', authMiddleware, permissionMiddleware('ATTENDANCE_VIEW'), attendanceController.getAttendanceById);
router.post('/', authMiddleware, permissionMiddleware('ATTENDANCE_MARK'), attendanceController.markAttendance);
router.put('/:id', authMiddleware, permissionMiddleware('ATTENDANCE_MARK'), attendanceController.updateAttendance);
router.delete('/:id', authMiddleware, permissionMiddleware('ATTENDANCE_MARK'), attendanceController.deleteAttendance);

module.exports = router;
