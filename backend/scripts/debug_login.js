const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const debugLogin = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'smartpathshala_db'
        });

        const username = 'student_bob'; // One of the dummy users
        const password = 'password123';

        console.log(`Debug Login for: ${username}`);

        const [users] = await connection.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        if (users.length === 0) {
            console.log('User not found');
            return;
        }

        const user = users[0];
        console.log('User found:', user);

        // Fetch permissions
        console.log(`Fetching permissions for role_id: ${user.role_id}`);

        try {
            // This corresponds to line 33 in authController.js
            const [permissions] = await connection.query(
                `SELECT p.name 
           FROM permissions p 
           JOIN role_permissions rp ON p.id = rp.permission_id 
           WHERE rp.role_id = ?`,
                [user.role_id]
            );
            console.log('Permissions fetched:', permissions);
        } catch (permError) {
            console.error('Error fetching permissions:', permError);
        }


    } catch (error) {
        console.error('Debug Error:', error);
    } finally {
        if (connection) await connection.end();
    }
};

debugLogin();
