const db = require('../config/db');

// --- Routes Management ---

// Get all transport routes
exports.getAllRoutes = async (req, res) => {
    try {
        const [routes] = await db.query('SELECT * FROM transport_routes ORDER BY route_name ASC');
        res.json({ success: true, count: routes.length, data: routes });
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create new route
exports.createRoute = async (req, res) => {
    const { route_name, start_point, end_point, fare } = req.body;
    if (!route_name) {
        return res.status(400).json({ success: false, message: 'Route name is required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO transport_routes (route_name, start_point, end_point, fare) VALUES (?, ?, ?, ?)',
            [route_name, start_point, end_point, fare]
        );
        res.status(201).json({ success: true, message: 'Route created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating route:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update route
exports.updateRoute = async (req, res) => {
    const { route_name, start_point, end_point, fare } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE transport_routes SET route_name = ?, start_point = ?, end_point = ?, fare = ? WHERE id = ?',
            [route_name, start_point, end_point, fare, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Route not found' });
        res.json({ success: true, message: 'Route updated successfully' });
    } catch (error) {
        console.error('Error updating route:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete route
exports.deleteRoute = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM transport_routes WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Route not found' });
        res.json({ success: true, message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Error deleting route:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// --- Vehicles Management ---

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const [vehicles] = await db.query('SELECT * FROM transport_vehicles ORDER BY vehicle_number ASC');
        res.json({ success: true, count: vehicles.length, data: vehicles });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create new vehicle
exports.createVehicle = async (req, res) => {
    const { vehicle_number, driver_name, driver_phone, capacity } = req.body;
    if (!vehicle_number) {
        return res.status(400).json({ success: false, message: 'Vehicle number is required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO transport_vehicles (vehicle_number, driver_name, driver_phone, capacity) VALUES (?, ?, ?, ?)',
            [vehicle_number, driver_name, driver_phone, capacity]
        );
        res.status(201).json({ success: true, message: 'Vehicle created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
    const { vehicle_number, driver_name, driver_phone, capacity } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE transport_vehicles SET vehicle_number = ?, driver_name = ?, driver_phone = ?, capacity = ? WHERE id = ?',
            [vehicle_number, driver_name, driver_phone, capacity, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, message: 'Vehicle updated successfully' });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM transport_vehicles WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        res.json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
