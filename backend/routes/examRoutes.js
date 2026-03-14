const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, permissionMiddleware('EXAM_VIEW'), examController.getAllExams);
router.get('/:id', authMiddleware, permissionMiddleware('EXAM_VIEW'), examController.getExamById);
router.post('/', authMiddleware, permissionMiddleware('EXAM_MANAGE'), examController.createExam);
router.put('/:id', authMiddleware, permissionMiddleware('EXAM_MANAGE'), examController.updateExam);
router.delete('/:id', authMiddleware, permissionMiddleware('EXAM_MANAGE'), examController.deleteExam);

module.exports = router;
