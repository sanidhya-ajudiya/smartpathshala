const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const initDB = async () => {
    let connection;
    try {
        // 1. Connect without Database to create it
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Connected to MySQL server...');

        const dbName = process.env.DB_NAME || 'smartpathshala_db';

        // 2. Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`Database '${dbName}' created or already exists.`);

        // 3. Use Database
        await connection.query(`USE \`${dbName}\``);

        // 4. Read SQL Schema
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // 5. Split and Execute Statements
        // Note: Simple split by semicolon might fail on complex stored procedures but should work for basic schema
        // Better to use a robust parser or executeFile if supported, but mysql2 doesn't support source directly.
        // For now, let's just use verify the user runs schema manually or we try best effort
        // Actually, mysql2 supports multiple statements if configured.

        // We'll close this connection and open a new pool with multipleStatements: true
        await connection.end();

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName,
            multipleStatements: true
        });

        console.log('Executing schema...');
        await connection.query(schemaSql);
        console.log('Schema executed successfully.');

        await connection.end();

        // Now run seed
        console.log('Running seeder...');
        require('./seed');

    } catch (error) {
        console.error('Error initializing database:', error);
        if (connection) await connection.end();
        process.exit(1);
    }
};

initDB();
