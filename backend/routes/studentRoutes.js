const express = require('express');
const router = express.Router();
const db = require('../config/db');
const studentController = require('../controllers/studentController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

const { check } = require('express-validator');
const validate = require('../middleware/validationMiddleware');

router.get('/', authMiddleware, permissionMiddleware('STUDENT_VIEW'), studentController.getAllStudents);
router.get('/:id', authMiddleware, permissionMiddleware('STUDENT_VIEW'), studentController.getStudentById);

router.post('/',
    authMiddleware,
    permissionMiddleware('STUDENT_CREATE'),
    [
        check('first_name', 'First Name is required').not().isEmpty(),
        check('roll_no', 'Roll Number is required').not().isEmpty(),
        check('class_id', 'Class ID is required').isInt(),
        // Add more checks as needed
    ],
    validate,
    studentController.createStudent
);

router.put('/:id',
    authMiddleware,
    permissionMiddleware('STUDENT_EDIT'),
    [
        check('first_name', 'First Name is required').optional().not().isEmpty(),
        check('class_id', 'Class ID must be integer').optional().isInt(),
    ],
    validate,
    studentController.updateStudent
);

router.delete('/:id', authMiddleware, permissionMiddleware('STUDENT_DELETE'), studentController.deleteStudent);

module.exports = router;
