const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkDB = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [users] = await connection.query('SELECT * FROM users');
        console.log('Users in DB:');
        console.log(users.map(u => ({ username: u.username, password_hash: u.password_hash })));

        const [roles] = await connection.query('SELECT * FROM roles');
        console.log('Roles in DB:', roles.map(r => r.name));

        await connection.end();
    } catch (err) {
        console.error('DB Check failed:', err.message);
    }
};

checkDB();
