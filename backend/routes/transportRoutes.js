const express = require('express');
const router = express.Router();
const transportController = require('../controllers/transportController');
const { authMiddleware, permissionMiddleware } = require('../middleware/auth');

// Routes management
router.get('/routes', authMiddleware, permissionMiddleware('TRANSPORT_VIEW'), transportController.getAllRoutes);
router.post('/routes', authMiddleware, permissionMiddleware('TRANSPORT_MANAGE'), transportController.createRoute);
router.put('/routes/:id', authMiddleware, permissionMiddleware('TRANSPORT_MANAGE'), transportController.updateRoute);
router.delete('/routes/:id', authMiddleware, permissionMiddleware('TRANSPORT_MANAGE'), transportController.deleteRoute);

// Vehicles management
router.get('/vehicles', authMiddleware, permissionMiddleware('TRANSPORT_VIEW'), transportController.getAllVehicles);
router.post('/vehicles', authMiddleware, permissionMiddleware('TRANSPORT_MANAGE'), transportController.createVehicle);
router.put('/vehicles/:id', authMiddleware, permissionMiddleware('TRANSPORT_MANAGE'), transportController.updateVehicle);
router.delete('/vehicles/:id', authMiddleware, permissionMiddleware('TRANSPORT_MANAGE'), transportController.deleteVehicle);

module.exports = router;
