const db = require('./config/db');

async function checkReferences() {
    try {
        const [rows] = await db.query(`
            SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE REFERENCED_TABLE_NAME = 'roles'
            AND TABLE_SCHEMA = 'smartpathshala_db'
        `);
        console.log("Tables referencing 'roles':", rows);
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

checkReferences();
