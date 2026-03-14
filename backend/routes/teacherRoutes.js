const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, permissionMiddleware('TEACHER_VIEW'), teacherController.getAllTeachers);
router.get('/:id', authMiddleware, permissionMiddleware('TEACHER_VIEW'), teacherController.getTeacherById);
router.post('/', authMiddleware, permissionMiddleware('TEACHER_CREATE'), teacherController.createTeacher);
router.put('/:id', authMiddleware, permissionMiddleware('TEACHER_EDIT'), teacherController.updateTeacher);
router.delete('/:id', authMiddleware, permissionMiddleware('TEACHER_DELETE'), teacherController.deleteTeacher);

module.exports = router;
