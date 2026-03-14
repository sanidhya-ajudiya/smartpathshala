const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smartpathshala_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const defaultPassword = 'password123';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedDummyData = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log('Connected to database. Starting dummy data seeding...');

        // 1. Classes & Sections
        const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
        const sections = ['A', 'B', 'C'];

        console.log('Seeding Classes and Sections...');
        const classIds = [];
        for (const className of classes) {
            const [res] = await connection.query('INSERT INTO classes (name) VALUES (?)', [className]);
            const classId = res.insertId;
            classIds.push(classId);

            for (const sectionName of sections) {
                await connection.query('INSERT INTO sections (class_id, name) VALUES (?, ?)', [classId, sectionName]);
            }
        }

        // 2. Departments
        console.log('Seeding Departments...');
        const departments = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Sports', 'Administration', 'Transport', 'Library'];
        const deptIds = [];
        for (const dept of departments) {
            const [existing] = await connection.query('SELECT id FROM departments WHERE name = ?', [dept]);
            if (existing.length > 0) {
                deptIds.push(existing[0].id);
            } else {
                const [res] = await connection.query('INSERT INTO departments (name, description) VALUES (?, ?)', [dept, `${dept} Department`]);
                deptIds.push(res.insertId);
            }
        }

        // 3. Subjects (Map to Classes)
        console.log('Seeding Subjects...');
        const subjectsList = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science'];
        for (const classId of classIds) {
            for (const sub of subjectsList) {
                await connection.query('INSERT INTO subjects (name, code, class_id) VALUES (?, ?, ?)', [sub, `${sub.substring(0, 3).toUpperCase()}-${classId}`, classId]);
            }
        }

        // 4. Roles (Get IDs)
        const [roles] = await connection.query('SELECT id, name FROM roles');
        const roleMap = roles.reduce((acc, role) => { acc[role.name] = role.id; return acc; }, {});

        // 5. Teachers & Staff
        console.log('Seeding Teachers...');
        const teacherNames = [
            { f: 'John', l: 'Doe', dept: 'Mathematics' },
            { f: 'Jane', l: 'Smith', dept: 'Science' },
            { f: 'Robert', l: 'Brown', dept: 'English' },
            { f: 'Emily', l: 'Davis', dept: 'Social Studies' },
            { f: 'Michael', l: 'Wilson', dept: 'Computer Science' }
        ];

        for (const t of teacherNames) {
            const username = `teacher_${t.f.toLowerCase()}`;
            const email = `${t.f.toLowerCase()}@school.com`;

            // Check if user exists
            const [existingUser] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);
            if (existingUser.length > 0) {
                // Update password for existing user
                await connection.query('UPDATE users SET password_hash = ? WHERE id = ?', [defaultPassword, existingUser[0].id]);
                continue;
            }

            // Create User
            const [uRes] = await connection.query(
                'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
                [username, email, defaultPassword, roleMap['Teacher']]
            );
            const userId = uRes.insertId;

            // Find Dept ID
            const [dRes] = await connection.query('SELECT id FROM departments WHERE name = ?', [t.dept]);
            const deptId = dRes[0]?.id || deptIds[0]; // Fallback

            // Create Teacher Profile
            await connection.query(
                'INSERT INTO teachers (user_id, first_name, last_name, department_id, qualification, joining_date, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, t.f, t.l, deptId, 'M.Sc, B.Ed', '2020-05-15', '9876543210', '123 Teacher Lane']
            );
        }

        // 6. Students
        console.log('Seeding Students...');
        const studentNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jack'];
        let rollCounter = 1;

        // Get Section IDs for Class 1 (just picking one class for now to populate)
        const [secRes] = await connection.query('SELECT id FROM sections WHERE class_id = ?', [classIds[0]]); // Class 1 Sections
        const sectionId = secRes[0].id;

        for (const name of studentNames) {
            const username = `student_${name.toLowerCase()}`;
            const email = `${name.toLowerCase()}@student.com`;

            // Check if user exists
            const [existingUser] = await connection.query('SELECT id FROM users WHERE username = ?', [username]);
            if (existingUser.length > 0) {
                // Update password for existing user
                await connection.query('UPDATE users SET password_hash = ? WHERE id = ?', [defaultPassword, existingUser[0].id]);
                continue;
            }

            // Create User
            const [uRes] = await connection.query(
                'INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
                [username, email, defaultPassword, roleMap['Student']]
            );
            const userId = uRes.insertId;

            // Create Student Profile
            await connection.query(
                'INSERT INTO students (user_id, first_name, last_name, roll_no, class_id, section_id, dob, gender, address, phone, admission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [userId, name, 'Student', `R-${rollCounter++}`, classIds[0], sectionId, '2015-01-01', 'Male', '456 Student St', '1234567890', '2024-04-01']
            );
        }

        // 7. Exams & Marks
        console.log('Seeding Exams...');
        const [examRes] = await connection.query('INSERT INTO exams (name, start_date, end_date, class_id) VALUES (?, ?, ?, ?)', ['Mid Term 2024', '2024-09-01', '2024-09-15', classIds[0]]);
        const examId = examRes.insertId;

        // 8. Fee Structure
        console.log('Seeding Fees...');
        await connection.query('INSERT INTO fee_structure (class_id, category, amount, academic_year) VALUES (?, ?, ?, ?)', [classIds[0], 'Tuition Fee', 5000.00, '2024-2025']);
        await connection.query('INSERT INTO fee_structure (class_id, category, amount, academic_year) VALUES (?, ?, ?, ?)', [classIds[0], 'Transport Fee', 2000.00, '2024-2025']);

        // 9. Inventory
        console.log('Seeding Inventory...');
        await connection.query('INSERT INTO inventory_items (name, category, quantity, unit_price, supplier) VALUES (?, ?, ?, ?, ?)', ['Chalk Box', 'Stationery', 100, 50.00, 'ABC Suppliers']);
        await connection.query('INSERT INTO inventory_items (name, category, quantity, unit_price, supplier) VALUES (?, ?, ?, ?, ?)', ['Duster', 'Stationery', 50, 30.00, 'ABC Suppliers']);
        await connection.query('INSERT INTO inventory_items (name, category, quantity, unit_price, supplier) VALUES (?, ?, ?, ?, ?)', ['Desk', 'Furniture', 200, 2500.00, 'XYZ Furnitures']);

        // 10. Transport
        console.log('Seeding Transport...');
        const [existingRoute] = await connection.query('SELECT id FROM transport_routes WHERE route_name = ?', ['Route 1']);
        if (existingRoute.length === 0) {
            await connection.query('INSERT INTO transport_routes (route_name, start_point, end_point, fare) VALUES (?, ?, ?, ?)', ['Route 1', 'City Center', 'School', 1500.00]);
        }

        const [existingVehicle] = await connection.query('SELECT id FROM transport_vehicles WHERE vehicle_number = ?', ['UP-32-AB-1234']);
        if (existingVehicle.length === 0) {
            await connection.query('INSERT INTO transport_vehicles (vehicle_number, driver_name, driver_phone, capacity) VALUES (?, ?, ?, ?)', ['UP-32-AB-1234', 'Ram Singh', '9876500000', 40]);
        }

        console.log('Dummy data seeding completed successfully!');

    } catch (error) {
        console.error('Error seeding dummy data:', error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
};

seedDummyData();
