const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

// Get all roles, permissions, and their mappings
router.get('/', authMiddleware, permissionMiddleware('ROLE_MANAGE'), roleController.getAllRoles);

// Update permissions for a specific role
router.put('/:roleId/permissions', authMiddleware, permissionMiddleware('ROLE_MANAGE'), roleController.updateRolePermissions);

// Search users to assign roles
router.get('/users/search', authMiddleware, permissionMiddleware('ROLE_MANAGE'), roleController.searchUsers);

// Create a new role
router.post('/', authMiddleware, permissionMiddleware('ROLE_MANAGE'), roleController.createRole);

// Delete a role
router.delete('/:roleId', authMiddleware, permissionMiddleware('ROLE_MANAGE'), roleController.deleteRole);

// Update a user's role (e.g. Promote to Super Admin)
router.put('/users/:userId/role', authMiddleware, permissionMiddleware('ROLE_MANAGE'), roleController.updateUserRole);

module.exports = router;
